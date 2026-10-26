import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface GenerateMemberCardOptions {
  name?: string;
  phone: string;
  cardImagePath?: string;
  logoImagePath?: string;
}

/**
 * Standard Code 128 (Set B) Encoding Table
 * 107 symbols with their bar-space widths (Zero external dependencies)
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
 * Encode string into Code 128 binary sequence (1 = bar, 0 = space)
 */
function encodeCode128B(text: string): string {
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
 * Generate Vertical Barcode SVG Rectangles (Horizontal bars stacked vertically)
 */
function generateVerticalBarcodeSvg(text: string, startX: number, startY: number, totalHeight = 505, barWidth = 110): string {
  const bits = encodeCode128B(text);
  const moduleHeight = totalHeight / bits.length;
  let rects = '';
  let currentY = startY;
  let barRun = 0;

  for (let i = 0; i < bits.length; i++) {
    if (bits[i] === '1') {
      barRun++;
    } else {
      if (barRun > 0) {
        rects += `<rect x="${startX}" y="${currentY.toFixed(2)}" width="${barWidth}" height="${(barRun * moduleHeight).toFixed(2)}" fill="#000000" />\n`;
        currentY += barRun * moduleHeight;
        barRun = 0;
      }
      currentY += moduleHeight;
    }
  }

  if (barRun > 0) {
    rects += `<rect x="${startX}" y="${currentY.toFixed(2)}" width="${barWidth}" height="${(barRun * moduleHeight).toFixed(2)}" fill="#000000" />\n`;
  }

  return rects;
}

/**
 * Generator Gambar Kartu Member Java Batik (Metode B - Zero Dependencies)
 * Tidak membutuhkan library tambahan seperti bwip-js atau puppeteer.
 * Kompatibel 100% dengan hosting cPanel, Vercel, maupun VPS.
 */
export async function generateMemberCardImage({
  name = 'NO NAME',
  phone,
  cardImagePath,
  logoImagePath
}: GenerateMemberCardOptions): Promise<Buffer> {
  const W = 1200;
  const H = 686;

  // Resolusi lokasi aset
  const defaultCard = path.join(process.cwd(), 'public', 'images', 'membership', 'card.png');
  const defaultLogo = path.join(process.cwd(), 'public', 'images', 'membership', 'logo_card.png');

  const resolvedCardPath = cardImagePath || defaultCard;
  const resolvedLogoPath = logoImagePath || defaultLogo;

  if (!fs.existsSync(resolvedCardPath)) {
    throw new Error(`Aset template kartu tidak ditemukan di: ${resolvedCardPath}`);
  }
  if (!fs.existsSync(resolvedLogoPath)) {
    throw new Error(`Aset logo tidak ditemukan di: ${resolvedLogoPath}`);
  }

  // 1. Base card dengan rounded corners
  const roundedCornersMask = Buffer.from(`
    <svg width="${W}" height="${H}">
      <rect x="0" y="0" width="${W}" height="${H}" rx="36" ry="36" fill="#fff" />
    </svg>
  `);

  const baseCard = await sharp(resolvedCardPath)
    .resize(W, H)
    .composite([{ input: roundedCornersMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Resize logo Java Batik (~380px)
  const logoBuf = await sharp(resolvedLogoPath)
    .resize(380)
    .png()
    .toBuffer();

  // 3. Generate Vertical Barcode SVG (Pure SVG, 0 dependency)
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const barcodeValue = cleanPhone.startsWith('62') ? cleanPhone.slice(2) : cleanPhone;
  const barcodeSvgRects = generateVerticalBarcodeSvg(barcodeValue || '0000000000', 1005, 75, 505, 110);

  // 4. Koordinat & Elemen Desain
  const boxX = 95;
  const boxY = 405;
  const boxW = 875;
  const boxH = 162;
  const boxR = 26;

  const displayName = (name && name !== 'Prospek' && name !== 'Pelanggan WhatsApp') 
    ? name.toUpperCase() 
    : 'NO NAME';

  let nameFontSize = 48;
  if (displayName.length > 24) {
    nameFontSize = 28;
  } else if (displayName.length > 18) {
    nameFontSize = 34;
  } else if (displayName.length > 12) {
    nameFontSize = 40;
  }

  const svgOverlay = Buffer.from(`
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Shadow & Glow Filters -->
        <filter id="textShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.7" />
          <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#b89158" flood-opacity="0.6" />
        </filter>

        <filter id="boxShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000000" flood-opacity="0.3" />
          <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#b89158" flood-opacity="0.5" />
        </filter>
      </defs>

      <!-- Nama Pelanggan -->
      <text x="${boxX + 80}" y="${boxY - 24}" 
            font-family="'Playfair Display', Georgia, 'Times New Roman', serif" 
            font-size="${nameFontSize}" 
            font-weight="700" 
            letter-spacing="1.5"
            fill="#ffffff" 
            filter="url(#textShadow)">
        ${escapeXml(displayName)}
      </text>

      <!-- Kotak Nomor Member (Rounded Box Berbingkai Emas) -->
      <g filter="url(#boxShadow)">
        <rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="${boxR}" ry="${boxR}"
              fill="#f4ede5" 
              stroke="#b89158" 
              stroke-width="8" />
      </g>

      <!-- Label di Dalam Kotak -->
      <text x="${boxX + 42}" y="${boxY + 54}" 
            font-family="'Special Elite', 'Courier New', monospace" 
            font-size="26" 
            font-weight="900" 
            letter-spacing="1.5"
            fill="#404040">
        NUMBER MEMBER :
      </text>

      <!-- Nomor Member (Besar & Tebal) -->
      <text x="${boxX + boxW - 48}" y="${boxY + boxH - 36}" 
            text-anchor="end"
            font-family="'Special Elite', 'Courier New', monospace" 
            font-size="46" 
            font-weight="900" 
            letter-spacing="2"
            fill="#000000">
        ${escapeXml(cleanPhone)}
      </text>

      <!-- Barcode Vertikal di Sisi Kanan -->
      <g id="verticalBarcode">
        ${barcodeSvgRects}
      </g>

      <!-- Ikon & Handle Instagram -->
      <g transform="translate(${W - 405}, ${H - 68})">
        <rect x="0" y="0" width="38" height="38" rx="11" ry="11" fill="none" stroke="#ffffff" stroke-width="3.2" />
        <circle cx="19" cy="19" r="8.5" fill="none" stroke="#ffffff" stroke-width="3.2" />
        <circle cx="28" cy="9.5" r="2" fill="#ffffff" />

        <text x="52" y="28" 
              font-family="'Playfair Display', Georgia, 'Times New Roman', serif" 
              font-size="25" 
              font-weight="bold" 
              letter-spacing="1.2"
              fill="#ffffff">
          @javabatik.gallery
        </text>
      </g>

      <!-- Border Halus Tepi Kartu -->
      <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="36" ry="36" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
    </svg>
  `);

  // 5. Composite seluruh elemen (Sharp saja tanpa dependency lain)
  return await sharp(baseCard)
    .composite([
      { input: logoBuf, top: 80, left: 545 },
      { input: svgOverlay, top: 0, left: 0 }
    ])
    .png({ quality: 90, compressionLevel: 8 })
    .toBuffer();
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
