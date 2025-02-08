import * as React from "react";

import {
  Container,
  Html,
  Tailwind,
} from "@react-email/components";

interface SentProps {
  product_name: string;
  customer_name: string;
  store_name: string;
}

export function OrderClaimUnsolved(props: SentProps) {
  const { product_name, customer_name, store_name } = props;
  
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
                <h2 className="text-2xl font-semibold mb-6">Reclamación No Resuelta</h2>
                <p className="leading-relaxed mb-4">
                  Se informa que la tienda <strong>{store_name}</strong> y el cliente{" "}
                  <strong>{customer_name}</strong> no han podido llegar a un acuerdo sobre la reclamación del producto{" "}
                  <strong>{product_name}</strong>.
                </p>
                <p className="leading-relaxed mb-6">
                  Por favor, revisa esta situación y toma las medidas necesarias para resolver el conflicto.
                </p>
                <p className="leading-relaxed mb-6">
                  La reclamación está disponible en el dashboard, en la sección de <strong>"Reclamaciones"</strong>.
                </p>
                <p className="mt-6 font-medium text-gf">Atentamente,</p>
                <p className="font-medium text-gray-800">El sistema de notificaciones de Gudfy</p>
              </div>
  
              {/* Footer */}
              <div className="bg-gray-100 text-center py-4 px-6">
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
