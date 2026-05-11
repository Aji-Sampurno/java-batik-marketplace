import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, n as defineScriptVars, o as Fragment, h as addAttribute, m as maybeRenderHead } from './entrypoint_B7dm8yGT.mjs';
import { a as apiFetch, u as uploadToLaravel, $ as $$Layout } from './Layout_CnwklWu_.mjs';
import { $ as $$DeleteConfirmModal } from './DeleteConfirmModal_qO62LaXG.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$TambahProduk = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$TambahProduk;
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
    const pRes = await apiFetch("products");
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
          const name = formData.get("name");
          const price = formData.get("price");
          const category_ids = formData.getAll("category_ids");
          const type_id = category_ids[0] || null;
          const motif_ids = formData.getAll("motif_ids");
          const description = formData.get("description");
          const code = formData.get("code");
          const image_files = formData.getAll("image_file");
          const tokopedia_url = formData.get("tokopedia_url");
          const original_price = formData.get("original_price");
          const item_code = formData.get("item_code");
          let image_url = "";
          let images = [];
          if (image_files && image_files.length > 0) {
            for (const file of image_files) {
              if (file.size > 0) {
                const publicUrl = await uploadToLaravel(file, "products");
                images.push(publicUrl);
              }
            }
            if (images.length > 0) image_url = images[0];
          }
          const variant_sizes = formData.getAll("variant_size");
          const variant_prices = formData.getAll("variant_price");
          const variant_stocks = formData.getAll("variant_stock");
          const variants = variant_sizes.map((size, index) => ({
            size_name: size,
            price: parseFloat(variant_prices[index] || price?.toString() || "0"),
            stock: parseInt(variant_stocks[index] || "0", 10)
          }));
          await apiFetch("products", {
            method: "POST",
            body: JSON.stringify({
              name,
              price,
              type_id,
              category_ids,
              motif_ids,
              description,
              code,
              original_price,
              item_code,
              image_url,
              images,
              tokopedia_url,
              variants,
              is_active: true
            })
          });
          return Astro2.redirect("/buka-toko?success=product");
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Admin Panel - ${settings?.site_name || "Batik Nusantara"}` }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section style="padding: var(--spacing-xl) 0; min-height: 80vh;"> <div class="container"> <div class="admin-header"> <div style="display: flex; align-items: center; gap: var(--spacing-md);"> <div> <h1 class="text-uppercase" style="font-size: 1.2rem; margin: 0; font-weight: 600;"> ', ' Dashboard\n</h1> <p style="font-size: 0.8rem; opacity: 0.5;">\nKelola identitas dan katalog batik Anda.\n</p> </div> </div> <div style="display: flex; gap: var(--spacing-md); align-items: center;"> <a href="/buka-toko" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: var(--radius-sm); color: var(--color-text);">&larr; Kembali ke Dashboard</a> </div> </div> ', ' <div style="max-width: 900px; margin: 0 auto;"> <!-- Form Product --> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"> <h2 style="font-size: 1rem; margin-bottom: var(--spacing-lg); font-weight: 600;" class="text-uppercase">\nTambah Produk Baru\n</h2> <form method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: var(--spacing-md);"> <input type="hidden" name="action" value="add_product"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Nama Produk</label> <input name="name" id="product_name_input" type="text" required placeholder="Kemeja Batik Parang" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kode SKU</label> <input name="code" id="product_sku_input" type="text" placeholder="BTK-001" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kode Barang (Auto-Name)</label> <input name="item_code" id="product_item_code_input" type="text" placeholder="001" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Harga (Rp)</label> <input type="text" class="currency-mask" data-hidden-id="product_price_input" required id="product_price_input_display" placeholder="450.000" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> <input type="hidden" name="price" id="product_price_input"> <div id="price_markup_preview" style="font-size: 0.65rem; color: #10b981; margin-top: 0.4rem; font-weight: 600; display: none;">\nHarga Coret: Rp <span id="markup_val">0</span> (Hemat Rp <span id="markup_pct">0</span>)\n</div> <input type="hidden" name="original_price" id="original_price_input"> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kategori Produk</label> <div class="searchable-select" data-ss-type="product-l1"> <input type="hidden" name="category_ids" id="l1_category_input"> <input type="text" class="ss-input" placeholder="Cari & Pilih Kategori Utama..." readonly style="background: #ffffff; border-style: solid;"> <div class="ss-dropdown"> <div class="ss-search-container"> <svg class="ss-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="text" class="ss-search" placeholder="Cari kategori..."> </div> <div class="ss-options"> ', ' </div> </div> </div> <div id="sub-category-checkboxes" class="cascading-container"></div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Motif (Multi-select)</label> <div class="motif-style-container" id="motif-grid"> ', ' </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Foto Produk (Bisa Pilih Banyak)</label> <input name="image_file" type="file" accept="image/*" multiple required style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: var(--radius-sm); background: #fcfcfc; font-size: 0.75rem;"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Ukuran & Variasi Harga</label> <p style="font-size: 0.7rem; color: var(--color-muted); margin-bottom: 1rem;">Centang ukuran yang tersedia, lalu isi harga khususnya jika berbeda.</p> <label id="sleeve_toggle_wrapper" style="display: none; align-items: center; gap: 0.5rem; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm); cursor: pointer; background: #fcfcfc; margin-bottom: 1rem;"> <input type="checkbox" id="toggle_sleeve_options_add"> <span style="font-size: 0.85rem; font-weight: 500;">Aktifkan Pilihan Lengan (Pendek & Panjang)</span> </label> <div style="display: flex; flex-direction: column; gap: 0.5rem; background: #fcfcfc; padding: 1rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> ', " ", ' </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Link Tokopedia (Opsional)</label> <input name="tokopedia_url" type="url" placeholder="https://www.tokopedia.com/..." style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Deskripsi Produk</label> <textarea name="description" rows="2" placeholder="Detail produk..." style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"></textarea> </div> <div style="margin-top: var(--spacing-sm);"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.8rem; border: none; text-transform: uppercase; letter-spacing: 2px; width: 100%; cursor: pointer; font-weight: 600; font-size: 0.75rem; border-radius: var(--radius-sm); transition: var(--transition);">Simpan Produk</button> </div> </form> </div> </div>  ', " <script>(function(){", `
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
	})();<\/script> </div></section>`], [" ", '<section style="padding: var(--spacing-xl) 0; min-height: 80vh;"> <div class="container"> <div class="admin-header"> <div style="display: flex; align-items: center; gap: var(--spacing-md);"> <div> <h1 class="text-uppercase" style="font-size: 1.2rem; margin: 0; font-weight: 600;"> ', ' Dashboard\n</h1> <p style="font-size: 0.8rem; opacity: 0.5;">\nKelola identitas dan katalog batik Anda.\n</p> </div> </div> <div style="display: flex; gap: var(--spacing-md); align-items: center;"> <a href="/buka-toko" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: var(--radius-sm); color: var(--color-text);">&larr; Kembali ke Dashboard</a> </div> </div> ', ' <div style="max-width: 900px; margin: 0 auto;"> <!-- Form Product --> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-lg); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"> <h2 style="font-size: 1rem; margin-bottom: var(--spacing-lg); font-weight: 600;" class="text-uppercase">\nTambah Produk Baru\n</h2> <form method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: var(--spacing-md);"> <input type="hidden" name="action" value="add_product"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Nama Produk</label> <input name="name" id="product_name_input" type="text" required placeholder="Kemeja Batik Parang" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kode SKU</label> <input name="code" id="product_sku_input" type="text" placeholder="BTK-001" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kode Barang (Auto-Name)</label> <input name="item_code" id="product_item_code_input" type="text" placeholder="001" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Harga (Rp)</label> <input type="text" class="currency-mask" data-hidden-id="product_price_input" required id="product_price_input_display" placeholder="450.000" style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> <input type="hidden" name="price" id="product_price_input"> <div id="price_markup_preview" style="font-size: 0.65rem; color: #10b981; margin-top: 0.4rem; font-weight: 600; display: none;">\nHarga Coret: Rp <span id="markup_val">0</span> (Hemat Rp <span id="markup_pct">0</span>)\n</div> <input type="hidden" name="original_price" id="original_price_input"> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Kategori Produk</label> <div class="searchable-select" data-ss-type="product-l1"> <input type="hidden" name="category_ids" id="l1_category_input"> <input type="text" class="ss-input" placeholder="Cari & Pilih Kategori Utama..." readonly style="background: #ffffff; border-style: solid;"> <div class="ss-dropdown"> <div class="ss-search-container"> <svg class="ss-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="text" class="ss-search" placeholder="Cari kategori..."> </div> <div class="ss-options"> ', ' </div> </div> </div> <div id="sub-category-checkboxes" class="cascading-container"></div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Motif (Multi-select)</label> <div class="motif-style-container" id="motif-grid"> ', ' </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Foto Produk (Bisa Pilih Banyak)</label> <input name="image_file" type="file" accept="image/*" multiple required style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: var(--radius-sm); background: #fcfcfc; font-size: 0.75rem;"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Ukuran & Variasi Harga</label> <p style="font-size: 0.7rem; color: var(--color-muted); margin-bottom: 1rem;">Centang ukuran yang tersedia, lalu isi harga khususnya jika berbeda.</p> <label id="sleeve_toggle_wrapper" style="display: none; align-items: center; gap: 0.5rem; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm); cursor: pointer; background: #fcfcfc; margin-bottom: 1rem;"> <input type="checkbox" id="toggle_sleeve_options_add"> <span style="font-size: 0.85rem; font-weight: 500;">Aktifkan Pilihan Lengan (Pendek & Panjang)</span> </label> <div style="display: flex; flex-direction: column; gap: 0.5rem; background: #fcfcfc; padding: 1rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> ', " ", ' </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Link Tokopedia (Opsional)</label> <input name="tokopedia_url" type="url" placeholder="https://www.tokopedia.com/..." style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.6rem; display: block; margin-bottom: 0.3rem;">Deskripsi Produk</label> <textarea name="description" rows="2" placeholder="Detail produk..." style="width: 100%; padding: 0.7rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"></textarea> </div> <div style="margin-top: var(--spacing-sm);"> <button type="submit" style="background: var(--color-text); color: white; padding: 0.8rem; border: none; text-transform: uppercase; letter-spacing: 2px; width: 100%; cursor: pointer; font-weight: 600; font-size: 0.75rem; border-radius: var(--radius-sm); transition: var(--transition);">Simpan Produk</button> </div> </form> </div> </div>  ', " <script>(function(){", `
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
	})();<\/script> </div></section>`])), maybeRenderHead(), settings?.site_name || "Batik Nusantara", message && renderTemplate`<div class="animate-fade-in"${addAttribute(`padding: 1rem; margin-bottom: 2rem; border-radius: var(--radius-sm); border: 1px solid ${isError ? "#ff4d4d" : "#03ac0e"}; background: ${isError ? "#fff5f5" : "#f5fff5"}; color: ${isError ? "#ff4d4d" : "#03ac0e"}; text-align: center; font-size: 0.9rem; font-weight: 500;`, "style")}> ${message} </div>`, hierarchicalTypes.filter(
    (t) => t.parent_id === null
  ).map((t) => renderTemplate`<div class="ss-option"${addAttribute(t.id, "data-value")}> <span> ${t.name} </span> <span class="lvl-badge lvl-1">
