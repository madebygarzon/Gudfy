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
                boxShadow: {
                  card: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                },
              },
            },
          }}
        >
          <Container className="bg-gray-50 font-sans">
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
                  ¡Bienvenido(a), {name}!
                </h2>
                <p className="leading-relaxed mb-4">
                  Nos complace darte la bienvenida a <strong>Gudfy Marketplace</strong>, tu nueva comunidad para realizar compras y ventas de manera eficiente y confiable.
                </p>
                <p className="leading-relaxed mb-4">
                  En Gudfy, trabajamos para ofrecerte las mejores herramientas para gestionar tus transacciones y ayudarte a alcanzar tus metas.
                </p>
                <p className="leading-relaxed mb-6">
                  ¡Esperamos que disfrutes de la experiencia y aproveches al máximo las funcionalidades que hemos preparado para ti!
                </p>
                <p>Atentamente,</p>
                <p className="font-medium text-gf">El equipo de Gudfy</p>
              </div>
  
              {/* Footer */}
              <div className="bg-gray-100 text-center py-4 px-6">
                <p className="text-sm text-gray-600">
                  Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
                </p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }