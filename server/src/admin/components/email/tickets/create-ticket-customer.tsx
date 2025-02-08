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
              boxShadow: {
                card: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          },
        }}
      >
        <Container>
          <div className="w-[800px] border-t-[5px] border-button mx-auto rounded-lg shadow-card overflow-hidden">
            {/* Header */}
            <div className="flex bg-gf text-[32px] justify-center text-center text-white py-6">
              <h1>
                GUD<strong className="text-[#0BEBAA]">FY</strong>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-10 py-8 text-gray-800">
              <h2 className="text-2xl font-semibold mb-6">Hola {name},</h2>
              <p className="leading-relaxed mb-4">
                ¡Tu ticket ha sido creado con éxito! El ID de tu ticket es{" "}
                <strong>{tiket}</strong>.
              </p>
              <p className="leading-relaxed mb-4">
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
              <p className="leading-relaxed mt-4">
                Si tienes alguna pregunta adicional, no dudes en contactar con nuestro equipo de soporte.
              </p>
              <p className="mt-6 font-medium">Atentamente,</p>
              <p className="font-medium">El equipo de Gudfy</p>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 text-center py-4 px-6">
              <p className="text-sm text-gray-600">
                Este mensaje es automático. Si tienes preguntas, contacta con soporte.
              </p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
