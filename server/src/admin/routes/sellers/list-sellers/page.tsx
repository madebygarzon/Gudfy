import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Table, IconButton, Drawer, Button, DatePicker } from "@medusajs/ui";
import { Eye } from "@medusajs/icons";
import { Thumbnail } from "../../../components/thumbnail";
import {
  PencilSquare,
  XMark,
  ArrowLongRight,
  ArrowLongLeft,
  FaceSmile,
} from "@medusajs/icons";
import Spinner from "../../../components/shared/spinner";
import { Input, Select } from "@medusajs/ui";
import { RouteConfig } from "@medusajs/admin";
import SellersList from "../../../actions/sellers/get-sellers-list";
import { updateSellerReview } from "../../../actions/sellers/update-seller-review";
import getSellersReviewsList from "../../../actions/sellers/get-seller-reviews";
import {
  getStoreProducts,
  type StoreProductsResponse,
} from "../../../actions/sellers/get-store-products";
import { ListBullet } from "@medusajs/icons";

type Seller = {
  store_id: string;
  store_name: string;
  id_seller: string;
  seller_name: string;
  email: string;
  phone: string;
  review: number;
  product_count: number;
  stock_total: number;
  // review: [
  //   {
  //     id_review: string;
  //     customer: string;
  //     rating: string;
  //     content: string;
  //     approved: boolean;
  //     date: string;
  //   }
  // ];
};

type ListDataSellerApplication = {
  dataSellers: Seller[];
  dataFilter?: Seller[];
  dataPreview: Seller[];
  count: number;
};

const dataSelecFilter = [
  {
    value: "Todos",
    label: "Todos",
  },
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "published",
    label: "Published",
  },
];
const registerNumber = [15, 30, 100];
// numero de filas por pagina predeterminado
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";

