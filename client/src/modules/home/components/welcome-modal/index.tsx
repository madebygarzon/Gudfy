"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

const WelcomeModal = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shown = sessionStorage.getItem("welcome-modal-shown")
      if (!shown) {
        setOpen(true)
        sessionStorage.setItem("welcome-modal-shown", "true")
      }
    }
  }, [])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md rounded-[30px] bg-white p-6 text-center">
        <button
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-xl text-gray-500"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <p className="mb-6">
          Bienvenido a nuestro nuevo sistema, evolucionamos para darte un mejor servicio.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="https://gudfyp2p.com/account/register"
            className="rounded-md bg-[#9B48ED] px-4 py-2 text-white"
          >
            Regístrate aquí
          </Link>
          <Link
            href="https://gudfy.com/mi-cuenta/pedidos/"
            className="rounded-md bg-gray-200 px-4 py-2"
          >
            Ver pedidos Gudfy
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal

