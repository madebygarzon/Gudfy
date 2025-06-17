import type { WidgetConfig } from "@medusajs/admin";
import { Link } from "react-router-dom";

import React, { useState, useEffect, useRef } from "react";
import { Table, DropdownMenu, IconButton, FocusModal, Button, Select, Textarea, Text } from "@medusajs/ui";
import { Thumbnail } from "../../components/thumbnail";
import {
  PencilSquare,
  XMark,
  Eye,
  Check,
  ArrowLongRight,
  ArrowLongLeft,
  TriangleDownMini,
  ChatBubble,
  ArrowDownTray,
} from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";
import { Input } from "@medusajs/ui";
import { InformationCircleSolid } from "@medusajs/icons";
import { Tooltip } from "@medusajs/ui";
import { getAllListRequestProduct } from "../../actions/request-product/get-all-list-request-product";
import clsx from "clsx";
import { updateRequestProduct } from "../../actions/request-product/update-request-product";
import { createProductVariant } from "../../actions/product/create-productVariants";

type ListRequestProduct = {
  request_id: string;
  seller_id: string;
  product_title: string;
  product_image: string;
  description: string;
  variants: string;
  approved: boolean;
  created_at: string;
  store_name: string;
  customer_email: string;
  store_id: string;
};
type arraysRequestProduct = {
  dataRequestProduct: ListRequestProduct[];
  dataFilter?: ListRequestProduct[];
  dataPreview: ListRequestProduct[];
  count: number;
};

const registerNumber = [15, 30, 100];
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";
const dataSelecFilter = [
  {
    value: "all",
    label: "Todos",
  },
  {
    value: "true",
    label: "Aprobado",
  },
  {
    value: "false",
    label: "Sin Aprobar",
  },
];

