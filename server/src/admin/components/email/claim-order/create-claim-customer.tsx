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
              boxShadow: {
                card: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          },
        }}
      >
        <Container className="bg-gray-50 font-sans  ">
        <div className="w-[800px] border-t-[5px] border-button mx-auto  rounded-lg shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-gf text-white text-center py-4">
              <h1 className="text-2xl font-bold tracking-wide">
                GUD
                <span className="text-button">FY</span>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-6 py-8 text-gray-800">
              <h2 className="text-xl font-semibold mb-4">
                Estimado/a {name},
              </h2>
              <p className="leading-relaxed mb-4">
                Nos complace informarte que hemos recibido tu reclamación para la orden con número 
                <strong className="text-gf"> {order}</strong>. Ya hemos notificado a la tienda correspondiente sobre tu solicitud.
              </p>
              <p className="leading-relaxed mb-6">
                Puedes consultar el estado de tu reclamación en cualquier momento haciendo clic en el botón a continuación:
              </p>
              <div className="text-center">
                <a
                  href="http://179.61.219.62:8000/account/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gf text-white text-lg font-medium py-3 px-6 rounded-lg shadow hover:bg-[#0acb96] transition duration-200"
                >
                  Ver estado de la reclamación
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 text-center py-4 px-6">
              <p className="text-sm text-gray-600">
                Si tienes alguna pregunta o necesitas más información, no dudes en contactarnos.
              </p>
              <p className="mt-2 text-gray-800 font-medium">El equipo de Gudfy</p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
