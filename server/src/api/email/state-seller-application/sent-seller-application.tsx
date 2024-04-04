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

export function SentApplication(props: SentProps) {
  const { name } = props;

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
              <h1>Hola, {name}</h1>
              <p>
                Gracias por aplicar para convertirte en uno de nuestros
                vendedores en Gudfy. Queremos informarte que hemos recibido tu
                solicitud y que nuestro equipo ya está en proceso de evaluación
                de tus datos.
              </p>
              <p>
                Si tienes alguna pregunta o necesitas más información, no dudes
                en ponerte en contacto con nosotros.
              </p>
              <p>
                Gracias nuevamente por tu interés en ser parte de nuestra
                comunidad de vendedores en Gudfy. Atentamente, El equipo de
                Gudfy
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
