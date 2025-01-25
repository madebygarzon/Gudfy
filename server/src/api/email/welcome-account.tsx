import * as React from "react";

import { Container, Html, Tailwind } from "@react-email/components";

type EmailTicket = {
  name: string;
};

export function WelcomeAccount(props: EmailTicket) {
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
              <h1>¡Bienvenido(a), {name}!</h1>
              <p>
                Nos complace darte la bienvenida a <strong>Gudfy Marketplace</strong>, tu nueva
                comunidad para realizar compras y ventas de manera eficiente y confiable.
              </p>
              <p>
                En Gudfy, trabajamos para ofrecerte las mejores herramientas para
                gestionar tus transacciones y ayudarte a alcanzar tus metas.
              </p>
              <p>
                ¡Esperamos que disfrutes de la experiencia y aproveches al máximo
                las funcionalidades que hemos preparado para ti!
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
