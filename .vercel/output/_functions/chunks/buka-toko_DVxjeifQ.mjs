import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, n as defineScriptVars, h as addAttribute, o as Fragment, m as maybeRenderHead } from './entrypoint_B7dm8yGT.mjs';
import { a as apiFetch, u as uploadToLaravel, $ as $$Layout } from './Layout_CnwklWu_.mjs';
import { $ as $$DeleteConfirmModal } from './DeleteConfirmModal_qO62LaXG.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$BukaToko = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BukaToko;
  const session = Astro2.cookies.get("admin_session");
  if (session?.value !== "authenticated") {
    return Astro2.redirect("/login");
  }
  const { searchParams } = Astro2.url;
  if (searchParams.get("logout")) {
    Astro2.cookies.delete("admin_session");
    return Astro2.redirect("/login");
  }
  const adminSearchQuery = searchParams.get("q");
  let types = [];
  let motifs = [];
  let sizesData = [];
  let productsData = [];
  let settings = null;
  try {
    const tRes = await apiFetch("types");
    types = tRes?.data || tRes || [];
    const mRes = await apiFetch("motifs");
    motifs = mRes?.data || mRes || [];
    const szRes = await apiFetch("sizes");
    sizesData = szRes?.data || szRes || [];
    const pRes = await apiFetch("products?per_page=1000");
    productsData = pRes?.data || pRes || [];
    const sRes = await apiFetch("settings");
    settings = sRes?.data || sRes || { site_name: "Batik Nusantara" };
    if (adminSearchQuery) {
      const q = adminSearchQuery.toLowerCase().trim();
      const keywords = q.split(/\s+/).filter((kw) => kw.length > 0);
      productsData = productsData.filter((p) => {
        const productCategoryNames = p.product_categories?.map((pc) => pc.types?.name) || [];
        if (p.types?.name) productCategoryNames.push(p.types.name);
        const productMotifs = p.product_motifs?.map((pm) => pm.motifs?.name) || [];
        return keywords.every((kw) => {
          const nameMatch = p.name?.toLowerCase().includes(kw);
          const codeMatch = p.code?.toLowerCase().includes(kw);
          const motifMatch = productMotifs.some(
            (m) => m?.toLowerCase().includes(kw)
          );
          const categoryMatch = productCategoryNames.some(
            (c) => c?.toLowerCase().includes(kw)
          );
          return nameMatch || codeMatch || motifMatch || categoryMatch;
        });
      });
    }
  } catch (e) {
    console.error("API Fetch Error, using mock fallback:", e.message);
    const { products: mockProducts } = await import('./products_BUkfLFCk.mjs');
    const uniqueTypes = [...new Set(mockProducts.map((p) => p.type))];
    types = uniqueTypes.map((t) => ({ name: t, id: t }));
    const uniqueMotifs = [...new Set(mockProducts.map((p) => p.motif))];
    motifs = uniqueMotifs.map((m) => ({ name: m, id: m }));
    productsData = mockProducts.map((p) => ({
      ...p,
      types: { name: p.name, id: p.id },
      product_motifs: [{ motifs: { name: p.motif } }]
    }));
  }
  const buildCategoryTree = (list, parentId = null, depth = 0) => {
    let result = [];
    list.filter((item) => item.parent_id === parentId).forEach((item) => {
      result.push({ ...item, depth });
      const children = buildCategoryTree(list, item.id, depth + 1);
      result = result.concat(children);
    });
    return result;
  };
  const hierarchicalTypes = buildCategoryTree(types);
  let message = "";
  let isError = false;
  if (Astro2.request.method === "POST") {
    const contentType = Astro2.request.headers.get("content-type");
    if (contentType?.includes("form")) {
      try {
        const formData = await Astro2.request.formData();
        const action = formData.get("action");
        if (action === "add_size") {
          const name = formData.get("size_name");
          if (!name)
            return Astro2.redirect("/buka-toko?error=missing");
          await apiFetch("sizes", {
            method: "POST",
            body: JSON.stringify({ name })
          });
          return Astro2.redirect("/buka-toko?success=size");
        }
        if (action === "delete_size") {
          const id = formData.get("size_id");
          await apiFetch(`sizes/${id}`, { method: "DELETE" });
          return Astro2.redirect("/buka-toko?success=deleted");
        }
        if (action === "update_settings") {
          const site_name = formData.get("site_name");
          const address = formData.get("address");
          const contact_whatsapp = formData.get("contact_whatsapp");
          const url_instagram = formData.get("url_instagram");
          const url_tiktok = formData.get("url_tiktok");
          const url_tokopedia = formData.get("url_tokopedia");
          const url_shopee = formData.get("url_shopee");
          const logo_file = formData.get("logo_file");
          let logo_url = settings?.logo_url;
          if (logo_file && logo_file.size > 0) {
            logo_url = await uploadToLaravel(logo_file, "settings");
          }
          await apiFetch("settings", {
            method: "PUT",
            body: JSON.stringify({
              site_name,
              logo_url,
              address,
              contact_whatsapp,
              url_instagram,
              url_tiktok,
              url_tokopedia,
              url_shopee
            })
          });
          return Astro2.redirect("/buka-toko?success=settings");
        }
        if (action === "add_type") {
          const name = formData.get("name");
          const parent_id = formData.get("parent_id") || null;
          let category_level = 1;
          if (parent_id) {
            const parent = await apiFetch(`types/${parent_id}`);
            const parentData = parent?.data || parent;
            if (parentData) {
              category_level = (parentData.category_level || 1) + 1;
            }
          }
          if (category_level > 3) {
            throw new Error(
              "Maksimal hirarki kategori adalah 3 level."
            );
          }
          await apiFetch("types", {
            method: "POST",
            body: JSON.stringify({ name, parent_id, category_level })
          });
          return Astro2.redirect("/buka-toko?success=type");
        }
        if (action === "add_motif") {
          const name = formData.get("name");
          await apiFetch("motifs", {
            method: "POST",
            body: JSON.stringify({ name })
          });
          return Astro2.redirect("/buka-toko?success=motif");
        }
        if (action === "add_product") {
          return Astro2.redirect("/buka-toko/tambah-produk");
        }
        if (action === "toggle_status") {
          const id = formData.get("id");
          const current_status = formData.get("current_status") === "true";
          await apiFetch(`products/${id}`, {
            method: "PUT",
            body: JSON.stringify({ is_active: !current_status })
          });
          return Astro2.redirect("/buka-toko?success=status");
        }
        if (action === "delete_product") {
          const id = formData.get("id");
          await apiFetch(`products/${id}`, { method: "DELETE" });
          return Astro2.redirect("/buka-toko?success=delete");
        }
        if (action === "delete_type") {
          const id = formData.get("id");
          await apiFetch(`types/${id}`, { method: "DELETE" });
          return Astro2.redirect("/buka-toko?success=delete_type");
        }
        if (action === "delete_motif") {
          const id = formData.get("id");
          await apiFetch(`motifs/${id}`, { method: "DELETE" });
          return Astro2.redirect("/buka-toko?success=delete_motif");
        }
      } catch (e) {
        isError = true;
        message = "Gagal: " + e.message;
      }
    }
  }
  const success = Astro2.url.searchParams.get("success");
  if (success === "product") message = "Produk berhasil ditambahkan!";
  if (success === "type") message = "Jenis produk baru berhasil disimpan!";
  if (success === "motif") message = "Motif baru berhasil ditambahkan!";
  if (success === "settings") message = "Identitas website berhasil diperbarui!";
  if (success === "status") message = "Status visibilitas produk diperbarui!";
  if (success === "delete") message = "Produk berhasil dihapus!";
  if (success === "delete_type") message = "Jenis produk berhasil dihapus!";
  if (success === "delete_motif") message = "Motif berhasil dihapus!";
  if (success === "size") message = "Ukuran berhasil ditambahkan!";
  if (success === "deleted") message = "Data berhasil dihapus!";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Admin Panel - ${settings?.site_name || "Batik Nusantara"}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section style="padding: var(--spacing-xl) 0; min-height: 80vh;"> <div class="container"> <div class="admin-header"> <div style="display: flex; align-items: center; gap: var(--spacing-md);"> <div> <h1 class="text-uppercase" style="font-size: 1.2rem; margin: 0; font-weight: 600;"> ', ' Dashboard\n</h1> <p style="font-size: 0.8rem; opacity: 0.5;">\nKelola identitas dan katalog batik Anda.\n</p> </div> </div> <div style="display: flex; gap: var(--spacing-md); align-items: center;"> <a href="/" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6;">Lihat Toko</a> <button id="toggleTypesBtn" type="button" class="admin-toggle-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path> </svg> <span>Kelola Kategori</span> </button> <button id="toggleMotifsBtn" type="button" class="admin-toggle-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v19M5 8h14M5 16h14"></path> </svg> <span>Kelola Motif</span> </button> <button id="toggleSiteBtn" type="button" class="admin-toggle-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path> </svg> <span>Informasi Toko</span> </button> <button id="toggleSizesBtn" type="button" class="admin-toggle-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line> </svg> <span>Kelola Ukuran</span> </button> <a href="/buka-toko/pra-produk" class="admin-toggle-btn" style="background: var(--color-accent); border-color: var(--color-accent); color: white; text-decoration: none;"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> <span>Pra-Produk</span> </a> <a href="/buka-toko/promosi" class="admin-toggle-btn" style="background: #fffbeb; border-color: #fbbf24; color: #92400e; text-decoration: none;"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M12 2L2 7l10 5 10-5-10-5z"></path> <path d="M2 17l10 5 10-5"></path> <path d="M2 12l10 5 10-5"></path> </svg> <span>Kelola Promo</span> </a> <a href="?logout=true" style="padding: 0.6rem 1.2rem; background: #fff5f5; color: #ff4d4d; border: 1px solid #ff4d4d; font-size: 0.75rem; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Logout</a> </div> </div> <!-- Overview Stats --> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);"> <div class="glass" style="padding: var(--spacing-lg); border-radius: var(--radius-md); border-left: 4px solid var(--color-accent);"> <p class="text-uppercase opacity-50" style="font-size: 0.65rem;">\nTotal Produk\n</p> <h2 style="font-size: 2rem; margin: 0;"> ', ' <span style="font-size: 1rem; opacity: 0.4;">/ ', '</span> </h2> </div> <div class="glass" style="padding: var(--spacing-lg); border-radius: var(--radius-md); border-left: 4px solid #03ac0e;"> <p class="text-uppercase opacity-50" style="font-size: 0.65rem;">\nKategori Jenis\n</p> <h2 style="font-size: 2rem; margin: 0;"> ', ' </h2> </div> <div class="glass" style="padding: var(--spacing-lg); border-radius: var(--radius-md); border-left: 4px solid #3b82f6;"> <p class="text-uppercase opacity-50" style="font-size: 0.65rem;">\nTotal Motif\n</p> <h2 style="font-size: 2rem; margin: 0;"> ', " </h2> </div> </div> ", ' <div class="admin-main-grid"> <!-- Column 1: Forms --> <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);"> <div style="display: flex; gap: 0.5rem; margin-bottom: var(--spacing-sm); flex-wrap: wrap;"></div> <div id="typesContainer" style="display: none; margin-bottom: var(--spacing-md);"> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); width: 100%;"> <h3 style="font-size: 0.8rem; margin-bottom: 1rem; font-weight: 600;" class="text-uppercase">\nPengaturan Kategori\n</h3> <form method="POST" style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;"> <input type="hidden" name="action" value="add_type"> <div style="display: flex; flex-direction: column; gap: 0.5rem;"> <!-- Custom Searchable Select for Parent ID --> <div class="searchable-select" data-ss-type="parent"> <input type="hidden" name="parent_id" id="parent_id_input"> <input type="text" class="ss-input" placeholder="Pilih Induk Kategori (Opsional)..." readonly style="background: #fdfcfb; border-style: dashed;"> <div class="ss-dropdown"> <div class="ss-search-container"> <svg class="ss-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="text" class="ss-search" placeholder="Cari induk kategori..."> </div> <div class="ss-options"> <div class="ss-option" data-value=""> <span>Kategori Utama</span> <span class="lvl-badge lvl-1">Root</span> </div> ', ' </div> </div> </div> <div style="display: flex; gap: 0.5rem;"> <input name="name" type="text" required placeholder="Nama Kategori..." style="flex: 1; padding: 0.6rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem;"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.6rem 1rem; border: none; font-size: 0.7rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-sm);">TAMBAH</button> </div> </div> </form> <div style="max-height: 500px; overflow-y: auto; border-top: 1px solid #f3f4f6; padding-top: 1.5rem;"> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;"> <p class="text-uppercase opacity-50" style="font-size: 0.65rem; font-weight: 700; letter-spacing: 1.5px;">\nHierarchy Tree\n</p> <span style="font-size: 0.65rem; color: #9ca3af;">', ' Categories</span> </div> <div class="category-tree-wrapper"> ', " </div> ", ' </div> </div> </div> <div id="motifsContainer" style="display: none; margin-bottom: var(--spacing-md);"> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); width: 100%;"> <h3 style="font-size: 0.8rem; margin-bottom: 1rem; font-weight: 600;" class="text-uppercase">\nPengaturan Motif Batik\n</h3> <form method="POST" style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;"> <input type="hidden" name="action" value="add_motif"> <div style="display: flex; gap: 0.5rem;"> <input name="name" type="text" required placeholder="Tambah Motif..." style="flex: 1; padding: 0.6rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem;"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.6rem 1rem; border: none; font-size: 0.7rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-sm);">TAMBAH</button> </div> </form> <div style="max-height: 200px; overflow-y: auto; border-top: 1px solid #f0f0f0; padding-top: 0.8rem;"> <p class="text-uppercase opacity-50" style="font-size: 0.6rem; margin-bottom: 0.5rem;">\nKoleksi Motif\n</p> ', ' </div> </div> </div> <div id="siteContainer" style="display: none; margin-bottom: var(--spacing-md);"> <!-- Site Settings Management --> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-xl); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"> <h2 style="font-size: 1rem; margin-bottom: var(--spacing-lg); font-weight: 600;" class="text-uppercase">\nInformasi & Link Toko\n</h2> <form method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: var(--spacing-lg);"> <input type="hidden" name="action" value="update_settings"> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Nama Website</label> <input name="site_name" type="text" required', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Logo Website</label> <input name="logo_file" type="file" accept="image/*" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.75rem;"> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Alamat Toko Offline</label> <textarea name="address" rows="2" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);">', '</textarea> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">WhatsApp Admin</label> <input name="contact_whatsapp" type="text" placeholder="Contoh: 62812345678"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Instagram URL</label> <input name="url_instagram" type="text"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">TikTok URL</label> <input name="url_tiktok" type="text"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Tokopedia URL</label> <input name="url_tokopedia" type="text"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Shopee URL</label> <input name="url_shopee" type="text"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <button type="submit" style="background: var(--color-accent); color: white; padding: 1rem; border: none; text-transform: uppercase; letter-spacing: 2px; width: 100%; cursor: pointer; font-weight: 600; font-size: 0.8rem; border-radius: var(--radius-sm); margin-top: var(--spacing-md);">Update Konfigurasi Website</button> </form> </div> </div> <div id="sizesContainer" style="display: none; margin-bottom: var(--spacing-md);"> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); width: 100%;"> <h3 style="font-size: 0.8rem; margin-bottom: 1rem; font-weight: 600;" class="text-uppercase">\nPengaturan Ukuran Produk\n</h3> <form method="POST" style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;"> <input type="hidden" name="action" value="add_size"> <div style="display: flex; gap: 0.5rem;"> <input name="size_name" type="text" required placeholder="Tambah Ukuran (S, M, L, XL, dll)..." style="flex: 1; padding: 0.6rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem;"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.6rem 1rem; border: none; font-size: 0.7rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-sm);">TAMBAH</button> </div> </form> <div style="max-height: 200px; overflow-y: auto; border-top: 1px solid #f0f0f0; padding-top: 0.8rem;"> <p class="text-uppercase opacity-50" style="font-size: 0.6rem; margin-bottom: 0.5rem;">\nDaftar Ukuran Tersedia\n</p> <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem;"> ', " </div> ", ' </div> </div> </div> <!-- Form Product --> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"> <h2 style="font-size: 1rem; margin-bottom: var(--spacing-lg); font-weight: 600;" class="text-uppercase">\nTambah Produk Baru\n</h2> <form method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: var(--spacing-md);"> <input type="hidden" name="action" value="add_product"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Nama Produk</label> <input name="name" id="product_name_input" type="text" required placeholder="Kemeja Batik Parang" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kode SKU</label> <input name="code" id="product_sku_input" type="text" placeholder="BTK-001" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kode Barang (Auto-Name)</label> <input name="item_code" id="product_item_code_input" type="text" placeholder="001" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Harga (Rp)</label> <input type="text" class="currency-mask" data-hidden-id="product_price_input" required id="product_price_input_display" placeholder="450.000" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> <input type="hidden" name="price" id="product_price_input"> <div id="price_markup_preview" style="font-size: 0.65rem; color: #10b981; margin-top: 0.4rem; font-weight: 600; display: none;">\nHarga Coret: Rp <span id="markup_val">0</span> (Hemat Rp <span id="markup_pct">0</span>)\n</div> <input type="hidden" name="original_price" id="original_price_input"> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kategori Produk</label> <div class="searchable-select" data-ss-type="product-l1"> <input type="hidden" name="category_ids" id="l1_category_input"> <input type="text" class="ss-input" placeholder="Cari & Pilih Kategori Utama..." readonly style="background: #ffffff; border-style: solid;"> <div class="ss-dropdown"> <div class="ss-search-container"> <svg class="ss-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="text" class="ss-search" placeholder="Cari kategori..."> </div> <div class="ss-options"> ', ' </div> </div> </div> <div id="sub-category-checkboxes" class="cascading-container"></div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Motif (Multi-select)</label> <div class="motif-style-container" id="motif-grid"> ', ' </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Foto Produk (Bisa Pilih Banyak)</label> <input name="image_file" type="file" accept="image/*" multiple required style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: var(--radius-sm); background: #fcfcfc; font-size: 0.75rem;"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Ukuran & Variasi Harga</label> <p style="font-size: 0.7rem; color: var(--color-muted); margin-bottom: 1rem;">Centang ukuran yang tersedia, lalu isi harga khususnya jika berbeda.</p> <label id="sleeve_toggle_wrapper" style="display: none; align-items: center; gap: 0.5rem; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm); cursor: pointer; background: #fcfcfc; margin-bottom: 1rem;"> <input type="checkbox" id="toggle_sleeve_options_add"> <span style="font-size: 0.85rem; font-weight: 500;">Aktifkan Pilihan Lengan (Pendek & Panjang)</span> </label> <div style="display: flex; flex-direction: column; gap: 0.5rem; background: #fcfcfc; padding: 1rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> ', " ", ' </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Link Tokopedia (Opsional)</label> <input name="tokopedia_url" type="url" placeholder="https://www.tokopedia.com/..." style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Deskripsi Produk</label> <textarea name="description" rows="2" placeholder="Detail produk..." style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"></textarea> </div> <div style="margin-top: var(--spacing-sm);"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.8rem; border: none; text-transform: uppercase; letter-spacing: 2px; width: 100%; cursor: pointer; font-weight: 600; font-size: 0.75rem; border-radius: var(--radius-sm); transition: var(--transition);">Simpan Produk</button> </div> </form> </div> </div> <!-- List Column --> <div> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: 1rem;"> <h2 style="font-size: 1.1rem; font-weight: 600; margin: 0;">\nDaftar Produk Terdaftar\n</h2> <!-- Admin Search --> <form method="GET" style="position: relative; flex: 1; min-width: 200px; max-width: 400px;"> <input name="q" type="text"', ' placeholder="Cari nama, SKU, atau motif..." style="width: 100%; padding: 0.6rem 2.5rem 0.6rem 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem;"> <button type="submit" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; opacity: 0.4; cursor: pointer;"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line> </svg> </button> </form> <span class="text-uppercase opacity-50" style="font-size: 0.6rem;">', ' Items</span> </div> <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow-x: auto; box-shadow: var(--shadow-sm);"> <table style="width: 100%; border-collapse: collapse;"> <thead> <tr style="background: #f9f9f9; border-bottom: 1px solid var(--color-border); text-align: left;" class="text-uppercase"> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6;">Produk</th> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6;">Kategori</th> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6;">Harga</th> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6; text-align: center;">Status</th> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6; text-align: center;">Aksi</th> </tr> </thead> <tbody> ', " </tbody> </table> ", " </div> </div> </div> </div> </section>  ", " <script>(function(){", `
		function initSearchableSelect() {
			const selectContainers =
				document.querySelectorAll(".searchable-select");

			selectContainers.forEach((container) => {
				const input = container.querySelector(".ss-input");
				const hiddenInput = container.querySelector(
					'input[type="hidden"]',
				);
				const dropdown = container.querySelector(".ss-dropdown");
				const searchInput = container.querySelector(".ss-search");
				const options = container.querySelectorAll(".ss-option");
				const optionsContainer = container.querySelector(".ss-options");
				const ssType = container.getAttribute("data-ss-type");

				// Open/Close
				input.addEventListener("click", (e) => {
					e.stopPropagation();
					dropdown.classList.toggle("show");
					if (dropdown.classList.contains("show")) {
						searchInput.focus();
					}
				});

				// Search Logic
				searchInput.addEventListener("input", (e) => {
					const term = e.target.value.toLowerCase();
					let hasResults = false;

					options.forEach((opt) => {
						const text = opt.textContent.toLowerCase();
						if (text.includes(term)) {
							opt.style.display = "block";
							hasResults = true;
						} else {
							opt.style.display = "none";
						}
					});

					// Handle "No results"
					const noRes =
						optionsContainer.querySelector(".ss-no-results");
					if (!hasResults) {
						if (!noRes) {
							const div = document.createElement("div");
							div.className = "ss-no-results";
							div.textContent = "Kategori tidak ditemukan";
							optionsContainer.appendChild(div);
						}
					} else if (noRes) {
						noRes.remove();
					}
				});

				// Selection
				options.forEach((opt) => {
					opt.addEventListener("click", (e) => {
						e.stopPropagation();
						const val = opt.getAttribute("data-value");
						const text =
							opt.querySelector("span")?.textContent.trim() ||
							opt.textContent.trim();

						hiddenInput.value = val;
						input.value = text;

						options.forEach((o) => o.classList.remove("selected"));
						opt.classList.add("selected");

						dropdown.classList.remove("show");
						searchInput.value = "";
						options.forEach((o) => (o.style.display = "block"));

						// HYBRID CALLBACK: If this is Product Level 1, render checkboxes
						if (ssType === "product-l1") {
							renderSubCategoriesFromList([val]);
						}
					});
				});

				// Close when clicking outside
				document.addEventListener("click", (e) => {
					if (!container.contains(e.target)) {
						dropdown.classList.remove("show");
					}
				});
			});
		}

		function renderSubCategoriesFromList(parentIds) {
			const container = document.getElementById(
				"sub-category-checkboxes",
			);
			if (!container) return;

			if (parentIds.length === 0) {
				container.innerHTML = "";
				container.style.display = "none";
				return;
			}

			// Clear container
			container.innerHTML = "";
			const l2Children = hierarchicalTypes.filter((t) =>
				parentIds.includes(t.parent_id),
			);

			if (l2Children.length === 0) {
				container.style.display = "none";
				return;
			}

			container.style.display = "block";
			container.innerHTML = \`
				<div style="margin-top: 1rem;">
					<label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Jenis Produk (Level 2)</label>
					<div class="motif-style-container" id="l2-selection-row"></div>
				</div>
				<div id="l3-selection-area" style="display: none; margin-top: 1rem;">
					<label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Pilihan Detail (Level 3)</label>
					<div class="motif-style-container" id="l3-grid"></div>
				</div>
			\`;

			const l2Row = container.querySelector("#l2-selection-row");
			const l3Area = container.querySelector("#l3-selection-area");
			const l3Grid = container.querySelector("#l3-grid");

			function updateL3Selection() {
				const checkedL2s = Array.from(
					l2Row.querySelectorAll("input:checked"),
				);
				l3Grid.innerHTML = ""; // Clear previous L3s

				if (checkedL2s.length === 0) {
					l3Area.style.display = "none";
					updateName(); // Trigger update name when L2 is unchecked
					return;
				}

				let hasL3 = false;
				checkedL2s.forEach((l2) => {
					const l2Id = l2.getAttribute("data-id");
					const l3s = hierarchicalTypes.filter(
						(t) => String(t.parent_id) === String(l2Id),
					);
					if (l3s.length > 0) {
						hasL3 = true;
						l3s.forEach((cc) => {
							const label = document.createElement("label");
							label.className = "motif-style-label";
							label.innerHTML = \`
								<input type="checkbox" name="category_ids" value="\${cc.id}" data-id="\${cc.id}" data-parent="\${l2Id}" />
								\${cc.name}
							\`;
							l3Grid.appendChild(label);

							// Trigger name update when L3 is changed
							const cb = label.querySelector("input");
							cb.addEventListener("change", updateName);
						});
					}
				});

				l3Area.style.display = hasL3 ? "block" : "none";
				updateName(); // Trigger name update when L2 is changed
			}


			l2Children.forEach((c) => {
				const label = document.createElement("label");
				label.className = "motif-style-label";
				label.innerHTML = \`
					<input type="checkbox" name="category_ids" value="\${c.id}" data-id="\${c.id}" data-parent="\${c.parent_id}" />
					\${c.name}
				\`;
				l2Row.appendChild(label);

				const cb = label.querySelector("input");
				cb.addEventListener("change", (e) => {
					if (cb.checked) {
						// Single-select behavior for Level 2
						l2Row.querySelectorAll("input:checked").forEach((other) => {
							if (other !== cb) other.checked = false;
						});
					}
					updateL3Selection();
					updateName();
				});
			});
			updateName(); // Initial update when L2s appear
		}

		// --- Product Naming Automation Logic ---
		const nameInput = document.getElementById("product_name_input");
		const itemCodeInput = document.getElementById("product_item_code_input");
		const categoryContainer = document.getElementById("sub-category-checkboxes");

		function updateName() {
			if (!nameInput) return;

			// 1. Get Category (Jenis) - ALL LEVELS
			const selectedCategories = [];
			const l1Text = document.querySelector('[data-ss-type="product-l1"] .ss-input');
			if (l1Text && l1Text.value && l1Text.value !== "") {
				selectedCategories.push(l1Text.value);
			}

			// Get L2 and L3 from checkboxes within sub-category container
			if (categoryContainer) {
				const checkedSubCats = Array.from(
					categoryContainer.querySelectorAll("input:checked"),
				);
				checkedSubCats.forEach((cb) => {
					const catName = cb.parentElement.textContent.trim();
					if (catName && !selectedCategories.includes(catName)) {
						selectedCategories.push(catName);
					}
				});
			}

			const jenis = selectedCategories.join(" ");

			// 2. Get Motifs
			let motifStr = "";
			const motifGrid = document.getElementById("motif-grid");
			if (motifGrid) {
				const checkedMotifs = Array.from(
					motifGrid.querySelectorAll("input:checked"),
				);
				motifStr = checkedMotifs
					.map((m) => m.parentElement.textContent.trim())
					.join(", ");
			}


			// 3. Get Item Code
			const itemCode = itemCodeInput?.value.trim() || "";

			// Combine
			const parts = [];
			if (jenis) parts.push(jenis);
			if (motifStr) parts.push(motifStr);
			if (itemCode) parts.push(itemCode);

			nameInput.value = parts.join(" ");

			// --- Sleeve Toggle Visibility based on Category ---
			const sleeveKeywords = ['kemeja', 'baju', 'hem', 'atasan', 'blouse', 'tunik', 'gamis', 'koko', 'pdh', 'jaket'];
			const jenisLower = jenis.toLowerCase();
			const needsSleeve = sleeveKeywords.some(kw => jenisLower.includes(kw));
			
			const sleeveWrapper = document.getElementById('sleeve_toggle_wrapper');
			if (sleeveWrapper) {
				if (needsSleeve) {
					sleeveWrapper.style.display = 'flex';
				} else {
					sleeveWrapper.style.display = 'none';
					const toggleCb = document.getElementById('toggle_sleeve_options_add');
					if (toggleCb && toggleCb.checked) {
						toggleCb.checked = false;
						toggleCb.dispatchEvent(new Event('change'));
					}
				}
			}
		}


		function setupToggles() {
			const configs = [
				{ btnId: "toggleTypesBtn", containerId: "typesContainer" },
				{ btnId: "toggleMotifsBtn", containerId: "motifsContainer" },
				{ btnId: "toggleSiteBtn", containerId: "siteContainer" },
				{ btnId: "toggleSizesBtn", containerId: "sizesContainer" },
			];

			configs.forEach((config) => {
				const btn = document.getElementById(config.btnId);
				const container = document.getElementById(config.containerId);

				btn?.addEventListener("click", () => {
					const isCurrentlyOpen = container.style.display !== "none";

					// Close ALL first
					configs.forEach((c) => {
						const cContainer = document.getElementById(
							c.containerId,
						);
						const cBtn = document.getElementById(c.btnId);
						if (cContainer) cContainer.style.display = "none";
						if (cBtn) cBtn.classList.remove("active");
					});

					// If it was NOT open, open it
					if (!isCurrentlyOpen) {
						if (container) container.style.display = "block";
						if (btn) btn.classList.add("active");
					}
				});
			});
		}

		// Price Markup Logic (15% Discount Markup)
		const priceInputHidden = document.getElementById("product_price_input");
		const markupPreview = document.getElementById("price_markup_preview");
		const markupVal = document.getElementById("markup_val");
		const originalPriceInput = document.getElementById(
			"original_price_input",
		);

		if (priceInputHidden) {
			priceInputHidden.addEventListener("input", (e) => {
				const val = parseFloat(e.target.value);
				if (!isNaN(val) && val > 0) {
					// P = O * 0.85 => O = P / 0.85
					let originalPrice = Math.round(val / 0.85);
					originalPrice = Math.ceil(originalPrice / 10000) * 10000;
					const pct = (originalPrice - val).toLocaleString("id-ID");
					markupVal.innerText = originalPrice.toLocaleString("id-ID");
					originalPriceInput.value = originalPrice;
					const markupPctEl = document.getElementById("markup_pct");
					if(markupPctEl) markupPctEl.innerText = pct;
					markupPreview.style.display = "block";
				} else {
					markupPreview.style.display = "none";
					originalPriceInput.value = "";
				}
			});
		}

		// Naming Listeners Setup
		function setupNamingAutomation() {
			const itemCodeInput = document.getElementById("product_item_code_input");
			const categoryContainer = document.getElementById("sub-category-checkboxes");
			const l1Input = document.getElementById("l1_category_input");

			itemCodeInput?.addEventListener("input", updateName);
			categoryContainer?.addEventListener("change", updateName);

			const motifGrid = document.getElementById("motif-grid");
			motifGrid?.addEventListener("change", updateName);


			if (l1Input) {
				const observer = new MutationObserver(updateName);
				observer.observe(l1Input, { attributes: true });
			}
		}


		setupToggles();
		initSearchableSelect();
		setupNamingAutomation();

		// Variasi UI Logic Tambah Produk
		document.querySelectorAll('.variant-cb-add').forEach(cb => {
			cb.addEventListener('change', (e) => {
				const parent = e.target.closest('.variant-item-add');
				const vSize = parent.querySelector('.v-size-input-add');
				const vPriceDisp = parent.querySelector('.v-price-input-add');
				const vPriceHid = parent.querySelector('.v-price-hidden-add');
				const vStock = parent.querySelector('.v-stock-input-add');
				const details = parent.querySelector('.v-details-add');
				
				const isChecked = e.target.checked;
				vSize.disabled = !isChecked;
				vPriceDisp.disabled = !isChecked;
				if(vPriceHid) vPriceHid.disabled = !isChecked;
				vStock.disabled = !isChecked;
				details.style.display = isChecked ? 'flex' : 'none';

				// Set default price based on main price input if empty
				if (isChecked && !vPriceDisp.value) {
					const mainPriceHid = document.getElementById("product_price_input");
					if(mainPriceHid && mainPriceHid.value) {
						vPriceHid.value = mainPriceHid.value;
						vPriceDisp.value = new Intl.NumberFormat('id-ID').format(mainPriceHid.value);
					}
				}
			});
		});

		// Currency Formatting Logic
		function initCurrencyMasks() {
			document.querySelectorAll('.currency-mask').forEach(input => {
				const formatPrice = (val) => {
					const num = val.toString().replace(/\\D/g, '');
					return num ? new Intl.NumberFormat('id-ID').format(num) : '';
				};
				const getHidden = () => {
					if (input.dataset.hiddenId) return document.getElementById(input.dataset.hiddenId);
					return input.parentElement.querySelector('input[type="hidden"]');
				};

				const hidden = getHidden();
				input.addEventListener('input', (e) => {
					const rawVal = e.target.value.replace(/\\D/g, '');
					e.target.value = formatPrice(e.target.value);
					if (hidden) {
						hidden.value = rawVal;
						hidden.dispatchEvent(new Event('input', { bubbles: true }));
					}
				});
				// Initial set on load
				if (input.value) { 
					input.value = formatPrice(input.value); 
					if(hidden) hidden.value = input.value.replace(/\\D/g, '');
				}
			});
		}
		initCurrencyMasks();

		// Sleeve Mode Toggle Logic
		const sleeveToggleAdd = document.getElementById('toggle_sleeve_options_add');
		if(sleeveToggleAdd) {
			sleeveToggleAdd.addEventListener('change', (e) => {
				const isChecked = e.target.checked;
				document.querySelectorAll('.variant-standard').forEach(el => {
					el.style.display = isChecked ? 'none' : 'flex';
					if(isChecked) {
						const cb = el.querySelector('.variant-cb-add');
						if(cb && cb.checked) {
							cb.checked = false;
							cb.dispatchEvent(new Event('change'));
						}
					}
				});
				document.querySelectorAll('.variant-sleeve-split').forEach(el => {
					el.style.display = isChecked ? 'flex' : 'none';
					if(!isChecked) {
						const cb = el.querySelector('.variant-cb-add');
						if(cb && cb.checked) {
							cb.checked = false;
							cb.dispatchEvent(new Event('change'));
						}
					}
				});
			});
		}

		// Check URL for Pra-Produk selection
		document.addEventListener("DOMContentLoaded", async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const praProdukId = urlParams.get('use_praproduk');
			if(praProdukId) {
				try {
					const res = await fetch("https://noir.grace.gracianna.web.id/api/v1/beli1");
					const json = await res.json();
					if(json.success && json.data) {
						const item = json.data.find(p => p.id == praProdukId);
						if(item) {
							// Auto-fill form
							const nameInput = document.getElementById("product_name_input");
							if(nameInput && item.nama) nameInput.value = item.nama;
							
							const skuInput = document.getElementById("product_sku_input");
							if(skuInput && item.counter) skuInput.value = item.counter;
							
							const itemCodeInput = document.getElementById("product_item_code_input");
							if(itemCodeInput && item.kodeitem) itemCodeInput.value = item.kodeitem;
							
							if(item.hjual) {
								const priceInputHidden = document.getElementById("product_price_input");
								const priceInputDisplay = document.getElementById("product_price_input_display");
								if(priceInputHidden) {
									priceInputHidden.value = item.hjual;
									priceInputHidden.dispatchEvent(new Event('input', { bubbles: true }));
								}
								if(priceInputDisplay) {
									priceInputDisplay.value = parseInt(item.hjual).toLocaleString('id-ID');
								}
							}
							
							setTimeout(() => {
								if(item.old) {
									const oldInput = document.getElementById("original_price_input");
									const markupVal = document.getElementById("markup_val");
									const markupPctEl = document.getElementById("markup_pct");
									const markupPreview = document.getElementById("price_markup_preview");
									
									if(oldInput && markupVal && markupPctEl && markupPreview) {
										oldInput.value = item.old;
										markupVal.innerText = parseInt(item.old).toLocaleString("id-ID");
										
										const price = parseFloat(item.hjual || 0);
										const oldPrice = parseFloat(item.old);
										markupPctEl.innerText = (oldPrice - price).toLocaleString("id-ID");
										
										markupPreview.style.display = "block";
									}
								}
							}, 50);

							// Scroll to form
							if(nameInput) {
								nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
							}

							// Remove query param without reload
							const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
							window.history.pushState({path:newUrl}, '', newUrl);
						}
					}
				} catch(e) {
					console.error("Gagal mengambil data Pra-Produk", e);
				}
			}
		});
	})();<\/script> `], [" ", '<section style="padding: var(--spacing-xl) 0; min-height: 80vh;"> <div class="container"> <div class="admin-header"> <div style="display: flex; align-items: center; gap: var(--spacing-md);"> <div> <h1 class="text-uppercase" style="font-size: 1.2rem; margin: 0; font-weight: 600;"> ', ' Dashboard\n</h1> <p style="font-size: 0.8rem; opacity: 0.5;">\nKelola identitas dan katalog batik Anda.\n</p> </div> </div> <div style="display: flex; gap: var(--spacing-md); align-items: center;"> <a href="/" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6;">Lihat Toko</a> <button id="toggleTypesBtn" type="button" class="admin-toggle-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path> </svg> <span>Kelola Kategori</span> </button> <button id="toggleMotifsBtn" type="button" class="admin-toggle-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v19M5 8h14M5 16h14"></path> </svg> <span>Kelola Motif</span> </button> <button id="toggleSiteBtn" type="button" class="admin-toggle-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path> </svg> <span>Informasi Toko</span> </button> <button id="toggleSizesBtn" type="button" class="admin-toggle-btn"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line> </svg> <span>Kelola Ukuran</span> </button> <a href="/buka-toko/pra-produk" class="admin-toggle-btn" style="background: var(--color-accent); border-color: var(--color-accent); color: white; text-decoration: none;"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> <span>Pra-Produk</span> </a> <a href="/buka-toko/promosi" class="admin-toggle-btn" style="background: #fffbeb; border-color: #fbbf24; color: #92400e; text-decoration: none;"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M12 2L2 7l10 5 10-5-10-5z"></path> <path d="M2 17l10 5 10-5"></path> <path d="M2 12l10 5 10-5"></path> </svg> <span>Kelola Promo</span> </a> <a href="?logout=true" style="padding: 0.6rem 1.2rem; background: #fff5f5; color: #ff4d4d; border: 1px solid #ff4d4d; font-size: 0.75rem; text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Logout</a> </div> </div> <!-- Overview Stats --> <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);"> <div class="glass" style="padding: var(--spacing-lg); border-radius: var(--radius-md); border-left: 4px solid var(--color-accent);"> <p class="text-uppercase opacity-50" style="font-size: 0.65rem;">\nTotal Produk\n</p> <h2 style="font-size: 2rem; margin: 0;"> ', ' <span style="font-size: 1rem; opacity: 0.4;">/ ', '</span> </h2> </div> <div class="glass" style="padding: var(--spacing-lg); border-radius: var(--radius-md); border-left: 4px solid #03ac0e;"> <p class="text-uppercase opacity-50" style="font-size: 0.65rem;">\nKategori Jenis\n</p> <h2 style="font-size: 2rem; margin: 0;"> ', ' </h2> </div> <div class="glass" style="padding: var(--spacing-lg); border-radius: var(--radius-md); border-left: 4px solid #3b82f6;"> <p class="text-uppercase opacity-50" style="font-size: 0.65rem;">\nTotal Motif\n</p> <h2 style="font-size: 2rem; margin: 0;"> ', " </h2> </div> </div> ", ' <div class="admin-main-grid"> <!-- Column 1: Forms --> <div style="display: flex; flex-direction: column; gap: var(--spacing-lg);"> <div style="display: flex; gap: 0.5rem; margin-bottom: var(--spacing-sm); flex-wrap: wrap;"></div> <div id="typesContainer" style="display: none; margin-bottom: var(--spacing-md);"> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); width: 100%;"> <h3 style="font-size: 0.8rem; margin-bottom: 1rem; font-weight: 600;" class="text-uppercase">\nPengaturan Kategori\n</h3> <form method="POST" style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;"> <input type="hidden" name="action" value="add_type"> <div style="display: flex; flex-direction: column; gap: 0.5rem;"> <!-- Custom Searchable Select for Parent ID --> <div class="searchable-select" data-ss-type="parent"> <input type="hidden" name="parent_id" id="parent_id_input"> <input type="text" class="ss-input" placeholder="Pilih Induk Kategori (Opsional)..." readonly style="background: #fdfcfb; border-style: dashed;"> <div class="ss-dropdown"> <div class="ss-search-container"> <svg class="ss-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="text" class="ss-search" placeholder="Cari induk kategori..."> </div> <div class="ss-options"> <div class="ss-option" data-value=""> <span>Kategori Utama</span> <span class="lvl-badge lvl-1">Root</span> </div> ', ' </div> </div> </div> <div style="display: flex; gap: 0.5rem;"> <input name="name" type="text" required placeholder="Nama Kategori..." style="flex: 1; padding: 0.6rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem;"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.6rem 1rem; border: none; font-size: 0.7rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-sm);">TAMBAH</button> </div> </div> </form> <div style="max-height: 500px; overflow-y: auto; border-top: 1px solid #f3f4f6; padding-top: 1.5rem;"> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;"> <p class="text-uppercase opacity-50" style="font-size: 0.65rem; font-weight: 700; letter-spacing: 1.5px;">\nHierarchy Tree\n</p> <span style="font-size: 0.65rem; color: #9ca3af;">', ' Categories</span> </div> <div class="category-tree-wrapper"> ', " </div> ", ' </div> </div> </div> <div id="motifsContainer" style="display: none; margin-bottom: var(--spacing-md);"> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); width: 100%;"> <h3 style="font-size: 0.8rem; margin-bottom: 1rem; font-weight: 600;" class="text-uppercase">\nPengaturan Motif Batik\n</h3> <form method="POST" style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;"> <input type="hidden" name="action" value="add_motif"> <div style="display: flex; gap: 0.5rem;"> <input name="name" type="text" required placeholder="Tambah Motif..." style="flex: 1; padding: 0.6rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem;"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.6rem 1rem; border: none; font-size: 0.7rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-sm);">TAMBAH</button> </div> </form> <div style="max-height: 200px; overflow-y: auto; border-top: 1px solid #f0f0f0; padding-top: 0.8rem;"> <p class="text-uppercase opacity-50" style="font-size: 0.6rem; margin-bottom: 0.5rem;">\nKoleksi Motif\n</p> ', ' </div> </div> </div> <div id="siteContainer" style="display: none; margin-bottom: var(--spacing-md);"> <!-- Site Settings Management --> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-xl); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"> <h2 style="font-size: 1rem; margin-bottom: var(--spacing-lg); font-weight: 600;" class="text-uppercase">\nInformasi & Link Toko\n</h2> <form method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: var(--spacing-lg);"> <input type="hidden" name="action" value="update_settings"> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Nama Website</label> <input name="site_name" type="text" required', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Logo Website</label> <input name="logo_file" type="file" accept="image/*" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.75rem;"> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Alamat Toko Offline</label> <textarea name="address" rows="2" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);">', '</textarea> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">WhatsApp Admin</label> <input name="contact_whatsapp" type="text" placeholder="Contoh: 62812345678"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Instagram URL</label> <input name="url_instagram" type="text"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">TikTok URL</label> <input name="url_tiktok" type="text"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Tokopedia URL</label> <input name="url_tokopedia" type="text"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Shopee URL</label> <input name="url_shopee" type="text"', ' style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <button type="submit" style="background: var(--color-accent); color: white; padding: 1rem; border: none; text-transform: uppercase; letter-spacing: 2px; width: 100%; cursor: pointer; font-weight: 600; font-size: 0.8rem; border-radius: var(--radius-sm); margin-top: var(--spacing-md);">Update Konfigurasi Website</button> </form> </div> </div> <div id="sizesContainer" style="display: none; margin-bottom: var(--spacing-md);"> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); width: 100%;"> <h3 style="font-size: 0.8rem; margin-bottom: 1rem; font-weight: 600;" class="text-uppercase">\nPengaturan Ukuran Produk\n</h3> <form method="POST" style="display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem;"> <input type="hidden" name="action" value="add_size"> <div style="display: flex; gap: 0.5rem;"> <input name="size_name" type="text" required placeholder="Tambah Ukuran (S, M, L, XL, dll)..." style="flex: 1; padding: 0.6rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem;"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.6rem 1rem; border: none; font-size: 0.7rem; font-weight: 600; cursor: pointer; border-radius: var(--radius-sm);">TAMBAH</button> </div> </form> <div style="max-height: 200px; overflow-y: auto; border-top: 1px solid #f0f0f0; padding-top: 0.8rem;"> <p class="text-uppercase opacity-50" style="font-size: 0.6rem; margin-bottom: 0.5rem;">\nDaftar Ukuran Tersedia\n</p> <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.5rem;"> ', " </div> ", ' </div> </div> </div> <!-- Form Product --> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"> <h2 style="font-size: 1rem; margin-bottom: var(--spacing-lg); font-weight: 600;" class="text-uppercase">\nTambah Produk Baru\n</h2> <form method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: var(--spacing-md);"> <input type="hidden" name="action" value="add_product"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Nama Produk</label> <input name="name" id="product_name_input" type="text" required placeholder="Kemeja Batik Parang" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kode SKU</label> <input name="code" id="product_sku_input" type="text" placeholder="BTK-001" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kode Barang (Auto-Name)</label> <input name="item_code" id="product_item_code_input" type="text" placeholder="001" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Harga (Rp)</label> <input type="text" class="currency-mask" data-hidden-id="product_price_input" required id="product_price_input_display" placeholder="450.000" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> <input type="hidden" name="price" id="product_price_input"> <div id="price_markup_preview" style="font-size: 0.65rem; color: #10b981; margin-top: 0.4rem; font-weight: 600; display: none;">\nHarga Coret: Rp <span id="markup_val">0</span> (Hemat Rp <span id="markup_pct">0</span>)\n</div> <input type="hidden" name="original_price" id="original_price_input"> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kategori Produk</label> <div class="searchable-select" data-ss-type="product-l1"> <input type="hidden" name="category_ids" id="l1_category_input"> <input type="text" class="ss-input" placeholder="Cari & Pilih Kategori Utama..." readonly style="background: #ffffff; border-style: solid;"> <div class="ss-dropdown"> <div class="ss-search-container"> <svg class="ss-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="text" class="ss-search" placeholder="Cari kategori..."> </div> <div class="ss-options"> ', ' </div> </div> </div> <div id="sub-category-checkboxes" class="cascading-container"></div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Motif (Multi-select)</label> <div class="motif-style-container" id="motif-grid"> ', ' </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Foto Produk (Bisa Pilih Banyak)</label> <input name="image_file" type="file" accept="image/*" multiple required style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: var(--radius-sm); background: #fcfcfc; font-size: 0.75rem;"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Ukuran & Variasi Harga</label> <p style="font-size: 0.7rem; color: var(--color-muted); margin-bottom: 1rem;">Centang ukuran yang tersedia, lalu isi harga khususnya jika berbeda.</p> <label id="sleeve_toggle_wrapper" style="display: none; align-items: center; gap: 0.5rem; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm); cursor: pointer; background: #fcfcfc; margin-bottom: 1rem;"> <input type="checkbox" id="toggle_sleeve_options_add"> <span style="font-size: 0.85rem; font-weight: 500;">Aktifkan Pilihan Lengan (Pendek & Panjang)</span> </label> <div style="display: flex; flex-direction: column; gap: 0.5rem; background: #fcfcfc; padding: 1rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> ', " ", ' </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Link Tokopedia (Opsional)</label> <input name="tokopedia_url" type="url" placeholder="https://www.tokopedia.com/..." style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Deskripsi Produk</label> <textarea name="description" rows="2" placeholder="Detail produk..." style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"></textarea> </div> <div style="margin-top: var(--spacing-sm);"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.8rem; border: none; text-transform: uppercase; letter-spacing: 2px; width: 100%; cursor: pointer; font-weight: 600; font-size: 0.75rem; border-radius: var(--radius-sm); transition: var(--transition);">Simpan Produk</button> </div> </form> </div> </div> <!-- List Column --> <div> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg); flex-wrap: wrap; gap: 1rem;"> <h2 style="font-size: 1.1rem; font-weight: 600; margin: 0;">\nDaftar Produk Terdaftar\n</h2> <!-- Admin Search --> <form method="GET" style="position: relative; flex: 1; min-width: 200px; max-width: 400px;"> <input name="q" type="text"', ' placeholder="Cari nama, SKU, atau motif..." style="width: 100%; padding: 0.6rem 2.5rem 0.6rem 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem;"> <button type="submit" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; opacity: 0.4; cursor: pointer;"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line> </svg> </button> </form> <span class="text-uppercase opacity-50" style="font-size: 0.6rem;">', ' Items</span> </div> <div style="background: white; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow-x: auto; box-shadow: var(--shadow-sm);"> <table style="width: 100%; border-collapse: collapse;"> <thead> <tr style="background: #f9f9f9; border-bottom: 1px solid var(--color-border); text-align: left;" class="text-uppercase"> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6;">Produk</th> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6;">Kategori</th> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6;">Harga</th> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6; text-align: center;">Status</th> <th style="padding: 1rem; font-size: 0.65rem; opacity: 0.6; text-align: center;">Aksi</th> </tr> </thead> <tbody> ', " </tbody> </table> ", " </div> </div> </div> </div> </section>  ", " <script>(function(){", `
		function initSearchableSelect() {
			const selectContainers =
				document.querySelectorAll(".searchable-select");

			selectContainers.forEach((container) => {
				const input = container.querySelector(".ss-input");
				const hiddenInput = container.querySelector(
					'input[type="hidden"]',
				);
				const dropdown = container.querySelector(".ss-dropdown");
				const searchInput = container.querySelector(".ss-search");
				const options = container.querySelectorAll(".ss-option");
				const optionsContainer = container.querySelector(".ss-options");
				const ssType = container.getAttribute("data-ss-type");

				// Open/Close
				input.addEventListener("click", (e) => {
					e.stopPropagation();
					dropdown.classList.toggle("show");
					if (dropdown.classList.contains("show")) {
						searchInput.focus();
					}
				});

				// Search Logic
				searchInput.addEventListener("input", (e) => {
					const term = e.target.value.toLowerCase();
					let hasResults = false;

					options.forEach((opt) => {
						const text = opt.textContent.toLowerCase();
						if (text.includes(term)) {
							opt.style.display = "block";
							hasResults = true;
						} else {
							opt.style.display = "none";
						}
					});

					// Handle "No results"
					const noRes =
						optionsContainer.querySelector(".ss-no-results");
					if (!hasResults) {
						if (!noRes) {
							const div = document.createElement("div");
							div.className = "ss-no-results";
							div.textContent = "Kategori tidak ditemukan";
							optionsContainer.appendChild(div);
						}
					} else if (noRes) {
						noRes.remove();
					}
				});

				// Selection
				options.forEach((opt) => {
					opt.addEventListener("click", (e) => {
						e.stopPropagation();
						const val = opt.getAttribute("data-value");
						const text =
							opt.querySelector("span")?.textContent.trim() ||
							opt.textContent.trim();

						hiddenInput.value = val;
						input.value = text;

						options.forEach((o) => o.classList.remove("selected"));
						opt.classList.add("selected");

						dropdown.classList.remove("show");
						searchInput.value = "";
						options.forEach((o) => (o.style.display = "block"));

						// HYBRID CALLBACK: If this is Product Level 1, render checkboxes
						if (ssType === "product-l1") {
							renderSubCategoriesFromList([val]);
						}
					});
				});

				// Close when clicking outside
				document.addEventListener("click", (e) => {
					if (!container.contains(e.target)) {
						dropdown.classList.remove("show");
					}
				});
			});
		}

		function renderSubCategoriesFromList(parentIds) {
			const container = document.getElementById(
				"sub-category-checkboxes",
			);
			if (!container) return;

			if (parentIds.length === 0) {
				container.innerHTML = "";
				container.style.display = "none";
				return;
			}

			// Clear container
			container.innerHTML = "";
			const l2Children = hierarchicalTypes.filter((t) =>
				parentIds.includes(t.parent_id),
			);

			if (l2Children.length === 0) {
				container.style.display = "none";
				return;
			}

			container.style.display = "block";
			container.innerHTML = \\\`
				<div style="margin-top: 1rem;">
					<label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Jenis Produk (Level 2)</label>
					<div class="motif-style-container" id="l2-selection-row"></div>
				</div>
				<div id="l3-selection-area" style="display: none; margin-top: 1rem;">
					<label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Pilihan Detail (Level 3)</label>
					<div class="motif-style-container" id="l3-grid"></div>
				</div>
			\\\`;

			const l2Row = container.querySelector("#l2-selection-row");
			const l3Area = container.querySelector("#l3-selection-area");
			const l3Grid = container.querySelector("#l3-grid");

			function updateL3Selection() {
				const checkedL2s = Array.from(
					l2Row.querySelectorAll("input:checked"),
				);
				l3Grid.innerHTML = ""; // Clear previous L3s

				if (checkedL2s.length === 0) {
					l3Area.style.display = "none";
					updateName(); // Trigger update name when L2 is unchecked
					return;
				}

				let hasL3 = false;
				checkedL2s.forEach((l2) => {
					const l2Id = l2.getAttribute("data-id");
					const l3s = hierarchicalTypes.filter(
						(t) => String(t.parent_id) === String(l2Id),
					);
					if (l3s.length > 0) {
						hasL3 = true;
						l3s.forEach((cc) => {
							const label = document.createElement("label");
							label.className = "motif-style-label";
							label.innerHTML = \\\`
								<input type="checkbox" name="category_ids" value="\\\${cc.id}" data-id="\\\${cc.id}" data-parent="\\\${l2Id}" />
								\\\${cc.name}
							\\\`;
							l3Grid.appendChild(label);

							// Trigger name update when L3 is changed
							const cb = label.querySelector("input");
							cb.addEventListener("change", updateName);
						});
					}
				});

				l3Area.style.display = hasL3 ? "block" : "none";
				updateName(); // Trigger name update when L2 is changed
			}


			l2Children.forEach((c) => {
				const label = document.createElement("label");
				label.className = "motif-style-label";
				label.innerHTML = \\\`
					<input type="checkbox" name="category_ids" value="\\\${c.id}" data-id="\\\${c.id}" data-parent="\\\${c.parent_id}" />
					\\\${c.name}
				\\\`;
				l2Row.appendChild(label);

				const cb = label.querySelector("input");
				cb.addEventListener("change", (e) => {
					if (cb.checked) {
						// Single-select behavior for Level 2
						l2Row.querySelectorAll("input:checked").forEach((other) => {
							if (other !== cb) other.checked = false;
						});
					}
					updateL3Selection();
					updateName();
				});
			});
			updateName(); // Initial update when L2s appear
		}

		// --- Product Naming Automation Logic ---
		const nameInput = document.getElementById("product_name_input");
		const itemCodeInput = document.getElementById("product_item_code_input");
		const categoryContainer = document.getElementById("sub-category-checkboxes");

		function updateName() {
			if (!nameInput) return;

			// 1. Get Category (Jenis) - ALL LEVELS
			const selectedCategories = [];
			const l1Text = document.querySelector('[data-ss-type="product-l1"] .ss-input');
			if (l1Text && l1Text.value && l1Text.value !== "") {
				selectedCategories.push(l1Text.value);
			}

			// Get L2 and L3 from checkboxes within sub-category container
			if (categoryContainer) {
				const checkedSubCats = Array.from(
					categoryContainer.querySelectorAll("input:checked"),
				);
				checkedSubCats.forEach((cb) => {
					const catName = cb.parentElement.textContent.trim();
					if (catName && !selectedCategories.includes(catName)) {
						selectedCategories.push(catName);
					}
				});
			}

			const jenis = selectedCategories.join(" ");

			// 2. Get Motifs
			let motifStr = "";
			const motifGrid = document.getElementById("motif-grid");
			if (motifGrid) {
				const checkedMotifs = Array.from(
					motifGrid.querySelectorAll("input:checked"),
				);
				motifStr = checkedMotifs
					.map((m) => m.parentElement.textContent.trim())
					.join(", ");
			}


			// 3. Get Item Code
			const itemCode = itemCodeInput?.value.trim() || "";

			// Combine
			const parts = [];
			if (jenis) parts.push(jenis);
			if (motifStr) parts.push(motifStr);
			if (itemCode) parts.push(itemCode);

			nameInput.value = parts.join(" ");

			// --- Sleeve Toggle Visibility based on Category ---
			const sleeveKeywords = ['kemeja', 'baju', 'hem', 'atasan', 'blouse', 'tunik', 'gamis', 'koko', 'pdh', 'jaket'];
			const jenisLower = jenis.toLowerCase();
			const needsSleeve = sleeveKeywords.some(kw => jenisLower.includes(kw));
			
			const sleeveWrapper = document.getElementById('sleeve_toggle_wrapper');
			if (sleeveWrapper) {
				if (needsSleeve) {
					sleeveWrapper.style.display = 'flex';
				} else {
					sleeveWrapper.style.display = 'none';
					const toggleCb = document.getElementById('toggle_sleeve_options_add');
					if (toggleCb && toggleCb.checked) {
						toggleCb.checked = false;
						toggleCb.dispatchEvent(new Event('change'));
					}
				}
			}
		}


		function setupToggles() {
			const configs = [
				{ btnId: "toggleTypesBtn", containerId: "typesContainer" },
				{ btnId: "toggleMotifsBtn", containerId: "motifsContainer" },
				{ btnId: "toggleSiteBtn", containerId: "siteContainer" },
				{ btnId: "toggleSizesBtn", containerId: "sizesContainer" },
			];

			configs.forEach((config) => {
				const btn = document.getElementById(config.btnId);
				const container = document.getElementById(config.containerId);

				btn?.addEventListener("click", () => {
					const isCurrentlyOpen = container.style.display !== "none";

					// Close ALL first
					configs.forEach((c) => {
						const cContainer = document.getElementById(
							c.containerId,
						);
						const cBtn = document.getElementById(c.btnId);
						if (cContainer) cContainer.style.display = "none";
						if (cBtn) cBtn.classList.remove("active");
					});

					// If it was NOT open, open it
					if (!isCurrentlyOpen) {
						if (container) container.style.display = "block";
						if (btn) btn.classList.add("active");
					}
				});
			});
		}

		// Price Markup Logic (15% Discount Markup)
		const priceInputHidden = document.getElementById("product_price_input");
		const markupPreview = document.getElementById("price_markup_preview");
		const markupVal = document.getElementById("markup_val");
		const originalPriceInput = document.getElementById(
			"original_price_input",
		);

		if (priceInputHidden) {
			priceInputHidden.addEventListener("input", (e) => {
				const val = parseFloat(e.target.value);
				if (!isNaN(val) && val > 0) {
					// P = O * 0.85 => O = P / 0.85
					let originalPrice = Math.round(val / 0.85);
					originalPrice = Math.ceil(originalPrice / 10000) * 10000;
					const pct = (originalPrice - val).toLocaleString("id-ID");
					markupVal.innerText = originalPrice.toLocaleString("id-ID");
					originalPriceInput.value = originalPrice;
					const markupPctEl = document.getElementById("markup_pct");
					if(markupPctEl) markupPctEl.innerText = pct;
					markupPreview.style.display = "block";
				} else {
					markupPreview.style.display = "none";
					originalPriceInput.value = "";
				}
			});
		}

		// Naming Listeners Setup
		function setupNamingAutomation() {
			const itemCodeInput = document.getElementById("product_item_code_input");
			const categoryContainer = document.getElementById("sub-category-checkboxes");
			const l1Input = document.getElementById("l1_category_input");

			itemCodeInput?.addEventListener("input", updateName);
			categoryContainer?.addEventListener("change", updateName);

			const motifGrid = document.getElementById("motif-grid");
			motifGrid?.addEventListener("change", updateName);


			if (l1Input) {
				const observer = new MutationObserver(updateName);
				observer.observe(l1Input, { attributes: true });
			}
		}


		setupToggles();
		initSearchableSelect();
		setupNamingAutomation();

		// Variasi UI Logic Tambah Produk
		document.querySelectorAll('.variant-cb-add').forEach(cb => {
			cb.addEventListener('change', (e) => {
				const parent = e.target.closest('.variant-item-add');
				const vSize = parent.querySelector('.v-size-input-add');
				const vPriceDisp = parent.querySelector('.v-price-input-add');
				const vPriceHid = parent.querySelector('.v-price-hidden-add');
				const vStock = parent.querySelector('.v-stock-input-add');
				const details = parent.querySelector('.v-details-add');
				
				const isChecked = e.target.checked;
				vSize.disabled = !isChecked;
				vPriceDisp.disabled = !isChecked;
				if(vPriceHid) vPriceHid.disabled = !isChecked;
				vStock.disabled = !isChecked;
				details.style.display = isChecked ? 'flex' : 'none';

				// Set default price based on main price input if empty
				if (isChecked && !vPriceDisp.value) {
					const mainPriceHid = document.getElementById("product_price_input");
					if(mainPriceHid && mainPriceHid.value) {
						vPriceHid.value = mainPriceHid.value;
						vPriceDisp.value = new Intl.NumberFormat('id-ID').format(mainPriceHid.value);
					}
				}
			});
		});

		// Currency Formatting Logic
		function initCurrencyMasks() {
			document.querySelectorAll('.currency-mask').forEach(input => {
				const formatPrice = (val) => {
					const num = val.toString().replace(/\\\\D/g, '');
					return num ? new Intl.NumberFormat('id-ID').format(num) : '';
				};
				const getHidden = () => {
					if (input.dataset.hiddenId) return document.getElementById(input.dataset.hiddenId);
					return input.parentElement.querySelector('input[type="hidden"]');
				};

				const hidden = getHidden();
				input.addEventListener('input', (e) => {
					const rawVal = e.target.value.replace(/\\\\D/g, '');
					e.target.value = formatPrice(e.target.value);
					if (hidden) {
						hidden.value = rawVal;
						hidden.dispatchEvent(new Event('input', { bubbles: true }));
					}
				});
				// Initial set on load
				if (input.value) { 
					input.value = formatPrice(input.value); 
					if(hidden) hidden.value = input.value.replace(/\\\\D/g, '');
				}
			});
		}
		initCurrencyMasks();

		// Sleeve Mode Toggle Logic
		const sleeveToggleAdd = document.getElementById('toggle_sleeve_options_add');
		if(sleeveToggleAdd) {
			sleeveToggleAdd.addEventListener('change', (e) => {
				const isChecked = e.target.checked;
				document.querySelectorAll('.variant-standard').forEach(el => {
					el.style.display = isChecked ? 'none' : 'flex';
					if(isChecked) {
						const cb = el.querySelector('.variant-cb-add');
						if(cb && cb.checked) {
							cb.checked = false;
							cb.dispatchEvent(new Event('change'));
						}
					}
				});
				document.querySelectorAll('.variant-sleeve-split').forEach(el => {
					el.style.display = isChecked ? 'flex' : 'none';
					if(!isChecked) {
						const cb = el.querySelector('.variant-cb-add');
						if(cb && cb.checked) {
							cb.checked = false;
							cb.dispatchEvent(new Event('change'));
						}
					}
				});
			});
		}

		// Check URL for Pra-Produk selection
		document.addEventListener("DOMContentLoaded", async () => {
			const urlParams = new URLSearchParams(window.location.search);
			const praProdukId = urlParams.get('use_praproduk');
			if(praProdukId) {
				try {
					const res = await fetch("https://noir.grace.gracianna.web.id/api/v1/beli1");
					const json = await res.json();
					if(json.success && json.data) {
						const item = json.data.find(p => p.id == praProdukId);
						if(item) {
							// Auto-fill form
							const nameInput = document.getElementById("product_name_input");
							if(nameInput && item.nama) nameInput.value = item.nama;
							
							const skuInput = document.getElementById("product_sku_input");
							if(skuInput && item.counter) skuInput.value = item.counter;
							
							const itemCodeInput = document.getElementById("product_item_code_input");
							if(itemCodeInput && item.kodeitem) itemCodeInput.value = item.kodeitem;
							
							if(item.hjual) {
								const priceInputHidden = document.getElementById("product_price_input");
								const priceInputDisplay = document.getElementById("product_price_input_display");
								if(priceInputHidden) {
									priceInputHidden.value = item.hjual;
									priceInputHidden.dispatchEvent(new Event('input', { bubbles: true }));
								}
								if(priceInputDisplay) {
									priceInputDisplay.value = parseInt(item.hjual).toLocaleString('id-ID');
								}
							}
							
							setTimeout(() => {
								if(item.old) {
									const oldInput = document.getElementById("original_price_input");
									const markupVal = document.getElementById("markup_val");
									const markupPctEl = document.getElementById("markup_pct");
									const markupPreview = document.getElementById("price_markup_preview");
									
									if(oldInput && markupVal && markupPctEl && markupPreview) {
										oldInput.value = item.old;
										markupVal.innerText = parseInt(item.old).toLocaleString("id-ID");
										
										const price = parseFloat(item.hjual || 0);
										const oldPrice = parseFloat(item.old);
										markupPctEl.innerText = (oldPrice - price).toLocaleString("id-ID");
										
										markupPreview.style.display = "block";
									}
								}
							}, 50);

							// Scroll to form
							if(nameInput) {
								nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
							}

							// Remove query param without reload
							const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
							window.history.pushState({path:newUrl}, '', newUrl);
						}
					}
				} catch(e) {
					console.error("Gagal mengambil data Pra-Produk", e);
				}
			}
		});
	})();<\/script> `])), maybeRenderHead(), settings?.site_name || "Batik Nusantara", productsData?.filter((p) => p.is_active).length || 0, productsData?.length || 0, types?.length || 0, motifs?.length || 0, message && renderTemplate`<div class="animate-fade-in"${addAttribute(`padding: 1rem; margin-bottom: 2rem; border-radius: var(--radius-sm); border: 1px solid ${isError ? "#ff4d4d" : "#03ac0e"}; background: ${isError ? "#fff5f5" : "#f5fff5"}; color: ${isError ? "#ff4d4d" : "#03ac0e"}; text-align: center; font-size: 0.9rem; font-weight: 500;`, "style")}> ${message} </div>`, hierarchicalTypes.filter(
    (t) => t.depth < 2
  ).map((t) => renderTemplate`<div class="ss-option"${addAttribute(
    t.id,
    "data-value"
  )}> <span> ${"--".repeat(
    t.depth
  )}${" "} ${t.name} </span> <span${addAttribute(`lvl-badge lvl-${t.depth + 1}`, "class")}>
L
${t.depth + 1} </span> </div>`), hierarchicalTypes?.length || 0, hierarchicalTypes?.map((t) => renderTemplate`<div class="category-item"${addAttribute(`margin-left: ${t.depth * 28}px; border-color: ${t.depth === 0 ? "#f3f4f6" : "transparent"};`, "style")}> ${t.depth > 0 && renderTemplate`<div class="tree-connector"></div>`} <div class="cat-content"> <span${addAttribute(`lvl-badge lvl-${t.depth + 1}`, "class")}>
L${t.depth + 1} </span> <span class="cat-name"${addAttribute(`font-weight: ${t.depth === 0 ? "600" : "400"}; color: ${t.depth === 0 ? "#111827" : "#4b5563"};`, "style")}> ${t.name} </span> </div> <div class="cat-actions"> <form method="POST" onsubmit="return showDeleteConfirm(this, 'Hapus kategori ini?')"> <input type="hidden" name="action" value="delete_type"> <input type="hidden" name="id"${addAttribute(t.id, "value")}> <button type="submit" class="btn-trash" title="Hapus Kategori"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path> </svg> </button> </form> </div> </div>`), (!hierarchicalTypes || hierarchicalTypes.length === 0) && renderTemplate`<div style="padding: 3rem 1rem; text-align: center; border: 1px dashed #e5e7eb; border-radius: 12px; margin-top: 10px;"> <p style="font-size: 0.85rem; color: #9ca3af;">
Belum ada struktur kategori.
</p> </div>`, motifs?.map((m) => renderTemplate`<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; border-bottom: 1px solid #fafafa;"> <span style="font-size: 0.85rem;"> ${m.name} </span> <form method="POST" onsubmit="return showDeleteConfirm(this, 'Hapus motif ini? Pastikan tidak ada produk yang menggunakan motif ini.')"> <input type="hidden" name="action" value="delete_motif"> <input type="hidden" name="id"${addAttribute(m.id, "value")}> <button type="submit" style="background: none; border: none; color: #ff4d4d; cursor: pointer; padding: 2px; display: flex; align-items: center; opacity: 0.6; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'"> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg> </button> </form> </div>`), addAttribute(settings?.site_name, "value"), settings?.address, addAttribute(settings?.contact_whatsapp, "value"), addAttribute(settings?.url_instagram, "value"), addAttribute(settings?.url_tiktok, "value"), addAttribute(settings?.url_tokopedia, "value"), addAttribute(settings?.url_shopee, "value"), sizesData.map((s) => renderTemplate`<div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.8rem; background: #f9f9f9; border-radius: 6px; border: 1px solid #f0f0f0;"> <span style="font-size: 0.8rem; font-weight: 500;"> ${s.name} </span> <form method="POST" onsubmit="return showDeleteConfirm(this, 'Hapus ukuran ini?')"> <input type="hidden" name="action" value="delete_size"> <input type="hidden" name="size_id"${addAttribute(s.id, "value")}> <button type="submit" style="background: none; border: none; color: #ff4d4d; cursor: pointer; padding: 2px; display: flex; align-items: center; opacity: 0.6; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'"> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"> <line x1="18" y1="6" x2="6" y2="18"></line> <line x1="6" y1="6" x2="18" y2="18"></line> </svg> </button> </form> </div>`), sizesData.length === 0 && renderTemplate`<p style="font-size: 0.75rem; opacity: 0.5; text-align: center; padding: 1rem;">
Belum ada data ukuran.
</p>`, hierarchicalTypes.filter(
    (t) => t.parent_id === null
  ).map((t) => renderTemplate`<div class="ss-option"${addAttribute(t.id, "data-value")}> <span> ${t.name} </span> <span class="lvl-badge lvl-1">
Root
</span> </div>`), motifs?.map((m) => renderTemplate`<label class="motif-style-label"> <input type="checkbox" name="motif_ids"${addAttribute(m.id, "value")}> ${m.name} </label>`), sizesData.map((size) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="variant-item-add variant-standard" style="display: flex; align-items: center; gap: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;"> <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; min-width: 60px;"> <input type="checkbox" class="variant-cb-add"${addAttribute(size.name, "value")} style="margin-top: 2px;"> <span style="display: flex; flex-direction: column;"> <strong style="font-weight: 500;">${size.name}</strong> </span> </label> <input type="hidden" name="variant_size"${addAttribute(size.name, "value")} disabled class="v-size-input-add"> <div class="v-details-add" style="flex: 1; gap: 0.5rem; display: none;"> <div style="flex: 1;"> <span style="font-size: 0.6rem; opacity: 0.5;">Harga (Rp)</span> <input type="text" placeholder="Harga" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;" disabled class="v-price-input-add currency-mask"> <input type="hidden" name="variant_price" disabled class="v-price-hidden-add"> </div> <div style="width: 80px;"> <span style="font-size: 0.6rem; opacity: 0.5;">Stok</span> <input type="number" name="variant_stock" value="0" placeholder="Stok" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;" disabled class="v-stock-input-add"> </div> </div> </div> ${["Lengan Pendek", "Lengan Panjang"].map((sleeve) => renderTemplate`<div class="variant-item-add variant-sleeve-split" style="display: none; align-items: center; gap: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; padding-left: 1.5rem;"> <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; min-width: 120px;"> <input type="checkbox" class="variant-cb-add"${addAttribute(`${size.name} - ${sleeve}`, "value")} style="margin-top: 2px;"> <span style="display: flex; flex-direction: column;"> <strong style="font-weight: 500;">${size.name}</strong> <span style="font-size: 0.7rem; opacity: 0.6;">${sleeve}</span> </span> </label> <input type="hidden" name="variant_size"${addAttribute(`${size.name} - ${sleeve}`, "value")} disabled class="v-size-input-add"> <div class="v-details-add" style="flex: 1; gap: 0.5rem; display: none;"> <div style="flex: 1;"> <span style="font-size: 0.6rem; opacity: 0.5;">Harga (Rp)</span> <input type="text" placeholder="Harga" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;" disabled class="v-price-input-add currency-mask"> <input type="hidden" name="variant_price" disabled class="v-price-hidden-add"> </div> <div style="width: 80px;"> <span style="font-size: 0.6rem; opacity: 0.5;">Stok</span> <input type="number" name="variant_stock" value="0" placeholder="Stok" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;" disabled class="v-stock-input-add"> </div> </div> </div>`)}` })}`), sizesData.length === 0 && renderTemplate`<span style="font-size: 0.7rem; opacity: 0.5;">
Belum ada data ukuran.
</span>`, addAttribute(adminSearchQuery || "", "value"), productsData?.length || 0, productsData?.map((p) => renderTemplate`<tr style="border-bottom: 1px solid #f0f0f0; transition: background 0.2s;" class="table-row-hover"> <td style="padding: 1rem;"> <div style="display: flex; gap: 0.8rem; align-items: center;"> <div style="width: 40px; height: 40px; background: #eee; border-radius: 4px; overflow: hidden; flex-shrink: 0;"> <img${addAttribute(p.image_url, "src")} style="width: 100%; height: 100%; object-fit: cover;" alt=""> </div> <div> <div style="font-weight: 500; font-size: 0.9rem;"> ${p.name} </div> <div style="display: flex; gap: 0.4rem; align-items: center;"> <code style="font-size: 0.7rem; color: var(--color-muted);"> ${p.code || "-"} </code> ${p.sizes && p.sizes.length > 0 && renderTemplate`<span style="font-size: 0.6rem; background: #eee; padding: 1px 4px; border-radius: 2px;"> ${p.sizes.join(
    ", "
  )} </span>`} </div> </div> </div> </td> <td style="padding: 1rem;"> <div style="display: flex; flex-wrap: wrap; gap: 4px;"> ${p.product_categories?.map(
    (pc) => renderTemplate`<span style="font-size: 0.7rem; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; color: #555;"> ${pc.types?.name} </span>`
  )} ${(!p.product_categories || p.product_categories.length === 0) && renderTemplate`<span style="font-size: 0.75rem; opacity: 0.5;">
-
</span>`} </div> <div style="font-size: 0.7rem; opacity: 0.5; margin-top: 4px;"> ${p.product_motifs?.map(
    (pm) => pm.motifs?.name
  ).join(", ") || "-"} </div> </td> <td style="padding: 1rem; font-weight: 600; font-size: 0.85rem;">
