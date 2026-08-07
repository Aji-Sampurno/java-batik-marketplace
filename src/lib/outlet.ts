/**
 * Helper untuk menyelaraskan / meng-alias nama outlet / counter / gudang.
 * Contoh: 
 * - "Gudang Buring" -> "Buring"
 * - "Outlet Gudang Buring" -> "Buring"
 */

// Map kustom untuk pengubahan nama outlet spesifik (case-insensitive key)
const OUTLET_ALIAS_MAP: Record<string, string> = {
  // 'gudang buring': 'Buring',
  // 'outlet gudang buring': 'Buring',
  // Tambahkan daftar alias khusus lainnya di sini jika ada:
  // 'gudang malang': 'Malang',
  // 'counter sby': 'Surabaya',
};

/**
 * Mengembalikan nama alias outlet berdasarkan aturan mapping atau pembersihan kata kunci.
 */
export function getOutletAlias(rawName?: string | null): string {
  if (!rawName) return '';

  const trimmed = rawName.trim();
  const lower = trimmed.toLowerCase();

  // 1. Cek apakah ada mapping khusus di dictionary
  if (OUTLET_ALIAS_MAP[lower]) {
    return OUTLET_ALIAS_MAP[lower];
  }

  // 2. Pembersihan otomatis kata "Gudang" / "Outlet" / "Counter" di awal kata
  let cleaned = trimmed
    .replace(/^(outlet|gudang|counter)\s+/i, '')
    .replace(/^(outlet|gudang|counter)\s+/i, '') // Hapus jika ada double prefix seperti "Outlet Gudang"
    .trim();

  return cleaned || trimmed;
}
