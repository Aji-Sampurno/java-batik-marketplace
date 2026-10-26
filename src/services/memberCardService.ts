import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Standard Code 128 (Set B) Encoding Table
 * 107 symbols with their bar-space widths
 */
const CODE128_TABLE = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112'
];

/**
 * Encode string into Code 128 binary sequence (1 = black bar, 0 = white space)
 */
export function encodeCode128B(text: string): string {
  const codes: number[] = [104]; // Start B
  let checksum = 104;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i) - 32;
    const safeCode = (code >= 0 && code <= 95) ? code : 0;
    codes.push(safeCode);
    checksum += safeCode * (i + 1);
  }

  codes.push(checksum % 103);
  codes.push(106); // Stop symbol

  let pattern = '';
  for (const c of codes) {
    pattern += CODE128_TABLE[c] || CODE128_TABLE[0];
  }

  let bits = '';
  let isBar = true;
  for (const widthChar of pattern) {
    const w = parseInt(widthChar, 10);
    bits += (isBar ? '1' : '0').repeat(w);
    isBar = !isBar;
  }

  return bits;
}

/**
 * Generate SVG Elements for the Barcode
 */
export function generateBarcodeSvgElements(
  text: string, 
  startX: number, 
  startY: number, 
  barHeight = 65, 
  moduleWidth = 3
): { svgRects: string; totalWidth: number } {
  const bits = encodeCode128B(text);
  let svgRects = '';
  let currentX = startX;
  let barRun = 0;

  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      barRun++;
    } else {
      if (barRun > 0) {
        svgRects += `<rect x="${currentX}" y="${startY}" width="${barRun * moduleWidth}" height="${barHeight}" fill="#111827"/>`;
        currentX += barRun * moduleWidth;
        barRun = 0;
      }
      currentX += moduleWidth;
    }
  }

  if (barRun > 0) {
    svgRects += `<rect x="${currentX}" y="${startY}" width="${barRun * moduleWidth}" height="${barHeight}" fill="#111827"/>`;
    currentX += barRun * moduleWidth;
  }

  const totalWidth = currentX - startX;
  return { svgRects, totalWidth };
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

let cachedLogoBase64: string | null = null;
let cachedBatikBgBase64: string | null = null;

async function getAssetsBase64(): Promise<{ logoBase64: string; batikBgBase64: string }> {
  if (!cachedLogoBase64) {
    const candidateLogoPaths = [
      path.join(process.cwd(), 'public', 'images', 'java_batik_gold.png'),
      '/Users/ajisampurno/Project/GooProper/goo-proper-connect/public/images/java_batik_gold.png',
      path.join(process.cwd(), 'public', 'images', 'java_batik_transparent.png'),
      path.join(process.cwd(), 'public', 'images', 'Java Batik Ori.png')
    ];
    for (const p of candidateLogoPaths) {
      if (fs.existsSync(p)) {
        try {
          const trimmed = await sharp(p).trim().png().toBuffer();
          cachedLogoBase64 = trimmed.toString('base64');
          break;
        } catch (e) {
          try {
            cachedLogoBase64 = fs.readFileSync(p).toString('base64');
            break;
          } catch (err) {}
        }
      }
    }
  }

  if (!cachedBatikBgBase64) {
    const candidateBgPaths = [
      path.join(process.cwd(), 'public', 'images', 'batik_parang_rusak.jpg'),
      '/Users/ajisampurno/Project/GooProper/goo-proper-connect/public/images/batik_parang_rusak.jpg',
      path.join(process.cwd(), 'public', 'images', 'batik_sogan_real.jpg'),
      path.join(process.cwd(), 'public', 'images', 'batik_bg_4r.jpg')
    ];
    for (const p of candidateBgPaths) {
      if (fs.existsSync(p)) {
        try {
          cachedBatikBgBase64 = fs.readFileSync(p).toString('base64');
          break;
        } catch (e) {}
      }
    }
  }

  return {
    logoBase64: cachedLogoBase64 || '',
    batikBgBase64: cachedBatikBgBase64 || ''
  };
}

export interface MemberCardParams {
  name: string;
  phone: string;
  memberNumber?: string;
  businessName?: string;
  tier?: string;
  outlet?: string;
}

/**
 * Generate a clean, modern, and elegant Java Batik Member Card
 * Focused purely on the authentic Batik Parang Rusak canvas, seamless gold logo without white frame, customer name, and barcode.
 * Strictly eliminates 'KARTU MEMBER', 'NAMA MEMBER', 'STATUS AKTIF', and 'VIP MEMBER'.
 * Eliminates redundant 'JAVA BATIK' text since the official logo already states the brand.
 */
