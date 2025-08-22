import React, { useEffect, useState } from "react";
import type { RouteConfig, WidgetConfig } from "@medusajs/admin";
import { Table, Select, Input, Badge, Command, Copy } from "@medusajs/ui";
import { TriangleDownMini, XMark, ArrowLongLeft, ArrowLongRight } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import clsx from "clsx";
import getListSerialCode from "../../actions/serial-code/get-list-serial-code";

type SerialCodeRow = {
  serial_code: string;
  so_id: string | null;
  store_name: string;
  product_name: string;
  created_at: string;
};

type SerialCodeArrays = {
  dataAll: SerialCodeRow[];
  dataFilter?: SerialCodeRow[];
  dataPreview: SerialCodeRow[];
  count: number;
};

const registerNumber = [100, 300, 500];

const SerialCodeTable = () => {
  const [state, setState] = useState<SerialCodeArrays>({
    dataAll: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPageTotal] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderDateDesc, setOrderDateDesc] = useState<boolean>(true); 
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SOLD" | "AVAILABLE">("ALL");

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const paginate = (arr: SerialCodeRow[], pageNum: number, rows?: number) => {
    const rp = rows ?? rowsPages;
    const start = (pageNum - 1) * rp;
    const end = pageNum * rp;
    setPageTotal(Math.ceil((arr?.length || 0) / rp));
    return arr.slice(start, end);
  };

  const applySort = (data: SerialCodeRow[], desc: boolean) => {
    return [...data].sort((a, b) => {
      const aTs = new Date(a.created_at).getTime();
      const bTs = new Date(b.created_at).getTime();
      return desc ? bTs - aTs : aTs - bTs;
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result: SerialCodeRow[] = await getListSerialCode();
      const sorted = applySort(result || [], true); 
      setState({
        dataAll: sorted,
        dataFilter: [],
        dataPreview: paginate(sorted, 1),
        count: sorted.length,
      });
      setPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSortDate = () => {
    const nextDesc = !orderDateDesc;
    setOrderDateDesc(nextDesc);
    const base = state.dataFilter && state.dataFilter.length ? state.dataFilter : state.dataAll;
    const sorted = applySort(base, nextDesc);
    setState({
      ...state,
      dataPreview: paginate(sorted, 1),
      dataFilter: state.dataFilter && state.dataFilter.length ? sorted : [],
    });
    setPage(1);
  };

  const handleRowsNumber = (value: string) => {
    const valueInt = parseInt(value, 10);
    setRowsPages(valueInt);
    const base = state.dataFilter && state.dataFilter.length ? state.dataFilter : state.dataAll;
    setState({
      ...state,
      dataPreview: paginate(base, 1, valueInt),
    });
    setPage(1);
  };

  const handleNextPrev = (action: "NEXT" | "PREV") => {
    if (action === "NEXT") {
      setPage((old) => {
        const base = state.dataFilter && state.dataFilter.length ? state.dataFilter : state.dataAll;
        const next = old + 1;
        setState({ ...state, dataPreview: paginate(base, next) });
        return next;
      });
    }
    if (action === "PREV") {
      setPage((old) => {
        const base = state.dataFilter && state.dataFilter.length ? state.dataFilter : state.dataAll;
        const prev = old - 1;
        setState({ ...state, dataPreview: paginate(base, prev) });
        return prev;
      });
    }
  };

  const filterData = (term: string, status: "ALL" | "SOLD" | "AVAILABLE") => {
    const t = term.trim().toLowerCase();
    let filtered = state.dataAll;
    if (status === "SOLD") {
      filtered = filtered.filter((r) => !!r.so_id);
    } else if (status === "AVAILABLE") {
      filtered = filtered.filter((r) => !r.so_id);
    }
    if (t) {
      filtered = filtered.filter((row) => {
        const c1 = row.serial_code?.toLowerCase().includes(t);
        const c2 = row.product_name?.toLowerCase().includes(t);
        const c3 = row.store_name?.toLowerCase().includes(t);
        const c4 = (row.so_id ?? "--").toString().toLowerCase().includes(t);
        return c1 || c2 || c3 || c4;
      });
    }
    const sorted = applySort(filtered, orderDateDesc);
    return sorted;
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const filtered = filterData(value, statusFilter);
    setState({
      ...state,
      dataFilter: filtered,
      dataPreview: paginate(filtered, 1),
    });
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    const v = (value as "ALL" | "SOLD" | "AVAILABLE") || "ALL";
    setStatusFilter(v);
    const filtered = filterData(search, v);
    setState({
      ...state,
      dataFilter: filtered,
      dataPreview: paginate(filtered, 1),
    });
    setPage(1);
  };

  const currentList = state.dataPreview;


  return (
    <div className="bg-white p-8 border border-gray-200 rounded-lg mb-10">
      <div className="mt-2 h-[120px] flex justify-between">
        <h1 className="text-xl font-bold">Códigos/Seriales de productos</h1>
        <div className="flex gap-5 h-full items-end py-4">
          <div className="w-[200px]">
            <Select onValueChange={handleStatusChange} size="small">
              <Select.Trigger>
                <Select.Value placeholder={
                  statusFilter === "ALL"
                    ? "Estado: Todos"
                    : statusFilter === "SOLD"
                    ? "Estado: Vendido"
                    : "Estado: Disponible"
                } />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="ALL">Todos</Select.Item>
                <Select.Item value="AVAILABLE">Disponible</Select.Item>
                <Select.Item value="SOLD">Vendido</Select.Item>
              </Select.Content>
            </Select>
          </div>
          <div className="w-[300px]">
            <Input
              placeholder="Buscar por código, producto, tienda u orden"
              id="search-input"
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[293px] flex items-center justify-center">
          <Spinner size="large" variant="secondary" />
        </div>
      ) : currentList?.length ? (
        <div className="min-h-[293px] pb-10">
          <Table>
            <Table.Header>
              <Table.Row>
                
                <Table.HeaderCell>Código</Table.HeaderCell>
                <Table.HeaderCell>Producto</Table.HeaderCell>
                <Table.HeaderCell>Orden</Table.HeaderCell>
                <Table.HeaderCell
                  className="flex cursor-pointer items-center"
                  onClick={handleSortDate}
                >
                  Fecha{" "}
                  <TriangleDownMini
                    className={clsx("", {
                      "rotate-180": !orderDateDesc,
                    })}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell>Tienda</Table.HeaderCell>
                
                
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentList.map((row) => (
                <Table.Row key={`${row.serial_code}-${row.created_at}`}>
                  
                  <Table.Cell >
                  <div className="flex items-center justify-between gap-2 bg-slate-300 border rounded border-slate-300 px-2 py-1">
                  <code className=" text-xs text-black-800"> {row.serial_code} </code>
                  <Copy content={row.serial_code} />
                  </div>
                  </Table.Cell>
                  <Table.Cell>{row.product_name}</Table.Cell>
                  <Table.Cell>{row.so_id ?? "--"}</Table.Cell>
                  <Table.Cell>{formatDate(row.created_at)}</Table.Cell>
                  <Table.Cell>
                    {row.so_id ? (
                      <Badge color="red">Vendido</Badge>
                    ) : (
                      <Badge color="green">Disponible</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>{row.store_name}</Table.Cell>
                  
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[293px] gap-2">
          <XMark className="text-ui-fg-subtle" />
          <span>No hay datos relacionados</span>
        </div>
      )}

      <div className="flex pt-[10] mt-[10]">
        <div className="w-[35%]">{`${state.count || 0} Códigos`}</div>
        <div className="flex w-[65%] gap-5 justify-end items-center">
          <span className="text-[12px] mr-[4px]">{`N° Registros: `}</span>
          <div className="text-[12px] w-[70px]">
            <Select onValueChange={handleRowsNumber} size="small">
              <Select.Trigger>
                <Select.Value placeholder={`${rowsPages}`} />
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
            {page} de {pageTotal}
          </>
          <button disabled={page === 1} onClick={() => handleNextPrev("PREV")}>
            <ArrowLongLeft />
          </button>
          <button
            disabled={page === pageTotal || pageTotal === 0}
            onClick={() => handleNextPrev("NEXT")}
          >
            <ArrowLongRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export const config: RouteConfig = {
    link: {
      label: "Codes",
      // icon: CustomIcon,
    },
  };

export default SerialCodeTable;