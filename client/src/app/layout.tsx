// import Providers from "@modules/providers"
// import "styles/globals.css"

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <Providers>
//           <main className="relative">{children}</main>
//         </Providers>
//       </body>
//     </html>
//   )
// }

"use client"
import Providers from "@modules/providers";
import "styles/globals.css";
import { I18nextProvider } from 'react-i18next';  // Importa I18nextProvider
import i18n from '../lib/i18n';  
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [currentLang, setCurrentLang] = useState(i18n.language);  // Almacena el idioma actual

  useEffect(() => {

    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
      document.documentElement.lang = lng;
    };

    i18n.on('languageChanged', handleLanguageChange);  // Escucha cambios en el idioma

    // Limpia el listener cuando se desmonta el componente
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

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
  );
}
