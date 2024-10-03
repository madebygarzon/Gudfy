import React, { useState, useEffect } from "react";
import {
  Table,
  DropdownMenu,
  IconButton,
  Select,
  FocusModal,
  Input,
  Label,
  Text,
} from "@medusajs/ui";
import {
  EllipsisHorizontal,
  Plus,
  Trash,
  PencilSquare,
  XMark,
  ArrowLongRight,
  ArrowLongLeft,
  Eye,
} from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { RouteConfig } from "@medusajs/admin";
import axios from "axios";
import { getListClaim } from "../../actions/claim/get-list-claim";
import { formatDate } from "../../utils/format-date";
import { getClaimComments } from "../../actions/claim/get-claim-comments";
import { useAdminGetSession } from "medusa-react";
import { postAddComment } from "../../actions/claim/post-add-comment";
import { updateStatusClaim } from "../../actions/claim/update-status-claim";
import io, { Socket } from "socket.io-client";

type Data = {
  id: string;
  status_order_claim: string;
  number_order: string;
  price_unit: number;
  store_name: string;
  product_name: string;
  storeName: string;
  customer_name: string;
  customer_last_name: string;
  customer_email: string;
  created_at: string;
};
type ClaimComments = {
  id?: string;
  comment: string;
  comment_owner_id: string;
  order_claim_id?: string;
  customer_id?: string;
  created_at?: string;
};