Rp${" "} ${Number(p.price).toLocaleString(
    "id-ID"
  )} </td> <td style="padding: 1rem; text-align: center;"> <form method="POST" style="display: inline;"> <input type="hidden" name="action" value="toggle_status"> <input type="hidden" name="id"${addAttribute(p.id, "value")}> <input type="hidden" name="current_status"${addAttribute(
    p.is_active ? "true" : "false",
    "value"
  )}> <button type="submit"${addAttribute(
    p.is_active ? "Sembunyikan dari Katalog" : "Tampilkan di Katalog",
    "title"
  )}${addAttribute(`border: none; background: none; cursor: pointer; color: ${p.is_active ? "var(--color-accent)" : "#ccc"}; transition: 0.2s;`, "style")}> ${p.is_active ? renderTemplate`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path> <circle cx="12" cy="12" r="3"></circle> </svg>` : renderTemplate`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path> <line x1="1" y1="1" x2="23" y2="23"></line> </svg>`} </button> </form> </td> <td style="padding: 1rem; text-align: center;"> <div style="display: flex; gap: 0.4rem; justify-content: center;"> <a${addAttribute(`/buka-toko/edit/${p.id}`, "href")} title="Edit Produk" style="background: #f0f7ff; color: #0070f3; padding: 0.4rem; border-radius: 4px; display: inline-flex; align-items: center; transition: 0.2s;"> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"> <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path> <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path> </svg> </a> <form method="POST" style="display: inline;" onsubmit="return showDeleteConfirm(this, 'Apakah Anda yakin ingin menghapus produk ini secara permanen?')"> <input type="hidden" name="action" value="delete_product"> <input type="hidden" name="id"${addAttribute(p.id, "value")}> <button type="submit" title="Hapus Permanen" style="border: none; background: #fff5f5; color: #ff4d4d; padding: 0.4rem; border-radius: 4px; cursor: pointer; transition: 0.2s;"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path> </svg> </button> </form> </div> </td> </tr>`), (!productsData || productsData.length === 0) && renderTemplate`<div style="padding: var(--spacing-xl); text-align: center; opacity: 0.4;">
Belum ada produk.
</div>`, renderComponent($$result2, "DeleteConfirmModal", $$DeleteConfirmModal, {}), defineScriptVars({ hierarchicalTypes })) })}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko.astro", void 0);

const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko.astro";
const $$url = "/buka-toko";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$BukaToko,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
