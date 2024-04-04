import * as React from "react";

import {
  Container,
  Head,
  Text,
  Button,
  Html,
  Heading,
  Img,
  Tailwind,
  Section,
} from "@react-email/components";

interface SentProps {
  name: string;
  message: string;
}

export function CorrectionApplication(props: SentProps) {
  const { name, message } = props;

  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                gf: "#1F0046",
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
              <h1>¡Hola {name}!</h1>
              <p>
                Hemos revisado cuidadosamente tu solicitud, y aunque apreciamos
                tu compromiso, hay algunos aspectos que necesitan ser corregidos
                antes de que podamos avanzar con tu solicitud.
              </p>
              <p>{message}</p>

              <p>Agradecemos tu comprensión y cooperación en este proceso.</p>
              <p>Atentamente,</p>
              <p>El equipo de Gudfy</p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
