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
              <h1>¡Nueva Solicitud de Vendedor!</h1>
              <p>
                Se ha recibido una nueva solicitud para unirse como vendedor en la plataforma.
              </p>
              <p><strong>Datos del solicitante:</strong></p>
              <ul className="list-disc pl-5">
                <li><strong>Nombre:</strong> {name}</li>
                <li><strong>Email:</strong> {email}</li>
              </ul>
              <p>
                Por favor, revisa los detalles y procede con la aprobación o rechazo según sea necesario desde el dashboard.
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
