"use client"
import Image from "next/image"
import ReviewsTrusPilot from "../trustpilot"
import { Formik, Field, Form } from "formik"
import ButtonLigth from "@modules/common/components/button_light"

const MedusaCTA = () => {
  return (
    <div className="bg-blue-gf px-4 sm:px-8 justify-center sm:space-x-40 p-3 block sm:flex sm:items-end pt-6 sm:pt-8">
      
      
      <div className="text-[#C7C7C7] font-[300] text-[14px] flex flex-col items-center sm:items-start mb-6 sm:mb-0">
        <span className="text-center sm:text-left mb-2">Ver nuestros comentarios en</span>
        <a
          href="https://es.trustpilot.com/review/gudfy.com"
          target="_blank"
          rel="noreferrer"
          className="inline-block"
        >
          <Image
            src="/image_coins/trust_pilot_icon.webp"
            alt="You can see our comments on trustpilot"
            width={160}
            height={160}
            sizes="(max-width: 640px) 160px, 180px"
            className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
          />
        </a>
        <ReviewsTrusPilot />
      </div>




      <div className="text-[#C7C7C7] sm:mt-0 mt-8 font-[300] text-[14px] mb-5 w-full sm:w-auto">
        <span className="block text-center sm:text-left mb-4">Suscríbete a nuestro newsletter y obtén contenido exclusivo.</span>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            alert(JSON.stringify(values, null, 2))
          }}
        >
          <Form className="flex flex-col sm:flex-row gap-4 sm:gap-4 mt-4 sm:mt-6">
            <Field
              className="border-white border-solid border text-[#ffffff] font-[400] bg-transparent rounded min-h-[44px] pl-4 sm:pl-6 sm:w-[250px] w-full text-sm sm:text-base"
              placeholder="Ingresa tu email"
              name="email"
              type="email"
            />
            <ButtonLigth
              className="text-[#000] font-semibold text-[14px] bg-white min-h-[44px] px-6 rounded whitespace-nowrap"
              type="submit"
            >
              Suscribirme
            </ButtonLigth>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default MedusaCTA
