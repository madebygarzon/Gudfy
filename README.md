# Módulo de Bus de Evento en Medusa

El módulo de bus de eventos en Medusa es esencial para activar eventos y notificaciones a los suscriptores que escuchan. Aquí, se describen dos opciones para configurar el módulo de bus de eventos: **Local** para entornos de desarrollo y **Redis Event Bus** para producción.

## Módulo de Bus de Evento Local

El módulo de bus de eventos local es adecuado para entornos de desarrollo. Aquí se proporciona información sobre cómo configurarlo:

- [Configuración del Módulo de Bus de Evento Local](https://docs.medusajs.com/modules/customers/backend/send-confirmation)

Este recurso ya esta implementado por lo que se debe de comentar si se desea llevar a producción: configuracion en **medusa-config.js**.

<<<<<<< HEAD
```javascript test 
=======
```javascript '''
>>>>>>> fb3a021ca42d92b5e78942bfa2d1838003b8c1fc

const modules = {
  //codigo a comentar 
  // eventBus: {
  //   resolve: "@medusajs/event-bus-local",
  // },
};
```

## Módulo de Bus de Evento para Producción

Para entornos de producción, se recomienda utilizar el **Módulo Redis Event Bus** para garantizar una mayor escalabilidad y fiabilidad. Aquí se proporciona información sobre cómo configurar esta opción:

- [Configuración del Módulo Redis Event Bus para Producción](https://docs.medusajs.com/development/events/modules/redis)

Este recurso te proporciona instrucciones detalladas sobre cómo configurar el Módulo Redis Event Bus en tu aplicación Medusa para garantizar un funcionamiento eficiente y confiable en entornos de producción.


# Configuracion para el entorno de SendGrid (Gestor de envios de correo)

Importante mencionar que esta erramienta nos brinda un uso gratuito de 100 emails por dia, se puede considerar la opcion de 100.000 emials 

Para integrar el servicio de notificaciones con **Resend** debes crear una cuenta en [Resend](https://resend.com) y obtener una clave API.

En tu archivo **.env** agrega las variables:

```javascript
RESEND_API_KEY=<API_KEY>
RESEND_FROM_EMAIL=<SEND_FROM_EMAIL>
```

Asegúrate de reemplazar `<API_KEY>` con tu clave de Resend y `<SEND_FROM_EMAIL>` con el correo electrónico verificado que usarás como remitente.

Luego, agrega el plugin de Resend en **medusa-config.js**:

```javascript
const plugins = [
  // ...,
  {
    resolve: `medusa-plugin-resend`,
    options: {
      api_key: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL,
    },
  },
]
```

Las opciones `api_key` y `from` son obligatorias. Consulta la documentación de Medusa para personalizar otras opciones según tus necesidades.
# Implementación y configuración del plugin *medusa-plugin-auth*

Para la implementación de la herramienta, se siguieron los pasos recomendados por la documentación oficial en https://medusa-plugins.vercel.app/authentication.

Se debe tener en cuenta que en la carpeta del back-end, medusa-config.js se implementa el plugin, con una característica modificada, la cual es { strict: "none"}, esta permite que los usuarios que previamente ya se han registrado en la plataforma de gudfy puedan iniciar sesión con sus redes sociales.

## Facebook & Gmail ## 
Utilizando el plugin medusa-plugin-auth, puedes habilitar el inicio de sesión a través de Facebook y Gmail. La documentación proporciona un detallado paso a paso para configurarlo. Además, es importante mencionar que debes agregar las variables de entorno necesarias en el archivo .env. Para obtener estas variables, te recomendamos contactar directamente con la documentacion de la API de Autenticación de terceros de Facebook y Gmail.


## Codigo Manipulado en librerias ## 

**server\node_modules\@medusajs\medusa\dist\services\product-variant.js**
**comentar la linea 237:  this.validateVariantsToCreate_(product, variants_);**
Se comento esta funcion de validacion para la creacion de la Variante de producto  por medio del id del producto, ya que esta funcion esta generando error en la forma en como se utilisa el Servicio de la tabla (Entity) ProductVariantService. este endpoint personalisado esta ubicado en server/src/api/routes/seller/update-seller-product.ts

**server/node_modules/@medusajs/medusa/dist/loaders/plugins.js:524:70**
**comentar la linea 524 - 534:  else if (utils_1.SearchUtils.isSearchService(loaded.prototype))**
Se commento esta validacioon que causaba conflictos con el arranque del sistema. Test
