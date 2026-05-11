import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from './entrypoint_B7dm8yGT.mjs';
import { a as apiFetch, u as uploadToLaravel, $ as $$Layout } from './Layout_CnwklWu_.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Promosi = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Promosi;
  const session = Astro2.cookies.get("admin_session");
  if (session?.value !== "authenticated") {
    return Astro2.redirect("/login");
  }
  let promotions = [];
  let settings = null;
  try {
    const pr = await apiFetch("promotions");
    promotions = pr?.data || pr || [];
    const s = await apiFetch("settings");
    settings = s?.data || s || { site_name: "Batik Nusantara" };
  } catch (e) {
    console.error("Promotions/Settings fetch error:", e);
  }
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const action = formData.get("action");
      if (action === "add_promo") {
        const title = formData.get("title");
        const link_url = formData.get("link_url") || "/products";
        const order_index = formData.get("order_index") || 0;
        const promo_file = formData.get("promo_file");
        let image_url = "";
        if (promo_file && promo_file.size > 0) {
          image_url = await uploadToLaravel(promo_file, "promotions");
        }
        await apiFetch("promotions", {
          method: "POST",
          body: JSON.stringify({ title, image_url, link_url, order_index, is_active: true })
        });
        return Astro2.redirect("/buka-toko/promosi?success=promo");
      }
      if (action === "delete_promo") {
        const id = formData.get("id");
        await apiFetch(`promotions/${id}`, { method: "DELETE" });
        return Astro2.redirect("/buka-toko/promosi?success=deleted");
      }
      if (action === "toggle_promo") {
        const id = formData.get("id");
        const current_status = formData.get("current_status") === "true";
        await apiFetch(`promotions/${id}`, {
          method: "PUT",
          body: JSON.stringify({ is_active: !current_status })
        });
        return Astro2.redirect("/buka-toko/promosi?success=status");
      }
    } catch (e) {
      console.error("Action error:", e);
      return Astro2.redirect(`/buka-toko/promosi?error=${encodeURIComponent(e.message || "Terjadi kesalahan sistem")}`);
    }
  }
  const success = Astro2.url.searchParams.get("success");
  const error = Astro2.url.searchParams.get("error");
  let message = "";
  if (success === "promo") message = "Promo berhasil ditambahkan!";
  if (success === "deleted") message = "Promo berhasil dihapus!";
  if (success === "status") message = "Status promo diperbarui!";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Kelola Promo - ${settings?.site_name}`, "data-astro-cid-werzfvnx": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section style="padding: 100px 0; background: #fdfcfb; min-height: 100vh;" data-astro-cid-werzfvnx> <div class="container" data-astro-cid-werzfvnx> <!-- Header --> <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem;" data-astro-cid-werzfvnx> <div data-astro-cid-werzfvnx> <a href="/buka-toko" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: var(--color-accent); text-decoration: none; display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; position: relative; z-index: 1001; cursor: pointer;" data-astro-cid-werzfvnx> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" data-astro-cid-werzfvnx><path d="M19 12H5M12 19l-7-7 7-7" data-astro-cid-werzfvnx></path></svg>\nKembali ke Dashboard\n</a> <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin: 0; font-weight: 400;" data-astro-cid-werzfvnx>\nManajemen <span style="font-style: italic;" data-astro-cid-werzfvnx>Promosi</span> </h1> <p style="opacity: 0.5; margin-top: 0.5rem;" data-astro-cid-werzfvnx>\nKelola banner dan penawaran spesial di halaman depan.\n</p> </div> </div> <!-- Flash Message --> ', " <!-- Error Message --> ", ' <div style="display: grid; grid-template-columns: 350px 1fr; gap: 3rem; align-items: start;" data-astro-cid-werzfvnx> <!-- Form Section --> <div class="glass-form" style="position: sticky; top: 120px;" data-astro-cid-werzfvnx> <h2 class="text-uppercase" style="font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 1.5rem; opacity: 0.8; font-weight: 700;" data-astro-cid-werzfvnx>\nTambah Banner Baru\n</h2> <form method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: 1.2rem;" data-astro-cid-werzfvnx> <input type="hidden" name="action" value="add_promo" data-astro-cid-werzfvnx> <div data-astro-cid-werzfvnx> <label class="input-label" data-astro-cid-werzfvnx>Judul Banner</label> <input name="title" type="text" required placeholder="Promo Koleksi Sutra" class="admin-input" data-astro-cid-werzfvnx> </div> <div data-astro-cid-werzfvnx> <label class="input-label" data-astro-cid-werzfvnx>Link Tujuan</label> <input name="link_url" type="text" placeholder="/products?type=Kain" class="admin-input" data-astro-cid-werzfvnx> </div> <div style="display: grid; grid-template-columns: 80px 1fr; gap: 15px;" data-astro-cid-werzfvnx> <div data-astro-cid-werzfvnx> <label class="input-label" data-astro-cid-werzfvnx>Urutan</label> <input name="order_index" type="number" value="0" class="admin-input" data-astro-cid-werzfvnx> </div> <div data-astro-cid-werzfvnx> <label class="input-label" data-astro-cid-werzfvnx>File Gambar</label> <input name="promo_file" type="file" accept="image/*" required style="font-size: 0.7rem; margin-top: 5px;" data-astro-cid-werzfvnx> <p style="font-size: 0.65rem; opacity: 0.4; margin-top: 4px; color: var(--color-accent); font-weight: 600;" data-astro-cid-werzfvnx>\nRekomendasi rasio 2:1 (Contoh: 1500 x 750 px)\n</p> </div> </div> <button type="submit" class="btn-save" data-astro-cid-werzfvnx>\nSimpan Promo\n</button> </form> </div> <!-- List Section --> <div data-astro-cid-werzfvnx> <div style="background: white; border-radius: var(--radius-md); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid #f1f1f1;" data-astro-cid-werzfvnx> <table style="width: 100%; border-collapse: collapse;" data-astro-cid-werzfvnx> <thead data-astro-cid-werzfvnx> <tr style="background: #fafafa; border-bottom: 1px solid #f0f0f0;" data-astro-cid-werzfvnx> <th class="th-style" data-astro-cid-werzfvnx>Preview</th> <th class="th-style" data-astro-cid-werzfvnx>Informasi Promo</th> <th class="th-style" style="text-align: center;" data-astro-cid-werzfvnx>Status</th> <th class="th-style" style="text-align: right;" data-astro-cid-werzfvnx>Aksi</th> </tr> </thead> <tbody data-astro-cid-werzfvnx> ', " </tbody> </table> ", ` </div> </div> </div> </div> </section>  <div id="delete-modal" class="modal-overlay" data-astro-cid-werzfvnx> <div class="modal-content" data-astro-cid-werzfvnx> <div class="modal-header" data-astro-cid-werzfvnx> <div class="warning-icon" data-astro-cid-werzfvnx> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-werzfvnx><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" data-astro-cid-werzfvnx></path></svg> </div> <h3 style="font-family: var(--font-serif); font-size: 1.5rem; font-weight: 400; margin: 0;" data-astro-cid-werzfvnx>Konfirmasi <span style="font-style: italic;" data-astro-cid-werzfvnx>Hapus</span></h3> </div> <p style="opacity: 0.6; line-height: 1.6; margin: 1.5rem 0; font-size: 0.95rem;" data-astro-cid-werzfvnx>Apakah Anda yakin ingin menghapus promo ini secara permanen? Tindakan ini tidak dapat dibatalkan.</p> <div class="modal-footer" data-astro-cid-werzfvnx> <button type="button" id="cancel-btn" class="btn-admin-secondary" data-astro-cid-werzfvnx>Batal</button> <button type="button" id="confirm-btn" class="btn-admin-danger" data-astro-cid-werzfvnx>Ya, Hapus</button> </div> </div> </div> <script>
		let currentForm = null;
		const modal = document.getElementById('delete-modal');
		const confirmBtn = document.getElementById('confirm-btn');
		const cancelBtn = document.getElementById('cancel-btn');

		window.openDeleteModal = function(form) {
			currentForm = form;
			modal.classList.add('active');
			document.body.style.overflow = 'hidden';
		}

		function closeModal() {
			modal.classList.remove('active');
			document.body.style.overflow = '';
			currentForm = null;
		}

		cancelBtn.addEventListener('click', closeModal);
		
		confirmBtn.addEventListener('click', () => {
			if (currentForm) {
				confirmBtn.disabled = true;
				confirmBtn.innerText = "Menghapus...";
				currentForm.submit();
			}
		});

		// Close on click outside
		modal.addEventListener('click', (e) => {
			if (e.target === modal) closeModal();
		});
	<\/script> `])), maybeRenderHead(), message && renderTemplate`<div style="background: #e6f9e9; color: #0d5a15; padding: 1rem 1.5rem; border-radius: 8px; margin-bottom: 2rem; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; border: 1px solid rgba(13, 90, 21, 0.1);" data-astro-cid-werzfvnx> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-werzfvnx><path d="M20 6L9 17l-5-5" data-astro-cid-werzfvnx></path></svg> ${message} </div>`, error && renderTemplate`<div style="background: #fff5f5; color: #b91c1c; padding: 1rem 1.5rem; border-radius: 8px; margin-bottom: 2rem; display: flex; align-items: center; gap: 10px; font-size: 0.9rem; border: 1px solid rgba(185, 28, 28, 0.1);" data-astro-cid-werzfvnx> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" data-astro-cid-werzfvnx><path d="M12 8v4M12 16h.01" data-astro-cid-werzfvnx></path></svg> <strong data-astro-cid-werzfvnx>Error:</strong> ${error} </div>`, promotions.map((p) => renderTemplate`<tr style="border-bottom: 1px solid #f9f9f9;" data-astro-cid-werzfvnx> <td style="padding: 1.5rem;" data-astro-cid-werzfvnx> <div class="promo-preview-box" data-astro-cid-werzfvnx> <img${addAttribute(p.image_url, "src")}${addAttribute(p.title, "alt")} data-astro-cid-werzfvnx> </div> </td> <td style="padding: 1.5rem;" data-astro-cid-werzfvnx> <div style="font-weight: 600; font-size: 1rem; color: #111;" data-astro-cid-werzfvnx> ${p.title} </div> <div style="font-size: 0.75rem; opacity: 0.4; margin-top: 4px;" data-astro-cid-werzfvnx>
