"use client"

import type { SyntheticEvent } from "react"
import { motion } from "framer-motion"
import { Minus, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/hooks/use-quote-state"

interface ProductRowProps {
  product: Product
  clientType: "publico" | "consumidor" | "inversionista"
  quantity: number
  active: boolean
  onQuantityChange: (quantity: number) => void
  onToggleActive: () => void
  // usar el mismo cálculo que los totales
  calcUnitPrice: (product: Product, type: "publico" | "consumidor" | "inversionista") => number
}

export function ProductRow({
  product,
  clientType,
  quantity,
  active,
  onQuantityChange,
  onToggleActive,
  calcUnitPrice,
}: ProductRowProps) {
  // Cálculos unificados
  const unitPrice = calcUnitPrice(product, clientType)
  const subtotal = unitPrice * quantity
  const pointsTotal = Number((product.points * quantity).toFixed(1))

  // Mostrar -% SOLO para inversionista
  const showPercent = clientType === "inversionista"
  const discountPercent = showPercent ? 40 : 0

  const handleQuantityChange = (val: string) => {
    const digits = val.replace(/[^\d]/g, "")
    const num = digits === "" ? 0 : Math.max(0, Math.floor(Number(digits)))
    onQuantityChange(num)
  }

  // imágenes (case-sensitive en Vercel)
  const imageKey = String(product.code).trim().toLowerCase().replace(/\s+/g, "-")
  const imageSrc = `/${imageKey}.png`
  const handleImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null
    e.currentTarget.src = "/logo-advanced-nutrition.png"
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
      <Card className={`p-3 md:p-4 transition-all duration-200 ${active ? "border-green-300 bg-green-50/50 shadow-md" : "border-gray-200 bg-white hover:border-gray-300"}`}>
        <div className="grid grid-cols-12 gap-4 md:gap-y-4 md:gap-x-10 items-start md:items-center">
          {/* Switch desktop */}
          <div className="hidden md:flex md:col-span-1 md:order-1 justify-center md:pr-3">
            <Switch aria-label="Activar producto" checked={active} onCheckedChange={onToggleActive} className="data-[state=checked]:bg-green-600" />
          </div>

          {/* Header móvil */}
          <div className="col-span-12 md:hidden order-1">
            <div className="flex flex-col items-center gap-2">
              <div className="size-28 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center border border-green-200">
                <img src={imageSrc} onError={handleImgError} alt={`Producto ${product.name}`} className="w-full h-full object-contain rounded" loading="lazy" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-[11px] border-green-200">{product.code}</Badge>
                <span className="font-medium text-gray-900 text-base">{product.name}</span>
                <Switch aria-label="Activar producto" checked={active} onCheckedChange={onToggleActive} className="data-[state=checked]:bg-green-600" />
              </div>
            </div>
          </div>

          {/* Imagen desktop */}
          <div className="hidden md:flex md:col-span-1 md:order-2 md:pr-4">
            <div className="shrink-0 size-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center border border-green-200">
              <img src={imageSrc} onError={handleImgError} alt={`Producto ${product.name}`} className="w-full h-full object-contain rounded" loading="lazy" />
            </div>
          </div>

          {/* Nombre desktop */}
          <div className="hidden md:flex md:col-span-3 md:order-3 md:pr-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono text-xs border-green-200">{product.code}</Badge>
              <span className="font-medium text-gray-900">{product.name}</span>
            </div>
          </div>

          {/* Cantidad */}
          <div className="col-span-12 md:col-span-2 order-3 md:order-4 md:pr-6">
            <label className="block text-[11px] md:text-xs font-medium text-gray-600 mb-1 text-center md:text-left">Cantidad</label>
            <div className="flex items-center justify-center md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" aria-label="Disminuir cantidad" onClick={() => onQuantityChange(Math.max(0, quantity - 1))} disabled={quantity <= 0} className="h-12 w-12 md:h-9 md:w-9 p-0 border-green-200 hover:border-green-300 rounded-xl md:rounded-lg">
                  <Minus className="h-4 w-4" />
                </Button>
                <Input type="tel" inputMode="numeric" pattern="[0-9]*" value={quantity.toString()} onChange={(e) => handleQuantityChange(e.target.value)} className="h-12 md:h-9 w-24 md:w-16 text-center tabular-nums leading-none text-base md:text-sm border-green-200 focus:border-green-400 rounded-xl md:rounded-lg px-0" />
                <Button variant="outline" size="icon" aria-label="Aumentar cantidad" onClick={() => onQuantityChange(quantity + 1)} className="h-12 w-12 md:h-9 md:w-9 p-0 border-green-200 hover:border-green-300 rounded-xl md:rounded-lg">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Precio (unitario) */}
          <div className="col-span-12 md:col-span-2 order-4 md:order-5 md:pl-8 md:min-w-[160px]">
            <label className="block text-[11px] md:text-xs font-medium text-gray-600 mb-1 text-left">Precio</label>
            <div className="space-y-1">
              <div className="font-semibold text-green-700 text-base md:text-sm text-left">
                {formatCurrency(unitPrice)}
              </div>
              {(clientType !== "publico") && (
                <div className="flex items-center justify-start gap-2">
                  <span className="text-[11px] md:text-xs text-gray-500 line-through">
                    {formatCurrency(product.pricePublic)}
                  </span>
                  {showPercent && (
                    <span className="text-[11px] md:text-xs text-orange-600 font-bold">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Subtotal móvil */}
            <div className="md:hidden mt-3">
              <label className="block text-[11px] font-medium text-gray-600 mb-1 text-left">Subtotal</label>
              <div className="text-green-600 font-semibold text-lg text-left">
                {formatCurrency(subtotal)}
              </div>
            </div>
          </div>

          {/* Subtotal desktop */}
          <div className="hidden md:block md:col-span-2 md:order-6 md:text-right md:pr-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
            <div className="font-bold text-base text-green-700">
              {formatCurrency(subtotal)}
            </div>
          </div>

          {/* Puntos */}
          <div className="col-span-12 md:col-span-1 order-6 md:order-7 md:flex md:justify-end md:pr-2">
            <div className="text-left md:text-right">
              <label className="block text-[11px] md:text-xs font-medium text-gray-600 mb-1">Puntos</label>
              <div className="flex items-center justify-start md:justify-end gap-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 rounded-lg">{pointsTotal}</Badge>
                <span className="text-[11px] md:text-xs text-gray-500">pts</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