export async function generateMemberCardSvg({
  name,
  phone,
  memberNumber,
  businessName = 'JAVA BATIK'
}: MemberCardParams): Promise<string> {
  const { logoBase64, batikBgBase64 } = await getAssetsBase64();

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const displayNum = memberNumber || cleanPhone || '081234567890';
  const cleanName = escapeXml((name && name !== 'Prospek' && name !== 'Pelanggan WhatsApp') ? name.toUpperCase() : 'MEMBER SETIA');
  const safeBusinessName = escapeXml(businessName);
  
  // Card dimensions (Standard 16:10 high-res card ratio)
  const width = 860;
  const height = 540;

  // Format display number with 4-digit grouping
  const formattedDisplayNum = displayNum.replace(/(\d{4})/g, '$1 ').trim();

  // Integrated Bottom Barcode Dock
  const dockHeight = 120;
  const dockY = height - dockHeight; // 420

  const rawBits = encodeCode128B(displayNum);
  const moduleWidth = Math.max(2, Math.floor(520 / rawBits.length));
  const estimatedBarcodeWidth = rawBits.length * moduleWidth;
  const barcodeStartX = Math.round((width - estimatedBarcodeWidth) / 2);
  const barcodeStartY = dockY + 16;
  const barcodeHeight = 46;

  const { svgRects } = generateBarcodeSvgElements(displayNum, barcodeStartX, barcodeStartY, barcodeHeight, moduleWidth);

  // Logo tag: Top Left Seamless on Batik
  const logoSeamlessTag = logoBase64 
    ? `
    <g filter="url(#shadow)">
      <image href="data:image/png;base64,${logoBase64}" x="48" y="36" width="136" height="62" preserveAspectRatio="xMidYMid contain" />
    </g>`
    : `
    <g filter="url(#shadow)">
      <text x="48" y="75" font-family="'Cinzel', 'Georgia', serif" font-size="28" font-weight="900" fill="url(#goldFoil)">${safeBusinessName}</text>
    </g>`;

  // Authentic Batik Parang Rusak Pattern (Symbol of perseverance, nobility, and continuous progress)
  const batikBgTag = batikBgBase64
    ? `<image href="data:image/jpeg;base64,${batikBgBase64}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" opacity="0.88" />`
    : `<rect width="${width}" height="${height}" fill="#160802" />`;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Metallic Gold Foil Gradient -->
    <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#CA8A04" />
      <stop offset="25%" stop-color="#FEF08A" />
      <stop offset="50%" stop-color="#EAB308" />
      <stop offset="75%" stop-color="#FACC15" />
      <stop offset="100%" stop-color="#A16207" />
    </linearGradient>

    <!-- Warm Vignette for Contrast & Depth -->
    <radialGradient id="vignette" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.15" />
      <stop offset="60%" stop-color="#000000" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.80" />
    </radialGradient>

    <!-- General Drop Shadow -->
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.85" />
    </filter>

    <clipPath id="cardClip">
      <rect x="0" y="0" width="${width}" height="${height}" rx="28" ry="28" />
    </clipPath>
  </defs>

  <!-- Master Card with Rounded Corners -->
  <g clip-path="url(#cardClip)">
    <!-- Base Deep Sogan Ground -->
    <rect width="${width}" height="${height}" fill="#160802" />

    <!-- Authentic Traditional Batik Parang Rusak Pattern -->
    ${batikBgTag}

    <!-- Vignette Overlay for Depth & High Readability -->
    <rect width="${width}" height="${height}" fill="url(#vignette)" />

    <!-- Top Left: Logo (Natural Member Card Placement) -->
    ${logoSeamlessTag}

    <!-- Top Right: Tagline -->
    <g filter="url(#shadow)">
      <text x="${width - 48}" y="70" font-family="'Cinzel', 'Playfair Display', serif" font-size="13" font-weight="700" fill="url(#goldFoil)" text-anchor="end" letter-spacing="3.5">EXCLUSIVE BATIK &amp; GALLERY</text>
    </g>

    <!-- Cardholder Info: Classic Member Card Placement -->
    <g filter="url(#shadow)">
      <text x="48" y="240" font-family="'Montserrat', Arial, sans-serif" font-size="38" font-weight="800" fill="#FFFFFF" letter-spacing="3">${cleanName}</text>
      <text x="48" y="278" font-family="'Courier New', monospace" font-size="22" font-weight="700" fill="url(#goldFoil)" letter-spacing="4">${formattedDisplayNum}</text>
    </g>

    <!-- Bottom Dock: Integrated Barcode Section (Standard Digital Member Card Anatomy) -->
    <rect x="0" y="${dockY}" width="${width}" height="${dockHeight}" fill="#FFFFFF" />
    <rect x="0" y="${dockY}" width="${width}" height="3" fill="url(#goldFoil)" />
    <!-- Barcode Bars -->
    ${svgRects}
    <!-- Barcode Digits -->
    <text x="${width / 2}" y="${dockY + 94}" font-family="'Courier New', monospace, sans-serif" font-size="19" font-weight="800" fill="#111827" text-anchor="middle" letter-spacing="6">${formattedDisplayNum}</text>
  </g>

  <!-- Outer Double Luxury Gold Border -->
  <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="27" ry="27" fill="none" stroke="url(#goldFoil)" stroke-width="2.5" />
  <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="22" ry="22" fill="none" stroke="url(#goldFoil)" stroke-width="1" opacity="0.5" />
</svg>
`;
}

/**
 * Generate Member Card PNG Buffer directly using Sharp
 * Menggunakan template kartu merah terbaru dari images/membership/ (Metode B)
 */
export async function generateMemberCardPng(params: MemberCardParams): Promise<Buffer> {
  const { generateMemberCardImage } = await import('../utils/memberCardGenerator');
  return await generateMemberCardImage({
    name: params.name,
    phone: params.memberNumber || params.phone
  });
}

