import { Metadata } from "next"
import HeadTC from "@modules/terms-and-Conditions/components/head"
import BodyTC from "@modules/terms-and-Conditions/components/body"

export const metadata: Metadata = {
  title: "Térmonos y condiciones",
  description: "gudfy - te brindamos los terminos y condiciones.",
}

export default function TermsAndConditions() {
  return( 
  <>
    <HeadTC />
    <BodyTC />
  </>)
}