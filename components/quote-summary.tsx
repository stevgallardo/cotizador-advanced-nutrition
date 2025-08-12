"use client"

import { motion } from "framer-motion"
import { Copy, Download, Check, ShoppingCart, Award, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import type { Totals } from "@/hooks/use-quote-state"

interface QuoteSummaryProps {
  totals: Totals
  onCopyQuote: () => void
  onExportJSON: () => void
  copied: boolean
}

export function QuoteSummary({ totals, onCopyQuote, onExportJSON, copied }: QuoteSummaryProps) {
  return (
    <Card className="border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-green-700 flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Resumen de Cotización
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total principal */}
        <motion.div
          key={totals.total}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white"
        >
          <div className="text-sm font-medium opacity-90">Total</div>
          <div className="text-3xl font-bold">{formatCurrency(totals.total)}</div>
          <div className="text-sm opacity-90">MXN</div>
        </motion.div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200"
          >
            <Award className="mx-auto h-5 w-5 text-orange-600 mb-1" />
            <div className="text-2xl font-bold text-orange-700">{totals.points.toLocaleString()}</div>
            <div className="text-xs text-orange-600">Puntos</div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <svg className="mx-auto h-5 w-5 text-green-600 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
            <div className="text-2xl font-bold text-green-700">{totals.activeProducts}</div>
            <div className="text-xs text-green-600">Productos</div>
          </motion.div>
        </div>

        {/* Piezas totales */}
        <div className="text-center">
          <Badge variant="outline" className="text-sm border-green-200 text-green-700">
            {totals.totalPieces.toLocaleString()} piezas totales
          </Badge>
        </div>

        <Separator className="bg-green-200" />

        {/* Botones de acción */}
        <div className="space-y-3">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onCopyQuote}
              variant="outline"
              className="w-full border-green-200 hover:border-green-300 hover:bg-green-50 bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar Cotización
                </>
              )}
            </Button>
          </motion.div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button onClick={onExportJSON} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </motion.div>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <div>Los datos se guardan automáticamente</div>
          <div>en tu navegador</div>
        </div>
      </CardContent>
    </Card>
  )
}
