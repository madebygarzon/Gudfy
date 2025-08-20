import type { WidgetConfig } from "@medusajs/admin";
import React, { useState, useEffect } from "react";
import { XMark, ArrowLongRight, ArrowLongLeft, Eye, ChevronUpMini, ChevronDownMini } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import {
  Table,
  Input,
  Select,
  Label,
  FocusModal,
  Button,
  Text,
  Heading,
  IconButton,
  Drawer,
  Tooltip,
} from "@medusajs/ui";
import { formatDate } from "../../utils/format-date";
import { getListStoreOrder } from "../../actions/orders/get-list-store-orders";
import OrderCancel from "../../components/orders/order-cancel";
import OrderDetail from "../../components/orders/order-detail";
import { BACKEND } from "../../actions";

export interface order {
  id: string;
  pay_method_id: string;
  created_at: string;
  sellerapproved: string;
  customerapproved: string;
  quantity_products: number;
  total_price: string;
  person_name: string;
  person_last_name: string;
  email: string;
  conty: string;
  city: string;
  phone: string;
  proof_of_payment: string;
  status_id: string;
  state_order:
    | "Completado"
    | "Cancelada"
    | "Pendiente de pago"
    | "Finalizado"
    | "En discusión";
  store_variant: [
    {
      store_id: string;
      store_name: string;
      store_variant_order_id: string;
      variant_order_status_id: string;
      product_title: string;
      price: string;
      quantity: string;
      total_price_for_product: string;
      serial_code_products: [{ id: string; serial: string }];
    }
  ];
}

type ListDataSellerApplication = {
  dataOrders: Array<order>;
  dataPreview: Array<order>;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  loadedPages: Set<number>;
};

const dataSelecFilter = [
  {
    value: "All",
    label: "Todos",
  },
  {
    value: "Completed_ID",
    label: "Completado",
  },
  {
    value: "Finished_ID",
    label: "Finalizado",
  },
  {
    value: "Cancel_ID",
    label: "Cancelada",
  },
  {
    value: "Discussion_ID",
    label: "En discusión",
  },
  {
    value: "Pending_ID",
    label: "Pendiente de pago",
  },
];

const paymentMethodOptions = [
  {
    value: "All",
    label: "Todos los métodos",
  },
  {
    value: "Method_COINPAL_ID",
    label: "CoinPal",
  },
  {
    value: "Method_Manual_Pay_ID",
    label: "Pago Manual",
  },
];

const registerNumber = [50, 100, 300, 500, 1000];

