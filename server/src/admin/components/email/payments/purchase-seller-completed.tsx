import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
  Hr,
} from "@react-email/components";

interface SentProps {
  name_store: string;
  order_id: string;
  codes: { serialCodes: string; title: string }[];
}

export function PurchaseSellerCompleted(props: SentProps) {
  const { name_store, order_id, codes } = props;

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
        <Container className="max-w-2xl mx-auto my-8 bg-white rounded-md shadow-card">
          <div className="border border-solid border-gray-200 rounded-md overflow-hidden">
            {/* Header */}
            <div className="bg-gf py-6 px-8 text-center">
              <Text className="text-2xl font-bold text-white m-0">
                ¡Se ha realizado una venta!
              </Text>
            </div>

            {/* Main Content */}
            <div className="px-8 py-6">
              <Text className="text-lg font-medium text-gray-800">
                Hola {name_store},
              </Text>

              <Text className="text-gray-700 mb-6">
                ¡Felicidades! Uno o varios de tus productos han sido vendidos. A
                continuación encontrarás el detalle de la venta correspondiente
                al pedido #{order_id}.
              </Text>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <Text className="text-md font-medium text-gray-800 mb-3">
                  Detalles de venta:
                </Text>

                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2 text-gray-600 text-sm">
                        Producto
                      </th>
                      <th className="text-left p-2 text-gray-600 text-sm">
                        Código Serial
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {codes.map((code, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-2 text-gray-700">{code.title}</td>
                        <td className="p-2 text-gray-700">
                          {code.serialCodes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Text className="text-gray-700 mb-4">
                Los fondos correspondientes a esta venta serán procesados según
                la política de pagos de Gudfy.
              </Text>

              <Text className="text-gray-700 mb-4">
                Puedes ver los detalles completos de esta orden en tu panel de
                vendedor en la web de Gudfy.
              </Text>

              <Hr className="border-gray-200 my-6" />

              <Text className="text-gray-700 mb-4">
                Si tienes alguna pregunta o necesitas asistencia, no dudes en
                contactarnos.
              </Text>

              <div className="mt-6 text-center">
                <Text className="font-medium text-gray-800">
                  ¡Gracias por ser parte de Gudfy!
                </Text>
                <Text className="font-medium text-gray-800">Equipo Gudfy</Text>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 text-center py-4 px-6 rounded-b-md">
              <Text className="text-sm text-gray-600 m-0">
                Este mensaje es automático. Si tienes preguntas, contacta con
                soporte.
              </Text>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
