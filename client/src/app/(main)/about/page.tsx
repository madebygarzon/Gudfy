import React from "react"

const About: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-start my-10 mx-4 sm:mx-80" >
      <h2 className="text-2xl mt-2 font-bold text-gray-700 capitalize mb-4">Sobre nosotros</h2>
      <p>
        En Gudfy, nos enorgullece ser una plataforma líder en la distribución de
        códigos digitales, operando a nivel internacional y atendiendo a más de
        1000 usuarios activos en todo el mundo. Nuestra presencia en esta
        marketplace refleja nuestro compromiso de acercar soluciones digitales
        de calidad a retailers, wholesalers y emprendedores que buscan potenciar
        sus negocios.
      </p><br/>

      <p>
        Nos destacamos por ofrecer un servicio al cliente excepcional, con
        soporte en vivo personalizado que guía y resuelve cualquier inquietud
        durante el proceso de compra. Nuestra misión es clara: brindar el mejor
        servicio en productos digitales, con precios asequibles, entrega rápida
        y un proceso de compra sencillo y eficiente.
      </p><br/>

      <p>
        En esta sección de la marketplace, queremos que encuentres no solo
        productos, sino también una experiencia de compra diseñada para ayudarte
        a llevar tu negocio al siguiente nivel. En Gudfy, estamos aquí para
        apoyarte en cada paso del camino.
      </p>
    </div>
  )
}

export default About
