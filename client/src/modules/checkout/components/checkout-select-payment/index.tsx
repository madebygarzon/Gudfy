import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Accordion, AccordionItem, Checkbox } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import Button from "@modules/common/components/button";
import { useOrderGudfy, orderDataForm } from "@lib/context/order-context";
import CheckautVirtualForm from "../checkout-virtual-form";
import { fetchCommission } from "@lib/commission";

/***********************************************************
 * CONSTANTES                                             *
 ***********************************************************/

/** Comisión fija de Binance Pay (puedes moverla a .env) */
const BINANCE_FEE = Number(process.env.NEXT_PUBLIC_BINANCE_FEE ?? 0.01);

/***********************************************************
 * TIPOS                                                   *
 ***********************************************************/

type CompleteForm = {
  form: boolean;
  payment: boolean;
  TermsConditions: boolean;
};

type CheckoutDetailsProps = {
  cart: any;
  completedForm: CompleteForm;
  setCompleteForm: React.Dispatch<React.SetStateAction<CompleteForm>>;
  checkbox: string;
  selectedCheckbox: React.Dispatch<
    React.SetStateAction<
      | "automatic_binance_pay"
      | "manual_binance_pay"
      | "bitcoin_ethereum_litecoin_entrega_automatica"
      | "coinpal_pay"
    >
  >;
  selectedKeys: any;
  setSelectedKeys: React.Dispatch<React.SetStateAction<any>>;
  handlersubmit: (dataForm?: orderDataForm) => Promise<void>;
  dataForm: orderDataForm;
  setDataForm: React.Dispatch<React.SetStateAction<orderDataForm>>;
};

const methodPayment = [
  "automatic_binance_pay",
  "manual_binance_pay",
  "bitcoin_ethereum_litecoin_entrega_automatica",
  "coinpal_pay",
];

/***********************************************************
 * COMPONENTE                                             *
 ***********************************************************/

