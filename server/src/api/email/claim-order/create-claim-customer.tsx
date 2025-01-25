import * as React from "react";

import { Container, Html, Tailwind } from "@react-email/components";

interface SentProps {
  name: string;
  order: string;
  
}

export function CreateClaimCustomer(props: SentProps) {
  const { name, order } = props;

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
              <h1>Estimado {name},</h1>
              <p>
                Nos complace informarte que hemos recibido tu reclamación para
                la orden con número <strong>{order}</strong>Ya le hemos hecho saber a la
                correspondiente tienda de tu reclamacion.
              </p>
              <p>
                Puedes consultar el estado de tu reclamación en cualquier
                momento haciendo clic en el siguiente botón:
              </p>
              <div className="flex justify-center mt-4">
                <a
                  href={"http://179.61.219.62:8000/account/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-button text-white text-center py-2 px-4 rounded-md shadow hover:bg-[#0acb96] transition"
                >
                  Ver estado de la reclamación
                </a>
              </div>
              <p className="mt-4">
                Si tienes alguna pregunta o necesitas más información, no dudes
                en contactarnos.
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
