import * as React from "react";

import { Container, Html, Tailwind } from "@react-email/components";

interface SentProps {
  title_product: string;
  store_name: string;
  customer_email: string;
  note?: string;
}

export function RequestProductRejected(props: SentProps) {
  const { title_product, store_name, note } = props;

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
          <div className="w-[800px] border-t-[5px] border-[#dc2626] mx-auto  rounded-lg shadow-card overflow-hidden">
            
            <div className="bg-gf text-white text-center py-4">
              <h1 className="text-2xl font-bold tracking-wide">
                GUD
                <span className="text-button">FY</span>
              </h1>
            </div>

          
            <div className="bg-white px-6 py-8 text-gray-800">
              <h2 className="text-xl font-semibold mb-4">Hola {store_name},</h2>
              <p className="leading-relaxed mb-4">
                Lamentamos informarte que tu solicitud para el producto
                <strong className="text-gf"> {title_product}</strong> ha sido
                <span className="text-red-600 font-semibold"> rechazada</span>.
              </p>
              {note && (
                <p className="leading-relaxed mb-4">
                  Motivo:&nbsp;<em>{note}</em>
                </p>
              )}
              <p className="leading-relaxed mb-6">
                Puedes revisar los detalles en tu panel de control y realizar una nueva solicitud cuando lo desees.
              </p>
              <div className="text-center">
                <a
                  href="https://gudfyp2p.com/account/seller/products"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gf text-white text-lg font-medium py-3 px-6 rounded-lg shadow hover:bg-[#0acb96] transition duration-200"
                >
                  Ir a mi dashboard
                </a>
              </div>
            </div>

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
