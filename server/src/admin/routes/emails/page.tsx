import { useEffect, useState } from "react";
import { RouteConfig } from "@medusajs/admin";
import { Container, Html, Tailwind, Button } from "@react-email/components";


const data ={
    name: "Ronaldo Delgado",
    order: "GMP-123456"
}

const Emails = () => {
  return (
    <div className="w-full h-full">
        <WelcomeAccount  name={data.name} />
        <div className="w-full h-[100px]"></div>
        <CreateClaimCustomer name={data.name} order={data.order}/>
        <div className="w-full h-[100px]"></div>
        <CreateClaimSeller order_id={data.order} store_name={data.name}/>
        <div className="w-full h-[100px]"></div>
        <OrderClaimUnsolved customer_name="Ronaldo Delgado" product_name="Netflix 1 mes" store_name="tienda D1"/>
        <div className="w-full h-[100px]"></div>
        <PurchaseCompleted name="Ronaldo Delgado" order="" serialCodes={[{serialCodes: "serial 1", title:"Netflix 1 mes "},{serialCodes: "serial 2", title:"Netflix 3 mes "}]}/>
        <div className="w-full h-[100px]"></div>
        <ApprovedApplication name="Ronaldo Delgado"/>
        <div className="w-full h-[100px]"></div>
        <NewSellerApplication email="ronaldo@gmail.com" name="Ronaldo Delgado"/>
        <div className="w-full h-[100px]"></div>
        <CorrectionApplication name="Ronaldo Delgado" message="este es el mensaje que debe de recibir para que corriga"/>
        <div className="w-full h-[100px]"></div>
        <SentApplication name="Ronaldo Delgado"/>
        <div className="w-full h-[100px]"></div>
        <RejectedApplication message=" la razon por la que fue rechazado" name="Ronaldo Delgado"/>
        <div className="w-full h-[100px]"></div>
        <CreateTicketCustomer name="Ronaldo Delgado" tiket="tkict-123123"/>
        <div className="w-full h-[100px]"></div>
        <NewTicketAdmin name="Ronaldo Delgado" tiket="tkict-123123" email="ronaldo@gmail.com"/>
        <div className="w-full h-[100px]"></div>
        <Email email="ronaldo@gmail.com" token="token-123" url="http://localhost:8000/account/recover-paswor"/>
        <div className="w-full h-[100px]"></div>

    </div>
  );
};
export const config: RouteConfig = {
  link: {
    label: "Emails",
    // icon: CustomIcon,
  },
};

export default Emails;

