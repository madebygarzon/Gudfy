"use client"
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

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
            Bye: "Goodbye",
            subtitle_skills: "Current Work Tools",
            greeting: "Hi",
            inicio: "Home",
            home_name: "I'm",
            home_subtitle: "Systems Engineer and Fullstack Web Developer",
            home_description: "",
            proyectos: "Projects",
            contacto: "Contact",
            templates: "Templates",
            blog: "Blog",
            projects_title: "Featured projects",
            projects_descriptions: "These are some of my most recent projects",
            see_more: "See more",
            blog_title: "Blog",
            blog_descriptions: "Read my most recent blogs",
            contact_title: "Let's work together!",
            contact_descriptions: "Write to me and I will get in touch as soon as possible",
            form_name: "Name",
            form_email: "Email Address",
            form_phone: "Phone",
            form_message: "Message",
            form_buttom: "Send",
            services_title: "Services",
            services_description: "",
            services_long_description: "Choose how you want your project to look",
            cta_buttom_modal: "Let's work together!",
        }
    },
    es: {
        translation: {
            Hello: "Hola",
            Bye: "Adios",
            subtitle_skills: "Herramientas de trabajo actual",
            greeting: "Hola",
            inicio: "Inicio",
            home_name: "Soy",
            home_subtitle: "Ingeniero de Sistemas y Desarrollador Web Fullstack",
            home_description: "",
            proyectos: "Proyectos",
            contacto: "Contacto",
            templates: "Plantillas",
            blog: "Blog",
            projects_title: "Proyectos destacados",
            projects_descriptions: "Estos son algunos de mis proyectos más recientes",
            see_more: "Ver más",
            blog_title: "Blog",
            blog_descriptions: "Lee mis blogs más recientes",
            contact_title: "¡Trabajemos juntos!",
            contact_descriptions: "Escríbeme y me pondré en contacto en el menor tiempo posible",
            form_name: "Nombre",
            form_email: "Correo electrónico",
            form_phone: "Teléfono",
            form_message: "Mensaje",
            form_buttom: "Enviar",
            services_title: "Servicios",
            services_description: "Soluciones Web a Medida",
            services_long_description: "En ByGarzon, ofrecemos una gama completa de servicios de desarrollo web personalizados para satisfacer las necesidades únicas de tu negocio. Desde la creación de sitios web impactantes hasta el desarrollo de plugins personalizados, nuestro enfoque centrado en el cliente garantiza soluciones que impulsan el éxito en línea.",
            cta_buttom_modal: "¡Trabajemos juntos!",
        }
    },    
}

i18next.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    keySeparator: false, // we do
    interpolation: {
        escapeValue: false // not needed for react as it escapes by default
    }
})
export default i18next; 