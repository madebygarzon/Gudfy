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

export function RejectedApplication(props: SentProps) {
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
              <h1>Estimado {name}</h1>
              <p>
                Lamentamos informarte que después de una cuidadosa evaluación,
                hemos tomado la decisión de no avanzar con tu solicitud en este
                momento. Queremos que sepas que esta decisión no refleja
                necesariamente tus habilidades o méritos, sino que se debe a
                factores específicos que estamos considerando en este momento.
              </p>
              <p>{message}</p>
              <p>
                Apreciamos sinceramente tu interés en ser parte de nuestra
                comunidad de vendedores en Gudfy, y queremos agradecerte por
                haber dedicado tu tiempo y esfuerzo a este proceso. Si tienes
                alguna pregunta o necesitas más información sobre nuestra
                decisión, no dudes en ponerte en contacto con nosotros.
              </p>
              <p>Te deseamos lo mejor en tus futuros esfuerzos y proyectos.</p>
              <p>Atentamente,</p>
              <p>El equipo de Gudfy</p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
