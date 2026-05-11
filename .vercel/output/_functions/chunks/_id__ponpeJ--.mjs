import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { r as renderTemplate, n as defineScriptVars, l as renderComponent, m as maybeRenderHead, h as addAttribute, o as Fragment } from './entrypoint_B7dm8yGT.mjs';
import { a as apiFetch, u as uploadToLaravel, $ as $$Layout } from './Layout_CnwklWu_.mjs';
import { $ as $$DeleteConfirmModal } from './DeleteConfirmModal_qO62LaXG.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const session = Astro2.cookies.get("admin_session");
  if (session?.value !== "authenticated") {
    return Astro2.redirect("/login");
  }
  const { id } = Astro2.params;
  let product = null;
  let types = [];
  let motifs = [];
  let sizesData = [];
  let selectedMotifIds = [];
  let message = "";
  let isError = false;
  try {
    const pRes = await apiFetch(`products/${id}`);
    product = pRes?.data || pRes;
    if (product) {
      selectedMotifIds = product.product_motifs?.map((pm) => pm.motif_id) || [];
    }
    const tRes = await apiFetch("types");
    types = tRes?.data || tRes || [];
    const mRes = await apiFetch("motifs");
    motifs = mRes?.data || mRes || [];
    const szRes = await apiFetch("sizes");
    sizesData = szRes?.data || szRes || [];
  } catch (e) {
    console.error("API Fetch Error:", e.message);
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
  let currentL1CatId = null;
  let currentCategoryIds = [];
  if (product) {
    currentCategoryIds = product.product_categories.map(
      (pc) => pc.category_id
    );
    const l1 = types.find(
      (t) => currentCategoryIds.includes(t.id) && t.parent_id === null
    );
    currentL1CatId = l1?.id || null;
  }
  if (!product) {
    return Astro2.redirect("/buka-toko");
  }
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const action = formData.get("action");
      if (action === "delete_product") {
        await apiFetch(`products/${id}`, { method: "DELETE" });
        return Astro2.redirect("/buka-toko?success=delete");
      }
      const name = formData.get("name");
      const price = formData.get("price");
      const type_id = formData.get("type_id");
      const motif_ids = formData.getAll("motif_ids");
      const description = formData.get("description");
      const code = formData.get("code");
      const image_files = formData.getAll("image_file");
      const tokopedia_url = formData.get("tokopedia_url");
      const is_active = formData.get("is_active") === "on";
      let updatedImages = [...product.images || []];
      let primaryImageUrl = product.image_url;
      if (image_files && image_files.length > 0 && image_files[0].size > 0) {
        const newImages = [];
        for (const file of image_files) {
          if (file.size > 0) {
            const publicUrl = await uploadToLaravel(file, "products");
            newImages.push(publicUrl);
          }
        }
        updatedImages = newImages;
        primaryImageUrl = newImages[0];
      }
      const variant_sizes = formData.getAll("variant_size");
      const variant_prices = formData.getAll("variant_price");
      const variant_stocks = formData.getAll("variant_stock");
      const variants = variant_sizes.map((size, index) => ({
        size_name: size,
        price: parseFloat(variant_prices[index] || price?.toString() || "0"),
        stock: parseInt(variant_stocks[index] || "0", 10)
      }));
      await apiFetch(`products/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          price,
          type_id: formData.getAll("category_ids")[0] || null,
          category_ids: formData.getAll("category_ids"),
          motif_ids,
          image_url: primaryImageUrl,
          images: updatedImages,
          tokopedia_url,
          description,
          code,
          original_price: formData.get("original_price"),
          item_code: formData.get("item_code"),
          is_active,
          variants
        })
      });
      return Astro2.redirect("/buka-toko?success=status");
    } catch (e) {
      isError = true;
      message = "Gagal memperbarui produk: " + e.message;
    }
  }
  return renderTemplate(_a || (_a = __template(["", "  <script>(function(){", `
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

	function initSearchableSelect() {
		const selectContainers =
			document.querySelectorAll(".searchable-select");
		selectContainers.forEach((container) => {
			const input = container.querySelector(".ss-input");
			const hiddenInput = container.querySelector('input[type="hidden"]');
			const dropdown = container.querySelector(".ss-dropdown");
			const searchInput = container.querySelector(".ss-search");
			const options = container.querySelectorAll(".ss-option");
			const optionsContainer = container.querySelector(".ss-options");
			const ssType = container.getAttribute("data-ss-type");

			input.addEventListener("click", (e) => {
				e.stopPropagation();
				dropdown.classList.toggle("show");
				if (dropdown.classList.contains("show")) {
					searchInput.focus();
				}
			});

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
				const noRes = optionsContainer.querySelector(".ss-no-results");
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

					if (ssType === "product-l1") {
						renderSubCategoriesFromList([val]);
					}
				});
			});

			document.addEventListener("click", (e) => {
				if (!container.contains(e.target))
					dropdown.classList.remove("show");
			});
		});
	}

	function renderSubCategoriesFromList(parentIds) {
		const container = document.getElementById("sub-category-checkboxes");
		if (!container || parentIds.length === 0) return;

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
			l3Grid.innerHTML = "";
			let hasL3 = false;

			if (checkedL2s.length === 0) {
				l3Area.style.display = "none";
				updateName();
				return;
			}

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
						const isChecked = currentCategoryIds.includes(cc.id)
							? "checked"
							: "";
						label.innerHTML = \`<input type="checkbox" name="category_ids" value="\${cc.id}" data-id="\${cc.id}" \${isChecked} /> \${cc.name}\`;
						l3Grid.appendChild(label);

						label.querySelector("input").addEventListener("change", updateName);
					});
				}
			});
			l3Area.style.display = hasL3 ? "block" : "none";
			updateName();
		}

		const l2Children = hierarchicalTypes.filter((t) =>
			parentIds.includes(t.parent_id),
		);
		l2Children.forEach((c) => {
			const label = document.createElement("label");
			label.className = "motif-style-label";
			const isChecked = currentCategoryIds.includes(c.id)
				? "checked"
				: "";
			label.innerHTML = \`<input type="checkbox" name="category_ids" value="\${c.id}" data-id="\${c.id}" \${isChecked} /> \${c.name}\`;
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

		// Trigger initial population
		updateL3Selection();
		updateName();
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
				// Don't auto-hide if it's already checked/active with real data
				const toggleCb = document.getElementById('toggle_sleeve_options');
				if (toggleCb && !toggleCb.checked) {
					sleeveWrapper.style.display = 'none';
				} else if (toggleCb && toggleCb.checked) {
				    // Even if it doesn't match the new category, it was checked, so leave it visible for the user to uncheck
				    sleeveWrapper.style.display = 'flex';
				}
			}
		}
	}


	// Naming Listeners Setup
	function setupNamingAutomation() {
		const itemCodeInput = document.getElementById("product_item_code_input");
		const l1Input = document.getElementById("l1_category_input");

		itemCodeInput?.addEventListener("input", updateName);

		const motifGrid = document.getElementById("motif-grid");
		motifGrid?.addEventListener("change", updateName);

		if (l1Input) {
			const observer = new MutationObserver(updateName);
			observer.observe(l1Input, { attributes: true });
		}
	}


	// Initialize
	initSearchableSelect();
	const initialL1Input = document.getElementById("l1_category_input");
	if (initialL1Input && initialL1Input.value) {
		renderSubCategoriesFromList([initialL1Input.value]);
	}
	setupNamingAutomation();

	// Variasi UI Logic
	document.querySelectorAll('.variant-cb').forEach(cb => {
		cb.addEventListener('change', (e) => {
			const parent = e.target.closest('.variant-item');
			const vSize = parent.querySelector('.v-size-input');
			const vPriceDisp = parent.querySelector('.v-price-input');
			const vPriceHid = parent.querySelector('.v-price-hidden-input');
			const vStock = parent.querySelector('.v-stock-input');
			const details = parent.querySelector('.v-details');
			
			const isChecked = e.target.checked;
			vSize.disabled = !isChecked;
			vPriceDisp.disabled = !isChecked;
			if(vPriceHid) vPriceHid.disabled = !isChecked;
			vStock.disabled = !isChecked;
			details.style.display = isChecked ? 'flex' : 'none';
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
	const sleeveToggleEdit = document.getElementById('toggle_sleeve_options');
	if(sleeveToggleEdit) {
		sleeveToggleEdit.addEventListener('change', (e) => {
			const isChecked = e.target.checked;
			document.querySelectorAll('.variant-standard').forEach(el => {
				el.style.display = isChecked ? 'none' : 'flex';
				if(isChecked) {
					const cb = el.querySelector('.variant-cb');
					if(cb && cb.checked) {
						cb.checked = false;
						cb.dispatchEvent(new Event('change'));
					}
				}
			});
			document.querySelectorAll('.variant-sleeve-split').forEach(el => {
				el.style.display = isChecked ? 'flex' : 'none';
				if(!isChecked) {
					const cb = el.querySelector('.variant-cb');
					if(cb && cb.checked) {
						cb.checked = false;
						cb.dispatchEvent(new Event('change'));
					}
				}
			});
		});
	}
})();<\/script>`], ["", "  <script>(function(){", `
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

	function initSearchableSelect() {
		const selectContainers =
			document.querySelectorAll(".searchable-select");
		selectContainers.forEach((container) => {
			const input = container.querySelector(".ss-input");
			const hiddenInput = container.querySelector('input[type="hidden"]');
			const dropdown = container.querySelector(".ss-dropdown");
			const searchInput = container.querySelector(".ss-search");
			const options = container.querySelectorAll(".ss-option");
			const optionsContainer = container.querySelector(".ss-options");
			const ssType = container.getAttribute("data-ss-type");

			input.addEventListener("click", (e) => {
				e.stopPropagation();
				dropdown.classList.toggle("show");
				if (dropdown.classList.contains("show")) {
					searchInput.focus();
				}
			});

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
				const noRes = optionsContainer.querySelector(".ss-no-results");
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

					if (ssType === "product-l1") {
						renderSubCategoriesFromList([val]);
					}
				});
			});

			document.addEventListener("click", (e) => {
				if (!container.contains(e.target))
					dropdown.classList.remove("show");
			});
		});
	}

	function renderSubCategoriesFromList(parentIds) {
		const container = document.getElementById("sub-category-checkboxes");
		if (!container || parentIds.length === 0) return;

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
			l3Grid.innerHTML = "";
			let hasL3 = false;

			if (checkedL2s.length === 0) {
				l3Area.style.display = "none";
				updateName();
				return;
			}

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
						const isChecked = currentCategoryIds.includes(cc.id)
							? "checked"
							: "";
						label.innerHTML = \\\`<input type="checkbox" name="category_ids" value="\\\${cc.id}" data-id="\\\${cc.id}" \\\${isChecked} /> \\\${cc.name}\\\`;
						l3Grid.appendChild(label);

						label.querySelector("input").addEventListener("change", updateName);
					});
				}
			});
			l3Area.style.display = hasL3 ? "block" : "none";
			updateName();
		}

		const l2Children = hierarchicalTypes.filter((t) =>
			parentIds.includes(t.parent_id),
		);
		l2Children.forEach((c) => {
			const label = document.createElement("label");
			label.className = "motif-style-label";
			const isChecked = currentCategoryIds.includes(c.id)
				? "checked"
				: "";
			label.innerHTML = \\\`<input type="checkbox" name="category_ids" value="\\\${c.id}" data-id="\\\${c.id}" \\\${isChecked} /> \\\${c.name}\\\`;
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

		// Trigger initial population
		updateL3Selection();
		updateName();
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
				// Don't auto-hide if it's already checked/active with real data
				const toggleCb = document.getElementById('toggle_sleeve_options');
				if (toggleCb && !toggleCb.checked) {
					sleeveWrapper.style.display = 'none';
				} else if (toggleCb && toggleCb.checked) {
				    // Even if it doesn't match the new category, it was checked, so leave it visible for the user to uncheck
				    sleeveWrapper.style.display = 'flex';
				}
			}
		}
	}


	// Naming Listeners Setup
	function setupNamingAutomation() {
		const itemCodeInput = document.getElementById("product_item_code_input");
		const l1Input = document.getElementById("l1_category_input");

		itemCodeInput?.addEventListener("input", updateName);

		const motifGrid = document.getElementById("motif-grid");
		motifGrid?.addEventListener("change", updateName);

		if (l1Input) {
			const observer = new MutationObserver(updateName);
			observer.observe(l1Input, { attributes: true });
		}
	}


	// Initialize
	initSearchableSelect();
	const initialL1Input = document.getElementById("l1_category_input");
	if (initialL1Input && initialL1Input.value) {
		renderSubCategoriesFromList([initialL1Input.value]);
	}
	setupNamingAutomation();

	// Variasi UI Logic
	document.querySelectorAll('.variant-cb').forEach(cb => {
		cb.addEventListener('change', (e) => {
			const parent = e.target.closest('.variant-item');
			const vSize = parent.querySelector('.v-size-input');
			const vPriceDisp = parent.querySelector('.v-price-input');
			const vPriceHid = parent.querySelector('.v-price-hidden-input');
			const vStock = parent.querySelector('.v-stock-input');
			const details = parent.querySelector('.v-details');
			
			const isChecked = e.target.checked;
			vSize.disabled = !isChecked;
			vPriceDisp.disabled = !isChecked;
			if(vPriceHid) vPriceHid.disabled = !isChecked;
			vStock.disabled = !isChecked;
			details.style.display = isChecked ? 'flex' : 'none';
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
	const sleeveToggleEdit = document.getElementById('toggle_sleeve_options');
	if(sleeveToggleEdit) {
		sleeveToggleEdit.addEventListener('change', (e) => {
			const isChecked = e.target.checked;
			document.querySelectorAll('.variant-standard').forEach(el => {
				el.style.display = isChecked ? 'none' : 'flex';
				if(isChecked) {
					const cb = el.querySelector('.variant-cb');
					if(cb && cb.checked) {
						cb.checked = false;
						cb.dispatchEvent(new Event('change'));
					}
				}
			});
			document.querySelectorAll('.variant-sleeve-split').forEach(el => {
				el.style.display = isChecked ? 'flex' : 'none';
				if(!isChecked) {
					const cb = el.querySelector('.variant-cb');
					if(cb && cb.checked) {
						cb.checked = false;
						cb.dispatchEvent(new Event('change'));
					}
				}
			});
		});
	}
})();<\/script>`])), renderComponent($$result, "Layout", $$Layout, { "title": `Edit Produk - ${product.name}` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section style="padding: var(--spacing-xl) 0; min-height: 80vh;"> <div class="container" style="max-width: 800px;"> <div style="margin-bottom: var(--spacing-xl); display: flex; justify-content: space-between; align-items: center;"> <div> <h1 class="text-uppercase" style="font-size: 1.5rem; margin: 0; font-weight: 600;">
Edit Produk
</h1> <p style="font-size: 0.8rem; opacity: 0.5;">
Ubah detail produk
</p> </div> <a href="/buka-toko" style="font-size: 0.8rem; text-transform: uppercase; color: var(--color-muted); border-bottom: 1px solid #ccc; padding-bottom: 2px;">Kembali ke Dashboard</a> </div> ${message && renderTemplate`<div class="animate-fade-in"${addAttribute(`padding: 1rem; margin-bottom: 2rem; border-radius: var(--radius-sm); border: 1px solid ${isError ? "#ff4d4d" : "#03ac0e"}; background: ${isError ? "#fff5f5" : "#f5fff5"}; color: ${isError ? "#ff4d4d" : "#03ac0e"}; text-align: center; font-size: 0.9rem; font-weight: 500;`, "style")}> ${message} </div>`} <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-xl); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);"> <form method="POST" enctype="multipart/form-data" style="display: flex; flex-direction: column; gap: var(--spacing-lg);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Nama Produk</label> <input name="name" id="product_name_input" type="text" required${addAttribute(product.name, "value")} style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Kode SKU</label> <input name="code" id="product_sku_input" type="text"${addAttribute(product.code, "value")} style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Kode Barang (Auto-Name)</label> <input name="item_code" id="product_item_code_input" type="text"${addAttribute(product.item_code, "value")} style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Harga (Rp)</label> <input type="text" class="currency-mask" data-hidden-id="product_price_input" required id="product_price_input_display"${addAttribute(product.price, "value")} style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> <input type="hidden" name="price" id="product_price_input"${addAttribute(product.price, "value")}> <div id="price_markup_preview" style="font-size: 0.65rem; color: #10b981; margin-top: 0.4rem; font-weight: 600; display: \${product.original_price ? 'block' : 'none'};">
Harga Coret: Rp <span id="markup_val">${product.original_price ? Number(
    product.original_price
  ).toLocaleString("id-ID") : "0"}</span> (Hemat Rp <span id="markup_pct">${product.original_price ? Number(product.original_price - product.price).toLocaleString("id-ID") : "0"}</span>)
