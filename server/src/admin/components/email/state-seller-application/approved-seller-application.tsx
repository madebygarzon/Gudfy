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
}

export function ApprovedApplication(props: SentProps) {
  const { name } = props;

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
              <h2 className="text-2xl font-semibold mb-6">Estimado {name},</h2>
              <p className="leading-relaxed mb-4">
                ¡Nos complace informarte que tu solicitud para convertirte en uno de nuestros vendedores en Gudfy ha sido aprobada!
              </p>
              <p className="leading-relaxed mb-4">
                Después de revisar cuidadosamente tus datos, estamos convencidos de que tienes mucho que ofrecer a nuestra comunidad de vendedores y estamos emocionados de darte la bienvenida a bordo. Creemos firmemente que tu experiencia y habilidades serán una adición valiosa a nuestro marketplace.
              </p>
              <p className="leading-relaxed mb-6">
                ¡Felicitaciones nuevamente y gracias por elegir ser parte de nuestra comunidad de vendedores en Gudfy!
              </p>
              <p className="font-medium text-gray-800">Atentamente,</p>
              <p className="font-medium text-gray-800">El equipo de Gudfy</p>
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

