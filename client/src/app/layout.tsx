"use client"
import Providers from "@modules/providers"
import "styles/globals.css"
import { I18nextProvider } from "react-i18next"
import i18n from "../lib/i18n"
import { useEffect, useState } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentLang, setCurrentLang] = useState(i18n.language)

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng)
      document.documentElement.lang = lng
    }

    i18n.on("languageChanged", handleLanguageChange)

    return () => {
      i18n.off("languageChanged", handleLanguageChange)
    }
  }, [])

  return (
    <html lang={currentLang}>
      <body>
        <I18nextProvider i18n={i18n}>
          <Providers>
            <main className="relative">{children}</main>
          </Providers>
        </I18nextProvider>
      </body>
    </html>
  )
}