</div> <input type="hidden" name="original_price" id="original_price_input"${addAttribute(product.original_price || "", "value")}> </div> </div> <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);"> <div class="filter-group"> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Kategori Produk</label> <div class="searchable-select" data-ss-type="product-l1"> <input type="hidden" name="category_ids" id="l1_category_input"${addAttribute(currentL1CatId, "value")}> <input type="text" class="ss-input" placeholder="Cari & Pilih Kategori Utama..." readonly${addAttribute(types.find(
    (t) => t.id === currentL1CatId
  )?.name || "", "value")} style="background: #ffffff; border-style: solid;"> <div class="ss-dropdown"> <div class="ss-search-container"> <svg class="ss-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> <input type="text" class="ss-search" placeholder="Cari kategori..."> </div> <div class="ss-options"> ${hierarchicalTypes.filter(
    (t) => t.parent_id === null
  ).map((t) => renderTemplate`<div class="ss-option"${addAttribute(t.id, "data-value")}> <span>${t.name}</span> <span class="lvl-badge lvl-1">
Root
</span> </div>`)} </div> </div> </div> <div id="sub-category-checkboxes" class="cascading-container"></div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Status Katalog</label> <label style="display: flex; align-items: center; gap: 0.5rem; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm); cursor: pointer; background: #fcfcfc;"> <input type="checkbox" name="is_active"${addAttribute(product.is_active, "checked")}> <span style="font-size: 0.85rem;">Tampilkan di Toko (In Stock)</span> </label> </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Motif Batik (Bisa Pilih Banyak)</label> <div class="motif-style-container" id="motif-grid"> ${motifs?.map((m) => renderTemplate`<label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer;"> <input type="checkbox" name="motif_ids"${addAttribute(m.id, "value")}${addAttribute(selectedMotifIds.includes(
    m.id
  ), "checked")}> ${m.name} </label>`)} </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Ukuran & Variasi Harga</label> <p style="font-size: 0.7rem; color: var(--color-muted); margin-bottom: 1rem;">Centang ukuran yang tersedia, lalu isi harga khususnya jika berbeda.</p> ${(() => {
    const sleeveKeywords = ["kemeja", "baju", "hem", "atasan", "blouse", "tunik", "gamis", "koko", "pdh", "jaket"];
    const categoryNames = product.product_categories?.map((pc) => pc.types?.name?.toLowerCase() || "") || [];
    if (product.types?.name) categoryNames.push(product.types?.name?.toLowerCase());
    const jenisStr = categoryNames.join(" ");
    const needsSleeve = sleeveKeywords.some((kw) => jenisStr.includes(kw));
    const hasLengan = product.product_variants?.some((v) => v.size_name?.includes("Lengan Pendek") || v.size_name?.includes("Lengan Panjang"));
    const showWrapper = hasLengan || needsSleeve;
    return renderTemplate`<label id="sleeve_toggle_wrapper"${addAttribute(`display: ${showWrapper ? "flex" : "none"}; align-items: center; gap: 0.5rem; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm); cursor: pointer; background: #fcfcfc; margin-bottom: 1rem;`, "style")}> <input type="checkbox" id="toggle_sleeve_options"${addAttribute(hasLengan, "checked")}> <span style="font-size: 0.85rem; font-weight: 500;">Aktifkan Pilihan Lengan (Pendek & Panjang)</span> </label>`;
  })()} <div style="display: flex; flex-direction: column; gap: 0.5rem; background: #fcfcfc; padding: 1rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> ${sizesData.map((s) => {
    const hasLengan = product.product_variants?.some((v) => v.size_name?.includes("Lengan Pendek") || v.size_name?.includes("Lengan Panjang"));
    const existingVarStd = product.product_variants?.find((v) => v.size_name === s.name);
    const isCheckedStd = !!existingVarStd;
    const vPriceStd = isCheckedStd ? existingVarStd.price : product.price;
    const vStockStd = isCheckedStd ? existingVarStd.stock : 0;
    const vPendek = `${s.name} - Lengan Pendek`;
    const existingVarPendek = product.product_variants?.find((v) => v.size_name === vPendek);
    const isCheckedPendek = !!existingVarPendek;
    const vPricePendek = isCheckedPendek ? existingVarPendek.price : product.price;
    const vStockPendek = isCheckedPendek ? existingVarPendek.stock : 0;
    const vPanjang = `${s.name} - Lengan Panjang`;
    const existingVarPanjang = product.product_variants?.find((v) => v.size_name === vPanjang);
    const isCheckedPanjang = !!existingVarPanjang;
    const vPricePanjang = isCheckedPanjang ? existingVarPanjang.price : product.price;
    const vStockPanjang = isCheckedPanjang ? existingVarPanjang.stock : 0;
    return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="variant-item variant-standard"${addAttribute(`display: ${hasLengan ? "none" : "flex"}; align-items: center; gap: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;`, "style")}> <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; min-width: 60px;"> <input type="checkbox" class="variant-cb"${addAttribute(s.name, "value")}${addAttribute(isCheckedStd, "checked")} style="margin-top: 2px;"> <span style="display: flex; flex-direction: column;"> <strong style="font-weight: 500;">${s.name}</strong> </span> </label> <input type="hidden" name="variant_size"${addAttribute(s.name, "value")}${addAttribute(!isCheckedStd, "disabled")} class="v-size-input"> <div class="v-details"${addAttribute(`flex: 1; gap: 0.5rem; display: ${isCheckedStd ? "flex" : "none"};`, "style")}> <div style="flex: 1;"> <span style="font-size: 0.6rem; opacity: 0.5;">Harga (Rp)</span> <input type="text"${addAttribute(vPriceStd, "value")} placeholder="Harga" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;"${addAttribute(!isCheckedStd, "disabled")} class="v-price-input currency-mask"> <input type="hidden" name="variant_price"${addAttribute(vPriceStd, "value")}${addAttribute(!isCheckedStd, "disabled")} class="v-price-hidden-input"> </div> <div style="width: 80px;"> <span style="font-size: 0.6rem; opacity: 0.5;">Stok</span> <input type="number" name="variant_stock"${addAttribute(vStockStd, "value")} placeholder="Stok" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;"${addAttribute(!isCheckedStd, "disabled")} class="v-stock-input"> </div> </div> </div> <div class="variant-item variant-sleeve-split"${addAttribute(`display: ${hasLengan ? "flex" : "none"}; align-items: center; gap: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; padding-left: 1.5rem;`, "style")}> <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; min-width: 120px;"> <input type="checkbox" class="variant-cb"${addAttribute(vPendek, "value")}${addAttribute(isCheckedPendek, "checked")} style="margin-top: 2px;"> <span style="display: flex; flex-direction: column;"> <strong style="font-weight: 500;">${s.name}</strong> <span style="font-size: 0.7rem; opacity: 0.6;">Lengan Pendek</span> </span> </label> <input type="hidden" name="variant_size"${addAttribute(vPendek, "value")}${addAttribute(!isCheckedPendek, "disabled")} class="v-size-input"> <div class="v-details"${addAttribute(`flex: 1; gap: 0.5rem; display: ${isCheckedPendek ? "flex" : "none"};`, "style")}> <div style="flex: 1;"> <span style="font-size: 0.6rem; opacity: 0.5;">Harga (Rp)</span> <input type="text"${addAttribute(vPricePendek, "value")} placeholder="Harga" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;"${addAttribute(!isCheckedPendek, "disabled")} class="v-price-input currency-mask"> <input type="hidden" name="variant_price"${addAttribute(vPricePendek, "value")}${addAttribute(!isCheckedPendek, "disabled")} class="v-price-hidden-input"> </div> <div style="width: 80px;"> <span style="font-size: 0.6rem; opacity: 0.5;">Stok</span> <input type="number" name="variant_stock"${addAttribute(vStockPendek, "value")} placeholder="Stok" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;"${addAttribute(!isCheckedPendek, "disabled")} class="v-stock-input"> </div> </div> </div> <div class="variant-item variant-sleeve-split"${addAttribute(`display: ${hasLengan ? "flex" : "none"}; align-items: center; gap: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; padding-left: 1.5rem;`, "style")}> <label style="display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; min-width: 120px;"> <input type="checkbox" class="variant-cb"${addAttribute(vPanjang, "value")}${addAttribute(isCheckedPanjang, "checked")} style="margin-top: 2px;"> <span style="display: flex; flex-direction: column;"> <strong style="font-weight: 500;">${s.name}</strong> <span style="font-size: 0.7rem; opacity: 0.6;">Lengan Panjang</span> </span> </label> <input type="hidden" name="variant_size"${addAttribute(vPanjang, "value")}${addAttribute(!isCheckedPanjang, "disabled")} class="v-size-input"> <div class="v-details"${addAttribute(`flex: 1; gap: 0.5rem; display: ${isCheckedPanjang ? "flex" : "none"};`, "style")}> <div style="flex: 1;"> <span style="font-size: 0.6rem; opacity: 0.5;">Harga (Rp)</span> <input type="text"${addAttribute(vPricePanjang, "value")} placeholder="Harga" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;"${addAttribute(!isCheckedPanjang, "disabled")} class="v-price-input currency-mask"> <input type="hidden" name="variant_price"${addAttribute(vPricePanjang, "value")}${addAttribute(!isCheckedPanjang, "disabled")} class="v-price-hidden-input"> </div> <div style="width: 80px;"> <span style="font-size: 0.6rem; opacity: 0.5;">Stok</span> <input type="number" name="variant_stock"${addAttribute(vStockPanjang, "value")} placeholder="Stok" style="width: 100%; padding: 0.4rem; border: 1px solid #ccc; font-size: 0.8rem; border-radius: 4px;"${addAttribute(!isCheckedPanjang, "disabled")} class="v-stock-input"> </div> </div> </div> ` })}`;
  })} ${sizesData.length === 0 && renderTemplate`<p style="font-size: 0.85rem; opacity: 0.5;">
Belum ada data ukuran.
</p>`} </div> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Update Foto (Kosongkan jika tidak ingin mengubah)</label> <div style="display: flex; gap: 1rem; margin-bottom: 1rem; overflow-x: auto; padding-bottom: 0.5rem;"> ${product.images?.map((img) => renderTemplate`<div style="width: 80px; height: 80px; border-radius: 4px; overflow: hidden; border: 1px solid #eee; flex-shrink: 0;"> <img${addAttribute(img, "src")} style="width: 100%; height: 100%; object-fit: cover;" alt=""> </div>`)} </div> <input name="image_file" type="file" accept="image/*" multiple style="width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: var(--radius-sm); background: #fcfcfc; font-size: 0.8rem;"> <p style="font-size: 0.65rem; opacity: 0.5; margin-top: 0.4rem;">
*Mengunggah foto baru akan menggantikan seluruh foto
							lama dengan foto baru tersebut.