const SellerApplication = () => {
  const [dataOrder, setDataCustomer] = useState<ListDataSellerApplication>({
    dataOrders: [],
    dataPreview: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 0,
    loadedPages: new Set(),
  });
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("All");
  const [storeFilter, setStoreFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  const [sortByPrice, setSortByPrice] = useState<string>(""); 
  const [sortByOrder, setSortByOrder] = useState<string>(""); 

  const [selectOrderData, setTelectOrderData] = useState<order>();

  const [open, onOpenChange] = useState(false);

  const handlerReset = () => {
    resetFiltersAndLoadFirstPage();
    onOpenChange(false);
  };

  const resetFiltersAndLoadFirstPage = () => {
    setStatusFilter("All");
    setPaymentMethodFilter("All");
    setStoreFilter("All");
    setSearchTerm("");
    setSearchInput("");
    setSortByPrice("");
    setSortByOrder("");
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });
    loadOrdersPage(1, true);
  };

  const loadOrdersPage = async (
    pageNumber: number,
    resetData: boolean = false
  ) => {
    setIsLoading(true);
    try {
      const params = {
        page: pageNumber,
        limit: rowsPages,
        status: statusFilter !== "All" ? statusFilter : undefined,
        paymentMethod:
          paymentMethodFilter !== "All" ? paymentMethodFilter : undefined,
        store: storeFilter !== "All" ? storeFilter : undefined,
        search: searchTerm || undefined,
        sortBy: sortByPrice ? "price" : sortByOrder ? "order" : undefined,
        sortDirection: sortByPrice || sortByOrder || undefined,
      };

      const response = await getListStoreOrder(params);
      if (!response) return;

      setDataCustomer((prev) => {
        const newLoadedPages = new Set(resetData ? [] : prev.loadedPages);
        newLoadedPages.add(pageNumber);

        const hasFilters =
          statusFilter !== "All" ||
          paymentMethodFilter !== "All" ||
          storeFilter !== "All" ||
          (searchTerm && searchTerm.trim() !== "");

        let newDataOrders, newDataPreview;

        if (hasFilters) {
          newDataOrders = resetData
            ? response.data
            : [
                ...prev.dataOrders.filter(
                  (order) =>
                    !response.data.some((newOrder) => newOrder.id === order.id)
                ),
                ...response.data,
              ];
          newDataPreview = response.data;
        } else {
          newDataOrders = resetData
            ? response.data
            : [
                ...prev.dataOrders.filter(
                  (order) =>
                    !response.data.some((newOrder) => newOrder.id === order.id)
                ),
                ...response.data,
              ];
          newDataPreview = getPageData(newDataOrders, pageNumber, rowsPages);
        }

        return {
          dataOrders: newDataOrders,
          dataPreview: newDataPreview,
          totalCount: response.totalCount,
          currentPage: pageNumber,
          totalPages: response.totalPages,
          loadedPages: newLoadedPages,
        };
      });
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPageData = (allData: order[], pageNum: number, limit: number) => {
    const startIndex = (pageNum - 1) * limit;
    const endIndex = startIndex + limit;
    return allData.slice(startIndex, endIndex);
  };

  const handlerNextPage = (action: "NEXT" | "PREV") => {
    const hasFilters =
      statusFilter !== "All" ||
      paymentMethodFilter !== "All" ||
      storeFilter !== "All" ||
      (searchTerm && searchTerm.trim() !== "");

    if (action === "NEXT" && page < dataOrder.totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);

      if (!dataOrder.loadedPages.has(nextPage) || hasFilters) {
        loadOrdersPage(nextPage);
      } else {
        const newDataPreview = getPageData(
          dataOrder.dataOrders,
          nextPage,
          rowsPages
        );
        setDataCustomer((prev) => ({
          ...prev,
          dataPreview: newDataPreview,
          currentPage: nextPage,
        }));
      }
    }

    if (action === "PREV" && page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);

      if (!dataOrder.loadedPages.has(prevPage) || hasFilters) {
        loadOrdersPage(prevPage);
      } else {
        const newDataPreview = getPageData(
          dataOrder.dataOrders,
          prevPage,
          rowsPages
        );
        setDataCustomer((prev) => ({
          ...prev,
          dataPreview: newDataPreview,
          currentPage: prevPage,
        }));
      }
    }
  };

  const handleSearch = async () => {
    const newSearchTerm = searchInput.trim();
    if (newSearchTerm === searchTerm) return;

    setIsSearching(true);
    setSearchTerm(newSearchTerm);
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });

    try {
      
      const params = {
        page: 1,
        limit: rowsPages,
        status: statusFilter !== "All" ? statusFilter : undefined,
        paymentMethod:
          paymentMethodFilter !== "All" ? paymentMethodFilter : undefined,
        store: storeFilter !== "All" ? storeFilter : undefined,
        search: newSearchTerm || undefined,
      };

    
      const response = await getListStoreOrder(params);

      if (response) {
        setDataCustomer({
          dataOrders: response.data,
          dataPreview: response.data,
          totalCount: response.totalCount,
          currentPage: 1,
          totalPages: response.totalPages,
          loadedPages: new Set([1]),
        });
      }
    } catch (error) {
      console.error("Error searching orders:", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    loadOrdersPage(1, true);
  }, []);

  useEffect(() => {
    if (dataOrder.dataOrders.length > 0) {
      const allStores = dataOrder.dataOrders.flatMap(
        (order) => order.store_variant?.map((store) => store.store_name) || []
      );

      const uniqueStores = [...new Set(allStores)];

      const storeOptions = [
        { value: "All", label: "Todas las tiendas" },
        ...uniqueStores.map((store) => ({
          value: store,
          label: store,
        })),
      ];

      setStoreFilterOptions(storeOptions);
    }
  }, [dataOrder.dataOrders]);

  const [storeFilterOptions, setStoreFilterOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const applyFilters = () => {
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });
    loadOrdersPage(1, true);
  };

  const handlerFilter = async (value: string) => {
    setIsLoading(true);
    setStatusFilter(value);
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });

    try {
      const params = {
        page: 1,
        limit: rowsPages,
        status: value !== "All" ? value : undefined,
        paymentMethod:
          paymentMethodFilter !== "All" ? paymentMethodFilter : undefined,
        store: storeFilter !== "All" ? storeFilter : undefined,
        search: searchTerm || undefined,
      };

      const response = await getListStoreOrder(params);

      if (response) {
        setDataCustomer({
          dataOrders: response.data,
          dataPreview: response.data,
          totalCount: response.totalCount,
          currentPage: 1,
          totalPages: response.totalPages,
          loadedPages: new Set([1]),
        });
      }
    } catch (error) {
      console.error("Error filtering orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlerFilterPaymentMethod = async (value: string) => {
    setIsLoading(true);
    setPaymentMethodFilter(value);
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });

    try {
      const params = {
        page: 1,
        limit: rowsPages,
        status: statusFilter !== "All" ? statusFilter : undefined,
        paymentMethod: value !== "All" ? value : undefined,
        store: storeFilter !== "All" ? storeFilter : undefined,
        search: searchTerm || undefined,
      };

      const response = await getListStoreOrder(params);

      if (response) {
        setDataCustomer({
          dataOrders: response.data,
          dataPreview: response.data,
          totalCount: response.totalCount,
          currentPage: 1,
          totalPages: response.totalPages,  
          loadedPages: new Set([1]),
        });
      }
    } catch (error) {
      console.error("Error filtering by payment method:", error);
    } finally {
      setIsLoading(false);
    }
  };    

  const handlerFilterStore = async (value: string) => {
    setStoreFilter(value);
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });

    const params = {
      page: 1,
      limit: rowsPages,
      status: statusFilter !== "All" ? statusFilter : undefined,
      paymentMethod:
        paymentMethodFilter !== "All" ? paymentMethodFilter : undefined,
      store: value !== "All" ? value : undefined,
      search: searchTerm || undefined,
    };

    const response = await getListStoreOrder(params);
    if (response) {
      setDataCustomer({
        dataOrders: response.data,
        dataPreview: response.data,
        totalCount: response.totalCount,
        currentPage: 1,
        totalPages: response.totalPages,
        loadedPages: new Set([1]),
      });
    }
  };

  const handlerRowsNumber = async (value: string) => {
    const newRowsPages = parseInt(value);
    setRowsPages(newRowsPages);
    setPage(1);
    setIsLoading(true);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });

    try {
      const params = {
        page: 1,
        limit: newRowsPages, 
        status: statusFilter !== "All" ? statusFilter : undefined,
        paymentMethod:
          paymentMethodFilter !== "All" ? paymentMethodFilter : undefined,
        store: storeFilter !== "All" ? storeFilter : undefined,
        search: searchTerm || undefined,
      };

      const response = await getListStoreOrder(params);

      if (response) {
        setDataCustomer({
          dataOrders: response.data,
          dataPreview: response.data,
          totalCount: response.totalCount,
          currentPage: 1,
          totalPages: response.totalPages,
          loadedPages: new Set([1]),
        });
      }
    } catch (error) {
      console.error("Error changing rows per page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorState = (state_id: string) => {
    switch (state_id) {
      case "Finalizado":
        return "text-green-500";

      case "Paid_ID":
        return "text-green-500";

      case "Completado":
        return "text-blue-500";

      case "En discusión":
        return "text-orange-500";

      case "Cancelada":
        return "text-red-500";
      default:
        break;
    }
  };

  const handlerSearcherbar = (value: string) => {
    setSearchInput(value);
  };

  const clearSearch = async () => {
    setIsSearching(true);
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });

    try {
      const params = {
        page: 1,
        limit: rowsPages,
        status: statusFilter !== "All" ? statusFilter : undefined,
        paymentMethod:
          paymentMethodFilter !== "All" ? paymentMethodFilter : undefined,
        store: storeFilter !== "All" ? storeFilter : undefined,
        search: undefined, 
      };

      const response = await getListStoreOrder(params);

      if (response) {
        setDataCustomer({
          dataOrders: response.data,
          dataPreview: response.data,
          totalCount: response.totalCount,
          currentPage: 1,
          totalPages: response.totalPages,
          loadedPages: new Set([1]),
        });
      }
    } catch (error) {
      console.error("Error clearing search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlerSortByPrice = () => {
    setSortByOrder("");
    
    if (sortByPrice === "") {
      setSortByPrice("desc"); 
    } else if (sortByPrice === "desc") {
      setSortByPrice("asc"); 
    } else {
      setSortByPrice(""); 
    }
    
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });
    
  
    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });
    
  
    setTimeout(() => loadOrdersPage(1, true), 0);
  };

  const handlerSortByOrder = () => {
    setSortByPrice("");
    
    if (sortByOrder === "") {
      setSortByOrder("asc"); 
    } else if (sortByOrder === "asc") {
      setSortByOrder("desc"); 
    } else {
      setSortByOrder(""); 
    }

    setPage(1);
    setDataCustomer({
      dataOrders: [],
      dataPreview: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0,
      loadedPages: new Set(),
    });
   
    setTimeout(() => loadOrdersPage(1, true), 0);
  };

  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg ">
       <h1 className=" text-xl font-bold">
              Lista de ordenes
            </h1>
      <div className="w-full h-auto ">
        <>
          <div className="mt-2 h-[120px] flex justify-between">
            <div className="flex gap-5 h-full items-end py-4">
              <div className="w-[156px] ">
                <Select onValueChange={handlerFilter}>
                  <Select.Trigger>
                    <Select.Value placeholder="Filtrar por estado: " />
                  </Select.Trigger>
                  <Select.Content>
                    {dataSelecFilter.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              <div className="w-[156px] ">
                <Select onValueChange={handlerFilterPaymentMethod}>
                  <Select.Trigger>
                    <Select.Value placeholder="Método de pago: " />
                  </Select.Trigger>
                  <Select.Content>
                    {paymentMethodOptions.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div>
              {/* <div className="w-[156px] ">
                <Select onValueChange={handlerFilterStore}>
                  <Select.Trigger>
                    <Select.Value placeholder="Filtrar por tienda: " />
                  </Select.Trigger>
                  <Select.Content>
                    {storeFilterOptions.map((item) => (
                      <Select.Item key={item.value} value={item.value}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              </div> */}
              <div className="w-[250px] flex gap-2">
                <Input
                  placeholder="Comprador, Email, Orden"
                  id="search-input"
                  type="search"
                  value={searchInput}
                  onChange={(e) => handlerSearcherbar(e.target.value)}
                />
                <Button
                  size="small"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
                {searchTerm && (
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={clearSearch}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
            <div className="flex w-full p-6 text-xs font-light items-end justify-end">
                
                <div className="flex gap-5 justify-end">
                  <div className="text-[12px] w-[50px]">
                    <Select onValueChange={handlerRowsNumber} size="small">
                      <Select.Trigger>
                        <Select.Value placeholder="50" />
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
                  <div className="flex items-center">
                    {page} of {dataOrder.totalPages}
                  </div>
                  <button
                    disabled={page == 1 ? true : false}
                    onClick={() => handlerNextPage("PREV")}
                  >
                    <ArrowLongLeft />
                  </button>

                  <button
                    disabled={page == dataOrder.totalPages ? true : false}
                    onClick={() => handlerNextPage("NEXT")}
                  >
                    <ArrowLongRight />
                  </button>
                </div>
              </div>
          </div>
          {isLoading ? (
            <div className="min-h-[293px] flex items-center justify-center">
              <Spinner size="large" variant="secondary" />
            </div>
          ) : dataOrder.dataPreview?.length ? (
            <div className="min-h-[293px]">
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Estado</Table.HeaderCell>
                    <Table.HeaderCell>
                      <button
                        onClick={handlerSortByOrder}
                        className="flex items-center gap-1 hover:text-ui-fg-base transition-colors"
                      >
                        Número de orden
                        <div className="flex flex-col">
                          <ChevronUpMini 
                            className={`w-3 h-3 ${
                              sortByOrder === "asc" 
                                ? "text-ui-fg-base" 
                                : "text-ui-fg-muted opacity-40"
                            }`} 
                          />
                          <ChevronDownMini 
                            className={`w-3 h-3 ${
                              sortByOrder === "desc" 
                                ? "text-ui-fg-base" 
                                : "text-ui-fg-muted opacity-40"
                            }`} 
                          />
                        </div>
                      </button>
                    </Table.HeaderCell>
                    <Table.HeaderCell>Usuario</Table.HeaderCell>
                    <Table.HeaderCell>
                      <button
                        onClick={handlerSortByPrice}
                        className="flex items-center gap-1 hover:text-ui-fg-base transition-colors"
                      >
                        Precio
                        <div className="flex flex-col">
                          <ChevronUpMini 
                            className={`w-3 h-3 ${
                              sortByPrice === "asc" 
                                ? "text-ui-fg-base" 
                                : "text-ui-fg-muted opacity-40"
                            }`} 
                          />
                          <ChevronDownMini 
                            className={`w-3 h-3 ${
                              sortByPrice === "desc" 
                                ? "text-ui-fg-base" 
                                : "text-ui-fg-muted opacity-40"
                            }`} 
                          />
                        </div>
                      </button>
                    </Table.HeaderCell>
                    <Table.HeaderCell>Tienda</Table.HeaderCell>
                    <Table.HeaderCell>Comprobante</Table.HeaderCell>
                    <Table.HeaderCell>Fecha y hora</Table.HeaderCell>
                    <Table.HeaderCell>Detalle</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {dataOrder.dataPreview?.map((data, i) => {
                    return (
                      <Table.Row key={data.id}>
                        <Table.Cell
                          className={`${getColorState(data.state_order)}`}
                        >
                          {data.state_order}
                        </Table.Cell>
                        <Table.Cell>{data.id}</Table.Cell>
                        <Table.Cell>
                          {data.person_name + " " + data.person_last_name}
                        </Table.Cell>
                        <Table.Cell>{data.total_price}</Table.Cell>
                        <Table.Cell>
                          {data.store_variant &&
                          Array.isArray(data.store_variant)
                            ? [
                                ...new Set(
                                  data.store_variant.map(
                                    (store) => store.store_name
                                  )
                                ),
                              ].map((storeName, index, uniqueStores) => (
                                <span key={storeName}>
                                  {storeName}
                                  {index < uniqueStores.length - 1 && ", "}
                                </span>
                              ))
                            : null}
                        </Table.Cell>
                        <Table.Cell>
                          {data.proof_of_payment ? (
                            <Tooltip
                              maxWidth={300}
                              content={
                                <img
                                  src={BACKEND + "/" + data.proof_of_payment}
                                  alt="Comprobante de pago"
                                  width={300}
                                  height={0}
                                />
                              }
                            >
                              <img
                                src={BACKEND + "/" + data.proof_of_payment}
                                alt="Comprobante de pago"
                                width={50}
                                height={50}
                              />
                            </Tooltip>
                          ) : (
                            "CoinPal Pago Automatico"
                          )}
                        </Table.Cell>
                        <Table.Cell>{formatDate(data.created_at)}</Table.Cell>
                        <Table.Cell>
                          <IconButton
                            onClick={() => {
                              setTelectOrderData(data);
                              onOpenChange(true);
                            }}
                          >
                            <Eye />
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
        </>
      </div>

      <div className="flex p-6">
        <div className="w-[35%]">{`${dataOrder.totalCount || 0} Ordenes`}</div>
        <div className="flex w-[65%] gap-5 justify-end">
          <span className="text-[12px] mr-[4px]">{`N° Registros: `}</span>
          <div className="text-[12px] w-[50px]">
            <Select onValueChange={handlerRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder="50" />
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
            {page} of {dataOrder.totalPages}
          </>
          <button
            disabled={page == 1 ? true : false}
            onClick={() => handlerNextPage("PREV")}
          >
            <ArrowLongLeft />
          </button>

          <button
            disabled={page == dataOrder.totalPages ? true : false}
            onClick={() => handlerNextPage("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>

      <FocusModalDemo
        handleReset={handlerReset}
        isOpen={open}
        onOpenChange={onOpenChange}
        orderData={selectOrderData}
      />
    </div>
  );
};

interface ModalOrder {
  orderData?: order;
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  handleReset: () => void;
}

function FocusModalDemo({
  orderData,
  isOpen,
  onOpenChange,
  handleReset,
}: ModalOrder) {
  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content className="w-1/2 right-0">
        <Drawer.Header>
          <Drawer.Title>Detalles del pedido {orderData?.id}</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="flex flex-col  py-5">
          {orderData?.state_order === "Cancelada" ? (
            <OrderCancel orderData={orderData} handlerReset={handleReset} />
          ) : (
            <OrderDetail
              customer={orderData?.person_name + orderData?.person_last_name}
              orderData={orderData}
              handlerReset={handleReset}
            />
          )}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer>
  );
}

export const config: WidgetConfig = {
  zone: "order.list.before",
};

export default SellerApplication;
