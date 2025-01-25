import * as React from "react";

import {
  Container,
  Html,
  Tailwind,
} from "@react-email/components";

interface SentProps {
  product_name: string;
  customer_name: string;
  store_name: string;
}

export function OrderClaimUnsolved(props: SentProps) {
  const { product_name, customer_name, store_name } = props;

  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                gf: "#1F0046",
                button: "#0BEBAA",
              },
              boxShadow: {},
            },
          },
        }}
      >
        <Container>
          <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
            <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
              <p>
                GUD<strong className="text-[#0BEBAA]">FY</strong>
              </p>
            </div>
            <div className="text-slate-800 px-5 py-2">
              <h1>Reclamación No Resuelta</h1>
              <p>
                Se informa que la tienda <strong>{store_name}</strong> y el cliente{" "}
                <strong>{customer_name}</strong> no han podido llegar a un acuerdo sobre la reclamación del producto{" "}
                <strong>{product_name}</strong>.
              </p>
              <p>
                Por favor, revisa esta situación y toma las medidas necesarias para resolver el conflicto.
              </p>
                <p>La reclamación la puedes observar en el dashboard, en la seccion de "Reclamaciones"</p>
              <p>Atentamente,</p>
              <p>El sistema de notificaciones de Gudfy</p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
