import React, { useState, useEffect, useRef } from "react";
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
  const [selectedClaimId, setSelectedClaimId] = useState<string>("");
  const [selectedClaimStatus, setSelectedClaimStatus] = useState<string>("");

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
        return "bg-red-200";
      case "SIN RESOLVER":
        return "bg-yellow-200";
      case "ABIERTA":
        return "bg-blue-200";
      case "RESUELTA":
        return "bg-green-200";
      default:
        return "bg-gray-200";
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
    
    const selectedClaim = dataCustomer.dataClaim.find(data => data.id === claim);
    if (selectedClaim) {
      setSelectedClaimStatus(selectedClaim.status_order_claim);
    }
    
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
                            <IconButton
                              onClick={() =>
                                handlerCommentsFromClaimOrder(data.id)
                              }
                            >
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
        claimStatus={selectedClaimStatus}
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
  claimStatus?: string;
}

const ModalComment = ({
  claimId,
  open,
  setOpen,
  comments,
  setComments,
  handlerStatusClaim,
  claimStatus,
}: ModalClaimComment) => {
  const [newComment, setNewComment] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const isClaimClosed = claimStatus === "CERRADA";
  
  const { user } = useAdminGetSession();

  useEffect(() => {
    const socketIo = io(
      process.env.BACKEND_URL ??
        `http://localhost:${process.env.BACKEND_PORT ?? 9000}`
    );
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, []);

  const handlerSubmitComment = async () => {
    if (!newComment.trim() || isLoading || isClaimClosed) return;

    setNewComment("");
    try {
      setIsLoading(true);
      const newCommentData = {
        comment: newComment,
        comment_owner_id: "COMMENT_ADMIN_ID",
        order_claim_id: claimId,
      };

      const response = await postAddComment(newCommentData);

      if (response && typeof response === "object" && "id" in response) {
        setComments((old) => [...old, { ...newCommentData, id: response.id }]);
        socket?.emit("comment-added", {
          ...newCommentData,
          id: response.id,
        });
      }
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlerSubmitComment();
    }
  };

  useEffect(() => {
    const socketIo = io(process.env.PORT_SOKET || "http://localhost:3001");
    socketIo.on("new_comment", (data: { order_claim_id: string }) => {
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

  useEffect(() => {
    scrollToBottom();
  }, [comments]);
  useEffect(() => {
    if (open && comments.length > 0) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [open, comments]);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Content className="w-[60%] h-full flex flex-col ml-auto">
        <FocusModal.Header className="flex gap-1 justify-end"></FocusModal.Header>
        <FocusModal.Body className="flex-1 overflow-hidden p-0">
          <div className="h-full flex flex-col bg-white">
            <h1 className="text-2xl font-bold text-center text-gray-700">
              Resolución de Reclamaciones
            </h1>
            <div className="flex-1 px-6 pb-4 flex flex-col gap-4 mt-4">
              <div
                className="overflow-y-auto space-y-3"
                style={{ height: "60vh" }}
              >
                {comments?.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex w-full ${
                      comment.comment_owner_id === "COMMENT_ADMIN_ID"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        comment.comment_owner_id === "COMMENT_ADMIN_ID"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <p className="text-xs font-semibold">
                        {comment.comment_owner_id === "COMMENT_CUSTOMER_ID"
                          ? "Cliente"
                          : comment.comment_owner_id === "COMMENT_ADMIN_ID"
                          ? "Admin Gudfy"
                          : "Tienda"}
                      </p>
                      {comment.created_at && (
                        <p className="text-[10px] text-gray-500 mb-2">
                          {new Date(comment.created_at).toLocaleString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )}
                        </p>
                      )}
                      <p className="mt-1">{comment.comment}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex flex-col gap-4">
                {isClaimClosed && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                    <p className="text-sm font-medium">
                      🚫 Esta reclamación está cerrada. No se pueden enviar más mensajes.
                    </p>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={handleKeyPress}
                      type="text"
                      placeholder={isClaimClosed ? "Reclamación cerrada - No se pueden enviar mensajes" : "Escribe tu respuesta... (Presiona Enter para enviar)"}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                        isClaimClosed 
                          ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                      }`}
                      disabled={isLoading || isClaimClosed}
                    />
                  </div>
                  <button
                    onClick={handlerSubmitComment}
                    className={`h-fit px-6 py-2 rounded-md transition-colors duration-200 ${
                      isClaimClosed || isLoading || !newComment.trim()
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    disabled={isLoading || !newComment.trim() || isClaimClosed}
                  >
                    {isLoading ? "Enviando..." : isClaimClosed ? "Cerrada" : "Enviar"}
                  </button>
                </div>

                <div className="flex justify-center">
                  {!isClaimClosed && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center gap-2 transition-colors duration-200"
                    onClick={() => handlerStatusClaim(claimId, "CANCEL")}
                  >
                    <ArchiveBox className="w-4 h-4" />
                    Cerrar reclamación
                  </button>
                  )}
                </div> 
              </div>
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
  },
};

export default ReclamosListado;
