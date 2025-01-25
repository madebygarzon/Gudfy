import * as React from "react";

import { Container, Html, Tailwind } from "@react-email/components";

type AdminTicket = {
  tiket: string;
  name: string;
  email: string;
};

export function NewTicketAdmin(props: AdminTicket) {
  const { name, tiket, email } = props;

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
              <h1>Hola Administrador,</h1>
              <p>
                Se ha creado un nuevo ticket en el sistema. Aquí están los detalles:
              </p>
              <ul className="list-disc list-inside mt-4">
                <li>
                  <strong>ID del Ticket:</strong> {tiket}
                </li>
                <li>
                  <strong>Nombre del Cliente:</strong> {name}
                </li>
                <li>
                  <strong>Email del Cliente:</strong> {email}
                </li>
              </ul>
              <p className="mt-4">
                Por favor, revisa este ticket en el panel de administración para tomar las acciones necesarias.
              </p>
              <p>Atentamente,</p>
              <p>El sistema de notificaciones de Gudfy</p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
