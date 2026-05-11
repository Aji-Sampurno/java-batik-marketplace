import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { r as renderTemplate, l as renderComponent, m as maybeRenderHead, h as addAttribute } from './entrypoint_B7dm8yGT.mjs';
import { a as apiFetch, $ as $$Layout } from './Layout_CnwklWu_.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Products = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Products;
  const { searchParams } = Astro2.url;
  const typeFilter = searchParams.get("type");
  const motifFilter = searchParams.get("motif");
  const sizeFilter = searchParams.get("size");
  const searchQuery = searchParams.get("q");
  const minPrice = searchParams.get("minP") ? Number(searchParams.get("minP")) : null;
  const maxPrice = searchParams.get("maxP") ? Number(searchParams.get("maxP")) : null;
  const sort = searchParams.get("sort") || "newest";
  const getSortUrl = (newSort) => {
    const p = new URLSearchParams(searchParams);
    p.set("sort", newSort);
    return `?${p.toString()}`;
  };
  console.log("DEBUG: products.astro", {
    typeFilter,
    motifFilter,
    sizeFilter,
    searchQuery,
    minPrice,
    maxPrice,
    sort
  });
  let typesData = [];
  let motifsData = [];
  let sizesData = [];
  let productsData = [];
  let hierarchicalTypes = [];
  let activePathIds = [];
  let targetType = null;
  let settings = { contact_whatsapp: "628123456789" };
  try {
    const tRes = await apiFetch("types");
    typesData = tRes?.data || tRes || [];
    const mRes = await apiFetch("motifs");
    motifsData = mRes?.data || mRes || [];
    const szRes = await apiFetch("sizes");
    sizesData = szRes?.data || szRes || [];
    const sRes = await apiFetch("settings");
    const s = sRes?.data || sRes;
    if (s) settings = s;
    const buildCategoryTree = (list, parentId = null, depth = 0, currentPath = "") => {
      let result = [];
      list.filter((item) => item.parent_id === parentId).forEach((item) => {
        const fullPath = currentPath ? `${currentPath} > ${item.name}` : item.name;
        result.push({ ...item, depth, fullPath });
        const children = buildCategoryTree(
          list,
          item.id,
          depth + 1,
          fullPath
        );
        result = result.concat(children);
      });
      return result;
    };
    hierarchicalTypes = buildCategoryTree(typesData);
    targetType = hierarchicalTypes.find(
      (t) => t.fullPath === typeFilter || t.id === typeFilter
    );
    const targetMotif = motifsData.find((m) => m.name === motifFilter);
    console.log("DEBUG: DB Match", { targetType, targetMotif });
    const getAncestry = (list, currentId) => {
      if (!currentId) return [];
      const item = list.find((t) => t.id === currentId);
      if (!item) return [];
      return [item.id, ...getAncestry(list, item.parent_id)];
    };
    activePathIds = getAncestry(typesData, targetType?.id || null);
    try {
      const pRes = await apiFetch("products?per_page=1000");
      productsData = pRes?.data || pRes || [];
    } catch (pError) {
      console.error("Filter Query Error:", pError.message);
    }
  } catch (e) {
    console.error("API Fetch Error, using mock fallback:", e.message);
    const { products: mockProducts } = await import('./products_BUkfLFCk.mjs');
    productsData = mockProducts.map((p) => ({
      ...p,
      types: { name: p.type },
      product_motifs: [{ motifs: { name: p.motif } }],
      image_url: p.imageUrl,
      wa_number: p.waNumber,
      tokopedia_url: p.tokopediaUrl
    }));
    const uniqueTypes = [...new Set(mockProducts.map((p) => p.type))];
    typesData = uniqueTypes.map((t) => ({ name: t }));
    uniqueTypes.forEach((t) => {
      hierarchicalTypes.push({ name: t, depth: 0, parent_id: null });
    });
    const uniqueMotifs = [...new Set(mockProducts.map((p) => p.motif))];
    motifsData = uniqueMotifs.map((m) => ({ name: m }));
    const mockSizes = ["S", "M", "L", "XL", "XXL", "All Size"];
    sizesData = mockSizes.map((s) => ({ name: s }));
    targetType = hierarchicalTypes.find(
      (t) => t.fullPath === typeFilter || t.name === typeFilter
    );
  }
  const waBaseUrl = "https://wa.me/";
  const filteredProducts = productsData?.filter((p) => {
    const productCategoryIds = p.product_categories?.map((pc) => pc.category_id) || [];
    if (p.type_id) productCategoryIds.push(p.type_id);
    const productCategoryNames = p.product_categories?.map((pc) => pc.types?.name) || [];
    if (p.types?.name) productCategoryNames.push(p.types.name);
    const typeMatch = !typeFilter || productCategoryIds.includes(targetType?.id) || productCategoryNames.includes(typeFilter);
    const productMotifs = p.product_motifs?.map((pm) => pm.motifs?.name) || [];
    const motifMatch = !motifFilter || productMotifs.includes(motifFilter);
    const variantSizes = p.product_variants?.map((v) => v.size_name) || [];
    const legacySizes = p.sizes || [];
    let sizeMatch = !sizeFilter;
    if (sizeFilter) {
      if (legacySizes.includes(sizeFilter)) {
        sizeMatch = true;
      } else {
        sizeMatch = variantSizes.some(
          (vs) => vs === sizeFilter || vs.startsWith(`${sizeFilter} -`)
        );
      }
    }
    let searchMatch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      const keywords = q.split(/\s+/).filter((kw) => kw.length > 0);
      searchMatch = keywords.every((kw) => {
        const nameMatch = p.name?.toLowerCase().includes(kw);
        const codeMatch = p.code?.toLowerCase().includes(kw);
        const motifMatch2 = productMotifs.some(
          (m) => m?.toLowerCase().includes(kw)
        );
        const categoryMatch = productCategoryNames.some(
          (c) => c?.toLowerCase().includes(kw)
        );
        return nameMatch || codeMatch || motifMatch2 || categoryMatch;
      });
    }
    let pMin = p.price;
    let pMax = p.price;
    if (p.product_variants && p.product_variants.length > 0) {
      const vPrices = p.product_variants.map((v) => v.price);
      pMin = Math.min(...vPrices);
      pMax = Math.max(...vPrices);
    }
    const priceMatch = (!minPrice || pMax >= minPrice) && (!maxPrice || pMin <= maxPrice);
    return typeMatch && motifMatch && sizeMatch && searchMatch && priceMatch;
  }) || [];
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (a.is_active !== b.is_active) {
      return a.is_active ? -1 : 1;
    }
    const getEffectivePrice = (prod) => {
      if (prod.product_variants && prod.product_variants.length > 0) {
        const vPrices = prod.product_variants.map((v) => v.price);
        const vMin = Math.min(...vPrices);
        if (vMin > 0) return vMin;
      }
      return prod.price;
    };
    switch (sort) {
      case "price-asc":
        return getEffectivePrice(a) - getEffectivePrice(b);
      case "price-desc":
        return getEffectivePrice(b) - getEffectivePrice(a);
      case "alphabetical":
        return (a.name || "").localeCompare(b.name || "");
      case "newest":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  return renderTemplate(_a || (_a = __template(["", ` <script>
	function formatPriceInput(val) {
		// Remove anything that's not a digit
		const number = val.replace(/\\D/g, "");
		if (!number) return "";
		// Format as Indonesian currency style with Rp prefix
		return "Rp " + new Intl.NumberFormat("id-ID").format(number);
	}

	function initPriceInputs() {
		// Existing price formatting logic
		const inputs = document.querySelectorAll(".js-price-input");
		inputs.forEach((input) => {
			input.addEventListener("input", (e) => {
				const el = e.target;
				const rawValue = el.value;
				const cursor = el.selectionStart;
				const oldLen = rawValue.length;
				const formatted = formatPriceInput(rawValue);
				el.value = formatted;
				const newLen = formatted.length;
				const nextCursor = cursor ? cursor + (newLen - oldLen) : 0;
				el.setSelectionRange(nextCursor, nextCursor);
			});
		});

		document.addEventListener("submit", (e) => {
			const form = e.target;
			const priceInputs = form.querySelectorAll(".js-price-input");
			priceInputs.forEach((input) => {
				input.value = input.value.replace(/\\D/g, "");
			});
		});
	}

	function initCustomDropdowns() {
		const sortDropdown = document.getElementById("sortDropdown");
		const trigger = sortDropdown?.querySelector(".dropdown-trigger");

		if (trigger) {
			trigger.addEventListener("click", (e) => {
				e.stopPropagation();
				sortDropdown?.classList.toggle("active");
			});
		}

		// Close when clicking outside
		window.addEventListener("click", () => {
			sortDropdown?.classList.remove("active");
		});
	}

	// Initialize on load
	initPriceInputs();
	initCustomDropdowns();

	// Support Astro view transitions
	document.addEventListener("astro:page-load", () => {
		initPriceInputs();
		initCustomDropdowns();
	});
<\/script>`], ["", ` <script>
	function formatPriceInput(val) {
		// Remove anything that's not a digit
		const number = val.replace(/\\\\D/g, "");
		if (!number) return "";
		// Format as Indonesian currency style with Rp prefix
		return "Rp " + new Intl.NumberFormat("id-ID").format(number);
	}

	function initPriceInputs() {
		// Existing price formatting logic
		const inputs = document.querySelectorAll(".js-price-input");
		inputs.forEach((input) => {
			input.addEventListener("input", (e) => {
				const el = e.target;
				const rawValue = el.value;
				const cursor = el.selectionStart;
				const oldLen = rawValue.length;
				const formatted = formatPriceInput(rawValue);
				el.value = formatted;
				const newLen = formatted.length;
				const nextCursor = cursor ? cursor + (newLen - oldLen) : 0;
				el.setSelectionRange(nextCursor, nextCursor);
			});
		});

		document.addEventListener("submit", (e) => {
			const form = e.target;
			const priceInputs = form.querySelectorAll(".js-price-input");
			priceInputs.forEach((input) => {
				input.value = input.value.replace(/\\\\D/g, "");
			});
		});
	}

	function initCustomDropdowns() {
		const sortDropdown = document.getElementById("sortDropdown");
		const trigger = sortDropdown?.querySelector(".dropdown-trigger");

		if (trigger) {
			trigger.addEventListener("click", (e) => {
				e.stopPropagation();
				sortDropdown?.classList.toggle("active");
			});
		}

		// Close when clicking outside
		window.addEventListener("click", () => {
			sortDropdown?.classList.remove("active");
		});
	}

	// Initialize on load
	initPriceInputs();
	initCustomDropdowns();

	// Support Astro view transitions
	document.addEventListener("astro:page-load", () => {
		initPriceInputs();
		initCustomDropdowns();
	});
<\/script>`])), renderComponent($$result, "Layout", $$Layout, { "title": "Koleksi Eksklusif Galeri", "data-astro-cid-3swd3b6j": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section style="padding: 90px 0 80px 0; background: #fff;" data-astro-cid-3swd3b6j> <div class="container" data-astro-cid-3swd3b6j> <header class="catalog-header" data-astro-cid-3swd3b6j> <p class="text-uppercase opacity-50 header-subtitle" data-astro-cid-3swd3b6j>
The Collection
</p> <div class="header-main" data-astro-cid-3swd3b6j> <h1 class="section-title" data-astro-cid-3swd3b6j>
Katalog <span style="font-style: italic;" data-astro-cid-3swd3b6j>Pilihan</span> </h1> <!-- Search Input --> <form action="/products" method="GET" class="search-form" data-astro-cid-3swd3b6j> <input type="text" name="q"${addAttribute(searchParams.get("q") || "", "value")} placeholder="Cari batik..." class="search-input" data-astro-cid-3swd3b6j> ${typeFilter && renderTemplate`<input type="hidden" name="type"${addAttribute(typeFilter, "value")} data-astro-cid-3swd3b6j>`} ${motifFilter && renderTemplate`<input type="hidden" name="motif"${addAttribute(motifFilter, "value")} data-astro-cid-3swd3b6j>`} ${sizeFilter && renderTemplate`<input type="hidden" name="size"${addAttribute(sizeFilter, "value")} data-astro-cid-3swd3b6j>`} ${minPrice && renderTemplate`<input type="hidden" name="minP"${addAttribute(minPrice, "value")} data-astro-cid-3swd3b6j>`} ${maxPrice && renderTemplate`<input type="hidden" name="maxP"${addAttribute(maxPrice, "value")} data-astro-cid-3swd3b6j>`} ${renderTemplate`<input type="hidden" name="sort"${addAttribute(sort, "value")} data-astro-cid-3swd3b6j>`} <button type="submit" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; opacity: 0.5;" data-astro-cid-3swd3b6j> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3swd3b6j><circle cx="11" cy="11" r="8" data-astro-cid-3swd3b6j></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-3swd3b6j></line></svg> </button> </form> </div> </header> <div class="products-layout" data-astro-cid-3swd3b6j> <!-- Sidebar Filters --> <aside class="filters-sidebar" data-astro-cid-3swd3b6j> <!-- Search Form Hidden Inputs (to preserve filters) --> <input type="hidden" name="q"${addAttribute(searchParams.get("q") || "", "value")} data-astro-cid-3swd3b6j> <div class="filter-group" data-astro-cid-3swd3b6j> <h3 class="text-uppercase" style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600; letter-spacing: 2px; margin-bottom: 0.6rem;" data-astro-cid-3swd3b6j>
Rentang Harga
</h3> <form action="/products" method="GET" style="display: flex; flex-direction: column; gap: 0.5rem;" data-astro-cid-3swd3b6j> <!-- Preserve existing filters --> ${Array.from(searchParams.entries()).map(
    ([key, value]) => key !== "minP" && key !== "maxP" && renderTemplate`<input type="hidden"${addAttribute(key, "name")}${addAttribute(value, "value")} data-astro-cid-3swd3b6j>`
  )} <div style="display: flex; flex-direction: column; gap: 0.8rem;" data-astro-cid-3swd3b6j> <div style="display: flex; flex-direction: column; gap: 0.3rem;" data-astro-cid-3swd3b6j> <label style="font-size: 0.6rem; opacity: 0.5; text-transform: uppercase; font-weight: 600;" data-astro-cid-3swd3b6j>Harga Minimum</label> <input type="text" inputmode="numeric" name="minP"${addAttribute(minPrice ? `Rp ${minPrice.toLocaleString("id-ID")}` : "", "value")} placeholder="Rp 0" class="price-input js-price-input" style="width: 100%;" data-astro-cid-3swd3b6j> </div> <div style="display: flex; flex-direction: column; gap: 0.3rem;" data-astro-cid-3swd3b6j> <label style="font-size: 0.6rem; opacity: 0.5; text-transform: uppercase; font-weight: 600;" data-astro-cid-3swd3b6j>Harga Maksimum</label> <input type="text" inputmode="numeric" name="maxP"${addAttribute(maxPrice ? `Rp ${maxPrice.toLocaleString("id-ID")}` : "", "value")} placeholder="Rp 0" class="price-input js-price-input" style="width: 100%;" data-astro-cid-3swd3b6j> </div> </div> <button type="submit" class="apply-filter-btn" data-astro-cid-3swd3b6j>Terapkan</button> </form> </div> <details open class="filter-group" data-astro-cid-3swd3b6j> <summary style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; list-style: none; outline: none;" data-astro-cid-3swd3b6j> <span class="text-uppercase" style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600; letter-spacing: 2px;" data-astro-cid-3swd3b6j>Jenis Produk</span> <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; transition: transform 0.3s ease;" data-astro-cid-3swd3b6j><polyline points="6 9 12 15 18 9" data-astro-cid-3swd3b6j></polyline></svg> </summary> <div style="display: flex; flex-direction: column; gap: 0.2rem; padding: 0.6rem 0 1rem 0;" data-astro-cid-3swd3b6j> <a${addAttribute(`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), type: "" })}`, "href")}${addAttribute(!typeFilter ? "active-filter" : "filter-link", "class")} data-astro-cid-3swd3b6j>Semua Jenis</a> ${hierarchicalTypes?.filter((t) => {
    return t.parent_id === null || activePathIds.includes(t.parent_id);
  }).map((t) => renderTemplate`<a${addAttribute(`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), type: t.fullPath })}`, "href")}${addAttribute(
    typeFilter === t.fullPath || typeFilter === t.id ? "active-filter" : "filter-link",
    "class"
  )}${addAttribute(`padding-left: ${t.depth * 1.2 + 0.8}rem; font-size: ${0.85 - t.depth * 0.05}rem; ${t.depth > 0 ? "opacity: 0.8;" : "font-weight: 500;"}`, "style")} data-astro-cid-3swd3b6j> ${activePathIds.includes(t.id) && renderTemplate`<span style="color: var(--color-accent); margin-right: 4px;" data-astro-cid-3swd3b6j>
