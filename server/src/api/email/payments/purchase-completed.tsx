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
              <h1>Estimado {name},</h1>
              <p>
                ¡Tu compra ha sido completada con éxito! Muchas gracias por tu
                pedido con el número de orden <strong>{order}</strong>.
              </p>
              <p>Te compartimos los detalles de los productos adquiridos:</p>
              <ul className="list-disc list-inside pl-4">
                {serialCodes.map((item, index) => (
                  <li key={index} className="mb-2">
                    <strong>{item.title}:</strong> {item.serialCodes}
                  </li>
                ))}
              </ul>
              <p>
                Si tienes alguna pregunta o necesitas asistencia, no dudes en
                contactarnos.
              </p>
              <p>¡Gracias por confiar en Gudfy!</p>
              <p>Atentamente,</p>
              <p>El equipo de Gudfy</p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