</p> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Link Tokopedia (Opsional)</label> <input name="tokopedia_url" type="url"${addAttribute(product.tokopedia_url, "value")} style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm);"> </div> <div> <label class="text-uppercase opacity-50" style="font-size: 0.65rem; display: block; margin-bottom: 0.5rem; font-weight: 600;">Deskripsi Produk</label> <textarea name="description" rows="4" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: var(--radius-sm);">${product.description}</textarea> </div> <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--spacing-lg); margin-top: var(--spacing-md);"> <a href="/buka-toko" style="text-align: center; padding: 1rem; border: 1px solid #ddd; color: var(--color-muted); text-transform: uppercase; letter-spacing: 2px; font-weight: 600; font-size: 0.75rem; border-radius: var(--radius-sm);">Batal</a> <button type="submit" style="background: var(--color-text); color: white; padding: 1rem; border: none; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; font-size: 0.75rem; border-radius: var(--radius-sm); cursor: pointer; transition: 0.3s;">Simpan Perubahan</button> <button type="button"${addAttribute(`const f = document.getElementById('deleteForm'); showDeleteConfirm(f, 'Apakah Anda yakin ingin menghapus produk ini secara permanen?')`, "onclick")} style="background: #fff5f5; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 1rem; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; font-size: 0.75rem; border-radius: var(--radius-sm); cursor: pointer; transition: 0.3s;" onmouseover="this.style.background='#ff4d4d'; this.style.color='white'" onmouseout="this.style.background='#fff5f5'; this.style.color='#ff4d4d'">Hapus Produk</button> </div> </form> <!-- Hidden Delete Form --> <form id="deleteForm" method="POST" style="display: none;"> <input type="hidden" name="action" value="delete_product"> </form> </div> </div> </section> ${renderComponent($$result2, "DeleteConfirmModal", $$DeleteConfirmModal, {})} ` }), defineScriptVars({ hierarchicalTypes, currentCategoryIds }));
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/edit/[id].astro", void 0);

const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/edit/[id].astro";
const $$url = "/buka-toko/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
