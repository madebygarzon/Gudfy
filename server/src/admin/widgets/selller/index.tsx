import type { WidgetConfig } from "@medusajs/admin";
import { getListSellerApplication } from "../../actions/seller-application-action/get-seller-application-action";
import { updateSellerAplicationAction } from "../../actions/seller-application-action/update-seller-application-action";
import React, { useState, useEffect } from "react";
import { Table, DropdownMenu, IconButton } from "@medusajs/ui";
import { PencilSquare, XMark, Eye, Check } from "@medusajs/icons";
import Spinner from "../../components/shared/spinner";

const SellerApplication = () => {
  const [dataCustomer, setDataCustomer] = useState(undefined);

  useEffect(() => {
    handlerGetListApplication();
  }, []);
  const handlerGetListApplication = async () => {
    const dataApplication = await getListSellerApplication();
    setDataCustomer(dataApplication);
  };
  const handlerEditstatus = async (e) => {
    updateSellerAplicationAction(e.payload, e.customer_id).then(() => {
      handlerGetListApplication();
    });
  };
  return (
    <div className=" bg-white p-8 border border-gray-200 rounded-lg">
      {dataCustomer ? (
        <>
          <h1 className=" text-xl"> Solicitudes de vendedores</h1>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Fecha Agregada</Table.HeaderCell>
                <Table.HeaderCell>Usuario</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Estado</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataCustomer.map((data, i) => {
                return (
                  <Table.Row key={data.customer_id}>
                    <Table.Cell>01 Enero 2023</Table.Cell>
                    <Table.Cell>{data.customer.name}</Table.Cell>
                    <Table.Cell>{data.customer.email}</Table.Cell>
                    <Table.Cell>
                      {data.approved
                        ? "Aprobado"
                        : data.rejected
                        ? "Rechazado"
                        : "Pendiente"}
                    </Table.Cell>
                    <Table.Cell className="flex gap-x-2 items-center">
                      <IconButton>
                        <Eye />
                      </IconButton>
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <IconButton>
                            <PencilSquare className="text-ui-fg-subtle" />
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <DropdownMenu.Item
                            className="gap-x-2"
                            onClick={() =>
                              handlerEditstatus({
                                payload: "APROBED",
                                customer_id: data.customer_id,
                              })
                            }
                          >
                            <Check className="text-ui-fg-subtle" />
                            Aceptar
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            className="gap-x-2"
                            onClick={() =>
                              handlerEditstatus({
                                payload: "REJECT",
                                customer_id: data.customer_id,
                              })
                            }
                          >
                            <XMark className="text-ui-fg-subtle" />
                            Rechazar
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </>
      ) : (
        <Spinner size="large" variant="secondary" />
      )}
    </div>
  );
};

export const config: WidgetConfig = {
  zone: "customer.list.after",
};

export default SellerApplication;
