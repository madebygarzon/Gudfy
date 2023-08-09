import { FaWhatsapp } from "react-icons/fa"

const BotonWhatsApp = () => {
  return (
    <div>
      <a
        href="https://api.whatsapp.com/send?phone=573024709370&text=Y%20en%20breve%20te%20responderemos."
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp
          className="fixed right-8 bottom-8 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 "
          color="#61CE70"
          size={60}
        />
      </a>
    </div>
  )
}
export default BotonWhatsApp
