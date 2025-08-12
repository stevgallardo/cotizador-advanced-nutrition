"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Copy, Download, Check, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useQuoteState } from "@/hooks/use-quote-state"
import { ProductRow } from "@/components/product-row"
import { QuoteSummary } from "@/components/quote-summary"
import { formatCurrency } from "@/lib/utils"

// Catálogo de productos (editable)
const PRODUCT_CATALOG = [
  { code: "OP", name: "OPC 95 PLUS", pricePublic: 490, points: 19.4 },
  { code: "C3", name: "CURCUMIN", pricePublic: 490, points: 19.4 },
  { code: "AN", name: "ALOE NECTAR", pricePublic: 424, points: 15.5 },
  { code: "HI", name: "ACTIVADOR", pricePublic: 208, points: 7.33 },
  { code: "RH", name: "ROYAL HONEY", pricePublic: 334, points: 10.5 },
  { code: "LP", name: "LACTOSPORE", pricePublic: 458, points: 18.1 },
  { code: "RG", name: "ROYAL GEL", pricePublic: 504, points: 18.1 },
  { code: "MS", name: "MSM", pricePublic: 490, points: 19.4 },
  { code: "SS", name: "SELECT SLIM", pricePublic: 514, points: 20.25 },
  { code: "TN", name: "TOTAL NUTRITION", pricePublic: 564, points: 20.25 },
  { code: "FL", name: "FORS LEAN", pricePublic: 514, points: 20.25 },
  { code: "V2", name: "V-24", pricePublic: 670, points: 20.25 },
  { code: "NS", name: "NUTRASANA", pricePublic: 1790, points: 60 },
  { code: "SA", name: "STRESANA", pricePublic: 490, points: 19.4 },
]

const CLIENT_TYPES = [
  { id: "inversionista", label: "Inversionista", discount: 0.4 },
  { id: "consumidor", label: "Consumidor", discount: 0.3 },
  { id: "publico", label: "Público", discount: 0 },
]

export default function CotizadorPage() {
  const {
    items,
    clientType,
    clientName,
    searchTerm,
    setClientType,
    setClientName,
    setSearchTerm,
    updateQuantity,
    toggleActive,
    selectAll,
    clearAll,
    totals,
    copyQuote,
    exportCSV,
  } = useQuoteState(PRODUCT_CATALOG)

  const [copied, setCopied] = useState(false)

  // Filtrar productos por búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return PRODUCT_CATALOG
    const term = searchTerm.toLowerCase()
    return PRODUCT_CATALOG.filter(
      (product) => product.code.toLowerCase().includes(term) || product.name.toLowerCase().includes(term),
    )
  }, [searchTerm])

  const handleCopyQuote = async () => {
    await copyQuote()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
        {/* Navigation Bar */}
        <nav className="bg-green-600 text-white py-2 px-4">
          <div className="container mx-auto flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-green-700 hover:text-white"
              onClick={() => (window.location.href = "/")}
            >
              ← Volver al inicio
            </Button>
            <img src="/logo-advanced-nutrition.png" alt="Logo Advanced Nutrition" className="h-16 w-auto" />
          </div>
        </nav>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green border-b border-green-100 w-full"
        >
          <div className="w-full px-4 pt-8 pb-4 flex flex-col items-center">
            {/* Título en Card con fondo igual al resumen */}
            <Card className="max-w-xl w-full mx-auto border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50/30">
              <CardHeader className="pb-0">
                <CardTitle className="text-center text-4xl md:text-5xl font-bold text-green-700 mb-2">Cotizador</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                <div className="text-center">
                  <p className="text-lg md:text-xl opacity-90 font-medium text-green-600">Advanced Nutrition</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Panel principal */}
            <div className="lg:col-span-8 space-y-6">
              {/* Controles superiores */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-green-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-green-700">Controles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Selector de tipo de cliente */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Tipo de Cliente</label>
                      <div className="flex flex-wrap gap-2">
                        {CLIENT_TYPES.map((type) => (
                          <Button
                            key={type.id}
                            variant={clientType === type.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setClientType(type.id as "inversionista" | "consumidor" | "publico")}
                            className={`transition-all duration-200 ${
                              clientType === type.id
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "border-green-200 hover:border-green-300 hover:bg-green-50"
                            }`}
                          >
                            {type.label}
                            {type.discount > 0 && (
                              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">
                                -{Math.round(type.discount * 100)}%
                              </Badge>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Campo de nombre del cliente */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nombre del Cliente</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Ingresa el nombre del cliente..."
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-400"
                        />
                      </div>
                    </div>

                    {/* Búsqueda */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Buscar Producto</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Buscar por código o nombre..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-400"
                        />
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAll}
                        className="border-green-200 hover:border-green-300 hover:bg-green-50 bg-transparent"
                      >
                        Seleccionar Todo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAll}
                        className="border-orange-200 hover:border-orange-300 hover:bg-orange-50 bg-transparent"
                      >
                        Limpiar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Lista de productos */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="border-green-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-green-700">Productos ({filteredProducts.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-2 p-6">
                        <AnimatePresence>
                          {filteredProducts.map((product, index) => (
                            <motion.div
                              key={product.code}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <ProductRow
                                product={product}
                                clientType={clientType}
                                quantity={items[product.code]?.quantity || 0}
                                active={items[product.code]?.active || false}
                                onQuantityChange={(qty) => updateQuantity(product.code, qty)}
                                onToggleActive={() => toggleActive(product.code)}
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      {/* Caja de total de puntos, solo una vez */}
                      <div className="p-6">
                        <span className="font-bold text-orange-700 hidden lg:inline">Total puntos: {totals.points}</span>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Resumen - Desktop */}
            <div className="hidden lg:block lg:col-span-4">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <QuoteSummary totals={totals} onCopyQuote={handleCopyQuote} onExportJSON={exportCSV} copied={copied} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-green-600 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-bold mb-2">Advanced Nutrition</h3>
                <p className="text-green-100 text-sm">Cotizador profesional para productos de Advanced Nutrition.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contacto</h4>
                <p className="text-green-100 text-sm">
                  Email: advancednutritionmex@gmail.com
                  <br />
                  Teléfono: (33) 35-87-2012
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Soporte</h4>
                <p className="text-green-100 text-sm">
                  Lunes a Viernes: 9:00 AM - 6:00 PM
                  <br />
                  Sábados: 9:00 AM - 2:00 PM
                </p>
              </div>
            </div>
            <div className="border-t border-green-500 mt-6 pt-4 text-center">
              <p className="text-green-100 text-sm">© 2024 Advanced Nutrition. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>

        {/* Resumen - Mobile (sticky bottom) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-green-200 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <div className="text-lg font-bold text-green-700">{formatCurrency(totals.total)}</div>
              <div className="text-sm text-gray-600">
                {totals.activeProducts} productos • {totals.totalPieces} piezas
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17l-5 3 1.9-5.6L4 9.5l5.7-.4L12 4l2.3 5.1 5.7.4-4.9 4.9L17 20z" /></svg>
                  {totals.points.toLocaleString()} pts
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyQuote}
                    className="border-green-200 hover:border-green-300 bg-transparent"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copiar cotización</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={exportCSV} className="bg-orange-600 hover:bg-orange-700">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Exportar CSV</TooltipContent>
              </Tooltip>
            </div>
          </motion.div>
        </div>

        {/* Espaciado para el resumen móvil */}
        <div className="lg:hidden h-20" />
      </div>
    </TooltipProvider>
  )
}
