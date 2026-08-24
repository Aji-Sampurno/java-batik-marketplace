/**
 * Helper untuk menyelaraskan / meng-alias nama outlet / counter / gudang.
 * Contoh: 
 * - "Gudang Buring" -> "Buring"
 * - "Outlet Gudang Buring" -> "Buring"
 */

// Map kustom untuk pengubahan nama outlet spesifik (case-insensitive key)
export const OUTLET_ALIAS_MAP: Record<string, string> = {
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

// Daftar unik nama outlet resmi untuk filter katalog
export const KNOWN_OUTLET_LIST: string[] = [
  'Surabaya, Pasar Atom lt 2',
  'Surabaya, Pasar Atom lt 3',
  'Surabaya, Pasar Atom lt 4',
  'Surabaya, Merr',
  'Malang, MOG',
  'Malang, MOG lt 2',
  'Malang, Jl. Buring',
  'Jakarta, senopati',
  'Jakarta, PIK',
  'Jakarta, Aeon Gc',
  'Jakarta, Aeon Tb',
  'Online'
];

/**
 * Mengembalikan nama alias outlet berdasarkan aturan mapping atau pembersihan kata kunci.
 */
export function getOutletAlias(rawName?: string | null): string {
  if (!rawName) return '';

  const trimmed = rawName.trim();
  // Filter out numeric barcodes or counter codes (e.g. "792498", "2000000000000003")
  if (/^\d+$/.test(trimmed)) {
    return '';
  }

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

  // If after cleaning it's pure numbers, ignore
  if (/^\d+$/.test(cleaned)) {
    return '';
  }

  // 3. Cek kembali di dictionary setelah dibersihkan prefix-nya
  const cleanedLower = cleaned.toLowerCase();
  if (OUTLET_ALIAS_MAP[cleanedLower]) {
    return OUTLET_ALIAS_MAP[cleanedLower];
  }

  return cleaned || trimmed;
}

/**
 * Memeriksa apakah outlet sebuah produk cocok dengan filter yang dipilih
 */
export function matchOutlet(rawOutlet: string, filterVal: string): boolean {
  if (!rawOutlet || !filterVal) return false;
  const alias = getOutletAlias(rawOutlet).toLowerCase();
  const target = filterVal.toLowerCase().trim();
  return alias === target || alias.includes(target) || rawOutlet.toLowerCase().trim() === target;
}