const RequestProduct = () => {
  const [dataProduct, setDataCustomer] = useState<arraysRequestProduct>({
    dataRequestProduct: [],
    dataFilter: [],
    dataPreview: [],
    count: 0,
  });
  const [pageTotal, setPagetotal] = useState<number>();
  const [page, setPage] = useState(1);
  const [rowsPages, setRowsPages] = useState<number>(15);
  const [isLoading2, setIsLoading] = useState<boolean>(true);
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const [orderDate, setOrderDate] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<ListRequestProduct | null>(null);
  const [variantInputs, setVariantInputs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlerGetListProduct = async (order?: string) => {
    setIsLoading(true);

    const product = await getAllListRequestProduct().then((p) => {
      setIsLoading(false);
      return p;
    });

    const sortedProducts = product.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    setPagetotal(Math.ceil(sortedProducts?.length || 0 / rowsPages));
    setDataCustomer({
      dataRequestProduct: sortedProducts,
      dataPreview: handlerPreviewSellerAplication(sortedProducts, 1),
      count: sortedProducts?.length || 0,
    });
  };

  const handlerNextPage = (action) => {
    if (action == "NEXT")
      setPage((old) => {
        if (dataProduct.dataFilter!) {
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataFilter,
              page + 1
            ),
          });
          return old + 1;
        } else
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataRequestProduct,
              page + 1
            ),
          });
        return old + 1;
      });

    if (action == "PREV")
      setPage((old) => {
        if (dataProduct.dataFilter!) {
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataFilter,
              page - 1
            ),
          });
          return old - 1;
        } else
          setDataCustomer({
            ...dataProduct,
            dataPreview: handlerPreviewSellerAplication(
              dataProduct.dataRequestProduct,
              page - 1
            ),
          });
        return old - 1;
      });
  };

  const handlerPreviewSellerAplication = (
    queryParams: Array<ListRequestProduct>,
    page,
    rows?
  ) => {
    const dataRowPage = rows || rowsPages;
    const start = (page - 1) * dataRowPage;
    const end = page * dataRowPage;
    const newArray = queryParams?.slice(start, end);
    setPage(1);
    setPagetotal(Math.ceil(queryParams?.length / dataRowPage));
    return newArray;
  };

  useEffect(() => {
    handlerGetListProduct();
  }, []);

  const handlerFilter = (value) => {
    setPage(1);
    let dataFilter;
    switch (value) {
      case "all":
        dataFilter = dataProduct.dataRequestProduct;
        break;
      case "true":
        dataFilter = dataProduct.dataRequestProduct.filter(
          (data) => data.approved === true
        );
        break;
      case "false":
        dataFilter = dataProduct.dataRequestProduct.filter(
          (data) => data.approved === false
        );
        break;
      default:
        dataFilter = dataProduct.dataRequestProduct;
        break;
    }
    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: value === "all" ? [] : dataFilter,
    });
  };

  const handlerRowsNumber = (value) => {
    const valueInt = parseInt(value);
    setRowsPages(valueInt);
    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(
        dataProduct.dataFilter!
          ? dataProduct.dataFilter
          : dataProduct.dataRequestProduct,
        1,
        valueInt
      ),
    });
  };

  const handlerOrderDate = (value: boolean) => {
    handlerGetListProduct(value ? "ASC" : "DESC");
    setOrderDate((data) => !data);
  };

  const handlerSearcherbar = (e: string) => {
    const searchTerm = e.toLowerCase();

    const dataFilter = dataProduct.dataRequestProduct.filter((data) => {
      const titleMatch = data.product_title.toLowerCase().includes(searchTerm);
      const emailMatch = data.customer_email.toLowerCase().includes(searchTerm);
      return titleMatch || emailMatch;
    });

    setDataCustomer({
      ...dataProduct,
      dataPreview: handlerPreviewSellerAplication(dataFilter, 1),
      dataFilter: dataFilter,
    });
  };

  const handleDownload = (data: ListRequestProduct) => {
    const link = document.createElement("a");

    const url = data.product_image;
    link.href = data.product_image;
    link.download = data.product_title;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openEditModal = (rowData: ListRequestProduct) => {
    setEditData(rowData);
    setVariantInputs(rowData.variants ? rowData.variants.split(",") : []);
    setPreviewUrl(rowData.product_image || null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    setIsLoadingButton(true)
    if (editData) {
      const updatedProduct = {
        ...editData,
        variants: variantInputs,
        product_image: selectedFile ? '' : (previewUrl || editData.product_image)
      };

      

      if (selectedFile) {
       
        
        createProductVariant(updatedProduct, selectedFile)
          .then((response) => {
            handlerGetListProduct()
            setIsModalOpen(false)
            setIsLoadingButton(false)
          })
          .catch((error) => {
           
            setIsLoadingButton(false)
          });
      } else {
       
        createProductVariant(updatedProduct)
          .then((response) => {
            handlerGetListProduct()
            setIsModalOpen(false)
            setIsLoadingButton(false)
          })
          .catch((error) => {
            setIsLoadingButton(false)
          });
      }
    }
  };

  const handleUpdateVariant = (index: number, value: string) => {
    const newVariants = [...variantInputs];
    newVariants[index] = value;
    setVariantInputs(newVariants);
  };
  
  const addVariant = () => {
    setVariantInputs([...variantInputs, '']);
  };
  
  const removeVariant = (index: number) => {
    const newVariants = [...variantInputs];
    newVariants.splice(index, 1);
    setVariantInputs(newVariants);
  };


  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg mb-10">
      <div className="mt-2 h-[120px] flex justify-between">
        <h1 className=" text-xl font-bold"> Solicitud de productos</h1>
        <div className="flex gap-5 h-full items-end py-4">
          <div className="w-[156px] ">
            <Select onValueChange={handlerFilter}>
              <Select.Trigger>
                <Select.Value placeholder="Filtar por: " />
              </Select.Trigger>
              <Select.Content>
                {dataSelecFilter.map((item, i) => (
                  <Select.Item key={i} value={item.value}>
                    {item.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
          <div className="w-[250px]">
            <Input
              placeholder="Buscar por nombre o email"
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
      ) : dataProduct.dataPreview?.length ? (
        <div className="min-h-[293px] pb-10">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell
                  className="flex cursor-pointer items-center"
                  onClick={() => handlerOrderDate(orderDate)}
                >
                  Fecha{" "}
                  <TriangleDownMini
                    className={clsx("", {
                      "rotate-180": orderDate === true,
                    })}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell> Nombre</Table.HeaderCell>
                <Table.HeaderCell>Usuario</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Variants</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>

                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataProduct.dataPreview?.map((data, i) => {
                return (
                  <Table.Row key={data.request_id}>
                    <Table.Cell>{formatarFecha(data.created_at)}</Table.Cell>

                    <Table.Cell>
                      <Tooltip
                        content={
                          <div className="w-auto h-auto flex flex-col items-center">
                            <h3 className=" text-base font-blod text-center m">
                              Imagen proporcionada por el vendedor
                            </h3>
                            <img
                              src={data.product_image}
                              className="object-fill object-center max-h-[200px] max-w-[200px] my-3"
                            />
                            <div>
                              <Link to={data.product_image} target="_blank">
                                <IconButton className="w-auto border">
                                  Descargar Imagen
                                  <ArrowDownTray />
                                </IconButton>
                              </Link>
                            </div>
                          </div>
                        }
                      >
                        <div className="flex gap-2">
                          <Thumbnail src={data.product_image} />
                          {data.product_title}
                        </div>
                      </Tooltip>
                    </Table.Cell>
                    <Table.Cell>{data.store_name}</Table.Cell>
                    <Table.Cell>{data.customer_email}</Table.Cell>
                    <Table.Cell>{data.variants}</Table.Cell>
                    <Table.Cell>
                      {!data.approved ? "Sin Aprobar" : "Aprobrado"}
                    </Table.Cell>

                    <Table.Cell className="flex gap-x-2 items-center">
                    {!data.approved &&  <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <IconButton>
                            <PencilSquare className="text-ui-fg-subtle" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            className="gap-x-2"
                            onClick={() => openEditModal(data)}
                          >
                            <Check className="text-ui-fg-subtle" />
                            Ver solicitud
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu> }
                     
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
        <div className="w-[35%]">{`${dataProduct.count || 0} Products`}</div>
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

      {/* Edit Modal */}
      {isModalOpen && editData && (
        <FocusModal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <FocusModal.Content className="w-[70%] h-[80%] mx-auto my-auto rounded-2xl overflow-hidden shadow-lg">
            <FocusModal.Header className=" justify-start m-2" >
              <h1 className="text-xl font-semibold">Aprobar Producto</h1>
            </FocusModal.Header>
            <FocusModal.Body className="bg-white px-8  overflow-y-auto flex gap-5">
             
                <div className=" w-[50%]">
                  <div>
                    <label className="text-gray-700 text-sm">Título del Producto</label>
                    <Input 
                      value={editData.product_title || ''}
                      onChange={(e) => setEditData({...editData, product_title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm">Descripción</label>
                    <textarea
                      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      value={editData.description || ''}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      placeholder="Introduce una descripción del producto..."
                    />
                  </div>
                  <div>
                    <div className="flex flex-col items-center">
                      <label className="text-gray-700 text-sm">Variantes</label>
                      <Button 
                        size="small" 
                        variant="secondary" 
                        onClick={addVariant}
                        className="px-2 py-1 text-xs"
                      >
                        + Añadir variante
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      {variantInputs.map((variant, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={variant}
                            onChange={(e) => handleUpdateVariant(index, e.target.value)}
                            className="flex-grow"
                          />
                          <IconButton 
                            onClick={() => removeVariant(index)}
                            size="small"
                          >
                            <XMark className="text-ui-fg-subtle" />
                          </IconButton>
                        </div>
                      ))}
                      {variantInputs.length === 0 && (
                        <p className="text-xs text-gray-500 italic">No hay variantes. Añade una con el botón "Añadir variante".</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Right Column - Image, URL and Upload */}
                <div className="w-[50%]">
                  <div className="flex items-center justify-center mb-4">
                    {previewUrl || editData.product_image ? (
                      <img 
                        src={previewUrl || editData.product_image} 
                        alt="Vista previa del producto" 
                        className="max-h-64 max-w-full rounded-md object-contain border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="h-64 w-full bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
                        <Text className="text-ui-fg-subtle">Sin imagen</Text>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm">URL de Imagen</label>
                    <Input 
                      value={editData.product_image || ''}
                      onChange={(e) => {
                        setEditData({...editData, product_image: e.target.value});
                        setPreviewUrl(e.target.value);
                      }}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-gray-700 text-sm">Subir Imagen</label>
                    <div className="mt-1 flex items-center">
                      <Button 
                        variant="secondary" 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-2 text-sm"
                      >
                        {selectedFile ? selectedFile.name : "Seleccionar archivo"}
                      </Button>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          if (file) {
                            setSelectedFile(file);
                            // Create a preview URL for the selected file
                            const fileUrl = URL.createObjectURL(file);
                            setPreviewUrl(fileUrl);
                          }
                        }}
                      />
                      {selectedFile && (
                        <IconButton
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(editData?.product_image || null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="ml-2"
                          size="small"
                        >
                          <XMark className="text-ui-fg-subtle" />
                        </IconButton>
                      )}
                    </div>
                    {selectedFile && (
                      <Text size="small" className="mt-1 text-ui-fg-subtle">
                        Archivo seleccionado: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </Text>
                    )}
                  </div>
                  <div className="col-span-1 md:col-span-2 flex items-center gap-x-2 justify-end w-full mt-4">
                  
                  <Button 
                  isLoading={isLoadingButton}
                    variant="primary" 
                    onClick={handleSubmit}>
                    Confirmar
                  </Button>
                </div>
                </div>
                {/* Footer with buttons - spans both columns */}

            </FocusModal.Body>
          </FocusModal.Content>
        </FocusModal>
      )}
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

export const config: WidgetConfig = {
  zone: "product.list.before",
};

export default RequestProduct;
