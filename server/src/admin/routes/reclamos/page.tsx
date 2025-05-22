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
  ArchiveBox,
  PlayMiniSolid,
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
import { getClaimNotification } from "../../actions/claim/get-admin-claim-notification";
import Notification from "../components/notification";

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

type notification = {
  id: string;
  order_claim_id: string;
  notification_type_id: string;
  customer_id: string;
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
  const [rowsPages, setRowsPages] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  // Estado para almacenar la reclamación seleccionada
  const [selectedClaimId, setSelectedClaimId] = useState<string>("");

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

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
    const searchValue = e.toLowerCase();
    let dataFilter = dataCustomer.dataClaim;
    if (searchValue) {
      dataFilter = dataCustomer.dataClaim.filter((data) => {
        return data.number_order.toLowerCase().includes(searchValue);
      });
    }
    setDataCustomer({
      ...dataCustomer,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: searchValue ? dataFilter : [],
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CERRADA":
        return "bg-red-200"; // Rojo: Indica que el reclamo está cerrado o finalizado.
      case "SIN RESOLVER":
        return "bg-yellow-200"; // Amarillo: Indica que el reclamo está pendiente o requiere atención.
      case "ABIERTA":
        return "bg-blue-200"; // Azul: Indica que el reclamo está activo o en revisión.
      case "RESUELTA":
        return "bg-green-200"; // Verde: Indica que el reclamo ha sido resuelto satisfactoriamente.
      default:
        return "bg-gray-200"; // Gris: Para estados no definidos o neutrales.
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

  // COMENTARIOS DE LA RECLAMACION ----------------

  const [comments, setComments] = useState<ClaimComments[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoadingComment, setIsLoadingComment] = useState<boolean>(true);

  const handleReset = () => {
    handlerGetListClaim();
  };

  const handlerCommentsFromClaimOrder = (claim: string) => {
    setIsLoadingComment(true);
    setSelectedClaimId(claim);
    getClaimComments(claim).then((e) => {
      setIsLoadingComment(false);
      setComments(e || []);
      setOpen(true);
    });
  };

  const handlerStatusClaim = (claim: string, status: string) => {
    updateStatusClaim(claim, status).then(() => {
      handleReset();
      setOpen(false);
    });
  };

  //--------------Notificaciones para los reclamos-------------------------

  const [notification, setNotification] = useState<notification[]>();
  const handlerRetriveNotificationsAdmin = () => {
    getClaimNotification().then((dataNotifi) => {
      setNotification(dataNotifi);
    });
  };

  //-----------------------------------------------------------------------

  useEffect(() => {
    handlerGetListClaim();
    handlerRetriveNotificationsAdmin();
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
                    <Select.Item value="CERRADA">Cerrado</Select.Item>
                    <Select.Item value="SIN RESOLVER">Escalado</Select.Item>
                    <Select.Item value="ABIERTA">Abierto</Select.Item>
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
          ) : dataCustomer.dataPreview?.length ? (
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
                  {dataCustomer.dataPreview?.map((data) => (
                    <Table.Row key={data.id}>
                      <Table.Cell>
                        <p
                          className={`${getStatusColor(
                            data.status_order_claim
                          )} capitalize px-4 py-2 rounded-lg`}
                        >
                          {formatStatus(data.status_order_claim)}
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
                      <Table.Cell className=" relativeflex gap-x-2 items-center">
                        <DropdownMenu>
                          <div className="relative">
                            {notification?.map((n) => {
                              if (n.order_claim_id === data.id) {
                                return <Notification key={n.id} />;
                              }
                              return null;
                            })}
                            <IconButton onClick={() => handlerCommentsFromClaimOrder(data.id)}>
                              <Eye className="text-ui-fg-subtle" />
                            </IconButton>
                          </div>
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

      {/* Modal único para todas las reclamaciones */}
      <ModalComment
        claimId={selectedClaimId}
        open={open}
        setOpen={setOpen}
        comments={comments}
        setComments={setComments}
        handlerStatusClaim={handlerStatusClaim}
      />
    </div>
  );
};

interface ModalClaimComment {
  claimId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  comments: ClaimComments[];
  setComments: React.Dispatch<React.SetStateAction<ClaimComments[]>>;
  handlerStatusClaim: (claim: string, status: string) => void;
}

const ModalComment = ({
  claimId,
  open,
  setOpen,
  comments,
  setComments,
  handlerStatusClaim,
}: ModalClaimComment) => {
  const { user } = useAdminGetSession();
  const [newComment, setNewComment] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io("http://localhost:9000");
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handlerSubmitComment = () => {
    if (!newComment.trim()) return;
    const newCommentData = {
      comment: newComment,
      comment_owner_id: "COMMENT_ADMIN_ID",
      order_claim_id: claimId,
    };

    postAddComment(newCommentData).then((response) => {
      // Solo procesamos la respuesta si existe y tiene un ID
      if (response && typeof response === 'object' && 'id' in response) {
        setComments((old) => [...old, { ...newCommentData, id: response.id }]);
        setNewComment("");
        socket?.emit("comment-added", {
          ...newCommentData,
          id: response.id,
        });
      }
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
  }, [claimId, setComments]);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      {/* No necesitamos un trigger aquí ya que el modal se abre desde la tabla */}

      {/* Contenedor principal del modal, aplicando estilos similares a "rounded-2xl overflow-hidden shadow-lg" */}
      <FocusModal.Content className="w-[50%] h-[80%] mx-auto my-auto rounded-2xl overflow-hidden shadow-lg">
        {/* Encabezado con estilo similar al ModalHeader original */}
        <FocusModal.Header className="flex flex-col gap-1 border-b border-slate-200 bg-gray-50 py-3 px-4 rounded-t-2xl">
          <h2 className="text-center text-lg font-semibold">
            Resolución de Reclamaciones
          </h2>
        </FocusModal.Header>

        {/* Cuerpo principal del chat, similar al ModalBody original */}
        <FocusModal.Body className="bg-gray-100 px-8 py-4 overflow-y-auto h-[60vh]">
          <div className="flex flex-col gap-2">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                className={`flex w-full transition-transform duration-300 ease-in-out ${
                  comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 shadow-md text-sm ${
                    comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                      ? "bg-blue-400 text-white rounded-bl-xl rounded-tr-xl rounded-tl-xl"
                      : "bg-gray-200 text-gray-900 rounded-br-xl rounded-tr-xl rounded-tl-xl"
                  }`}
                >
                  <p className="mb-1 text-xs font-bold">
                    {comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                      ? "Cliente"
                      : comment.comment_owner_id === "COMMENT_ADMIN_ID"
                      ? "Admin Gudfy"
                      : "Tienda"}
                  </p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </FocusModal.Body>

        {/* Zona de footer o acciones (en tu caso, lo manejas con otro FocusModal.Body) */}
        <FocusModal.Body className="border-t border-slate-200 bg-gray-50 py-3 px-4 rounded-b-2xl">
          <div className="w-full">
            {/* Campo de texto + botón de enviar, usando las clases del input estilo "rounded-full shadow-md" */}
            <div className="flex items-center w-full gap-2 bg-white px-3 py-2 rounded-full shadow-md">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                type="text"
                placeholder="Escribe tu respuesta..."
                className="flex-1 text-sm focus:outline-none focus:ring-0 border-none placeholder-gray-400"
              />
              <button
                onClick={handlerSubmitComment}
                className="cursor-pointer p-1 flex items-center justify-center w-10 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all duration-200"
              >
                {/* Icono de enviar (similar a SendIcon del original) */}
                <PlayMiniSolid />
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="py-2 btn btn-secondary btn-small flex items-center"
                onClick={()=>handlerStatusClaim(claimId, "CANCEL")}
              >
                <ArchiveBox className="mr-2" />
                Cerrar reclamación
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
