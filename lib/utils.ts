import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como moneda mexicana
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Calcula el precio unitario según el tipo de cliente
 */
export function calcUnitPrice(pricePublic: number, clientType: string): number {
  const discounts = {
    publico: 0,
    consumidor: 0.3,
    inversionista: 0.4,
  }

  const discount = discounts[clientType as keyof typeof discounts] || 0
  return pricePublic * (1 - discount)
}

/**
 * Valida que un número sea entero y mayor o igual a 0
 */
export function validateQuantity(value: number): number {
  return Math.max(0, Math.floor(value))
}
