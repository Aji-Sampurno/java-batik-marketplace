/**
 * Helper untuk menyelaraskan / meng-alias nama outlet / counter / gudang.
 * Contoh: 
 * - "Gudang Buring" -> "Buring"
 * - "Outlet Gudang Buring" -> "Buring"
 */

// Map kustom untuk pengubahan nama outlet spesifik (case-insensitive key)
const OUTLET_ALIAS_MAP: Record<string, string> = {
  'fairr': 'Surabaya, Pasar Atom lt 2',
  'fair': 'Surabaya, Pasar Atom lt 2',
  'lt 3': 'Surabaya, Pasar Atom lt 3',
  'lt3': 'Surabaya, Pasar Atom lt 3',
  'jatex': 'Surabaya, Pasar Atom lt 4',
  'merr': 'Surabaya, Merr',
  'buring': 'Malang, Jl. Buring',
  'mog': 'Malang, MOG',
  'senopati': 'Jakarta, senopati',
  'pik': 'Jakarta, PIK',
  'aeon gc': 'Jakarta, Aeon Gc',
  'aeon tb': 'Jakarta, Aeon Tb',
  'ijen': 'Online',
  'mog 2': 'Malang, MOG lt 2',
  'gudang': 'Online',
};

/**
 * Mengembalikan nama alias outlet berdasarkan aturan mapping atau pembersihan kata kunci.
 */
export function getOutletAlias(rawName?: string | null): string {
  if (!rawName) return '';

  const trimmed = rawName.trim();
  const lower = trimmed.toLowerCase();

  // 1. Cek apakah ada mapping khusus di dictionary langsung
  if (OUTLET_ALIAS_MAP[lower]) {
    return OUTLET_ALIAS_MAP[lower];
  }

  // 2. Pembersihan otomatis kata "Gudang" / "Outlet" / "Counter" di awal kata
  let cleaned = trimmed
    .replace(/^(outlet|gudang|counter)\s+/i, '')
    .replace(/^(outlet|gudang|counter)\s+/i, '') // Hapus jika ada double prefix seperti "Outlet Gudang"
    .trim();

  // 3. Cek kembali di dictionary setelah dibersihkan prefix-nya
  const cleanedLower = cleaned.toLowerCase();
  if (OUTLET_ALIAS_MAP[cleanedLower]) {
    return OUTLET_ALIAS_MAP[cleanedLower];
  }

  return cleaned || trimmed;
}