Link: ${p.link_url} </div> <div style="font-size: 0.7rem; font-weight: 700; color: var(--color-accent); margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;" data-astro-cid-werzfvnx>
Urutan #${p.order_index} </div> </td> <td style="padding: 1.5rem; text-align: center;" data-astro-cid-werzfvnx> <form method="POST" data-astro-cid-werzfvnx> <input type="hidden" name="action" value="toggle_promo" data-astro-cid-werzfvnx> <input type="hidden" name="id"${addAttribute(p.id, "value")} data-astro-cid-werzfvnx> <input type="hidden" name="current_status"${addAttribute(String(p.is_active), "value")} data-astro-cid-werzfvnx> <button type="submit"${addAttribute(`status-toggle ${p.is_active ? "active" : "inactive"}`, "class")} data-astro-cid-werzfvnx> ${p.is_active ? "Aktif" : "Nonaktif"} </button> </form> </td> <td style="padding: 1.5rem; text-align: right;" data-astro-cid-werzfvnx> <form method="POST" class="delete-form" data-astro-cid-werzfvnx> <input type="hidden" name="action" value="delete_promo" data-astro-cid-werzfvnx> <input type="hidden" name="id"${addAttribute(p.id, "value")} data-astro-cid-werzfvnx> <button type="button" class="btn-delete" onclick="openDeleteModal(this.form)" data-astro-cid-werzfvnx> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-werzfvnx><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-astro-cid-werzfvnx></path></svg> </button> </form> </td> </tr>`), promotions.length === 0 && renderTemplate`<div style="padding: 4rem; text-align: center; opacity: 0.3;" data-astro-cid-werzfvnx> <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom: 1rem;" data-astro-cid-werzfvnx><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" data-astro-cid-werzfvnx></path><path d="M12 8v4M12 16h.01" data-astro-cid-werzfvnx></path></svg> <p data-astro-cid-werzfvnx>Belum ada banner promo yang ditambahkan.</p> </div>`) })}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/promosi.astro", void 0);

const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/promosi.astro";
const $$url = "/buka-toko/promosi";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Promosi,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
