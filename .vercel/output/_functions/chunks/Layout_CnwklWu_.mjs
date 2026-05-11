import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { p as createRenderInstruction, l as renderComponent, r as renderTemplate, h as addAttribute, q as renderSlot, v as renderHead } from './entrypoint_B7dm8yGT.mjs';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const API_URL = "https://api.katalog.batik.gooproper.id/api";
async function apiFetch(endpoint, options) {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  const isMultipart = options?.body instanceof FormData;
  if (isMultipart) {
    delete headers["Content-Type"];
  }
  const mergedHeaders = {
    ...headers,
    ...options?.headers
  };
  const url = `${API_URL}/${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: mergedHeaders
  });
  const text = await res.text();
  if (!res.ok) {
    let message = `HTTP Error ${res.status}: ${res.statusText}`;
    try {
      const errBody = JSON.parse(text);
      if (errBody.message) message = errBody.message;
    } catch (e) {
    }
    throw new Error(message);
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("DEBUG: Server returned non-JSON response:", text.slice(0, 1e3));
    throw new Error(`Respon server bukan JSON yang valid (kemungkinan HTML/Error Backend). Teks awal: ${text.slice(0, 150)}...`);
  }
  if (endpoint.startsWith("types")) {
    const rawData = data?.data || data;
    if (Array.isArray(rawData)) {
      const flatten = (items) => {
        let flat = [];
        for (const item of items) {
          const { children, ...rest } = item;
          flat.push(rest);
          if (children && Array.isArray(children)) {
            flat = flat.concat(flatten(children));
          }
        }
        return flat;
      };
      const flatList = flatten(rawData);
      return data?.data ? { ...data, data: flatList } : flatList;
    }
  }
  return data;
}
async function uploadToLaravel(file, folder) {
  const formData = new FormData();
  formData.append("image", file);
  if (folder) {
    formData.append("folder", folder);
  }
  const url = `${API_URL}/upload`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json"
    },
    body: formData
  });
  const text = await res.text();
  if (!res.ok) {
    let message = `Upload gagal dengan status ${res.status}`;
    try {
      const errBody = JSON.parse(text);
      if (errBody.message) message = errBody.message;
    } catch (e) {
    }
    throw new Error(message);
  }
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error("DEBUG: Upload endpoint returned non-JSON:", text.slice(0, 1e3));
    throw new Error(`Upload gagal: Respon server bukan JSON. Teks awal: ${text.slice(0, 150)}...`);
  }
  return json.url;
}

const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index$1;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-speed-insights", "vercel-speed-insights", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/node_modules/@vercel/speed-insights/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/node_modules/@vercel/speed-insights/dist/astro/index.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  let settings = { site_name: "Batik Nusantara" };
  try {
    const res = await apiFetch("settings");
    const data = res?.data || res;
    if (data) settings = data;
  } catch (e) {
    console.error("Settings fetch error:", e.message);
  }
  const whatsappNumber = settings.contact_whatsapp ? settings.contact_whatsapp.toString().replace(/^0/, "62").replace(/\D/g, "") : "";
  const rawAddress = settings.address || "";
  const addressBlocks = rawAddress.split(/\r?\n\s*\r?\n/).filter((block) => block.trim().length > 0);
  const formattedAddresses = addressBlocks.map((block) => {
    const lines = block.trim().split(/\r?\n/);
    const city = lines[0].trim();
    const branches = lines.slice(1).map((l) => {
      const raw = l.trim().replace(/^[•\-\*]\s?/, "");
      const urlMatch = raw.match(/https?:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(raw + " " + city)}`;
      const text = raw.replace(/https?:\/\/[^\s]+/, "").trim();
      return { text, url };
    }).filter((b) => b.text.length > 0);
    return { city, branches };
  });
  console.log("DEBUG: Batik Offline Parsing v4", {
    rawLength: rawAddress.length,
    blocksFound: addressBlocks.length,
    formattedCount: formattedAddresses.length
  });
  const nameParts = settings.site_name.split(" ");
  const firstWord = nameParts[0];
  const restWords = nameParts.slice(1).join(" ");
  const isAdmin = Astro2.cookies.get("admin_session")?.value === "authenticated";
  return renderTemplate(_a || (_a = __template(['<html lang="id"> <head><meta charset="UTF-8"><meta name="description" content="Marketplace Batik Eksklusif - Modern & Minimalist"><meta name="viewport" content="width=device-width"><meta name="generator"', '><link rel="icon"', '><link rel="shortcut icon"', "><title>", " | ", "</title>", '</head> <body style="scroll-behavior: smooth;"> <header id="main-header" style="position: absolute; top: 0; left: 0; right: 0; z-index: 100; transition: var(--transition); padding: 1.2rem 0;"> <nav class="container" style="display: flex; justify-content: space-between; align-items: center;"> <div class="logo"> <a href="/" style="display: flex; align-items: center; gap: 0.8rem;"> ', ' </a> </div> <!-- Desktop Navigation --> <ul style="display: flex; gap: var(--spacing-lg); list-style: none;" class="text-uppercase nav-links hide-mobile"> <li><a href="/products" style="font-weight: 500; color: rgba(255,255,255,0.8);">Katalog</a></li> <li> <a href="/about" style="font-weight: 500; color: rgba(255,255,255,0.8);">Tentang</a> </li> ', ' </ul> <!-- Mobile Menu Toggle --> <button id="mobile-menu-toggle" class="show-mobile" style="background: none; border: none; cursor: pointer; padding: var(--spacing-sm); z-index: 1001;"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path id="menu-icon-top" d="M4 6H20" stroke="white" stroke-width="2" stroke-linecap="round" style="transition: var(--transition);"></path> <path id="menu-icon-mid" d="M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round" style="transition: var(--transition);"></path> <path id="menu-icon-bot" d="M4 18H20" stroke="white" stroke-width="2" stroke-linecap="round" style="transition: var(--transition);"></path> </svg> </button> </nav> <!-- Mobile Menu Overlay --> <div id="mobile-menu" class="show-mobile" style="position: fixed; top: 0; left: 0; width: 100%; height: 100dvh; background: var(--color-bg); z-index: 1000; transform: translateY(-100%); transition: transform 0.6s cubic-bezier(0.85, 0, 0.15, 1); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: var(--spacing-xl); padding: var(--spacing-2xl);"> <ul style="list-style: none; text-align: center; display: flex; flex-direction: column; gap: var(--spacing-lg);" class="text-uppercase"> <li><a href="/" style="font-size: 1.5rem; font-weight: 500; color: var(--color-text);">Beranda</a></li> <li><a href="/products" style="font-size: 1.5rem; font-weight: 500; color: var(--color-text);">Katalog</a></li> <li> <a href="/about" style="font-size: 1.5rem; font-weight: 500; color: var(--color-text);">Tentang Kami</a> </li> ', ' </ul> <div style="margin-top: var(--spacing-xl); text-align: center; opacity: 0.6;"> <p style="font-size: 0.8rem; margin-bottom: var(--spacing-sm);">', '</p> <div style="display: flex; gap: var(--spacing-md); justify-content: center;"> ', " ", " </div> </div> </div> </header> <main> ", ' </main> <!-- Floating WhatsApp Button --> <div class="fixed-contact-trigger" style="position: fixed; bottom: 30px; right: 30px; z-index: 999; animation: wa-fade-in 1s ease-out forwards; opacity: 0;"> <a', ` target="_blank" rel="noopener noreferrer" class="wa-floating-btn" style="display: flex; align-items: center; justify-content: center; width: 62px; height: 62px; background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 50%; box-shadow: 0 15px 45px rgba(0,0,0,0.12); transition: 0.4s cubic-bezier(0.2, 1, 0.3, 1); text-decoration: none; position: relative;" onmouseover="this.style.transform='translateY(-5px) scale(1.05)'; this.style.boxShadow='0 20px 55px rgba(0,0,0,0.2)'; document.getElementById('wa-tooltip').style.opacity='1'; document.getElementById('wa-tooltip').style.transform='translateX(-20px)';" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 15px 45px rgba(0,0,0,0.12)'; document.getElementById('wa-tooltip').style.opacity='0'; document.getElementById('wa-tooltip').style.transform='translateX(0)';"> <!-- Tooltip Label --> <span id="wa-tooltip" style="position: absolute; right: 75px; background: #111; color: white; padding: 12px 22px; border-radius: 30px; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; white-space: nowrap; pointer-events: none; opacity: 0; transform: translateX(0); transition: 0.4s cubic-bezier(0.2, 1, 0.3, 1); box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
Klik untuk Chat
</span> <!-- WA Icon (Official Brand Logo SVG) --> <svg width="34" height="34" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg"> <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.412h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.883-9.885 9.883m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path> </svg> <!-- Status Pulse --> <div style="position: absolute; top: 2px; right: 2px; width: 14px; height: 14px; background: #25D366; border: 2px solid #fff; border-radius: 50%;"> <div style="position: absolute; width: 100%; height: 100%; background: #25D366; border-radius: 50%; animation: wa-pulse 2s infinite; opacity: 0.5;"></div> </div> </a> </div>  <footer style="background: #0a0a0a; color: white; padding: var(--spacing-2xl) 0 var(--spacing-xl) 0; border-top: 1px solid rgba(255,255,255,0.05);"> <div class="container"> <!-- Grand Logo Section --> <div style="text-align: center; margin-bottom: var(--spacing-2xl); border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: var(--spacing-2xl);"> <a href="/" style="display: inline-block; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"> `, ' <p class="text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.6em; opacity: 0.3; margin-top: 1rem;">Eksklusivitas Warisan Nusantara</p> </a> </div> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-xl); margin-bottom: var(--spacing-xl);"> <!-- Brand Info --> <div> <h4 class="text-uppercase" style="font-size: 0.75rem; margin-bottom: var(--spacing-lg); letter-spacing: 1px; color: var(--color-accent-light);">Visi Kami</h4> <p style="font-size: 0.85rem; opacity: 0.5; line-height: 1.8; max-width: 280px; font-weight: 300;">\nMenghidupkan kembali filosofi luhur di balik setiap helai kain batik melalui kurasi desain modern yang relevan bagi gaya hidup masa kini.\n</p> </div> <!-- Location --> <div style="grid-column: span 1;"> <h4 class="text-uppercase" style="font-size: 0.75rem; margin-bottom: var(--spacing-lg); letter-spacing: 1px; color: var(--color-accent-light);">Butik Offline</h4> ', ' </div> <!-- Contact --> <div> <h4 class="text-uppercase" style="font-size: 0.75rem; margin-bottom: var(--spacing-lg); letter-spacing: 1px; color: var(--color-accent-light);">Layanan Admin</h4> <ul style="list-style: none; padding: 0;"> ', ' <li><a href="/about" style="font-size: 0.85rem; color: white; opacity: 0.7;">Tentang Kami</a></li> <li><a href="/products" style="font-size: 0.85rem; color: white; opacity: 0.7;">Koleksi Terbaru</a></li> </ul> </div> <!-- Channels --> <div> <h4 class="text-uppercase" style="font-size: 0.75rem; margin-bottom: var(--spacing-lg); letter-spacing: 1px; color: var(--color-accent-light);">Kunjungi Kami</h4> <div style="display: flex; flex-direction: column; gap: 0.5rem;"> ', " ", " ", " ", ' </div> </div> </div> <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: var(--spacing-xl); text-align: center; position: relative;"> <p class="text-uppercase opacity-30" style="font-size: 0.65rem; letter-spacing: 2px;">\n&copy; 2026 ', ". All Rights Reserved.\n</p> </div> </div> </footer> <script>\n			// Centralized Scroll & Animation Logic\n			const header = document.getElementById('main-header');\n			const mobileMenu = document.getElementById('mobile-menu');\n			const mobileMenuToggle = document.getElementById('mobile-menu-toggle');\n			const menuIconTop = document.getElementById('menu-icon-top');\n			const menuIconMid = document.getElementById('menu-icon-mid');\n			const menuIconBot = document.getElementById('menu-icon-bot');\n			const logoText = document.getElementById('logo-text');\n			\n			let isMenuOpen = false;\n\n			const toggleMenu = () => {\n				isMenuOpen = !isMenuOpen;\n				mobileMenu.style.transform = isMenuOpen ? 'translateY(0)' : 'translateY(-100%)';\n				document.body.classList.toggle('mobile-menu-open', isMenuOpen);\n				\n				// Animate Hamburger to X\n				if (isMenuOpen) {\n					menuIconTop.setAttribute('d', 'M6 18L18 6');\n					menuIconMid.setAttribute('d', 'M6 6L18 18');\n					menuIconBot.setAttribute('d', 'M6 6L18 18');\n					menuIconTop.setAttribute('stroke', 'var(--color-text)');\n					menuIconMid.setAttribute('stroke', 'var(--color-text)');\n					menuIconBot.setAttribute('stroke', 'var(--color-text)');\n				} else {\n					menuIconTop.setAttribute('d', 'M4 6H20');\n					menuIconMid.setAttribute('d', 'M4 12H20');\n					menuIconBot.setAttribute('d', 'M4 18H20');\n					updateHeaderColors();\n				}\n			};\n\n			const updateHeaderColors = () => {\n				const isGlass = window.scrollY > 50;\n				const color = isGlass ? 'var(--color-text)' : 'white';\n				\n				if (!isMenuOpen) {\n					menuIconTop.setAttribute('stroke', color);\n					menuIconMid.setAttribute('stroke', color);\n					menuIconBot.setAttribute('stroke', color);\n				}\n				if (logoText) logoText.style.color = color;\n			};\n\n			const handleHeader = () => {\n				if (window.scrollY > 50) {\n					header.classList.add('glass-header');\n					header.style.position = 'fixed';\n				} else {\n					header.classList.remove('glass-header');\n					header.style.position = 'absolute';\n				}\n				updateHeaderColors();\n			};\n\n			mobileMenuToggle.addEventListener('click', toggleMenu);\n\n			const observerOptions = {\n				threshold: 0.1,\n				rootMargin: '0px 0px -50px 0px'\n			};\n\n			const revealObserver = new IntersectionObserver((entries) => {\n				entries.forEach(entry => {\n					if (entry.isIntersecting) {\n						const delay = entry.target.getAttribute('data-delay') || 0;\n						setTimeout(() => {\n							entry.target.classList.add('active');\n						}, delay);\n						revealObserver.unobserve(entry.target);\n					}\n				});\n			}, observerOptions);\n\n			// Init\n			window.addEventListener('scroll', handleHeader);\n			document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObserver.observe(el));\n			handleHeader(); // Initial check\n		<\/script> ", " ", " </body></html>"])), addAttribute(Astro2.generator, "content"), addAttribute(`${settings.logo_url || "/favicon.png"}?v=1774431418`, "href"), addAttribute(`${settings.logo_url || "/favicon.png"}?v=1774431418`, "href"), title, settings.site_name, renderHead(), settings.logo_url ? renderTemplate`<img${addAttribute(settings.logo_url, "src")}${addAttribute(settings.site_name, "alt")} style="height: 80px; width: auto;">` : renderTemplate`<span id="logo-text" style="font-family: 'Playfair Display', serif; font-size: 2.5rem; letter-spacing: 1px; font-weight: 500; color: white;"> ${firstWord} <span style="font-style: italic; color: var(--color-accent-light);">${restWords}</span> </span>`, isAdmin && renderTemplate`<li> <a href="/buka-toko" style="opacity: 0.3; font-size: 0.6rem; color: white;">Admin</a> </li>`, isAdmin && renderTemplate`<li> <a href="/buka-toko" style="opacity: 0.5; font-size: 0.8rem; color: var(--color-text);">Admin Panel</a> </li>`, settings.site_name, settings.url_instagram && renderTemplate`<a${addAttribute(settings.url_instagram, "href")} style="font-size: 0.7rem;">IG</a>`, settings.url_whatsapp && renderTemplate`<a${addAttribute(`https://wa.me/${settings.url_whatsapp}`, "href")} style="font-size: 0.7rem;">WA</a>`, renderSlot($$result, $$slots["default"]), addAttribute(`https://wa.me/${whatsappNumber}`, "href"), settings.logo_url ? renderTemplate`<img${addAttribute(settings.logo_url, "src")}${addAttribute(settings.site_name, "alt")} style="height: 160px; width: auto; filter: drop-shadow(0 0 30px rgba(255,255,255,0.1));">` : renderTemplate`<span style="font-family: 'Playfair Display', serif; font-size: clamp(3rem, 12vw, 6.5rem); letter-spacing: -0.02em; color: white; display: block; line-height: 0.9; margin-bottom: 0.5rem;"> ${firstWord} <span style="font-style: italic; color: var(--color-accent-light); opacity: 0.9;">${restWords}</span> </span>`, formattedAddresses.length > 0 ? renderTemplate`<div style="display: flex; flex-direction: column; gap: 1.5rem;"> ${formattedAddresses.map((group) => renderTemplate`<div> <p style="font-size: 0.7rem; font-weight: 700; color: var(--color-accent-light); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.6rem; border-left: 2px solid var(--color-accent); padding-left: 10px;"> ${group.city} </p> <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.6rem;"> ${group.branches.map((branch) => renderTemplate`<li style="font-size: 0.8rem; opacity: 0.6; line-height: 1.4; font-weight: 300; position: relative; padding-left: 15px; transition: all 0.3s;"> <span style="position: absolute; left: 0; top: 8px; width: 4px; height: 1px; background: rgba(255,255,255,0.3);"></span> <a${addAttribute(branch.url, "href")} target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: none; transition: all 0.3s;" onmouseover="this.parentElement.style.opacity=1; this.style.color='white'" onmouseout="this.parentElement.style.opacity=0.6; this.style.color='inherit'"> ${branch.text} </a> </li>`)} </ul> </div>`)} </div>` : renderTemplate`<p style="font-size: 0.85rem; opacity: 0.7; line-height: 1.8;"> ${settings.address || "Alamat belum diatur di dashboard admin."} </p>`, settings.contact_whatsapp && renderTemplate`<li style="margin-bottom: 0.5rem;"> <a${addAttribute(`https://wa.me/${settings.contact_whatsapp}`, "href")} target="_blank" style="font-size: 0.85rem; color: white; opacity: 0.7; text-decoration: none; border-bottom: 1px solid transparent; transition: 0.3s;" onmouseover="this.style.opacity=1; this.style.borderBottomColor='white'" onmouseout="this.style.opacity=0.7; this.style.borderBottomColor='transparent'">WhatsApp: +${settings.contact_whatsapp}</a> </li>`, settings.url_tokopedia && renderTemplate`<a${addAttribute(settings.url_tokopedia, "href")} target="_blank" style="font-size: 0.85rem; color: white; opacity: 0.7;">Tokopedia</a>`, settings.url_shopee && renderTemplate`<a${addAttribute(settings.url_shopee, "href")} target="_blank" style="font-size: 0.85rem; color: white; opacity: 0.7;">Shopee</a>`, settings.url_instagram && renderTemplate`<a${addAttribute(settings.url_instagram, "href")} target="_blank" style="font-size: 0.85rem; color: white; opacity: 0.7;">Instagram</a>`, settings.url_tiktok && renderTemplate`<a${addAttribute(settings.url_tiktok, "href")} target="_blank" style="font-size: 0.85rem; color: white; opacity: 0.7;">TikTok</a>`, settings.site_name, renderComponent($$result, "Analytics", $$Index$1, {}), renderComponent($$result, "SpeedInsights", $$Index, {}));
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/layouts/Layout.astro", void 0);

export { $$Layout as $, apiFetch as a, uploadToLaravel as u };
