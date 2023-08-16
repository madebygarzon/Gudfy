import React from "react";



const BodyTC: React.FC = () => {
  return (
    <div className="relative w-full px-[100px] ">
      <div className="relative w-full flex-wrap flex mt-[-80px] mb-[50px] shadow-gf bg-[#ffffff] rounded-30 px-[50px] pt-[50px] pb-[100px]">
        <div className="flex flex-col leading-7 text-[16px] text-[#3c3c3c]">
          <h4 className="text-[#1e293b] text-[22.59px] font-black">Quienes somos:</h4>
          <p>La dirección de nuestro sitio web es: https://gudfy.com.</p>
          <br/>
          <h4 className="text-[#1e293b] text-[22.59px] font-black">Comentarios:</h4>
          <p>
            Cuando los visitantes dejan comentarios en el sitio, recopilamos los
            datos que se muestran en el formulario de comentarios, y también la
            dirección IP del visitante y la cadena del agente de usuario del
            navegador para ayudar a la detección de spam.
          </p>
          <br/>
          <p>
            Se puede proporcionar una cadena anónima creada a partir de su
            dirección de correo electrónico (también llamada hash) al servicio
            Gravatar para ver si la está utilizando. La política de privacidad
            del servicio Gravatar está disponible aquí:
            https://automattic.com/privacy/.&nbsp; Después de la aprobación de
            su comentario, su foto de perfil es visible para el público en el
            contexto de su comentario.
          </p>
          <br/>
          <h4 className="text-[#1e293b] text-[22.59px] font-black">Medios de comunicación:</h4>
          <p>
            Si subes imágenes al sitio web, debes evitar subir imágenes con
            datos de ubicación incrustados (GPS EXIF) incluidos. Los visitantes
            del sitio web pueden descargar y extraer cualquier dato de ubicación
            de las imágenes del sitio web.
          </p>
          <br/>
          <h4 className="text-[#1e293b] text-[22.59px] font-black">Cookies:</h4>
          <p>
            Si deja un comentario en nuestro sitio, puede optar por guardar su
            nombre, dirección de correo electrónico y sitio web en cookies.
            Estos son para su comodidad, para que no tenga que volver a rellenar
            sus datos cuando deje otro comentario. Estas cookies tendrán una
            duración de un año.
          </p>
          <br/>
          <p>
            Si visita nuestra página de inicio de sesión, estableceremos una
            cookie temporal para determinar si su navegador acepta cookies. Esta
            cookie no contiene datos personales y se descarta cuando cierra su
            navegador.
          </p>
          <br/>
          <p>
            Cuando inicie sesión, también configuraremos varias cookies para
            guardar su información de inicio de sesión y sus opciones de
            visualización de pantalla. Las cookies de inicio de sesión duran dos
            días y las cookies de opciones de pantalla duran un año. Si
            selecciona “Recordarme”, su inicio de sesión persistirá durante dos
            semanas. Si cierra sesión en su cuenta, se eliminarán las cookies de
            inicio de sesión.
          </p>
          <br/>
          <p>
            Si edita o publica un artículo, se guardará una cookie adicional en
            su navegador. Esta cookie no incluye datos personales y simplemente
            indica el ID de publicación del artículo que acaba de editar. Caduca
            después de 1 día.
          </p>
          <br/>
          <h4 className="text-[#1e293b] text-[22.59px] font-black">Contenido incrustado de otros sitios web:</h4>
          <p>
            Los artículos de este sitio pueden incluir contenido incrustado (por
            ejemplo, videos, imágenes, artículos, etc.). El contenido incrustado
            de otros sitios web se comporta exactamente de la misma manera que
            si el visitante hubiera visitado el otro sitio web.
          </p>
          <br/>
          <p>
            Estos sitios web pueden recopilar datos sobre usted, usar cookies,
            incrustar un seguimiento adicional de terceros y monitorear su
            interacción con ese contenido incrustado, incluido el seguimiento de
            su interacción con el contenido incrustado si tiene una cuenta y ha
            iniciado sesión en ese sitio web.
          </p>
          <br/>
          <h4 className="text-[#1e293b] text-[22.59px] font-black">Con quién compartimos sus datos:</h4>
          <p>
            Si solicita un restablecimiento de contraseña, su dirección IP se
            incluirá en el correo electrónico de restablecimiento.
          </p>
          <br/>
          <h4 className="text-[#1e293b] text-[22.59px] font-black">Cuánto tiempo conservamos sus datos:</h4>
          <p>
            Si deja un comentario, el comentario y sus metadatos se conservan
            indefinidamente. Esto es para que podamos reconocer y aprobar
            cualquier comentario de seguimiento automáticamente en lugar de
            mantenerlos en una cola de moderación.
          </p>
          <br/>
          <p>
            Para los usuarios que se registran en nuestro sitio web (si los
            hay), también almacenamos la información personal que proporcionan
            en su perfil de usuario. Todos los usuarios pueden ver, editar o
            eliminar su información personal en cualquier momento (excepto que
            no pueden cambiar su nombre de usuario). Los administradores del
            sitio web también pueden ver y editar esa información.
          </p>
          <br/>
          <h4 className="text-[#1e293b] text-[22.59px] font-black" >Qué derechos tienes sobre tus datos:</h4>
          <p>
            Si tiene una cuenta en este sitio o ha dejado comentarios, puede
            solicitar recibir un archivo exportado de los datos personales que
            tenemos sobre usted, incluidos los datos que nos haya proporcionado.
            También puede solicitar que eliminemos cualquier dato personal que
            tengamos sobre usted. Esto no incluye ningún dato que estemos
            obligados a conservar con fines administrativos, legales o de
            seguridad.
          </p>
          <br/>
          <h4 className="text-[#1e293b] text-[22.59px]font-black">Dónde se envían sus datos:&nbsp;</h4>
          <p>
            Es posible que los comentarios de los visitantes los revise un
            servicio de detección automática de spam.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BodyTC;