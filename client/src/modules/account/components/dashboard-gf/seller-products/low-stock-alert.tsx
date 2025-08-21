import React, { useState, useRef, useEffect } from "react"
import { Switch, Input } from "@medusajs/ui"
import { BsBell, BsBellSlash } from "react-icons/bs"
import { activateLowStock } from "../../../actions/low-stock/activate-low-stock"

interface LowStockAlertProps {
  productId: string
  initialEnabled?: boolean | null
  initialThreshold?: number | null
 
}

export default function LowStockAlert({
  productId,
  initialEnabled = false,
  initialThreshold = 5,
  
}: LowStockAlertProps) {
  // Manejar valores null del backend
  const [isEnabled, setIsEnabled] = useState(initialEnabled ?? false)
  const [threshold, setThreshold] = useState(initialThreshold ?? 5)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleToggle = async (enabled: boolean) => {
    setIsEnabled(enabled)
   
    
    // Enviar al backend
    try {
      await activateLowStock(productId, threshold, enabled)
      console.log(`Alerta ${enabled ? 'activada' : 'desactivada'} para producto ${productId}`)
    } catch (error) {
      console.error('Error al actualizar alerta:', error)
      // Revertir el estado en caso de error
      setIsEnabled(!enabled)
    }
  }

  const handleThresholdChange = async (value: string) => {
    const numValue = parseInt(value) || 0
    if (numValue >= 0) {
      setThreshold(numValue)
     
      
      // Enviar al backend solo si la alerta está activa
      if (isEnabled) {
        try {
          await activateLowStock(productId, numValue, isEnabled)
          console.log(`Umbral actualizado a ${numValue} para producto ${productId}`)
        } catch (error) {
          console.error('Error al actualizar umbral:', error)
          // Revertir el valor en caso de error
          setThreshold(threshold)
        }
      }
    }
  }

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {isEnabled ? (
          <BsBell className="text-orange-500 w-4 h-4" />
        ) : (
          <BsBellSlash className="text-gray-400 w-4 h-4" />
        )}
        <span className="text-xs text-gray-600 whitespace-nowrap">
          {isEnabled ? "Activa" : "Inactiva"}
        </span>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg p-3 shadow-lg min-w-[220px] z-50"
          style={{ zIndex: 1000 }}
        >
          <div className="flex flex-col gap-3">
            {/* Enable/Disable Switch */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Alerta de bajo stock
              </label>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggle}
                size="small"
              />
            </div>

            {/* Threshold Input */}
            {isEnabled && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-600">
                  Notificar cuando el stock sea ≤
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={threshold}
                    onChange={(e) => handleThresholdChange(e.target.value)}
                    min="0"
                    className="w-20 text-sm"
                    size="small"
                  />
                  <span className="text-xs text-gray-500">unidades</span>
                </div>
              </div>
            )}

            {/* Current Status */}
            <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
              {isEnabled 
                ? `Alerta configurada para ≤ ${threshold} unidades`
                : "Alerta desactivada"
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
