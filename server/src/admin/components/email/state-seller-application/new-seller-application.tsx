import * as React from "react";

import {
  Container,
  Html,
  Tailwind,
} from "@react-email/components";

interface Props {
  name: string;
  email: string;
}

export function NewSellerApplication(props: Props) {
  const { name, email } = props;

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
                GUD<strong className="text-button">FY</strong>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-10 py-8 text-gray-800">
              <h2 className="text-2xl font-semibold mb-6">¡Nueva Solicitud de Vendedor!</h2>
              <p className="leading-relaxed mb-4">
                Se ha recibido una nueva solicitud para unirse como vendedor en la plataforma.
              </p>
              <p className="font-semibold mb-2">Datos del solicitante:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Nombre:</strong> {name}
                </li>
                <li>
                  <strong>Email:</strong> {email}
                </li>
              </ul>
              <p className="leading-relaxed mb-6">
                Por favor, revisa los detalles y procede con la aprobación o rechazo según sea necesario desde el dashboard.
              </p>
              <p className="font-medium">Atentamente,</p>
              <p className="font-medium">El sistema de notificaciones de Gudfy</p>
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