Root
</span> </div>`), motifs?.map((m) => renderTemplate`<label class="motif-style-label"> <input type="checkbox" name="motif_ids"${addAttribute(m.id, "value")}> ${m.name} </label>`), sizesData.map((size) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="variant-item-add variant-standard" style="display: flex; align-items: center; gap: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;"> <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; min-width: 60px;"> <input type="checkbox" class="variant-cb-add"${addAttribute(size.name, "value")} style="margin-top: 2px;"> <span style="display: flex; flex-direction: column;"> <strong style="font-weight: 500;">${size.name}</strong> </span> </label> <input type="hidden" name="variant_size"${addAttribute(size.name, "value")} disabled class="v-size-input-add"> <div class="v-details-add" style="flex: 1; gap: 0.5rem; display: none;"> <div style="flex: 1;"> <span style="font-size: 0.6rem; opacity: 0.5;">Harga (Rp)</span> <input type="text" placeholder="Harga" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;" disabled class="v-price-input-add currency-mask"> <input type="hidden" name="variant_price" disabled class="v-price-hidden-add"> </div> <div style="width: 80px;"> <span style="font-size: 0.6rem; opacity: 0.5;">Stok</span> <input type="number" name="variant_stock" value="0" placeholder="Stok" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;" disabled class="v-stock-input-add"> </div> </div> </div> ${["Lengan Pendek", "Lengan Panjang"].map((sleeve) => renderTemplate`<div class="variant-item-add variant-sleeve-split" style="display: none; align-items: center; gap: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; padding-left: 1.5rem;"> <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; min-width: 120px;"> <input type="checkbox" class="variant-cb-add"${addAttribute(`${size.name} - ${sleeve}`, "value")} style="margin-top: 2px;"> <span style="display: flex; flex-direction: column;"> <strong style="font-weight: 500;">${size.name}</strong> <span style="font-size: 0.7rem; opacity: 0.6;">${sleeve}</span> </span> </label> <input type="hidden" name="variant_size"${addAttribute(`${size.name} - ${sleeve}`, "value")} disabled class="v-size-input-add"> <div class="v-details-add" style="flex: 1; gap: 0.5rem; display: none;"> <div style="flex: 1;"> <span style="font-size: 0.6rem; opacity: 0.5;">Harga (Rp)</span> <input type="text" placeholder="Harga" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;" disabled class="v-price-input-add currency-mask"> <input type="hidden" name="variant_price" disabled class="v-price-hidden-add"> </div> <div style="width: 80px;"> <span style="font-size: 0.6rem; opacity: 0.5;">Stok</span> <input type="number" name="variant_stock" value="0" placeholder="Stok" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;" disabled class="v-stock-input-add"> </div> </div> </div>`)}` })}`), sizesData.length === 0 && renderTemplate`<span style="font-size: 0.7rem; opacity: 0.5;">
Belum ada data ukuran.
</span>`, renderComponent($$result2, "DeleteConfirmModal", $$DeleteConfirmModal, {}), defineScriptVars({ hierarchicalTypes })) })}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/tambah-produk.astro", void 0);

const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/tambah-produk.astro";
const $$url = "/buka-toko/tambah-produk";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$TambahProduk,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
