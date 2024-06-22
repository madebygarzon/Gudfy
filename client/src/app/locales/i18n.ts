"use client"
//import i18next from "i18next";
//import { initReactI18next } from "react-i18next";

export const langs = [
    {
        value: "en",
        label: "English",
        
    },
    {
        value: "es",
        label: "Spanish",
        
    }
];

const resources = {
    en: {
        translation: {
            Hello: "Hello",
            
        }
    },
    es: {
        translation: {
            Hello: "Hola",
           
        }
    },    
}

// i18next.use(initReactI18next).init({
//     resources,
//     lng: "en",
//     fallbackLng: "en",
//     keySeparator: false, // we do
//     interpolation: {
//         escapeValue: false // not needed for react as it escapes by default
//     }
// })
// export default i18next; 