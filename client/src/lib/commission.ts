// Helper para obtener el % de comisión desde el backend
// Cachea cada resultado 30 s para evitar peticiones repetidas.

type CacheEntry = { rate: number; ts: number }
const cache = new Map<string, CacheEntry>()
const CACHE_MS = 30_000
const FALLBACK  = Number(process.env.NEXT_PUBLIC_COMMISSION_FALLBACK ?? 0.01)

export async function fetchCommission(variantId: string): Promise<number> {
  const hit = cache.get(variantId)
  const now = Date.now()

  if (hit && now - hit.ts < CACHE_MS) return hit.rate

  try {
    const res   = await fetch(`/api/public/commission?variantId=${variantId}`)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const { rate } = await res.json()
    const finalRate = typeof rate === "number" ? rate : FALLBACK
    cache.set(variantId, { rate: finalRate, ts: now })
    return finalRate
  } catch {
    return FALLBACK
  }
}
