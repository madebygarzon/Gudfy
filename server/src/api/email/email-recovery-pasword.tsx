import * as React from 'react';

import {Container,Head, Text, Button , Html, Heading, Img, Tailwind} from "@react-email/components"

interface EmailProps {
  url: string;
  email : string,
  token : string
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
            },
            boxShadow: {
            },
          },
        },
      }}
    >
  <Container className='shadow-lg'>
  <Container className='flex bg-gf justify-center rounded-t-md py-3'>
    <title>Recupera Contraseña de Gudfy</title> 
    <Img src="https://gudfy.com/wp-content/uploads/2023/02/g71.png" width="167.84" height="54.42" alt="Gudfy" className='felx justify-center' />
    </Container>
  <Container className='flex-col items-center text-gray-900 justify-center'>
    <Heading as="h1">Hola,</Heading>
    <Text>Estás recibiendo este correo porque has solicitado un restablecimiento de contraseña para tu cuenta en Gudfy.</Text>
    <Text>Para restablecer tu contraseña, por favor haz clic en el siguiente botón:</Text>
    <Button href={`${url}/${token}/${email}`} className='bg-gf text-white py-2 px-2 rounded-md' >Restablecer Contraseña</Button>
    <Text>Si no has solicitado un restablecimiento de contraseña, puedes ignorar este correo.</Text>
    <Text>Gracias,</Text>
    <Text>El equipo de Gudfy</Text>
  </Container>
  </Container>
  </Tailwind>
</Html>
  );
}
