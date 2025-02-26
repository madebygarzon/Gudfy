import * as React from "react";

import { Container, Html, Tailwind } from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function ContactEmail(props: ContactEmailProps) {
  const { name, email, phone, message } = props;

  return (
    <Html lang="en">
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: "#1F0046",
                accent: "#0BEBAA",
              },
              boxShadow: {
                card: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              },
            },
          },
        }}
      >
        <Container className="w-[800px] mx-auto bg-gray-50 font-sans">
          <div className="w-[800px] border-t-[5px] border-accent mx-auto rounded-lg shadow-card overflow-hidden">
            {/* Header */}
            <div className="bg-primary text-white text-center py-6 rounded-t-md">
              <h1 className="text-3xl font-bold tracking-wide">
                Contacto <span className="text-accent">Recibido</span>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-10 py-8 text-gray-800">
              <h2 className="text-2xl font-semibold mb-6">
                Nuevo mensaje de contacto
              </h2>
              <p className="leading-relaxed mb-4">
                Has recibido un nuevo mensaje de contacto a través del
                formulario.
              </p>
              <div className="bg-gray-100 p-4 rounded-md shadow-sm mb-6">
                <p>
                  <strong>Nombre:</strong> {name}
                </p>
                <p>
                  <strong>Email:</strong> {email}
                </p>
                {phone && (
                  <p>
                    <strong>Teléfono:</strong> {phone}
                  </p>
                )}
                <p className="mt-4">
                  <strong>Mensaje:</strong>
                </p>
                <p className="italic">"{message}"</p>
              </div>
              <p className="leading-relaxed mb-6">
                Responde a este correo o contacta directamente con el usuario
                para dar seguimiento.
              </p>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 text-center py-4 px-6 rounded-b-md">
              <p className="text-sm text-gray-600">
                Este es un mensaje automático. No respondas directamente a este
                correo.
              </p>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
