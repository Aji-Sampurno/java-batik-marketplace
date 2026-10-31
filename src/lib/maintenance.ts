import fs from 'node:fs';
import path from 'node:path';

export interface MaintenanceConfig {
  enabled: boolean;
  title: string;
  message: string;
  estimatedEndTime?: string;
  contactWhatsapp?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  enabled: false,
  title: "Website Sedang Dalam Pemeliharaan",
  message: "Kami sedang melakukan pemeliharaan sistem dan sinkronisasi data produk Noir untuk meningkatkan kualitas layanan. Halaman akan segera kembali aktif.",
  estimatedEndTime: "",
  contactWhatsapp: "6281228222383",
  updatedAt: new Date().toISOString(),
  updatedBy: "system"
};

const MAINTENANCE_FILE = path.resolve(process.cwd(), 'maintenance.json');
const FLAG_FILE = path.resolve(process.cwd(), '.maintenance');

// Cache configuration for 2 seconds to minimize disk I/O on busy traffic
let cachedConfig: MaintenanceConfig | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 2000;

export function getMaintenanceStatus(): MaintenanceConfig {
  const now = Date.now();
  if (cachedConfig && now - lastCacheTime < CACHE_TTL) {
    return cachedConfig;
  }

  let config: MaintenanceConfig = { ...DEFAULT_MAINTENANCE_CONFIG };

  // 1. Read JSON config if available
  try {
    if (fs.existsSync(MAINTENANCE_FILE)) {
      const raw = fs.readFileSync(MAINTENANCE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      config = { ...DEFAULT_MAINTENANCE_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn('[Maintenance] Error reading maintenance.json:', e);
  }

  // 2. Override enabled if .maintenance flag file exists (CLI friendly: `touch .maintenance`)
  try {
    if (fs.existsSync(FLAG_FILE)) {
      config.enabled = true;
    }
  } catch (e) {}

  // 3. Override if env variable is set
  if (process.env.MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === '1') {
    config.enabled = true;
  }

  cachedConfig = config;
  lastCacheTime = now;
  return config;
}

export function setMaintenanceStatus(updates: Partial<MaintenanceConfig>): MaintenanceConfig {
  const current = getMaintenanceStatus();
  const nextConfig: MaintenanceConfig = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy: updates.updatedBy || 'admin'
  };

  // Write JSON
  try {
    fs.writeFileSync(MAINTENANCE_FILE, JSON.stringify(nextConfig, null, 2), 'utf-8');
  } catch (e) {
    console.error('[Maintenance] Error writing maintenance.json:', e);
  }

  // Sync flag file (.maintenance)
  try {
    if (nextConfig.enabled) {
      if (!fs.existsSync(FLAG_FILE)) {
        fs.writeFileSync(FLAG_FILE, '1', 'utf-8');
      }
    } else {
      if (fs.existsSync(FLAG_FILE)) {
        fs.unlinkSync(FLAG_FILE);
      }
    }
  } catch (e) {
    console.error('[Maintenance] Error toggling .maintenance flag file:', e);
  }

  // Invalidate cache immediately
  cachedConfig = nextConfig;
  lastCacheTime = Date.now();
  return nextConfig;
}

export function renderMaintenanceHtml(config: MaintenanceConfig): string {
  const waNumber = (config.contactWhatsapp || '6281228222383').replace(/\D/g, '');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Java Batik Gallery, saya ingin menanyakan perihal produk batik.')}`;

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.title} | Java Batik Gallery</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-bg: #fffbf7;
      --color-text: #1a1a1a;
      --color-muted: #666666;
      --color-accent: #8c7851;
      --color-accent-light: #c5b38a;
      --color-border: #eeedea;
      --color-card: #ffffff;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--color-bg);
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(197, 179, 138, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(140, 120, 81, 0.08) 0%, transparent 40%);
      color: var(--color-text);
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      line-height: 1.6;
    }
    .maintenance-card {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 20px;
      padding: 3rem 2.5rem;
      max-width: 580px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px -15px rgba(140, 120, 81, 0.12), 0 0 1px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }
    .maintenance-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light), var(--color-accent));
    }
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
      padding: 0.35rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 1.75rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #f59e0b;
      border-radius: 50%;
      box-shadow: 0 0 0 rgba(245, 158, 11, 0.6);
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }
    .brand-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--color-accent);
      margin-bottom: 1.25rem;
      letter-spacing: 1px;
    }
    .brand-title span {
      font-style: italic;
      color: var(--color-accent-light);
    }
    .icon-wrapper {
      width: 76px;
      height: 76px;
      margin: 0 auto 1.5rem auto;
      background: #fbf8f2;
      border: 1px solid #f0e6d6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-accent);
    }
    .icon-wrapper svg {
      animation: rotate-gear 12s linear infinite;
    }
    @keyframes rotate-gear {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 1.85rem;
      font-weight: 600;
      color: var(--color-text);
      line-height: 1.3;
      margin-bottom: 1rem;
    }
    p.description {
      color: var(--color-muted);
      font-size: 0.98rem;
      line-height: 1.7;
      margin-bottom: 1.75rem;
    }
    .eta-box {
      background: #f9f8f6;
      border: 1px dashed var(--color-accent-light);
      border-radius: 10px;
      padding: 0.85rem 1.25rem;
      font-size: 0.88rem;
      color: var(--color-accent);
      font-weight: 600;
      margin-bottom: 2rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 1.75rem;
    }
    @media (min-width: 480px) {
      .actions {
        flex-direction: row;
        justify-content: center;
      }
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 1.5rem;
      border-radius: 10px;
      font-size: 0.92rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.25s ease;
      cursor: pointer;
      border: none;
    }
    .btn-wa {
      background: #25D366;
      color: white;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
    }
    .btn-wa:hover {
      background: #20bd5a;
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(37, 211, 102, 0.35);
    }
    .btn-refresh {
      background: white;
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }
    .btn-refresh:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
      background: #fdfcfb;
    }
    .live-status {
      font-size: 0.8rem;
      color: #888888;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      margin-top: 1rem;
    }
    .footer-note {
      margin-top: 2rem;
      font-size: 0.78rem;
      color: #999999;
    }
    .footer-note a {
      color: #999999;
      text-decoration: none;
    }
    .footer-note a:hover {
      color: var(--color-accent);
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="maintenance-card">
    <div class="brand-title">JAVA BATIK <span>GALLERY</span></div>
    
    <div class="badge-pill">
      <span class="pulse-dot"></span>
      <span>Pemeliharaan Sistem Sedang Berlangsung</span>
    </div>

    <div class="icon-wrapper">
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </div>

    <h1>${escapeHtml(config.title)}</h1>
    <p class="description">${escapeHtml(config.message)}</p>

    ${config.estimatedEndTime ? `
      <div class="eta-box">
        <span>⏱️ Estimasi Selesai:</span>
        <span>${escapeHtml(config.estimatedEndTime)}</span>
      </div>
    ` : ''}

    <div class="actions">
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-wa">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
        </svg>
        <span>Hubungi CS WhatsApp</span>
      </a>
      <button type="button" onclick="checkStatus(true)" class="btn btn-refresh" id="refresh-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>Cek Status Sekarang</span>
      </button>
    </div>

    <div class="live-status">
      <span>Auto reload dalam <strong id="countdown">30</strong>s</span>
    </div>
  </div>

  <div class="footer-note">
    &copy; 2026 Java Batik Gallery. All rights reserved. &bull; <a href="/login">Login Admin</a>
  </div>

  <script>
    let timeLeft = 30;
    const countdownEl = document.getElementById('countdown');
    const refreshBtn = document.getElementById('refresh-btn');

    async function checkStatus(isManual = false) {
      if (isManual && refreshBtn) {
        refreshBtn.innerHTML = 'Memeriksa...';
        refreshBtn.disabled = true;
      }

      try {
        const res = await fetch('/api/maintenance', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!data.maintenance?.enabled) {
            // Maintenance finished! Reload to original requested URL
            window.location.reload();
            return;
          }
        }
      } catch (e) {
        // Still error or offline
      }

      if (isManual) {
        setTimeout(() => {
          if (refreshBtn) {
            refreshBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg> <span>Cek Status Sekarang</span>';
            refreshBtn.disabled = false;
          }
          timeLeft = 30;
        }, 500);
      }
    }

    setInterval(() => {
      timeLeft--;
      if (countdownEl) countdownEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        timeLeft = 30;
        checkStatus(false);
      }
    }, 1000);
  </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

