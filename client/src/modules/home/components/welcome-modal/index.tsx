"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"

const WelcomeModal = () => {
  const [open, setOpen] = useState(true) // 🔥 Abierto por defecto siempre
  const firstBtnRef = useRef<HTMLAnchorElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Foco inicial
  useEffect(() => {
    if (open) {
      firstBtnRef.current?.focus()
    }
  }, [open])

  // Cerrar con Escape + trap de tab
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation()
      setOpen(false)
    }

    if (e.key === "Tab" && dialogRef.current) {
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (active === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      aria-hidden={!open}
      onKeyDown={onKeyDown}
    >
      {/* Click fuera para cerrar */}
      <button
        aria-hidden
        className="absolute inset-0 cursor-default"
        onClick={() => setOpen(false)}
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        aria-describedby="welcome-modal-desc"
        ref={dialogRef}
        className="relative mx-4 w-full max-w-md rounded-[10px] bg-white p-6 shadow-2xl outline-none"
      >
        {/* Botón cerrar */}
        <button
          aria-label="Cerrar"
          className="absolute right-4 top-4 rounded-full p-1 text-2xl leading-none text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9B48ED]"
          onClick={() => setOpen(false)}
        >
          ×
        </button>

        <h2 id="welcome-modal-title" className="sr-only">
          Bienvenida
        </h2>

        <p id="welcome-modal-desc" className="mb-6 text-balance text-gray-800">
          Bienvenido a nuestro nuevo sistema, evolucionamos para darte un mejor servicio.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="https://gudfyp2p.com/account/register"
            ref={firstBtnRef}
            className="inline-flex items-center justify-center rounded-xl bg-[#9B48ED] px-4 py-2 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#9B48ED]"
          >
            Regístrate aquí
          </Link>

          <Link
            href="https://gudfy.com/mi-cuenta/pedidos/"
            className="inline-flex items-center justify-center rounded-xl bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Ver pedidos Gudfy
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
