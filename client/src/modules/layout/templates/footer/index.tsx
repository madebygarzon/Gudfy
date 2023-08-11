'use client'
import FooterCTA from "@modules/layout/components/footer-cta"
import FooterNav from "@modules/layout/components/footer-nav"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const Footer = () => {
  const pathname = usePathname()
  const [isLogin,setIsLogin] = useState<boolean>()

  useEffect(()=>{
    pathname === "/account/login" ||  pathname === "/account/register" ?  setIsLogin(false) : setIsLogin(true)
  },[pathname])
  return (isLogin?
    <footer>
      <FooterCTA />
      <FooterNav />
      <MedusaCTA />
    </footer>
  :"")
}

export default Footer
