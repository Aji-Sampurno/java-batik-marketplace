import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, h as addAttribute, o as Fragment, m as maybeRenderHead } from './entrypoint_B7dm8yGT.mjs';
import { a as apiFetch, $ as $$Layout } from './Layout_CnwklWu_.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  let product = null;
  let relatedProducts = [];
  const waBaseUrl = "https://wa.me/";
  let settings = { contact_whatsapp: "628123456789" };
  try {
    const resProduct = await apiFetch(`products/${id}`);
    const p = resProduct?.data || resProduct;
    if (p) {
      product = p;
      try {
        const resProducts = await apiFetch("products");
        const allProducts = resProducts?.data || resProducts || [];
        relatedProducts = allProducts.filter((item) => item.type_id === p.type_id && item.is_active && item.id !== id).slice(0, 4);
      } catch (e) {
      }
    }
    const resSettings = await apiFetch("settings");
    const s = resSettings?.data || resSettings;
    if (s) settings = s;
  } catch (e) {
    console.error("API Fetch Error:", e.message);
  }
  if (!product) {
    return Astro2.redirect("/404");
  }
  const productMotifs = product.product_motifs?.map((pm) => pm.motifs?.name) || [];
  const productCategories = product.product_categories?.map((pc) => pc.types).sort((a, b) => (a.category_level || 0) - (b.category_level || 0)) || [];
  const waNumber = settings.contact_whatsapp || "628123456789";
  const waMessage = encodeURIComponent(`Halo, saya tertarik dengan produk ${product.name} (${product.code || ""}). Apakah masih tersedia?`);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": product.name, "data-astro-cid-y5jmkon6": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<section class="product-detail-section" style="padding: 140px 0 0 0; background: #fff;" data-astro-cid-y5jmkon6> <div class="container" data-astro-cid-y5jmkon6> <!-- Breadcrumbs --> <nav class="breadcrumb-nav" data-astro-cid-y5jmkon6> <a href="/" class="breadcrumb-link" data-astro-cid-y5jmkon6>Home</a> <span class="sep" data-astro-cid-y5jmkon6>|</span> <a href="/products" class="breadcrumb-link" data-astro-cid-y5jmkon6>Katalog</a> <span class="sep" data-astro-cid-y5jmkon6>|</span> <span class="current-crumb" data-astro-cid-y5jmkon6>', '</span> </nav> <div class="detail-grid" data-astro-cid-y5jmkon6> <!-- Left: Image Gallery --> <div class="image-gallery reveal-left" data-astro-cid-y5jmkon6> <div class="main-image-container" style="position: relative;" data-astro-cid-y5jmkon6> <img id="main-product-img"', "", ' class="main-image" data-astro-cid-y5jmkon6> ', " </div> ", ' </div> <!-- Right: Product Info --> <div class="product-info-panel reveal-right" data-astro-cid-y5jmkon6> <div class="info-header" data-astro-cid-y5jmkon6> <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;" data-astro-cid-y5jmkon6> <p class="sku-code" data-astro-cid-y5jmkon6>', '</p> <div id="stock-badge"', " data-astro-cid-y5jmkon6> ", ' </div> </div> <h1 class="product-name" data-astro-cid-y5jmkon6>', '</h1> <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: var(--spacing-lg);" data-astro-cid-y5jmkon6> <p class="product-price" style="margin: 0;" data-astro-cid-y5jmkon6>Rp ', "</p> ", ' </div> </div> <div class="meta-section" data-astro-cid-y5jmkon6> <div class="meta-item" data-astro-cid-y5jmkon6> <span class="meta-label" data-astro-cid-y5jmkon6>Jenis Produk</span> <div class="tag-container" style="gap: 10px;" data-astro-cid-y5jmkon6> ', " ", ' </div> </div> <div class="meta-item" data-astro-cid-y5jmkon6> <span class="meta-label" data-astro-cid-y5jmkon6>Motif Batik</span> <div class="tag-container" data-astro-cid-y5jmkon6> ', " </div> </div> ", ' </div> <div class="description-section" data-astro-cid-y5jmkon6> <h3 class="section-subtitle" data-astro-cid-y5jmkon6>Deskripsi</h3> <p class="description-text" data-astro-cid-y5jmkon6> ', ' </p> </div> <div class="action-buttons" data-astro-cid-y5jmkon6> <a id="wa-btn"', "", "", ' data-astro-cid-y5jmkon6> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;" data-astro-cid-y5jmkon6><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7.19.19 0 0 1 .1 0 8.38 8.38 0 0 1 3.8.9L21 3z" data-astro-cid-y5jmkon6></path></svg> <span class="btn-text" data-astro-cid-y5jmkon6>', "</span> </a> ", " </div> </div> </div> </div> </section>  ", ` <script>
		// Gallery Switcher Logic
		const mainImg = document.getElementById('main-product-img');
		const thumbs = document.querySelectorAll('.thumb-item');

		if (thumbs) {
			thumbs.forEach(thumb => {
				thumb.addEventListener('click', () => {
					const newSrc = thumb.getAttribute('data-src');
					if (mainImg && newSrc) {
						mainImg.src = newSrc;
						thumbs.forEach(t => t.classList.remove('active'));
						thumb.classList.add('active');
					}
				});
			});
		}

		// Variant Selection Logic
		const variantBtns = document.querySelectorAll('.variant-btn');
		const priceDisplay = document.querySelector('.product-price');
		const badgeDisplay = document.getElementById('stock-badge');
		
		if (variantBtns.length > 0 && priceDisplay) {
			const checkVariantAvailability = (stock) => {
				const isAvailable = stock > 0;
				if (badgeDisplay) {
					badgeDisplay.innerText = isAvailable ? 'In Stock' : 'Stok Habis';
					badgeDisplay.className = \`status-badge \${!isAvailable ? 'out-of-stock' : ''}\`;
				}
				// Also update WA Button
				const waBtn = document.getElementById('wa-btn');
				if (waBtn && waBtn.getAttribute('target') !== '_self') { // Meaning the product itself is active globally
					waBtn.classList.toggle('btn-disabled', !isAvailable);
					const btnText = waBtn.querySelector('.btn-text');
					if (btnText) btnText.innerText = isAvailable ? 'Chat Admin' : 'Stok Ukuran Habis';
				}
			}

			variantBtns.forEach(btn => {
				btn.addEventListener('click', () => {
					variantBtns.forEach(b => b.classList.remove('active'));
					btn.classList.add('active');
					
					const newPrice = parseInt(btn.getAttribute('data-price') || "0", 10);
					if(newPrice > 0) {
						priceDisplay.innerText = "Rp " + newPrice.toLocaleString('id-ID');
					}

					const stock = parseInt(btn.getAttribute('data-stock') || "0", 10);
					checkVariantAvailability(stock);
				});
			});

			// Trigger initial variant state
			const initialStock = parseInt(variantBtns[0].getAttribute('data-stock') || "0", 10);
			const initialPrice = parseInt(variantBtns[0].getAttribute('data-price') || "0", 10);
			if(initialPrice > 0) priceDisplay.innerText = "Rp " + initialPrice.toLocaleString('id-ID');
			checkVariantAvailability(initialStock);
		}

		// Start the engines
	<\/script> `], [" ", '<section class="product-detail-section" style="padding: 140px 0 0 0; background: #fff;" data-astro-cid-y5jmkon6> <div class="container" data-astro-cid-y5jmkon6> <!-- Breadcrumbs --> <nav class="breadcrumb-nav" data-astro-cid-y5jmkon6> <a href="/" class="breadcrumb-link" data-astro-cid-y5jmkon6>Home</a> <span class="sep" data-astro-cid-y5jmkon6>|</span> <a href="/products" class="breadcrumb-link" data-astro-cid-y5jmkon6>Katalog</a> <span class="sep" data-astro-cid-y5jmkon6>|</span> <span class="current-crumb" data-astro-cid-y5jmkon6>', '</span> </nav> <div class="detail-grid" data-astro-cid-y5jmkon6> <!-- Left: Image Gallery --> <div class="image-gallery reveal-left" data-astro-cid-y5jmkon6> <div class="main-image-container" style="position: relative;" data-astro-cid-y5jmkon6> <img id="main-product-img"', "", ' class="main-image" data-astro-cid-y5jmkon6> ', " </div> ", ' </div> <!-- Right: Product Info --> <div class="product-info-panel reveal-right" data-astro-cid-y5jmkon6> <div class="info-header" data-astro-cid-y5jmkon6> <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;" data-astro-cid-y5jmkon6> <p class="sku-code" data-astro-cid-y5jmkon6>', '</p> <div id="stock-badge"', " data-astro-cid-y5jmkon6> ", ' </div> </div> <h1 class="product-name" data-astro-cid-y5jmkon6>', '</h1> <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: var(--spacing-lg);" data-astro-cid-y5jmkon6> <p class="product-price" style="margin: 0;" data-astro-cid-y5jmkon6>Rp ', "</p> ", ' </div> </div> <div class="meta-section" data-astro-cid-y5jmkon6> <div class="meta-item" data-astro-cid-y5jmkon6> <span class="meta-label" data-astro-cid-y5jmkon6>Jenis Produk</span> <div class="tag-container" style="gap: 10px;" data-astro-cid-y5jmkon6> ', " ", ' </div> </div> <div class="meta-item" data-astro-cid-y5jmkon6> <span class="meta-label" data-astro-cid-y5jmkon6>Motif Batik</span> <div class="tag-container" data-astro-cid-y5jmkon6> ', " </div> </div> ", ' </div> <div class="description-section" data-astro-cid-y5jmkon6> <h3 class="section-subtitle" data-astro-cid-y5jmkon6>Deskripsi</h3> <p class="description-text" data-astro-cid-y5jmkon6> ', ' </p> </div> <div class="action-buttons" data-astro-cid-y5jmkon6> <a id="wa-btn"', "", "", ' data-astro-cid-y5jmkon6> <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 10px;" data-astro-cid-y5jmkon6><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7.19.19 0 0 1 .1 0 8.38 8.38 0 0 1 3.8.9L21 3z" data-astro-cid-y5jmkon6></path></svg> <span class="btn-text" data-astro-cid-y5jmkon6>', "</span> </a> ", " </div> </div> </div> </div> </section>  ", ` <script>
		// Gallery Switcher Logic
		const mainImg = document.getElementById('main-product-img');
		const thumbs = document.querySelectorAll('.thumb-item');

		if (thumbs) {
			thumbs.forEach(thumb => {
				thumb.addEventListener('click', () => {
					const newSrc = thumb.getAttribute('data-src');
					if (mainImg && newSrc) {
						mainImg.src = newSrc;
						thumbs.forEach(t => t.classList.remove('active'));
						thumb.classList.add('active');
					}
				});
			});
		}

		// Variant Selection Logic
		const variantBtns = document.querySelectorAll('.variant-btn');
		const priceDisplay = document.querySelector('.product-price');
		const badgeDisplay = document.getElementById('stock-badge');
		
		if (variantBtns.length > 0 && priceDisplay) {
			const checkVariantAvailability = (stock) => {
				const isAvailable = stock > 0;
				if (badgeDisplay) {
					badgeDisplay.innerText = isAvailable ? 'In Stock' : 'Stok Habis';
					badgeDisplay.className = \\\`status-badge \\\${!isAvailable ? 'out-of-stock' : ''}\\\`;
				}
				// Also update WA Button
				const waBtn = document.getElementById('wa-btn');
				if (waBtn && waBtn.getAttribute('target') !== '_self') { // Meaning the product itself is active globally
					waBtn.classList.toggle('btn-disabled', !isAvailable);
					const btnText = waBtn.querySelector('.btn-text');
					if (btnText) btnText.innerText = isAvailable ? 'Chat Admin' : 'Stok Ukuran Habis';
				}
			}

			variantBtns.forEach(btn => {
				btn.addEventListener('click', () => {
					variantBtns.forEach(b => b.classList.remove('active'));
					btn.classList.add('active');
					
					const newPrice = parseInt(btn.getAttribute('data-price') || "0", 10);
					if(newPrice > 0) {
						priceDisplay.innerText = "Rp " + newPrice.toLocaleString('id-ID');
					}

					const stock = parseInt(btn.getAttribute('data-stock') || "0", 10);
					checkVariantAvailability(stock);
				});
			});

			// Trigger initial variant state
			const initialStock = parseInt(variantBtns[0].getAttribute('data-stock') || "0", 10);
			const initialPrice = parseInt(variantBtns[0].getAttribute('data-price') || "0", 10);
			if(initialPrice > 0) priceDisplay.innerText = "Rp " + initialPrice.toLocaleString('id-ID');
			checkVariantAvailability(initialStock);
		}

		// Start the engines
	<\/script> `])), maybeRenderHead(), product.name, addAttribute(product.image_url, "src"), addAttribute(product.name, "alt"), !product.is_active && renderTemplate`<div class="ribbon-wrapper" data-astro-cid-y5jmkon6> <div class="ribbon" data-astro-cid-y5jmkon6>HABIS</div> </div>`, product.images && product.images.length > 1 && renderTemplate`<div class="thumbnail-strip" data-astro-cid-y5jmkon6> ${product.images.map((img, i) => renderTemplate`<div${addAttribute(`thumb-item ${i === 0 ? "active" : ""}`, "class")}${addAttribute(img, "data-src")} data-astro-cid-y5jmkon6> <img${addAttribute(img, "src")}${addAttribute(`${product.name} view ${i + 1}`, "alt")} data-astro-cid-y5jmkon6> </div>`)} </div>`, product.code || "NO SKU", addAttribute(`status-badge ${!product.is_active ? "out-of-stock" : ""}`, "class"), product.is_active ? "In Stock" : "Stok Habis", product.name, Number(product.price).toLocaleString("id-ID"), product.original_price && product.original_price > product.price && renderTemplate`<div style="display: flex; flex-direction: column;" data-astro-cid-y5jmkon6> <span style="text-decoration: line-through; color: #999; font-size: 0.9rem;" data-astro-cid-y5jmkon6>
Rp ${Number(product.original_price).toLocaleString("id-ID")} </span> <span style="color: #10b981; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;" data-astro-cid-y5jmkon6>
Hemat Rp ${Number(product.original_price - product.price).toLocaleString("id-ID")} </span> </div>`, productCategories.map((cat, i) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-y5jmkon6": true }, { "default": async ($$result3) => renderTemplate` <span class="meta-value"${addAttribute(i > 0 ? "opacity: 0.8; font-weight: 400;" : "font-weight: 600;", "style")} data-astro-cid-y5jmkon6> ${cat.name} </span> ${i < productCategories.length - 1 && renderTemplate`<span style="opacity: 0.3; align-self: center;" data-astro-cid-y5jmkon6>&rsaquo;</span>`}` })}`), productCategories.length === 0 && renderTemplate`<span class="meta-value" data-astro-cid-y5jmkon6>${product.types?.name || "-"}</span>`, productMotifs.map((m) => renderTemplate`<span class="motif-tag" data-astro-cid-y5jmkon6>${m}</span>`), product.product_variants && product.product_variants.length > 0 ? renderTemplate`<div class="meta-item" data-astro-cid-y5jmkon6> <span class="meta-label" data-astro-cid-y5jmkon6>Tersedia Ukuran</span> <div class="size-chips" id="variant-selector" data-astro-cid-y5jmkon6> ${product.product_variants.map((v, i) => renderTemplate`<button${addAttribute(`size-chip variant-btn ${i === 0 ? "active" : ""}`, "class")}${addAttribute(v.price, "data-price")}${addAttribute(v.stock, "data-stock")} style="outline: none; font-family: inherit;" data-astro-cid-y5jmkon6> ${v.size_name} </button>`)} </div> </div>` : product.sizes && product.sizes.length > 0 && renderTemplate`<div class="meta-item" data-astro-cid-y5jmkon6> <span class="meta-label" data-astro-cid-y5jmkon6>Tersedia Ukuran</span> <div class="size-chips" data-astro-cid-y5jmkon6> ${product.sizes.map((s) => renderTemplate`<span class="size-chip" data-astro-cid-y5jmkon6>${s}</span>`)} </div> </div>`, product.description || "Produk batik eksklusif hasil kerajinan tangan terbaik dengan motif autentik yang menceritakan filosofi mendalam budaya Nusantara.", addAttribute(product.is_active ? `${waBaseUrl}${waNumber}?text=${waMessage}` : "javascript:void(0)", "href"), addAttribute(product.is_active ? "_blank" : "_self", "target"), addAttribute(`btn-primary ${!product.is_active ? "btn-disabled" : ""}`, "class"), product.is_active ? "Chat Admin" : "CEK PRODUK LAIN", product.tokopedia_url && renderTemplate`<a id="tokopedia-btn"${addAttribute(product.is_active ? product.tokopedia_url : "javascript:void(0)", "href")}${addAttribute(product.is_active ? "_blank" : "_self", "target")}${addAttribute(`btn-secondary ${!product.is_active ? "btn-disabled" : ""}`, "class")} data-astro-cid-y5jmkon6> <span class="btn-text" data-astro-cid-y5jmkon6>${product.is_active ? "Beli di Tokopedia" : "HABIS TERJUAL"}</span> </a>`, relatedProducts.length > 0 && renderTemplate`<section style="padding: var(--spacing-2xl) 0; background: #fafafa; border-top: 1px solid #eee;" data-astro-cid-y5jmkon6> <div class="container" data-astro-cid-y5jmkon6> <div style="text-align: center; margin-bottom: var(--spacing-xl);" data-astro-cid-y5jmkon6> <p class="text-uppercase opacity-50" style="font-size: 0.7rem; letter-spacing: 3px; margin-bottom: 0.5rem;" data-astro-cid-y5jmkon6>Discover More</p> <h2 class="section-title" style="font-size: 2.5rem;" data-astro-cid-y5jmkon6>Koleksi <span style="font-style: italic;" data-astro-cid-y5jmkon6>Serupa</span></h2> </div> <div class="product-grid" data-astro-cid-y5jmkon6> ${relatedProducts.map((p, index) => renderTemplate`<div class="product-card reveal-up"${addAttribute(index * 100, "data-delay")} data-astro-cid-y5jmkon6> <div class="product-image" style="aspect-ratio: 4/5;" data-astro-cid-y5jmkon6> <a${addAttribute(`/products/${p.id}`, "href")} data-astro-cid-y5jmkon6> <img${addAttribute(p.image_url, "src")}${addAttribute(p.name, "alt")} loading="lazy" data-astro-cid-y5jmkon6> </a> </div> <div class="product-info" style="padding: 1.5rem;" data-astro-cid-y5jmkon6> <p class="text-uppercase opacity-50" style="font-size: 0.6rem; margin-bottom: 0.5rem;" data-astro-cid-y5jmkon6> ${p.types?.name} • ${p.product_motifs?.map((pm) => pm.motifs?.name).join(", ") || "-"} </p> <h3 style="font-size: 1rem; font-weight: 500; margin-bottom: 0.5rem;" data-astro-cid-y5jmkon6> <a${addAttribute(`/products/${p.id}`, "href")} data-astro-cid-y5jmkon6>${p.name}</a> </h3> <p class="price-tag" style="font-size: 0.95rem;" data-astro-cid-y5jmkon6> ${(() => {
    let displayPrice = `Rp ${Number(p.price).toLocaleString("id-ID")}`;
    if (p.product_variants && p.product_variants.length > 0) {
      const vPrices = p.product_variants.map((v) => v.price);
      const vMin = Math.min(...vPrices);
      if (vMin > 0) {
        displayPrice = `Rp ${vMin.toLocaleString("id-ID")}`;
      }
    }
    return displayPrice;
  })()} </p> </div> </div>`)} </div> </div> </section>`) })}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/products/[id].astro", void 0);

const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/products/[id].astro";
const $$url = "/products/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
