import * as React from "react";

import { Container, Html, Tailwind } from "@react-email/components";

type EmailTicket = {
  tiket: string;
  name: string;
};

export function CreateTicketCustomer(props: EmailTicket) {
  const { name, tiket } = props;

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
              <h1>Hola {name},</h1>
              <p>
                ¡Tu ticket ha sido creado con éxito! El ID de tu ticket es{" "}
                <strong>{tiket}</strong>.
              </p>
              <p>
                Puedes verificar el estado de tu ticket y seguir el progreso haciendo clic en el botón de abajo.
              </p>
              <div className="flex justify-center mt-4">
                <a
                  href="http://179.61.219.62:8000/account/ticket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-button text-white text-center py-2 px-4 rounded-md shadow hover:bg-[#0acb96] transition"
                >
                  Ver mi ticket
                </a>
              </div>
              <p className="mt-4">
                Si tienes alguna pregunta adicional, no dudes en contactar con nuestro equipo de soporte.
              </p>
              <p>Atentamente,</p>
              <p>El equipo de Gudfy</p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