const SellerApplication = () => {
  //datos de losproductos -----------------

  //---------------------------------------

  //manejo de la tabla --------------
  const [dataSellers, setDataSellers] = useState<ListDataSellerApplication>({
    dataSellers: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>(); // paginas totales
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(15);
  const [isLoading2, setIsLoading] = useState<boolean>(true);
  const [orderDate, setOrderDate] = useState<boolean>(true);

  const [storeData, setStoreData] = useState<StoreProductsResponse | null>(
    null
  );

  const [productList, setProductList] = useState<
    Array<{ id: string; title: string; inventory: number }>
  >([]);
  const [openProducts, setOpenProducts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  //----------------------------------

  const handleOpenProducts = (storeId: string) => {
    setLoadingProducts(true);
    getStoreProducts(storeId).then((data) => {
      setStoreData(data); // <-- aquí guardas summary + details
      setOpenProducts(true); // abre el modal
      setLoadingProducts(false);
    });
  };

  const handlerGetListSellers = async (order?: string) => {
    setIsLoading(true);

    const sellers = await SellersList().then((p) => {
      setIsLoading(false);
      return p;
    });
    setPagetotal(Math.ceil(sellers?.length / rowsPages));
    setDataSellers({
      dataSellers: sellers,
      dataPreview: handlerPreviewSellerAplication(sellers, 1),
      count: sellers.length,
    });
  };

  const handlerNextPage = (action) => {
    if (action == "NEXT")
      setPage((old) => {
        if (dataSellers.dataFilter!) {
          setDataSellers({
            ...dataSellers,
            dataPreview: handlerPreviewSellerAplication(
              dataSellers.dataFilter,
              page + 1
            ),
          });
          return old + 1;
        } else
          setDataSellers({
            ...dataSellers,
            dataPreview: handlerPreviewSellerAplication(
              dataSellers.dataSellers,
              page + 1
            ),
          });
        return old + 1;
      });

    if (action == "PREV")
      setPage((old) => {
        if (dataSellers.dataFilter!) {
          setDataSellers({
            ...dataSellers,
            dataPreview: handlerPreviewSellerAplication(
              dataSellers.dataFilter,
              page - 1
            ),
          });
          return old - 1;
        } else
          setDataSellers({
            ...dataSellers,
            dataPreview: handlerPreviewSellerAplication(
              dataSellers.dataSellers,
              page - 1
            ),
          });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (
    queryParams: Array<Seller>,
    page,
    rows?
  ) => {
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams.slice(start, end);
    setPage(1);
    setPagetotal(Math.ceil(queryParams.length / dataRowPage));
    return newArray;
  };

  useEffect(() => {
    handlerGetListSellers();
  }, []);

  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataSellers({
      ...dataSellers,
      dataPreview: handlerPreviewSellerAplication(
        dataSellers.dataFilter!
          ? dataSellers.dataFilter
          : dataSellers.dataSellers,
        1,
        valueInt
      ),
    });
  };

  const handlerSearcherbar = (e: string) => {
    const dataFilter = dataSellers.dataSellers.filter((data) => {
      const nameIncludes = data.seller_name
        .toLowerCase()
        .includes(e.toLowerCase());
      const numberIncludes = data.phone.toLowerCase().includes(e.toLowerCase());
      const nameStoreIncludes = data.store_name
        .toLowerCase()
        .includes(e.toLowerCase());
      const emailIncludes = data.email.toLowerCase().includes(e.toLowerCase());
      return (
        nameIncludes ||
        emailIncludes ||
        nameStoreIncludes ||
        numberIncludes ||
        false
      );
    });

    setDataSellers({
      ...dataSellers,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter.length ? dataFilter : [],
    });
  };

  const handlerReset = (id_store) => {
    getSellersReviewsList(id_store).then((e) => {
      setComments(e);
      setLoading(false);
    });
  };
  const [comments, setComments] = useState<dataComments[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlerOpenModal = (id_store) => {
    getSellersReviewsList(id_store).then((e) => {
      setComments(e);
      setOpen(true);
    });
  };

  return (
    <div className=" bg-white p-8 border border-gray-2 00 rounded-lg mb-10">
      <div className="mt-2 h-[120px] flex justify-between">
        <h1 className=" text-xl font-bold"> Tiendas </h1>
        <div className="flex gap-5 h-full items-end py-4">
          <div className="w-[156px] ">
            {/* <Select onValueChange={handlerFilter}>
              <Select.Trigger>
                <Select.Value placeholder="Filtar por: " />
              </Select.Trigger>
              <Select.Content>
                {dataSelecFilter.map((item) => (
                  <Select.Item key={item.value} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select> */}
          </div>
          <div className="w-[250px]">
            <Input
              placeholder="Search"
              id="search-input"
              type="search"
              onChange={(e) => handlerSearcherbar(e.target.value)}
            />
          </div>
        </div>
      </div>
      {isLoading2 ? (
        <div className="min-h-[293px] flex items-center justify-center">
          <Spinner size="large" variant="secondary" />
        </div>
      ) : dataSellers.dataPreview.length ? (
        <div className="min-h-[293px] pb-10">
          <Table>
            <Table.Header>
              <Table.Row>
                {/* <Table.HeaderCell
                      className="flex cursor-pointer items-center"
                      onClick={() => handlerOrderDate(orderDate)}
                    >
                      Fecha{" "}
                      <TriangleDownMini
                        className={clsx("", {
                          "rotate-180": orderDate === true,
                        })}
                      />
                    </Table.HeaderCell> */}
                <Table.HeaderCell> Nombre de la tienda</Table.HeaderCell>
                <Table.HeaderCell>Nombre del vendedor</Table.HeaderCell>
                <Table.HeaderCell>Numero de telefono</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Comentarios</Table.HeaderCell>
                <Table.HeaderCell>Inventario</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataSellers.dataPreview?.map((data, i) => {
                return (
                  <Table.Row key={data.id_seller}>
                    {/* <Table.Cell>
                          {formatarFecha(data.created_at)}
                        </Table.Cell> */}
                    <Table.Cell>
                      <div className="flex gap-2">{data.store_name}</div>
                    </Table.Cell>
                    <Table.Cell>{data.seller_name}</Table.Cell>
                    <Table.Cell>{data.phone}</Table.Cell>
                    <Table.Cell>{data.email}</Table.Cell>
                    <Table.Cell>{data.review}</Table.Cell>
                    <Table.Cell>
                      <IconButton
                        className="hover:bg-gray-100 hover:scale-110 transition-all"
                        variant="transparent"
                        onClick={() => handleOpenProducts(data.store_id)}
                      >
                        <Eye className="text-ui-fg-subtle" />
                      </IconButton>
                    </Table.Cell>
                    <Table.Cell className="flex gap-x-2 items-center">
                      <IconButton
                        onClick={() => handlerOpenModal(data.store_id)}
                      >
                        <PencilSquare className="text-ui-fg-subtle" />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className=" flex items-center justify-center min-h-[293px]">
          <XMark className="text-ui-fg-subtle" />{" "}
          <span>No hay datos relacionados</span>
        </div>
      )}

      <div className="flex pt-[10] mt-[10] ">
        <div className="w-[35%]">{`${dataSellers.count || 0} Vendedores`}</div>
        <div className="flex w-[65%] gap-5 justify-end">
          <span className="text-[12px] mr-[4px]">{`N° Registros: `}</span>
          <div className="text-[12px] w-[50px]">
            <Select onValueChange={handlerRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder="5" />
              </Select.Trigger>
              <Select.Content>
                {registerNumber.map((num) => (
                  <Select.Item key={num} value={`${num}`}>
                    {num}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <>
            {page} of {pageTotal}
          </>
          <button
            disabled={page == 1 ? true : false}
            onClick={() => handlerNextPage("PREV")}
          >
            <ArrowLongLeft />
          </button>

          <button
            disabled={page == pageTotal ? true : false}
            onClick={() => handlerNextPage("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>
      <ModalComments
        setLoading={setLoading}
        loading={loading}
        comments={comments}
        onOpenChange={setOpen}
        open={open}
        handlerReset={handlerReset}
      />
      <Drawer open={openProducts} onOpenChange={setOpenProducts}>
        <Drawer.Content className="p-6">
          {loadingProducts ? (
            <Spinner size="large" variant="secondary" />
          ) : storeData && storeData.summary ? (
            <>
              {/* Resumen */}
              <h2 className="text-xl font-bold mb-2">
                Inventario — {storeData.summary.store_name}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <strong>Total variaciones:</strong>{" "}
                  {storeData.summary.total_variants}
                </div>
                <div>
                  <strong>Total inventario:</strong>{" "}
                  {storeData.summary.total_inventory}
                </div>
                <div>
                  <strong>Reservado:</strong> {storeData.summary.total_reserved}
                </div>
                <div>
                  <strong>Disponible:</strong>{" "}
                  {storeData.summary.total_available}
                </div>
              </div>

              {/* Detalle */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="py-2 px-3">Producto</th>
                      <th className="py-2 px-3">Variante</th>
                      <th className="py-2 px-3">Inventario</th>
                      <th className="py-2 px-3">Reservado</th>
                      <th className="py-2 px-3">Disponible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeData.details.map((d, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-3">{d.product}</td>
                        <td className="py-2 px-3">{d.variant}</td>
                        <td className="py-2 px-3">{d.inventory}</td>
                        <td className="py-2 px-3">{d.reserved}</td>
                        <td className="py-2 px-3">{d.available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>Esta tienda aún no ha agregado productos.</p>
          )}
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary">Cerrar</Button>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

function formatarFecha(fechaString: string): string {
  const fecha = new Date(fechaString);
  const opcionesDeFormato: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const fechaFormateada: string = fecha.toLocaleDateString(
    "en-US",
    opcionesDeFormato
  );
  return fechaFormateada;
}

export const config: RouteConfig = {
  link: {
    label: "Sellers",
    // icon: CustomIcon,
  },
};

interface propsModal {
  comments: dataComments[];
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  handlerReset: (id_store: any) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
type dataComments = {
  id: string;
  store_order_id: string;
  store_id: string;
  customer_id: string;
  customer_name: string;
  rating: number;
  content: string;
  approved: boolean;
  created_at: string;
};

const ModalComments = ({
  open,
  onOpenChange,
  handlerReset,
  comments,
  setLoading,
  loading,
}: propsModal) => {
  const onApprove = (id: string, store_id: string) => {
    setLoading(true);
    updateSellerReview({ review_id: id, payload: true }).then(() => {
      handlerReset(store_id);
    });
  };

  const onReject = (id: string, store_id: string) => {
    setLoading(true);
    updateSellerReview({ review_id: id, payload: false }).then(() => {
      handlerReset(store_id);
    });
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Content >
        <Drawer.Header className="flex flex-col gap-1"></Drawer.Header>
        <Drawer.Body>
          {loading ? (
            <>Cargando...</>
          ) : (
            <div className="comments-section">
              <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-gray-100 rounded-md shadow-sm flex flex-col space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{comment.customer_name}</p>
                        <p className="text-gray-500 text-sm">
                          {formatarFecha(comment.created_at)}
                        </p>
                      </div>
                      <p
                        className={`px-2 py-1 rounded-md text-sm ${
                          comment.approved
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {comment.approved ? "Aprobado" : "Rechazado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-yellow-600 font-bold">
                        Rating: {comment.rating}
                      </p>
                      <p>{comment.content}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        color="success"
                        onClick={() => {
                          onApprove(comment.id, comment.store_id);
                        }}
                      >
                        Aprobar
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => {
                          onReject(comment.id, comment.store_id);
                        }}
                      >
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cerrar</Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};

export default SellerApplication;
