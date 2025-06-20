import * as React from "react";

import { Container, Html, Tailwind } from "@react-email/components";

interface SentProps {
  title_product: string;
  store_name: string;
  customer_email: string;
  variants: string;
  note: string;
}

export function RequestProductApproved(props: SentProps) {
  const { title_product, store_name, customer_email, variants, note } = props;
  const variantLines = variants
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

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
         
            <div className="bg-gf text-white text-center py-4">
              <h1 className="text-2xl font-bold tracking-wide">
                GUD
                <span className="text-button">FY</span>
              </h1>
            </div>

          
            <div className="bg-white px-6 py-8 text-gray-800">
              <h2 className="text-xl font-semibold mb-4">Hola {store_name},</h2>
              <p className="leading-relaxed mb-4">
                ¡Nos complace informarte que tu solicitud para el producto
                <strong className="text-gf"> {title_product}</strong> ha sido
                <span className="text-green-600 font-semibold"> aprobada</span> y ya está disponible en tu tienda.
              </p>
              <div className="leading-relaxed mb-4">
                Variante del producto:
                {variantLines.length > 0 && (
                  <div className="mt-1">
                    {variantLines.map((v, i) => (
                      <p key={i} className="mb-0">- {v}</p>
                    ))}
                  </div>
                )}
              </div>
              {note && (
                <p className="leading-relaxed mb-4">
                  Nota de nuestro equipo:&nbsp;<em>{note}</em>
                </p>
              )}
              <p className="leading-relaxed mb-6">
                Puedes administrarlo directamente desde tu panel de control. Haz clic en el botón a continuación para ir a tu dashboard:
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
                Si tienes alguna pregunta o necesitas más información, no dudes
                en contactarnos.
              </p>
              <p className="mt-2 text-gray-800 font-medium">
                El equipo de Gudfy
              </p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
