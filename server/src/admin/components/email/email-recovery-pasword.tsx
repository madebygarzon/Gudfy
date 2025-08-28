import * as React from "react";



import {
  Container,
  Head,
  Text,
  Button,
  Html,
  Heading,
  Img,
  Tailwind,
  Section,
} from "@react-email/components";

interface EmailProps {
  url: string;
  email: string;
  token: string;
}

export function Email(props: EmailProps) {
  const { url, email, token } = props;
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
        <Container>
          <div className="w-[800px] border-t-[5px] border-button mx-auto rounded-lg shadow-card overflow-hidden">
            {/* Header */}
            <div className="flex bg-gf text-[32px] justify-center text-center text-white py-6">
              <h1>
                GUD<strong className="text-[#0BEBAA]">FY</strong>
              </h1>
            </div>

            {/* Body */}
            <div className="bg-white px-10 py-8 text-gray-800">
              <h2 className="text-2xl font-semibold mb-6">Hola,</h2>
              <p className="leading-relaxed mb-4">
                Estás recibiendo este correo porque has solicitado un
                restablecimiento de contraseña para tu cuenta en Gudfy.
              </p>
              <p className="leading-relaxed mb-4">
                Para restablecer tu contraseña, por favor haz clic en el
                siguiente botón:
              </p>
              <div className="flex justify-center mt-4">
                <a
                  href={`${url}/${token}/${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-button text-white text-center py-2 px-4 rounded-md shadow hover:bg-[#0acb96] transition"
                >
                  Restablecer Contraseña
                </a>
              </div>
              <p className="leading-relaxed mt-4">
                Si no has solicitado un restablecimiento de contraseña, puedes
                ignorar este correo.
              </p>
              <p className="mt-6 font-medium">Gracias,</p>
              <p className="font-medium">El equipo de Gudfy</p>
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

