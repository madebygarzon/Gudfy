import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';
import { Text } from '@react-email/text';
import { Head } from '@react-email/head';

interface EmailProps {
  url: string;
  email : string,
  token : string
}

export function Email(props: EmailProps) {
  const { url, email, token } = props;

  return (
    <Html lang="en">
      <Head>Recupera Contraseña de Gudfy</Head>
      <title>{email}</title>
      <p>tu codigo de confirmacion es : {" "} {token}</p>
      <Text>Para Reestablecer la Contraseña haz Click en el boton </Text>
      <Button href={url}>Click me</Button>
    </Html>
  );
}
