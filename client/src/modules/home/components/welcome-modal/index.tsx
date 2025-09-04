"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"

const WelcomeModal = () => {
  const [open, setOpen] = useState(false)
  const firstBtnRef = useRef<HTMLAnchorElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  const handleCloseModal = useCallback(() => {
    setOpen(false)
 
    if (typeof window !== "undefined") {
      localStorage.setItem("welcomeStatus", "seen")
    }
  }, [])

  
  useEffect(() => {
    const hasSeenModal = localStorage.getItem("welcomeStatus") === "seen"
    if (!hasSeenModal) {
      setOpen(true)
    }
  }, [])

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
      handleCloseModal()
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
        onClick={handleCloseModal}
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
          onClick={handleCloseModal}
        >
          ×
        </button>

        <h2 id="welcome-modal-title" className="sr-only">
          Bienvenida
        </h2>

        <p id="welcome-modal-desc" className="mb-6 text-balance text-gray-800">
          ¡Bienvenido al nuevo Gudfy, aquí podrás comprar y vender tus productos! 
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="https://gudfyp2p.com/account/register"
            ref={firstBtnRef}
            className="inline-flex items-center justify-center rounded-xl bg-[#9B48ED] px-4 py-2 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#9B48ED]"
            onClick={handleCloseModal}
          
          >
            Registro 
          </Link>

          <Link
            href="https://gudfy.com/mi-cuenta/pedidos/"
            target="_blank "
            className="inline-flex items-center justify-center rounded-xl bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Códigos antiguos
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WelcomeModal
