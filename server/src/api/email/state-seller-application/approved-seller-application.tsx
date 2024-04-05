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
                ¡Nos complace informarte que tu solicitud para convertirte en
                uno de nuestros vendedores en Gudfy ha sido aprobada!
              </p>
              <p>
                Después de revisar cuidadosamente tus datos, estamos convencidos
                de que tienes mucho que ofrecer a nuestra comunidad de
                vendedores y estamos emocionados de darte la bienvenida a bordo.
                Creemos firmemente que tu experiencia y habilidades serán una
                adición valiosa a nuestro marketplace.
              </p>
              <p>
                ¡Felicitaciones nuevamente y gracias por elegir ser parte de
                nuestra comunidad de vendedores en Gudfy!
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
