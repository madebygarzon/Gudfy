"use client"
import Image from "next/image"
import ReviewsTrusPilot from "../trustpilot"
import { Formik, Field, Form } from "formik"
import ButtonLigth from "@modules/common/components/button_light"

const MedusaCTA = () => {
  return (
    <div className="bg-blue-gf px-8 justify-center sm:space-x-40 p-3 block sm:flex sm:items-end pt-8 ">
      
      
      <div className="text-[#C7C7C7] font-[300] text-[14px] flex flex-col items-start">
        Ver nuestros comentarios en
        <a
          href="https://es.trustpilot.com/review/gudfy.com"
          target="_blank"
          rel="noreferrer"
        >
          <Image
            src="/image_coins/trust_pilot_icon.webp"
            alt="You can see our comments on trustpilot"
            width={180}
            height={180}
            className=" transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
          />
        </a>
        <ReviewsTrusPilot />
      </div>




      <div className="text-[#C7C7C7] sm:mt-0 mt-6 font-[300] text-[14px] mb-5">
        Suscríbete a nuestro newsletter y obtén contenido exclusivo.
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            await new Promise((resolve) => setTimeout(resolve, 500))
            alert(JSON.stringify(values, null, 2))
          }}
        >
          <Form className="sm:flex block sm:space-x-4 mt-6">
            <Field
              className="border-white border-solid border text-[#ffffff] font-[400] bg-transparent rounded min-h-[40px] pl-6 sm:w-[250px] w-full"
              placeholder="Ingresa tu email"
              name="email"
              type="email"
            />
            <ButtonLigth
              className="text-[#000] mt-6 sm:mt-0 font-semibold text-[14px] bg-white"
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