•
</span>`} ${t.depth > 0 && renderTemplate`<span style="opacity: 0.3; margin-right: 6px;" data-astro-cid-3swd3b6j>
∟
</span>`} <span${addAttribute(
    typeFilter === t.fullPath || typeFilter === t.id ? "font-weight: 700; text-decoration: underline;" : "",
    "style"
  )} data-astro-cid-3swd3b6j> ${t.name} </span> </a>`)} </div> </details> <div class="filter-group" style="padding-bottom: var(--spacing-sm);" data-astro-cid-3swd3b6j> <h3 class="text-uppercase" style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600; letter-spacing: 2px; margin-bottom: 0.6rem;" data-astro-cid-3swd3b6j>
Ukuran
</h3> <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;" data-astro-cid-3swd3b6j> <a${addAttribute(`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), size: "" })}`, "href")}${addAttribute(!sizeFilter ? "active-chip" : "chip", "class")} style="font-size: 0.7rem;" data-astro-cid-3swd3b6j>Semua</a> ${sizesData?.map((s) => renderTemplate`<a${addAttribute(`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), size: s.name })}`, "href")}${addAttribute(
    sizeFilter === s.name ? "active-chip" : "chip",
    "class"
  )} style="font-size: 0.7rem;" data-astro-cid-3swd3b6j> ${s.name} </a>`)} </div> </div> <details class="filter-group" data-astro-cid-3swd3b6j> <summary style="display: flex; justify-space-between; align-items: center; cursor: pointer; list-style: none; outline: none; display: flex; justify-content: space-between;" data-astro-cid-3swd3b6j> <span class="text-uppercase" style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600; letter-spacing: 2px;" data-astro-cid-3swd3b6j>Motif Batik</span> <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5; transition: transform 0.3s ease;" data-astro-cid-3swd3b6j><polyline points="6 9 12 15 18 9" data-astro-cid-3swd3b6j></polyline></svg> </summary> <div style="display: flex; flex-direction: column; gap: 0.4rem; padding: 0.6rem 0 1rem 0;" data-astro-cid-3swd3b6j> <a${addAttribute(`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), motif: "" })}`, "href")}${addAttribute(!motifFilter ? "active-filter" : "filter-link", "class")} data-astro-cid-3swd3b6j>Semua Motif</a> ${motifsData?.map((m) => renderTemplate`<a${addAttribute(`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), motif: m.name })}`, "href")}${addAttribute(
    motifFilter === m.name ? "active-filter" : "filter-link",
    "class"
  )} data-astro-cid-3swd3b6j> ${m.name} </a>`)} </div> </details> <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);" data-astro-cid-3swd3b6j> <p style="font-size: 0.75rem; opacity: 0.4; font-style: italic;" data-astro-cid-3swd3b6j>
Menampilkan ${filteredProducts.length} produk dari koleksi
							kami.
</p> </div> </aside> <!-- Product Grid --> <main data-astro-cid-3swd3b6j> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;" data-astro-cid-3swd3b6j> <div class="results-info" data-astro-cid-3swd3b6j>
Menampilkan <strong data-astro-cid-3swd3b6j>${filteredProducts.length}</strong> produk
</div> <div class="sorting-controls" data-astro-cid-3swd3b6j> <span class="sort-label" data-astro-cid-3swd3b6j>Urutkan:</span> <div class="custom-dropdown" id="sortDropdown" data-astro-cid-3swd3b6j> <button class="dropdown-trigger" type="button" data-astro-cid-3swd3b6j> <span class="current-label" data-astro-cid-3swd3b6j> ${sort === "newest" && "Terbaru"} ${sort === "price-asc" && "Harga: Terendah"} ${sort === "price-desc" && "Harga: Tertinggi"} ${sort === "alphabetical" && "Nama: A - Z"} </span> <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-3swd3b6j><path d="M6 9l6 6 6-6" data-astro-cid-3swd3b6j></path></svg> </button> <div class="dropdown-menu" data-astro-cid-3swd3b6j> <a${addAttribute(getSortUrl("newest"), "href")}${addAttribute(`dropdown-item ${sort === "newest" ? "active" : ""}`, "class")} data-astro-cid-3swd3b6j> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3swd3b6j><circle cx="12" cy="12" r="10" data-astro-cid-3swd3b6j></circle><path d="M12 6v6l4 2" data-astro-cid-3swd3b6j></path></svg>
Terbaru
</a> <a${addAttribute(getSortUrl("price-asc"), "href")}${addAttribute(`dropdown-item ${sort === "price-asc" ? "active" : ""}`, "class")} data-astro-cid-3swd3b6j> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3swd3b6j><path d="M12 19V5M5 12l7-7 7 7" data-astro-cid-3swd3b6j></path></svg>
Harga: Terendah
</a> <a${addAttribute(getSortUrl("price-desc"), "href")}${addAttribute(`dropdown-item ${sort === "price-desc" ? "active" : ""}`, "class")} data-astro-cid-3swd3b6j> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3swd3b6j><path d="M12 5v14M5 12l7 7 7-7" data-astro-cid-3swd3b6j></path></svg>
Harga: Tertinggi
</a> <a${addAttribute(getSortUrl("alphabetical"), "href")}${addAttribute(`dropdown-item ${sort === "alphabetical" ? "active" : ""}`, "class")} data-astro-cid-3swd3b6j> <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-3swd3b6j><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-astro-cid-3swd3b6j></path><polyline points="7 10 12 15 17 10" data-astro-cid-3swd3b6j></polyline><line x1="12" y1="15" x2="12" y2="3" data-astro-cid-3swd3b6j></line><path d="M11 5h10M11 9h10M11 13h10M11 17h10M11 21h10" data-astro-cid-3swd3b6j></path></svg>
Nama: A-Z
</a> </div> </div> </div> </div> <div class="product-grid" style="margin-top: 0;" data-astro-cid-3swd3b6j> ${sortedProducts.map((p, index) => renderTemplate`<div${addAttribute(`product-card reveal-up ${!p.is_active ? "product-inactive" : ""}`, "class")}${addAttribute(index % 4 * 100, "data-delay")} data-astro-cid-3swd3b6j> <div class="product-image" style="position: relative;" data-astro-cid-3swd3b6j> <a${addAttribute(`/products/${p.id}`, "href")} data-astro-cid-3swd3b6j> <img${addAttribute(
    p.image_url || "https://via.placeholder.com/400x600?text=Batik",
    "src"
  )}${addAttribute(p.name, "alt")} loading="lazy"${addAttribute(
    !p.is_active ? "out-of-stock-img" : "",
    "class"
  )} data-astro-cid-3swd3b6j> ${!p.is_active && renderTemplate`<div class="ribbon-wrapper" data-astro-cid-3swd3b6j> <div class="ribbon" data-astro-cid-3swd3b6j>
HABIS
</div> </div>`} </a> </div> <div class="product-info" style="display: flex; flex-direction: column; flex: 1;" data-astro-cid-3swd3b6j> <p class="text-uppercase color-accent" style="font-size: 0.65rem; color: var(--color-accent); margin-bottom: 0.2rem;" data-astro-cid-3swd3b6j> ${p.types?.name} •${" "} ${p.product_motifs?.map(
    (pm) => pm.motifs?.name
  ).join(", ") || "-"} </p> <h3 class="product-title" data-astro-cid-3swd3b6j> <a${addAttribute(`/products/${p.id}`, "href")} style="color: inherit; text-decoration: none;" data-astro-cid-3swd3b6j> ${p.name} </a> </h3> <div class="product-meta" data-astro-cid-3swd3b6j> ${p.code && renderTemplate`<code style="font-size: 0.7rem; background: #f9f9f9; padding: 0.2rem 0.4rem; color: #888; border-radius: 2px;" data-astro-cid-3swd3b6j> ${p.code} </code>`} ${p.product_variants && p.product_variants.length > 0 ? p.product_variants.map((v) => renderTemplate`<span style="font-size: 0.65rem; border: 1px solid #eee; padding: 1px 6px; border-radius: 2px; color: var(--color-muted);" data-astro-cid-3swd3b6j> ${v.size_name} </span>`) : p.sizes && p.sizes.length > 0 ? p.sizes.map((s) => renderTemplate`<span style="font-size: 0.65rem; border: 1px solid #eee; padding: 1px 6px; border-radius: 2px; color: var(--color-muted);" data-astro-cid-3swd3b6j> ${s} </span>`) : null} </div> <div style="display: flex; align-items: center; gap: 0.5rem;" data-astro-cid-3swd3b6j> ${p.original_price && p.original_price > p.price && renderTemplate`<span style="text-decoration: line-through; color: #999; font-size: 0.8rem;" data-astro-cid-3swd3b6j>
Rp${" "} ${Number(
    p.original_price
  ).toLocaleString(
    "id-ID"
  )} </span>`} <p class="price-tag" style="margin: 0;" data-astro-cid-3swd3b6j> ${(() => {
    let displayPrice = `Rp ${Number(p.price).toLocaleString("id-ID")}`;
    if (p.product_variants && p.product_variants.length > 0) {
      const vPrices = p.product_variants.map((v) => v.price);
      const vMin = Math.min(...vPrices);
      if (vMin > 0) {
        displayPrice = `Rp ${vMin.toLocaleString("id-ID")}`;
      }
    }
    return displayPrice;
  })()} </p> </div> <div class="actions" data-astro-cid-3swd3b6j> ${p.tokopedia_url && renderTemplate`<a${addAttribute(
    p.is_active ? p.tokopedia_url : "javascript:void(0)",
    "href"
  )}${addAttribute(
    p.is_active ? "_blank" : "_self",
    "target"
  )}${addAttribute(`buy-btn ${!p.is_active ? "disabled-btn" : ""}`, "class")} data-astro-cid-3swd3b6j> ${p.is_active ? "Beli Sekarang" : "HABIS TERJUAL"} </a>`} <a${addAttribute(
    p.is_active ? `${waBaseUrl}${settings.contact_whatsapp}?text=Halo, saya tertarik dengan produk ${p.name}` : "javascript:void(0)",
    "href"
  )}${addAttribute(
    p.is_active ? "_blank" : "_self",
    "target"
  )}${addAttribute(`wa-btn ${!p.is_active ? "disabled-btn" : ""}`, "class")} data-astro-cid-3swd3b6j> ${p.is_active ? "Chat Admin" : "CEK PRODUK LAIN"} </a> </div> </div> </div>`)} </div> ${filteredProducts.length === 0 && renderTemplate`<div class="reveal" style="padding: var(--spacing-xl) 0; text-align: center; background: #f9f9f9; border-radius: var(--radius-md); margin-top: 2rem;" data-astro-cid-3swd3b6j> <p style="font-style: italic; opacity: 0.5;" data-astro-cid-3swd3b6j>
Maaf, koleksi yang Anda cari belum tersedia.
</p> <a href="/products" style="text-decoration: underline; margin-top: 1rem; display: block; font-size: 0.8rem;" data-astro-cid-3swd3b6j>
Lihat Semua Koleksi
</a> </div>`} </main> </div> </div> </section> ` }));
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/products.astro", void 0);

const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/products.astro";
const $$url = "/products";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Products,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
