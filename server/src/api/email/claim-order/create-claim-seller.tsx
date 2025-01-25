import * as React from "react";

import {
  Container,
  Html,
  Tailwind,
} from "@react-email/components";

interface propsCreate {
  order_id: string;
  store_name: string;
  
}

export function CreateClaimSeller(props: propsCreate) {
  const { store_name, order_id } = props;

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
              <h1>Hola {store_name},</h1>
              <p>
                Queremos informarte que un cliente ha realizado una reclamación sobre la orden con ID{" "}
                <strong>{order_id}</strong>.
              </p>
              <p>
                Por favor, revisa los detalles de la reclamación y proporciona una solución lo más pronto posible.
              </p>
              <div className="flex justify-center mt-4">
                <a
                  href={`http://179.61.219.62:8000/account/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-button text-white text-center py-2 px-4 rounded-md shadow hover:bg-[#0acb96] transition"
                >
                  Ver detalles de la reclamación
                </a>
              </div>
              <p className="mt-4">
                Si necesitas ayuda o tienes preguntas, no dudes en contactar con nuestro equipo de soporte.
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