interface SentProps {
    name: string;
    order: string;
    
  }
  

  function CreateClaimCustomer(props: SentProps) {
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


  type welcomeAccount = {
    name: string;
  };
  
  function WelcomeAccount(props: welcomeAccount) {
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
  

  interface propsCreate {
    order_id: string;
    store_name: string;
    
  }
  
  function CreateClaimSeller(props: propsCreate) {
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
                <h2 className="text-2xl font-semibold mb-4">Hola {store_name},</h2>
                <p className="leading-relaxed mb-4">
                  Queremos informarte que un cliente ha realizado una reclamación sobre la orden con ID{" "}
                  <strong>{order_id}</strong>.
                </p>
                <p className="leading-relaxed mb-6">
                  Por favor, revisa los detalles de la reclamación y proporciona una solución lo más pronto posible.
                </p>
                <div className="text-center mt-6">
                  <a
                    href={`http://179.61.219.62:8000/account/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gf text-white text-lg font-medium py-3 px-6 rounded-md shadow hover:bg-[#0acb96] transition duration-200"
                  >
                    Ver detalles de la reclamación
                  </a>
                </div>
                <p className="mt-8">
                  Si necesitas ayuda o tienes preguntas, no dudes en contactar con nuestro equipo de soporte.
                </p>
                <p className="mt-4 font-medium text-gf">Atentamente,</p>
                <p className="font-medium text-gray-800">El equipo de Gudfy</p>
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
  

  interface PropsOrderClaimUnsolved {
    product_name: string;
    customer_name: string;
    store_name: string;
  }
  
  function OrderClaimUnsolved(props: PropsOrderClaimUnsolved) {
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
  
  interface PropsPurchaseCompleted {
    serialCodes: { serialCodes: string; title: string }[];
    order: string;
    name: string;
  }
  
 function PurchaseCompleted(props: PropsPurchaseCompleted) {
    const { name, order, serialCodes } = props;
  
    return (
      <Html lang="en">
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  gf: "#1F0046",
                },
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>Estimado {name},</h1>
                <p>
                  ¡Tu compra ha sido completada con éxito! Muchas gracias por tu
                  pedido con el número de orden <strong>{order}</strong>.
                </p>
                <p>Te compartimos los detalles de los productos adquiridos:</p>
                <ul className="list-disc list-inside pl-4">
                  {serialCodes.map((item, index) => (
                    <li key={index} className="mb-2">
                      <strong>{item.title}:</strong> {item.serialCodes}
                    </li>
                  ))}
                </ul>
                <p>
                  Si tienes alguna pregunta o necesitas asistencia, no dudes en
                  contactarnos.
                </p>
                <p>¡Gracias por confiar en Gudfy!</p>
                <p>Atentamente,</p>
                <p>El equipo de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }

  interface PropsApprovedApplication {
    name: string;
  }
  
  function ApprovedApplication(props: PropsApprovedApplication) {
    const { name } = props;
  
    return (
      <Html lang="en">
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  gf: "#1F0046",
                },
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>Estimado {name}</h1>
                <p>
                  ¡Nos complace informarte que tu solicitud para convertirte en
                  uno de nuestros vendedores en Gudfy ha sido aprobada!
                </p>
                <p>
                  Después de revisar cuidadosamente tus datos, estamos convencidos
                  de que tienes mucho que ofrecer a nuestra comunidad de
                  vendedores y estamos emocionados de darte la bienvenida a bordo.
                  Creemos firmemente que tu experiencia y habilidades serán una
                  adición valiosa a nuestro marketplace.
                </p>
                <p>
                  ¡Felicitaciones nuevamente y gracias por elegir ser parte de
                  nuestra comunidad de vendedores en Gudfy!
                </p>
                <p>Atentamente,</p>
                <p>El equipo de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }

  interface PropsCorrectionApplication {
    name: string;
    message: string;
  }
  
   function CorrectionApplication(props: PropsCorrectionApplication) {
    const { name, message } = props;
  
    return (
      <Html lang="en">
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  gf: "#1F0046",
                },
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>¡Hola {name}!</h1>
                <p>
                  Hemos revisado cuidadosamente tu solicitud, y aunque apreciamos
                  tu compromiso, hay algunos aspectos que necesitan ser corregidos
                  antes de que podamos avanzar con tu solicitud.
                </p>
                <p>{message}</p>
  
                <p>Agradecemos tu comprensión y cooperación en este proceso.</p>
                <p>Atentamente,</p>
                <p>El equipo de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }


  interface PropsNewSeller {
    name: string;
    email: string;
  }
   function NewSellerApplication(props: PropsNewSeller) {
    const { name, email } = props;
  
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
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>¡Nueva Solicitud de Vendedor!</h1>
                <p>
                  Se ha recibido una nueva solicitud para unirse como vendedor en la plataforma.
                </p>
                <p><strong>Datos del solicitante:</strong></p>
                <ul className="list-disc pl-5">
                  <li><strong>Nombre:</strong> {name}</li>
                  <li><strong>Email:</strong> {email}</li>
                </ul>
                <p>
                  Por favor, revisa los detalles y procede con la aprobación o rechazo según sea necesario desde el dashboard.
                </p>
                <p>Atentamente,</p>
                <p>El sistema de notificaciones de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }


  interface PropsRejectedApplication {
    name: string;
    message: string;
  }
  
 function RejectedApplication(props: PropsRejectedApplication) {
    const { name, message } = props;
  
    return (
      <Html lang="en">
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  gf: "#1F0046",
                },
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>Estimado {name}</h1>
                <p>
                  Lamentamos informarte que después de una cuidadosa evaluación,
                  hemos tomado la decisión de no avanzar con tu solicitud en este
                  momento. Queremos que sepas que esta decisión no refleja
                  necesariamente tus habilidades o méritos, sino que se debe a
                  factores específicos que estamos considerando en este momento.
                </p>
                <p>{message}</p>
                <p>
                  Apreciamos sinceramente tu interés en ser parte de nuestra
                  comunidad de vendedores en Gudfy, y queremos agradecerte por
                  haber dedicado tu tiempo y esfuerzo a este proceso. Si tienes
                  alguna pregunta o necesitas más información sobre nuestra
                  decisión, no dudes en ponerte en contacto con nosotros.
                </p>
                <p>Te deseamos lo mejor en tus futuros esfuerzos y proyectos.</p>
                <p>Atentamente,</p>
                <p>El equipo de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }
  
  interface PropsSentApplication {
    name: string;
  }
  
   function SentApplication(props: PropsSentApplication) {
    const { name } = props;
  
    return (
      <Html lang="en">
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  gf: "#1F0046",
                },
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>Hola, {name}</h1>
                <p>
                  Gracias por aplicar para convertirte en uno de nuestros
                  vendedores en Gudfy. Queremos informarte que hemos recibido tu
                  solicitud y que nuestro equipo ya está en proceso de evaluación
                  de tus datos.
                </p>
                <p>
                  Si tienes alguna pregunta o necesitas más información, no dudes
                  en ponerte en contacto con nosotros.
                </p>
                <p>
                  Gracias nuevamente por tu interés en ser parte de nuestra
                  comunidad de vendedores en Gudfy. Atentamente, El equipo de
                  Gudfy
                </p>
                <p>Atentamente,</p>
                <p>El equipo de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }
  

  type CreateTicketCustomer = {
    tiket: string;
    name: string;
  };
  
 function CreateTicketCustomer(props: CreateTicketCustomer) {
    const { name, tiket } = props;
  
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
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>Hola {name},</h1>
                <p>
                  ¡Tu ticket ha sido creado con éxito! El ID de tu ticket es{" "}
                  <strong>{tiket}</strong>.
                </p>
                <p>
                  Puedes verificar el estado de tu ticket y seguir el progreso haciendo clic en el botón de abajo.
                </p>
                <div className="flex justify-center mt-4">
                  <a
                    href="http://179.61.219.62:8000/account/ticket"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-button text-white text-center py-2 px-4 rounded-md shadow hover:bg-[#0acb96] transition"
                  >
                    Ver mi ticket
                  </a>
                </div>
                <p className="mt-4">
                  Si tienes alguna pregunta adicional, no dudes en contactar con nuestro equipo de soporte.
                </p>
                <p>Atentamente,</p>
                <p>El equipo de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }

  type AdminTicket = {
    tiket: string;
    name: string;
    email: string;
  };
  
  function NewTicketAdmin(props: AdminTicket) {
    const { name, tiket, email } = props;
  
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
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>Hola Administrador,</h1>
                <p>
                  Se ha creado un nuevo ticket en el sistema. Aquí están los detalles:
                </p>
                <ul className="list-disc list-inside mt-4">
                  <li>
                    <strong>ID del Ticket:</strong> {tiket}
                  </li>
                  <li>
                    <strong>Nombre del Cliente:</strong> {name}
                  </li>
                  <li>
                    <strong>Email del Cliente:</strong> {email}
                  </li>
                </ul>
                <p className="mt-4">
                  Por favor, revisa este ticket en el panel de administración para tomar las acciones necesarias.
                </p>
                <p>Atentamente,</p>
                <p>El sistema de notificaciones de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }


  interface EmailProps {
    url: string;
    email: string;
    token: string;
  }
  
   function Email(props: EmailProps) {
    const { url, email, token } = props;
  
    return (
      <Html lang="en">
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  gf: "#1F0046",
                },
                boxShadow: {},
              },
            },
          }}
        >
          <Container>
            <div className="border-[1px] border-solid border-[#1F0046] rounded-md shadow">
              <div className="flex w-auto h-auto bg-gf text-[32px] justify-center rounded-t-md text-center text-white p-[5px] pl-3">
                <p>
                  GUD<strong className="text-[#0BEBAA]">FY</strong>
                </p>
              </div>
              <div className="text-slate-800 px-5 py-2">
                <h1>Hola,</h1>
                <p>
                  Estás recibiendo este correo porque has solicitado un
                  restablecimiento de contraseña para tu cuenta en Gudfy.
                </p>
                <p>
                  Para restablecer tu contraseña, por favor haz clic en el
                  siguiente botón:
                </p>
                <Button
                  href={`${url}/${token}/${email}`}
                  className="bg-gf text-white py-2 px-2 rounded-md"
                >
                  Restablecer Contraseña
                </Button>
                <p>
                  Si no has solicitado un restablecimiento de contraseña, puedes
                  ignorar este correo.
                </p>
                <p>Gracias,</p>
                <p>El equipo de Gudfy</p>
              </div>
            </div>
          </Container>
        </Tailwind>
      </Html>
    );
  }

  
  