const ReclamosListado = () => {
  const [dataCustomer, setDataCustomer] = useState<{
    dataClaim: Data[];
    dataFilter: Data[];
    dataPreview: Data[];
    count: number;
  }>({
    dataClaim: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState(
    Math.ceil(dataCustomer?.dataClaim.length / 5 || 0)
  );
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const handlerNextPage = (action) => {
    if (action === "NEXT")
      setPage((old) => {
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerPreviewSellerAplication(
            dataCustomer.dataFilter.length
              ? dataCustomer.dataFilter
              : dataCustomer.dataClaim,
            page + 1
          ),
        });
        return old + 1;
      });

    if (action === "PREV")
      setPage((old) => {
        setDataCustomer({
          ...dataCustomer,
          dataPreview: handlerPreviewSellerAplication(
            dataCustomer.dataFilter.length
              ? dataCustomer.dataFilter
              : dataCustomer.dataClaim,
            page - 1
          ),
        });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (queryParams, page, rows?) => {
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams.slice(start, end);
    setPagetotal(Math.ceil(queryParams.length / dataRowPage));
    return newArray;
  };

  const handlerFilter = (value) => {
    setPage(1);
    let dataFilter = dataCustomer.dataClaim;
    if (value !== "All") {
      dataFilter = dataCustomer.dataClaim.filter(
        (data) => data.status_order_claim === value
      );
    }
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: value === "All" ? [] : dataFilter,
    });
  };

  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(
        dataCustomer.dataFilter.length
          ? dataCustomer.dataFilter
          : dataCustomer.dataClaim,
        1,
        valueInt
      ),
    });
  };

  const handlerSearcherbar = (e) => {
    const dataFilter = dataCustomer.dataClaim.filter((data) => {
      return data.number_order.toLowerCase().includes(e.toLowerCase());
    });
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter.length ? dataFilter : [],
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CERRADA":
        return "bg-red-200";
      case "SIN RESOLVER":
        return "bg-yellow-200";
      case "ABIERTA":
        return "bg-green-200";
      case "RESUELTA":
        return "bg-green-200";
      default:
        return "";
    }
  };

  const handlerGetListClaim = () => {
    setIsLoading(true);
    getListClaim().then((data) => {
      setDataCustomer({
        dataClaim: data,
        dataFilter: [],
        dataPreview: data,
        count: data.length,
      });

      setIsLoading(false);
    });
  };

  const handlerDate = (date: string) => {
    return;
  };

  // COMENTARIOS DE LA RECLAMACION ----------------

  const [comments, setComments] = useState<ClaimComments[]>();
  const [open, setOpen] = useState(false);
  const [isLoadingComment, setIsLoadingComment] = useState<boolean>(true);

  const handleReset = () => {
    handlerGetListClaim();
  };

  const handlerCommentsFromClaimOrder = (claim) => {
    setIsLoadingComment(true);
    getClaimComments(claim).then((e) => {
      setIsLoadingComment(false);
      setComments(e);
      setOpen(true);
    });
  };

  const handlerStatusClaim = () => {
    // setIsLoadingStatus((old) => {
    //   let selectStatus
    //   switch (status) {
    //     case "CANCEL":
    //       selectStatus = { ...old, cancel: true }
    //       break
    //     case "SOLVED":
    //       selectStatus = { ...old, solved: true }
    //       break
    //     case "UNSOLVED":
    //       selectStatus = { ...old, unsolved: true }
    //       break
    //     default:
    //       selectStatus = old
    //   }
    //   return selectStatus
    // })
    updateStatusClaim(comments?.[0].order_claim_id || " ", "").then(() => {
      handleReset();
      setOpen((old) => !old);
    });
  };

  useEffect(() => {
    handlerGetListClaim();
  }, []);

  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg">
      <div className="w-full h-full ">
        <>
          <div className="mt-1 h-[100px] flex justify-between">
            <h1 className="text-lg font-bold">Listado de reclamos</h1>
            <div className="flex gap-5 h-full items-end py-4">
              <div className="w-[156px]">
                <Select onValueChange={handlerFilter}>
                  <Select.Trigger>
                    <Select.Value placeholder="Filtrar por estado: " />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="All">Todos</Select.Item>
                    <Select.Item value="Cerrado">Cerrado</Select.Item>
                    <Select.Item value="En proceso">En proceso</Select.Item>
                    <Select.Item value="Abierto">Abierto</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div className="w-[250px]">
                <Input
                  placeholder="Buscar por número de orden"
                  id="search-input"
                  type="search"
                  onChange={(e) => handlerSearcherbar(e.target.value)}
                />
              </div>
            </div>
          </div>
          {isLoading ? (
            <div className="min-h-[293px] flex items-center justify-center">
              <Spinner size="large" variant="secondary" />
            </div>
          ) : dataCustomer.dataPreview.length ? (
            <div className="min-h-[293px]">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell className="ml-4">Estado</Table.HeaderCell>
                    <Table.HeaderCell>Número de orden</Table.HeaderCell>
                    <Table.HeaderCell>Producto y Tienda</Table.HeaderCell>
                    <Table.HeaderCell>Fecha y hora</Table.HeaderCell>
                    <Table.HeaderCell>Tienda</Table.HeaderCell>
                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                    <Table.HeaderCell>{""}</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataCustomer.dataPreview.map((data) => (
                    <Table.Row key={data.id}>
                      <Table.Cell>
                        <p
                          className={`${getStatusColor(
                            data.status_order_claim
                          )} px-4 py-2 rounded-lg`}
                        >
                          {data.status_order_claim}
                        </p>
                      </Table.Cell>
                      <Table.Cell>
                        {data.number_order.replace("store_order_id_", "CANCEL")}
                      </Table.Cell>
                      <Table.Cell>{data.product_name}</Table.Cell>
                      <Table.Cell>{formatDate(data.created_at)}</Table.Cell>
                      <Table.Cell>{data.store_name}</Table.Cell>
                      <Table.Cell>
                        {data.customer_name + " " + data.customer_last_name}
                      </Table.Cell>
                      <Table.Cell className="flex gap-x-2 items-center">
                        <DropdownMenu>
                          <ModalComment
                            claimId={data.id}
                            open={open}
                            setOpen={setOpen}
                            comments={comments}
                            handlerCommentsFromClaimOrder={
                              handlerCommentsFromClaimOrder
                            }
                            handlerStatusClaim={handlerStatusClaim}
                            setComments={setComments}
                          />
                        </DropdownMenu>

                        {/* <IconButton>
                          <PencilSquare className="text-ui-fg-subtle" />
                        </IconButton> */}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[293px]">
              <XMark className="text-ui-fg-subtle" />{" "}
              <span>No hay datos relacionados</span>
            </div>
          )}
        </>
      </div>

      <div className="flex p-6">
        <div className="w-[35%]">{`${dataCustomer.count || 0} reclamos`}</div>
        <div className="flex w-[65%] gap-5 justify-end">
          <span className="text-[12px] mr-[4px]">{`N° Registros: `}</span>
          <div className="text-[12px] w-[50px]">
            <Select onValueChange={handlerRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder="5" />
              </Select.Trigger>
              <Select.Content>
                {[5, 10, 100].map((num) => (
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
          <button disabled={page === 1} onClick={() => handlerNextPage("PREV")}>
            <ArrowLongLeft />
          </button>

          <button
            disabled={page === pageTotal}
            onClick={() => handlerNextPage("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ModalClaimComment {
  claimId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  comments: ClaimComments[];
  handlerCommentsFromClaimOrder: (claim: any) => void;
  setComments: React.Dispatch<React.SetStateAction<ClaimComments[]>>;
  handlerStatusClaim: () => void;
}

const ModalComment = ({
  claimId,
  open,
  setOpen,
  handlerCommentsFromClaimOrder,
  comments,
  setComments,
  handlerStatusClaim,
}: ModalClaimComment) => {
  const [newComment, setNewComment] = useState<string>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<{
    solved: boolean;
    cancel: boolean;
    unsolved: boolean;
  }>({ solved: false, cancel: false, unsolved: false });
  const { user, isLoading } = useAdminGetSession();
  const handlerSubmitComment = () => {
    const dataComment = {
      comment: newComment,
      order_claim_id: comments?.[0].order_claim_id,
      customer_id: "",
      comment_owner_id: "COMMENT_ADMIN_ID",
    };
    postAddComment(dataComment).then((e) => {
      setNewComment("");
      setComments((old) => {
        return old?.length
          ? [
              ...old,
              {
                comment: newComment || " ",
                comment_owner_id: "COMMENT_ADMIN_ID",
              },
            ]
          : [
              {
                comment: newComment || " ",
                comment_owner_id: "COMMENT_ADMIN_ID",
              },
            ];
      });
    });
  };

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001");
    socketIo.on("new_comment", (data: { order_claim_id: string }) => {
      // Si la notificación es para el cliente correcto, agregarla a la lista
      if (data.order_claim_id === claimId)
        getClaimComments(claimId).then((e) => {
          setComments(e);
        });
    });
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, [claimId]);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger
        onClick={() => handlerCommentsFromClaimOrder(claimId)}
      >
        <IconButton>
          <Eye className="text-ui-fg-subtle" />
        </IconButton>
        {/* <Button>Edit Variant</Button> */}
      </FocusModal.Trigger>
      <FocusModal.Content className="w-[50%] h-[80%] mx-auto my-auto">
        <FocusModal.Header>{/* <Button>Save</Button> */}</FocusModal.Header>
        <FocusModal.Body className="flex flex-col items-center py-8 ">
          <div className="flex w-full  flex-col gap-y-8">
            <div className="p-4 bg-white rounded ">
              <div className="mb-4">
                <p className="text-gray-600  font-bold mb-2">Conversación</p>
                <div className="bg-gray-100 p-3 rounded max-h-[400px] mb-4 overflow-y-scroll">
                  {comments?.map((comment) => (
                    <div
                      className={`flex w-full  ${
                        comment.comment_owner_id === "COMMENT_ADMIN_ID"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div className="my-1 px-3 py-1 max-w-[500px] bg-slate-200 border rounded-[10px]">
                        <p className="text-xs">
                          {comment.comment_owner_id === "COMMENT_ADMIN_ID"
                            ? "Admin Gudfy"
                            : comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                            ? "Cliente"
                            : "Tienda"}
                        </p>
                        {comment.comment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mb-4">
                <input
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                  }}
                  type="text"
                  placeholder="Escribe tu respuesta..."
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none"
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={handlerSubmitComment}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M9 16h6m-6-8h6m-8 4h.01m-2-4h.01M16 4h2a2 2 0 012 2v12a2 2 0 01-2 2h-4l-4 4v-4H8a2 2 0 01-2-2V6a2 2 0 012-2h2z"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-gray-500 mb-4">
                Como vendedor, tiene la opción de escalar esta discusión al
                administrador para una resolución más detallada.
              </p>

              <button
                className=" bg-red-500 text-white p-3 rounded hover:bg-red-600 transition-colors"
                onClick={handlerStatusClaim}
              >
                Cerrar Reclamación
              </button>
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export const config: RouteConfig = {
  link: {
    label: "Reclamos",
    // icon: CustomIcon,
  },
};

export default ReclamosListado;
