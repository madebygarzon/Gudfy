import * as React from "react";

import { Container, Html, Tailwind } from "@react-email/components";

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
              boxShadow: {
                card: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          },
        }}
      >
        <Container className="w-full bg-gray-50 font-sans">
          <div className="w-[800px] border-t-[5px] border-button mx-auto  rounded-lg shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-gf text-white text-center py-6">
              <h1 className="text-3xl font-bold tracking-wide">
                GUD
                <span className="text-button">FY</span>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-10 py-8 text-gray-800">
              <h2 className="text-2xl font-semibold mb-4">
                Hola {store_name},
              </h2>
              <p className="leading-relaxed mb-4">
                Queremos informarte que un cliente ha realizado una reclamación
                sobre la orden con ID <strong>{order_id}</strong>.
              </p>
              <p className="leading-relaxed mb-6">
                Por favor, revisa los detalles de la reclamación y proporciona
                una solución lo más pronto posible.
              </p>
              <div className="text-center mt-6">
                <a
                  href={`http://gudfyp2p.com/account/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gf text-white text-lg font-medium py-3 px-6 rounded-md shadow hover:bg-[#0acb96] transition duration-200"
                >
                  Ver detalles de la reclamación
                </a>
              </div>
              <p className="mt-8">
                Si necesitas ayuda o tienes preguntas, no dudes en contactar con
                nuestro equipo de soporte.
              </p>
              <p className="mt-4 font-medium text-gf">Atentamente,</p>
              <p className="font-medium text-gray-800">El equipo de Gudfy</p>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 text-center py-4 px-6">
              <p className="text-sm text-gray-600">
                Este mensaje es automático. Si tienes preguntas, contacta con
                soporte.
              </p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
