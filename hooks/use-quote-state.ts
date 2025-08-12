"use client"

import { useState, useEffect, useCallback, useMemo } from "react"

export interface Product {
  code: string
  name: string
  pricePublic: number
  points: number
}

export interface QuoteItem {
  quantity: number
  active: boolean
}

export interface QuoteState {
  [productCode: string]: QuoteItem
}

export interface Totals {
  total: number
  points: number
  activeProducts: number
  totalPieces: number
}

const CLIENT_TYPE_DISCOUNTS = {
  publico: 0,
  consumidor: 0.3,
  inversionista: 0.4,
}

export function useQuoteState(catalog: Product[]) {
  const [items, setItems] = useState<QuoteState>({})
  const [clientType, setClientType] = useState<keyof typeof CLIENT_TYPE_DISCOUNTS>("inversionista")
  const [clientName, setClientName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Cargar estado desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cotizador-state")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setItems(parsed.items || {})
        setClientType(parsed.clientType || "inversionista")
        setClientName(parsed.clientName || "")
        setSearchTerm(parsed.searchTerm || "")
      } catch (error) {
        console.error("Error loading saved state:", error)
      }
    }
  }, [])

  // Guardar estado en localStorage
  useEffect(() => {
    const state = { items, clientType, clientName, searchTerm }
    localStorage.setItem("cotizador-state", JSON.stringify(state))
  }, [items, clientType, clientName, searchTerm])

  // Calcular precio unitario según tipo de cliente
  const calcUnitPrice = useCallback((product: Product, type: keyof typeof CLIENT_TYPE_DISCOUNTS) => {
    const discount = CLIENT_TYPE_DISCOUNTS[type]
    return product.pricePublic * (1 - discount)
  }, [])

  // Actualizar cantidad
  const updateQuantity = useCallback((productCode: string, quantity: number) => {
    // Validar que sea entero >= 0
    const validQuantity = Math.max(0, Math.floor(quantity))

    setItems((prev) => ({
      ...prev,
      [productCode]: {
        ...prev[productCode],
        quantity: validQuantity,
        active: prev[productCode]?.active || validQuantity > 0,
      },
    }))
  }, [])

  // Toggle activo/inactivo
  const toggleActive = useCallback((productCode: string) => {
    setItems((prev) => ({
      ...prev,
      [productCode]: {
        quantity: prev[productCode]?.quantity || 0,
        active: !(prev[productCode]?.active || false),
      },
    }))
  }, [])

  // Seleccionar todos
  const selectAll = useCallback(() => {
    const newItems: QuoteState = {}
    catalog.forEach((product) => {
      newItems[product.code] = {
        quantity: items[product.code]?.quantity || 1,
        active: true,
      }
    })
    setItems(newItems)
  }, [catalog, items])

  // Limpiar todo
  const clearAll = useCallback(() => {
    setItems({})
  }, [])

  // Calcular totales
  const totals = useMemo((): Totals => {
    let total = 0
    let points = 0
    let activeProducts = 0
    let totalPieces = 0

    catalog.forEach((product) => {
      const item = items[product.code]
      if (item?.active && item.quantity > 0) {
        const unitPrice = calcUnitPrice(product, clientType)
        total += unitPrice * item.quantity
        points += product.points * item.quantity
        activeProducts += 1
        totalPieces += item.quantity
      }
    })

    return { total, points, activeProducts, totalPieces }
  }, [items, clientType, catalog, calcUnitPrice])

  // Copiar cotización al portapapeles
  const copyQuote = useCallback(async () => {
    const activeItems = catalog
      .filter((product) => items[product.code]?.active && items[product.code]?.quantity > 0)
      .map((product) => {
        const item = items[product.code]
        const unitPrice = calcUnitPrice(product, clientType)
        const subtotal = unitPrice * item.quantity
        return `${product.code} (${product.name}) x ${item.quantity} = $${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`
      })

    const clientTypeLabel =
      clientType === "inversionista"
        ? "Inversionista (-40%)"
        : clientType === "consumidor"
          ? "Consumidor (-30%)"
          : "Público"

    const quoteText = [
      "=== COTIZACIÓN ADVANCED N. ===",
      `Tipo de Cliente: ${clientTypeLabel}`,
      "",
      ...activeItems,
      "",
      `TOTAL: $${totals.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`,
      `PUNTOS: ${totals.points}`,
      `PRODUCTOS: ${totals.activeProducts}`,
      `PIEZAS: ${totals.totalPieces}`,
    ].join("\n")

    try {
      await navigator.clipboard.writeText(quoteText)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
    }
  }, [items, clientType, catalog, calcUnitPrice, totals])

  // Exportar CSV
  const exportCSV = useCallback(() => {
    const activeItems = catalog
      .filter((product) => items[product.code]?.active && items[product.code]?.quantity > 0)
      .map((product) => {
        const item = items[product.code]
        const unitPrice = calcUnitPrice(product, clientType)
        return {
          codigo: product.code,
          nombre: product.name,
          cantidad: item.quantity,
          precioUnitario: unitPrice,
          subtotal: unitPrice * item.quantity,
          puntos: product.points * item.quantity,
        }
      })

    const clientTypeLabel =
      clientType === "inversionista"
        ? "Inversionista (-40%)"
        : clientType === "consumidor"
          ? "Consumidor (-30%)"
          : "Público"

    // Crear contenido CSV
    const csvContent = [
      // Información del cliente
      `Cliente,${clientName || "Sin especificar"}`,
      `Tipo de Cliente,${clientTypeLabel}`,
      `Fecha,${new Date().toLocaleDateString("es-MX")}`,
      "",
      // Encabezados de productos
      "Código,Nombre,Cantidad,Precio Unitario,Subtotal,Puntos",
      // Productos
      ...activeItems.map(
        (item) =>
          `${item.codigo},${item.nombre},${item.cantidad},${item.precioUnitario.toFixed(2)},${item.subtotal.toFixed(2)},${item.puntos}`,
      ),
      "",
      // Totales
      `TOTAL,,,,$${totals.total.toFixed(2)},${totals.points}`,
      `PRODUCTOS ACTIVOS,,,,${totals.activeProducts},`,
      `PIEZAS TOTALES,,,,${totals.totalPieces},`,
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cotizacion-${clientName ? clientName.replace(/\s+/g, "-") : "cliente"}-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [items, clientType, clientName, catalog, calcUnitPrice, totals])

  return {
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
    calcUnitPrice,
  }
}