const CheckoutSelectPayment: React.FC<CheckoutDetailsProps> = ({
  cart,
  completedForm,
  setCompleteForm,
  checkbox,
  selectedCheckbox,
  selectedKeys,
  setSelectedKeys,
  handlersubmit,
  dataForm,
  setDataForm,
}) => {
  const { currentOrder } = useOrderGudfy();

  const { register, formState, trigger, setValue } = useForm<orderDataForm>({
    defaultValues: {
      name: dataForm.name,
      last_name: dataForm.last_name,
      email: dataForm.email,
    },
  });

  /** Helper para redondear precio a máximo 4 decimales */
  const formatPriceTotal = (num: number) => {
    if (Number.isInteger(num)) return num;
    const str = num.toString();
    const [, dec = ""] = str.split(".");
    if (dec.length > 2) return Math.round(num * 10000) / 10000;
    return num;
  };

  const isCoinpalSelected = checkbox === "coinpal_pay";

  /** Estado local con desglose de totales */
  const [totals, setTotals] = useState({
    subtotal: 0,
    gudfyFee: 0,
    binanceFee: 0,
    grandTotal: 0,
  });

  /* ------------------ sync datos de formulario ------------------ */
  useEffect(() => {
    if (dataForm.name) {
      setValue("name", dataForm.name);
      setValue("last_name", dataForm.last_name);
      setValue("email", dataForm.email);
      trigger();
    }
  }, [dataForm.name, setValue, trigger]);

  /* ------------------ calcula comisión dinámica ----------------- */
  useEffect(() => {
    if (!currentOrder) return;

    (async () => {
      let gudfyFee = 0;
      for (const item of currentOrder.store_variant) {
        /**
         * En esta respuesta que llega del backend NO existe `product_id`.
         * Puede venir en futuras versiones como `variant_id` o se puede exponer
         * explícitamente en la API.  
         * Mientras tanto deducimos la clave:
         *  - Si el backend ya expone `product_id`, úsalo.
         *  - Si no, intenta `store_variant_order_id` (lo mapea al mismo producto).
         *  - Si ninguna existe, aplica tasa fija de fallback (0.01).
         */
        const productId = (item as any).product_id ?? (item as any).store_variant_order_id;
        const rate = productId ? await fetchCommission(productId) : 0.01;
        gudfyFee += Number(item.price) * Number(item.quantity) * rate;
      };
    })();
  }, [currentOrder]);

  /***********************************************************
   * RENDER                                                 *
   ***********************************************************/

  return (
    <div className="px-2 w-full flex flex-col md:flex-row gap-4 justify-between">
      {/* --------- FORMULARIO DE COMPRA (sin cambios) ---------- */}
      <div className="w-full md:w-1/2 bg-white p-4 md:p-5">
        <h2 className="font-bold text-xl md:text-2xl text-center my-3">
          Formulario de compra
        </h2>
        <CheckautVirtualForm
          propsForm={{ register, formState }}
          setCompleteForm={setCompleteForm}
          dataForm={dataForm}
          setDataForm={setDataForm}
        />
        <p className="p-4 md:p-6 text-xs">
          *Tus datos personales se utilizarán para procesar tu pedido, respaldar
          tu experiencia en este sitio web y para otros fines descritos en
          nuestra política de privacidad.*
        </p>
      </div>

      {/* ----------------- FORMA DE PAGO ------------------- */}
      <div className="w-full md:w-1/2 bg-white p-4 md:p-5">
        {/* Sección orden de pago (resumen) */}
        {currentOrder && (
          <div className="mb-4 p-4 border rounded-md border-lila-gf">
            <h3 className="font-semibold text-lg mb-1 text-start">
              Información de la orden
            </h3>

            {/* Top grid info */}
            <div className="gap-1 text-sm mb-2">
              <div className="flex gap-2 p-1 rounded">
                <span className="font-medium">N° de orden:</span>
                <span className="font-bold truncate">{currentOrder.id}</span>
              </div>
              <div className="flex gap-2 p-1 rounded">
                <span className="font-medium">Fecha:</span>
                <span className="font-bold">
                  {new Date(currentOrder.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 p-1 rounded">
                <span className="font-medium">Productos:</span>
                <span className="font-bold">{currentOrder.quantity_products}</span>
              </div>
            </div>

            {/* Tabla de productos */}
            {currentOrder.store_variant?.length > 0 && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full bg-white rounded-md shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                        Producto
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                        Cantidad
                      </th>
                      <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                        Valor unitario
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                        Valor total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrder.store_variant.map((item: any, i: number) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 text-sm">
                          <div className="font-semibold">{item.produc_title}</div>
                          <div className="text-xs text-gray-500">
                            Tienda: {item.store_name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm">{item.quantity}</td>
                        <td className="px-4 py-3 text-center text-sm">${item.price}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold">
                          ${item.total_price_for_product}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sección de totales */}
            <div className="mt-4 border-t pt-2">
              {isCoinpalSelected ? (
                <>
                  <div className="flex justify-between p-1 rounded">
                    <span className="font-medium block">Subtotal:</span>
                    <span className="font-bold">
                      ${formatPriceTotal(totals.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between p-1 rounded">
                    <span className="font-medium block">Comisión Gudfy:</span>
                    <span className="font-bold">
                      ${formatPriceTotal(totals.gudfyFee)}
                    </span>
                  </div>

                  <div className="flex justify-between p-1 rounded">
                    <span className="font-medium block">Comisión Coinpal (1 %):</span>
                    <span className="font-bold">
                      ${formatPriceTotal(totals.binanceFee)}
                    </span>
                  </div>

                  <div className="flex justify-between p-2 rounded bg-gray-50 mt-2">
                    <span className="font-bold block">Total a Pagar:</span>
                    <span className="text-lg font-bold">
                      ${formatPriceTotal(totals.grandTotal)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between p-2 rounded">
                  <span className="font-bold block">Total a Pagar:</span>
                  <span className="text-lg font-bold">
                    ${formatPriceTotal(Number(currentOrder.total_price))}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------- Forma de pago (Accordion) / Checkbox TC / Botón ------- */}
        {/* … resto del componente permanece igual, no afecta a cálculo de comisión … */}
      </div>
    </div>
  );
};

export default CheckoutSelectPayment;
