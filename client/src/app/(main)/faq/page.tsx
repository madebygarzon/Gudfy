"use client"
import React, { useEffect, useState } from "react"
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Accordion,
  AccordionItem,
} from "@nextui-org/react"

const OrdersTemplate = () => {
  return (
    <div className="flex flex-col my-10 mx-4 sm:mx-80">
      <h2 className="text-2xl mx-auto mt-2 font-bold text-gray-700 capitalize mb-4">
        Preguntas frecuentes
      </h2>

      
          
          <Tabs aria-label="Options">
            <Tab key="Activaciones" title="Problemas de activación">
              <Card className="">
                <CardBody className="flex flex-col items-start">
                  <Accordion>
                    <AccordionItem
                      key="1"
                      aria-label="No recibí mis códigos"
                      title="No recibí mis códigos"
                    >
                      <p>
                        Recuerda que puedes ver los códigos de tus ordenes en la
                        sección Mi cuenta en el apartado de mis pedidos una vez
                        hayas iniciado sesión en Gudfy
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="2"
                      aria-label="¿No recibiste el correo con tus pines?"
                      title="¿No recibiste el correo con tus pines?"
                    >
                      <p>
                        Si no recibiste el correo con el contenido de tus pines
                        recuerda revisar tu carpeta de SPAM antes de comunicarte
                        con nosotros, ya que nuestros mensajes pueden terminar
                        en esta carpeta. De lo contrario escríbenos a nuestra
                        línea de Whatsapp o crea un ticket con tu solicitud.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="3"
                      aria-label="¿Comprobaste el correo electrónico que has utilizado para comprar?"
                      title="¿Comprobaste el correo electrónico que has utilizado para comprar?"
                    >
                      <p>
                        Asegurate de que estás comprobando la bandeja de entrada
                        del correo electrónico que has utilizado para registrar
                        la compra en nuestra página. Si crees que has cometido
                        un error al introducir el correo electrónico, crea un
                        ticket.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="4"
                      aria-label="Tengo problemas para canjear mi código"
                      title="Tengo problemas para canjear mi código"
                    >
                      <p>
                        ¿Copiaste el código correctamente? Es fácil cometer un
                        error al reescribir el código que recibiste. Compruebe
                        si no hay caracteres similares intercambiados o si estás
                        escribiendo mal el código.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="5"
                      aria-label="No sé cómo canjear mis códigos"
                      title="No sé cómo canjear mis códigos"
                    >
                      <p>
                        Recuerda que en la descripción de cada producto de Gudfy
                        encuentras un pequeño tutorial para canjear cada uno de
                        los códigos.
                      </p>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="Pago" title="Pago">
              <Card className="shadow-lg">
                <CardBody>
                  <Accordion>
                    <AccordionItem
                      key="1"
                      aria-label="¿Puedo solicitar el reembolso de mi orden?"
                      title="¿Puedo solicitar el reembolso de mi orden?"
                    >
                      <p>
                        Debido a la naturaleza de nuestros productos digitales,
                        sólo podemos tramitar el reembolso de un código o una
                        orden si aún no has accedido al producto, de lo
                        contrario no será posible si ya los recibiste. Si no
                        recibiste tus códigos y quieres un reembolso crea un
                        ticket con tu solicitud o comunícate a la línea de
                        whatsapp
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="2"
                      aria-label="Cuales son los métodos de pago en Gudfy?"
                      title="Cuales son los métodos de pago en Gudfy?"
                    >
                      <p>
                        Por el momento en Gudfy aceptamos pagos en Criptomonedas
                        a través de Binance o la Red TRON en USDT, Bitcoin,
                        BUSD, Litecoin y Ethereum.
                      </p>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="Entrega" title="Entrega de productos">
              <Card className="shadow-lg">
                <CardBody>
                  <Accordion>
                    <AccordionItem
                      key="1"
                      aria-label="¿Tienes problemas técnicos con el producto?"
                      title="¿Tienes problemas técnicos con el producto?"
                    >
                      <p>
                        Al momento de canjear tus pines pueden existir una serie
                        de problemas. Si este es el caso, recuerda que nuestro
                        equipo de servicio al cliente puede ayudarte a
                        solucionar este problema y guiarte en el proceso de
                        activación de los pines.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="2"
                      aria-label="¿Dónde puedo ver lo productos que compré?"
                      title="¿Dónde puedo ver lo productos que compré?"
                    >
                      <p>
                        Recuerda que puedes ver los códigos de tus órdenes y el
                        historial de ellas en la sección Mi cuenta en el
                        apartado de mis pedidos una vez hayas iniciado sesión en
                        la cuenta en la cual realizas tus ordenes en Gudfy.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="3"
                      aria-label="¿En cuánto tiempo recibiré mis productos?"
                      title="¿En cuánto tiempo recibiré mis productos?"
                    >
                      <p>
                        Si escoges un método de pago con entrega automática
                        recibirás los códigos en cuestión de segundos una vez
                        hayas realizado el pago, podrás ver tus códigos en tu
                        correo o en la sección de mis pedidos en tu perfil de
                        gudfy.
                        <br /> Si eliges un método de pago con entrega manual
                        prometemos entregas en un lapso de una hora desde que
                        realices tu orden, pero normalmente se liberan los
                        pedidos en muy poco tiempo gracias a nuestro oportuno
                        equipo.
                        <br />
                        <br /> 1. Binance Pay Entrega Automática: la entrega es
                        automática y en tiempo real.
                        <br /> 2.USDT TRC20: la entrega es automática y en
                        tiempo real.
                        <br /> 3. Binance Pay Entrega Manual: 60 minutos como
                        máximo dentro de nuestro horario laboral (8 AM a 10 PM
                        horario Colombia GTM-5).
                      </p>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="Compra" title="Proceso de compra">
              <Card className="shadow-lg">
                <CardBody>
                  <Accordion>
                    <AccordionItem
                      key="1"
                      aria-label="¿Cómo comprar?"
                      title="¿Cómo comprar?"
                    >
                      <p>
                        Si eres nuevo en la comunidad de Gudfiter y no conoces
                        el proceso de compra no te preocupes, tenemos distintas
                        formas de ayudarte en este proceso, te puedes apoyar de
                        un video que creamos especialmente para ti.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="2"
                      aria-label="Jamás he usado binance y no sé cómo crear una cuenta"
                      title="Jamás he usado binance y no sé cómo crear una cuenta"
                    >
                      <p>
                        Si jamás has usado Binance y no conoces el proceso para
                        crear una cuenta, no te preocupes, hemos creado un
                        apartado especial en nuestro blog el cual te enseñará el
                        paso a paso para crear tu cuenta desde cualquier país
                        ingresa aquí y conoce lo sencillo que es crear tu
                        cuenta.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="3"
                      aria-label="No sé como comprar USDT"
                      title="No sé como comprar USDT"
                    >
                      <p>
                        En nuestro blog tenemos un apartado especial donde te
                        enseñaremos a comprar con tu moneda local USDT para que
                        logres realizar una compra en Gudfy, ¡¡Una vez hayas
                        realizado el proceso por primera vez te darás cuenta de
                        lo sencillo y rápido que es!!
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="4"
                      aria-label="Puedo cancelar mi pedido?"
                      title="Puedo cancelar mi pedido?"
                    >
                      <p>
                        Si ya realizaste el pago pero no has recibido tus pines,
                        si, puedes cancelar tu pedido y recibir un reembolso con
                        tu dinero, para ello puedes crear un ticket con tus
                        datos para realizar el reembolso, PERO RECUERDA puedes
                        solicitarlo SOLO si no has recibido tus pines.
                      </p>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Card>
            </Tab>

            <Tab key="Otros" title="Otros">
              <Card className="shadow-lg">
                <CardBody>
                  <Accordion>
                    <AccordionItem
                      key="1"
                      aria-label="Horario laboral"
                      title="Horario laboral"
                    >
                      <p>
                        El servicio de soporte al cliente vía WhatsApp y los
                        pedidos manuales son entregados entre las 8 AM y 10 PM
                        hora Colombia GTM-5, todos los días.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="2"
                      aria-label="¿Los códigos tienen caducidad?"
                      title="¿Los códigos tienen caducidad?"
                    >
                      <p>
                        Todos los productos digitales vendidos en Gudfy.com
                        siguen las reglas de sus respectivas plataformas, sin
                        embargo, por norma general los códigos o pines tipo Gift
                        Card nunca caducan.
                      </p>
                    </AccordionItem>
                    <AccordionItem
                      key="3"
                      aria-label="¿Por qué cambian los precios?"
                      title="¿Por qué cambian los precios?"
                    >
                      <p>
                        Los productos de Gudfy son colombianos, sin embargo, los
                        pagos se reciben en USDT, esto nos obliga a ajustarnos
                        constantemente al cambio del mercado P2P de Binance en
                        relación con el peso colombiano. Gudfy nunca aumenta ni
                        disminuye su beneficio en nuestros productos.
                      </p>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        
    </div>
  )
}

export default OrdersTemplate
