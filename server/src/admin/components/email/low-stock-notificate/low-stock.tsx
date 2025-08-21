import * as React from "react";

import {
  Container,
  Html,
  Tailwind,
} from "@react-email/components";

interface LowStockProps {
  sellerName: string;
  productName: string;
}

export function LowStockNotificate(props: LowStockProps) {
  const { sellerName, productName } = props;

  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                gf: "#1F0046",
                button: "#0BEBAA",
                warning: "#F59E0B",
                danger: "#EF4444",
              },
              boxShadow: {
                card: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          },
        }}
      >
        <Container className="w-[800px] mx-auto bg-gray-50 font-sans">
          <div className="w-[800px] border-t-[5px] border-warning mx-auto rounded-lg shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-gf text-white text-center py-6 rounded-t-md">
              <h1 className="text-3xl font-bold tracking-wide">
                GUD
                <span className="text-button">FY</span>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-10 py-8 text-gray-800">
              <h2 className="text-2xl font-semibold mb-6">Hola {sellerName},</h2>
              
              <div className="bg-warning/10 border-l-4 border-warning p-4 mb-6 rounded-r-md">
                <div className="flex items-center mb-2">
                  <div className="text-warning text-xl mr-2">⚠️</div>
                  <h3 className="text-lg font-semibold text-warning">Alerta de Stock Bajo</h3>
                </div>
              </div>

              <p className="leading-relaxed mb-4">
                Tu producto <strong>{productName}</strong> está próximo a agotarse y necesita reabastecimiento.
              </p>

              <div className="text-center mb-6">
                <a 
                  href="https://gudfy.com/seller/products" 
                  className="inline-block bg-button text-white px-6 py-3 rounded-md font-semibold hover:bg-button/90 transition-colors"
                >
                  Gestionar Inventario
                </a>
              </div>

              {/* <p className="leading-relaxed mb-6">
                ¿Necesitas ayuda? Responde a este correo o escribe a soporte@gudfy.com.
              </p> */}

              <p className="mt-6 font-medium text-gf">Gracias por ser parte de Gudfy.</p>
              <p className="font-medium text-gray-800">Un saludo,</p>
              <p className="font-medium text-gray-800">Equipo Gudfy</p>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 text-center py-4 px-6 rounded-b-md">
              <p className="text-sm text-gray-600">
                Este es un mensaje automático del sistema de alertas de inventario. 
                Si tienes preguntas, contacta con soporte.
              </p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}