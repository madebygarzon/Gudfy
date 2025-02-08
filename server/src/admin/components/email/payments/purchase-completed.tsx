import * as React from "react";

import {
  Container,
  Html,
  Tailwind,
} from "@react-email/components";

interface SentProps {
  serialCodes: { serialCodes: string; title: string }[];
  order: string;
  name: string;
}

export function PurchaseCompleted(props: SentProps) {
  const { name, order, serialCodes } = props;

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
        <Container className="w-[800px] mx-auto bg-gray-50 font-sans">
        <div className="w-[800px] border-t-[5px] border-button mx-auto  rounded-lg shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-gf text-white text-center py-6 rounded-t-md">
              <h1 className="text-3xl font-bold tracking-wide">
                GUD
                <span className="text-button">FY</span>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-10 py-8 text-gray-800">
              <h2 className="text-2xl font-semibold mb-6">Estimado {name},</h2>
              <p className="leading-relaxed mb-4">
                ¡Tu compra ha sido completada con éxito! Muchas gracias por tu
                pedido con el número de orden <strong>{order}</strong>.
              </p>
              <p className="mb-4">Te compartimos los detalles de los productos adquiridos:</p>
              <ul className="list-disc list-inside bg-gray-100 p-4 rounded-md shadow-sm mb-6">
                {serialCodes.map((item, index) => (
                  <li key={index} className="mb-2">
                    <strong>{item.title}:</strong> {item.serialCodes}
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mb-6">
                Si tienes alguna pregunta o necesitas asistencia, no dudes en
                contactarnos.
              </p>
              <p className="mt-6 font-medium text-gf">¡Gracias por confiar en Gudfy!</p>
              <p className="font-medium text-gray-800">Atentamente,</p>
              <p className="font-medium text-gray-800">El equipo de Gudfy</p>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 text-center py-4 px-6 rounded-b-md">
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

