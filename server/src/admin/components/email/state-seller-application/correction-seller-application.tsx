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
              boxShadow: {
                card: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          },
        }}
      >
        <Container>
          <div className="w-[800px] border-t-[5px] border-[#0BEBAA] mx-auto rounded-lg shadow-card overflow-hidden">
            {/* Header */}
            <div className="flex bg-gf text-[32px] justify-center text-center text-white py-6">
              <h1>
                GUD<strong className="text-[#0BEBAA]">FY</strong>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-10 py-8 text-gray-800">
              <h2 className="text-2xl font-semibold mb-6">¡Hola {name}!</h2>
              <p className="leading-relaxed mb-4">
                Hemos revisado cuidadosamente tu solicitud, y aunque apreciamos
                tu compromiso, hay algunos aspectos que necesitan ser corregidos
                antes de que podamos avanzar con tu solicitud.
              </p>
              <p className="bg-gray-100 p-4 rounded-md text-gray-700 mb-6">{message}</p>
              <p className="leading-relaxed">
                Agradecemos tu comprensión y cooperación en este proceso.
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
