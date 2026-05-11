import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_B7dm8yGT.mjs';
import { a as apiFetch, $ as $$Layout } from './Layout_CnwklWu_.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$PraProduk = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PraProduk;
  const session = Astro2.cookies.get("admin_session");
  if (session?.value !== "authenticated") {
    return Astro2.redirect("/login");
  }
  let settings = null;
  try {
    const sRes = await apiFetch("settings");
    const s = sRes?.data || sRes;
    if (s) settings = s;
  } catch (e) {
    console.error("Settings fetch error:", e.message);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `Data Pra-Produk - ${settings?.site_name || "Batik Nusantara"}`, "data-astro-cid-5qb65rpk": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<section style="padding: 120px 0 var(--spacing-xl) 0; min-height: 80vh; background: #f9fafb;" data-astro-cid-5qb65rpk> <div class="container" data-astro-cid-5qb65rpk> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;" data-astro-cid-5qb65rpk> <div data-astro-cid-5qb65rpk> <h1 class="text-uppercase" style="font-size: 1.5rem; margin: 0; font-weight: 700;" data-astro-cid-5qb65rpk>Data Pra-Produk</h1> <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;" data-astro-cid-5qb65rpk>Pilih data produk mentah dari sistem untuk diproses menjadi produk siap jual.</p> </div> <a href="/buka-toko" style="padding: 0.6rem 1.2rem; background: white; color: var(--color-text); border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.8rem; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.4rem;" data-astro-cid-5qb65rpk> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-5qb65rpk><line x1="19" y1="12" x2="5" y2="12" data-astro-cid-5qb65rpk></line><polyline points="12 19 5 12 12 5" data-astro-cid-5qb65rpk></polyline></svg>
Kembali ke Form
</a> </div> <div style="margin-bottom: 2rem;" data-astro-cid-5qb65rpk> <input type="text" id="searchInput" placeholder="Cari berdasarkan Kode Barang, SKU, atau Nama Produk..." style="width: 100%; max-width: 500px; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: var(--radius-md); font-size: 0.95rem; box-shadow: var(--shadow-sm);" data-astro-cid-5qb65rpk> </div> <div id="loadingIndicator" style="text-align: center; padding: 4rem; color: #64748b;" data-astro-cid-5qb65rpk> <svg class="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; animation: spin 1s linear infinite;" data-astro-cid-5qb65rpk><line x1="12" y1="2" x2="12" y2="6" data-astro-cid-5qb65rpk></line><line x1="12" y1="18" x2="12" y2="22" data-astro-cid-5qb65rpk></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" data-astro-cid-5qb65rpk></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" data-astro-cid-5qb65rpk></line><line x1="2" y1="12" x2="6" y2="12" data-astro-cid-5qb65rpk></line><line x1="18" y1="12" x2="22" y2="12" data-astro-cid-5qb65rpk></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" data-astro-cid-5qb65rpk></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" data-astro-cid-5qb65rpk></line></svg> <p style="font-weight: 500;" data-astro-cid-5qb65rpk>Mengambil data dari API...</p> </div> <div id="productGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; display: none;" data-astro-cid-5qb65rpk> <!-- Cards will be injected here --> </div> <div id="emptyState" style="display: none; text-align: center; padding: 4rem; color: #64748b; background: white; border-radius: var(--radius-md); border: 1px dashed #cbd5e1;" data-astro-cid-5qb65rpk> <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;" data-astro-cid-5qb65rpk><circle cx="11" cy="11" r="8" data-astro-cid-5qb65rpk></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-5qb65rpk></line></svg> <p data-astro-cid-5qb65rpk>Tidak ada produk yang cocok dengan pencarian Anda.</p> </div> <!-- Pagination Controls --> <div id="paginationControls" style="display: none; justify-content: center; align-items: center; gap: 1.5rem; margin-top: 3rem; flex-wrap: wrap; padding-bottom: 2rem;" data-astro-cid-5qb65rpk> <button id="btnPrev" style="padding: 0.6rem 1.2rem; background: white; color: var(--color-text); border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem; border-color: #ddd;" data-astro-cid-5qb65rpk>
&larr; Prev
</button> <span id="pageInfo" style="font-size: 0.9rem; font-weight: 600; color: #475569;" data-astro-cid-5qb65rpk>
Halaman 1 dari 1
</span> <button id="btnNext" style="padding: 0.6rem 1.2rem; background: white; color: var(--color-text); border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem; border-color: #ddd;" data-astro-cid-5qb65rpk>
Next &rarr;
</button> </div> </div> </section>  <script>
		const BASE_PHOTO_URL = "https://noir.grace.gracianna.web.id/storage/";
        const BASE_PHOTO_URL_FALLBACK = "https://noir.grace.gracianna.web.id/public/";
        const BASE_PHOTO_URL_IMAGES = "https://noir.grace.gracianna.web.id/images/";
 
		let currentPage = 1;
		let totalPages = 1;
		let searchQuery = "";
		let searchTimeout;
 
		const productGrid = document.getElementById('productGrid');
		const loadingIndicator = document.getElementById('loadingIndicator');
		const searchInput = document.getElementById('searchInput');
        const emptyState = document.getElementById('emptyState');
		const paginationControls = document.getElementById('paginationControls');
		const btnPrev = document.getElementById('btnPrev');
		const btnNext = document.getElementById('btnNext');
		const pageInfo = document.getElementById('pageInfo');
 
		async function fetchProducts() {
			loadingIndicator.style.display = 'block';
			productGrid.style.display = 'none';
			paginationControls.style.display = 'none';
			emptyState.style.display = 'none';
 
			try {
				let url = \`https://noir.grace.gracianna.web.id/api/v1/beli1?per_page=12&page=\${currentPage}\`;
				if (searchQuery) {
					url += \`&q=\${encodeURIComponent(searchQuery)}\`;
				}
				const response = await fetch(url);
				const json = await response.json();
				if (json.success && json.data) {
					totalPages = json.meta?.last_page || 1;
					renderProducts(json.data);
					updatePaginationUI();
				} else {
					loadingIndicator.innerHTML = '<p style="color: #ef4444; font-weight: 600;">Gagal memuat data dari API.</p>';
				}
			} catch (err) {
				console.error(err);
				loadingIndicator.innerHTML = '<p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan koneksi saat memuat API.</p>';
			}
		}
 
		function updatePaginationUI() {
			pageInfo.textContent = \`Halaman \${currentPage} dari \${totalPages}\`;
			btnPrev.disabled = currentPage <= 1;
			btnNext.disabled = currentPage >= totalPages;
 
			btnPrev.style.opacity = currentPage <= 1 ? "0.5" : "1";
			btnPrev.style.cursor = currentPage <= 1 ? "not-allowed" : "pointer";
			btnNext.style.opacity = currentPage >= totalPages ? "0.5" : "1";
			btnNext.style.cursor = currentPage >= totalPages ? "not-allowed" : "pointer";
 
			paginationControls.style.display = totalPages > 1 ? 'flex' : 'none';
		}
 
		function renderProducts(products) {
			loadingIndicator.style.display = 'none';
			productGrid.style.display = 'grid';
			productGrid.innerHTML = '';
 
            if(products.length === 0) {
                emptyState.style.display = 'block';
                productGrid.style.display = 'none';
                paginationControls.style.display = 'none';
                return;
            } else {
                emptyState.style.display = 'none';
            }
 
			products.forEach(item => {
				const card = document.createElement('div');
				card.className = 'pra-card';
				card.style.background = 'white';
				card.style.borderRadius = 'var(--radius-md)';
				card.style.boxShadow = 'var(--shadow-sm)';
				card.style.overflow = 'hidden';
				card.style.display = 'flex';
				card.style.flexDirection = 'column';
				card.style.border = '1px solid #eee';
				card.style.transition = 'transform 0.2s, box-shadow 0.2s';
 
				// Prioritize foto, fallback to img1
				const photoFile = item.foto || item.img1;
				let photoHtml = \`<div style="height: 220px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>\`;
				
				if (photoFile) {
					// Multiple fallbacks can be handled via onerror to find where the image actually lives
					const primaryUrl = BASE_PHOTO_URL + photoFile;
					const fallback1 = BASE_PHOTO_URL_FALLBACK + photoFile;
					const fallback2 = BASE_PHOTO_URL_IMAGES + photoFile;
					
					photoHtml = \`
						<div style="height: 220px; overflow: hidden; background: #f8fafc; border-bottom: 1px solid #f1f5f9; position: relative;">
							<img 
								src="\${primaryUrl}" 
								onerror="if(!this.dataset.tried){this.dataset.tried='1'; this.src='\${fallback1}';} else if(this.dataset.tried==='1'){this.dataset.tried='2'; this.src='\${fallback2}';} else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }" 
								alt="\${item.nama || 'Produk'}" 
								style="width: 100%; height: 100%; object-fit: cover;" 
								loading="lazy"
							/>
							<div style="display: none; height: 100%; align-items: center; justify-content: center; color: #94a3b8; background: #f1f5f9; flex-direction: column; font-size: 0.75rem; position: absolute; inset: 0;">
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
								Foto tidak ditemukan
							</div>
						</div>
					\`;
				}
 
				const price = parseInt(item.hjual || 0);
				const formattedPrice = price > 0 ? \`Rp \${price.toLocaleString('id-ID')}\` : 'Harga tidak tersedia';
 
				const oldPriceHtml = item.old ? \`<span style="font-size: 0.75rem; text-decoration: line-through; color: #94a3b8; margin-left: 0.5rem;">Rp \${parseInt(item.old).toLocaleString('id-ID')}</span>\` : '';
 
				card.innerHTML = \`
					\${photoHtml}
					<div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column;">
						<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
							<span style="font-size: 0.65rem; font-weight: 700; color: var(--color-accent); background: #fdf2f8; padding: 0.2rem 0.5rem; border-radius: 4px; letter-spacing: 1px;">
								ITEM: \${item.kodeitem || '-'}
							</span>
							<span style="font-size: 0.65rem; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px;">
								SKU: \${item.counter || '-'}
							</span>
						</div>
						<h3 style="font-size: 1.1rem; margin: 0 0 0.5rem 0; font-weight: 600; color: #0f172a; line-height: 1.3;">
							\${item.nama || 'Tanpa Nama'}
						</h3>
						<div style="margin-top: auto; padding-top: 1rem;">
							<div style="font-size: 1.1rem; font-weight: 700; color: #10b981; margin-bottom: 1rem;">
								\${formattedPrice}
								\${oldPriceHtml}
							</div>
							<a href="/buka-toko/tambah-produk?use_praproduk=\${item.id}" class="btn-gunakan" style="display: block; width: 100%; text-align: center; background: var(--color-text); color: white; padding: 0.7rem; border-radius: var(--radius-sm); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: opacity 0.2s;">
								Gunakan Data Ini
							</a>
						</div>
					</div>
				\`;
				productGrid.appendChild(card);
			});
		}
 
		btnPrev.addEventListener('click', () => {
			if (currentPage > 1) {
				currentPage--;
				fetchProducts();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		});
 
		btnNext.addEventListener('click', () => {
			if (currentPage < totalPages) {
				currentPage++;
				fetchProducts();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		});
 
		searchInput.addEventListener('input', (e) => {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => {
				searchQuery = e.target.value.trim();
				currentPage = 1; // Reset ke halaman 1 saat pencarian baru
				fetchProducts();
			}, 300);
		});
 
		// Start fetching
		document.addEventListener('DOMContentLoaded', fetchProducts);
	<\/script> `], [" ", `<section style="padding: 120px 0 var(--spacing-xl) 0; min-height: 80vh; background: #f9fafb;" data-astro-cid-5qb65rpk> <div class="container" data-astro-cid-5qb65rpk> <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;" data-astro-cid-5qb65rpk> <div data-astro-cid-5qb65rpk> <h1 class="text-uppercase" style="font-size: 1.5rem; margin: 0; font-weight: 700;" data-astro-cid-5qb65rpk>Data Pra-Produk</h1> <p style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem;" data-astro-cid-5qb65rpk>Pilih data produk mentah dari sistem untuk diproses menjadi produk siap jual.</p> </div> <a href="/buka-toko" style="padding: 0.6rem 1.2rem; background: white; color: var(--color-text); border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.8rem; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.4rem;" data-astro-cid-5qb65rpk> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-5qb65rpk><line x1="19" y1="12" x2="5" y2="12" data-astro-cid-5qb65rpk></line><polyline points="12 19 5 12 12 5" data-astro-cid-5qb65rpk></polyline></svg>
Kembali ke Form
</a> </div> <div style="margin-bottom: 2rem;" data-astro-cid-5qb65rpk> <input type="text" id="searchInput" placeholder="Cari berdasarkan Kode Barang, SKU, atau Nama Produk..." style="width: 100%; max-width: 500px; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: var(--radius-md); font-size: 0.95rem; box-shadow: var(--shadow-sm);" data-astro-cid-5qb65rpk> </div> <div id="loadingIndicator" style="text-align: center; padding: 4rem; color: #64748b;" data-astro-cid-5qb65rpk> <svg class="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem; animation: spin 1s linear infinite;" data-astro-cid-5qb65rpk><line x1="12" y1="2" x2="12" y2="6" data-astro-cid-5qb65rpk></line><line x1="12" y1="18" x2="12" y2="22" data-astro-cid-5qb65rpk></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" data-astro-cid-5qb65rpk></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" data-astro-cid-5qb65rpk></line><line x1="2" y1="12" x2="6" y2="12" data-astro-cid-5qb65rpk></line><line x1="18" y1="12" x2="22" y2="12" data-astro-cid-5qb65rpk></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" data-astro-cid-5qb65rpk></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" data-astro-cid-5qb65rpk></line></svg> <p style="font-weight: 500;" data-astro-cid-5qb65rpk>Mengambil data dari API...</p> </div> <div id="productGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; display: none;" data-astro-cid-5qb65rpk> <!-- Cards will be injected here --> </div> <div id="emptyState" style="display: none; text-align: center; padding: 4rem; color: #64748b; background: white; border-radius: var(--radius-md); border: 1px dashed #cbd5e1;" data-astro-cid-5qb65rpk> <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;" data-astro-cid-5qb65rpk><circle cx="11" cy="11" r="8" data-astro-cid-5qb65rpk></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-astro-cid-5qb65rpk></line></svg> <p data-astro-cid-5qb65rpk>Tidak ada produk yang cocok dengan pencarian Anda.</p> </div> <!-- Pagination Controls --> <div id="paginationControls" style="display: none; justify-content: center; align-items: center; gap: 1.5rem; margin-top: 3rem; flex-wrap: wrap; padding-bottom: 2rem;" data-astro-cid-5qb65rpk> <button id="btnPrev" style="padding: 0.6rem 1.2rem; background: white; color: var(--color-text); border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem; border-color: #ddd;" data-astro-cid-5qb65rpk>
&larr; Prev
</button> <span id="pageInfo" style="font-size: 0.9rem; font-weight: 600; color: #475569;" data-astro-cid-5qb65rpk>
Halaman 1 dari 1
</span> <button id="btnNext" style="padding: 0.6rem 1.2rem; background: white; color: var(--color-text); border: 1px solid #ddd; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.4rem; border-color: #ddd;" data-astro-cid-5qb65rpk>
Next &rarr;
</button> </div> </div> </section>  <script>
		const BASE_PHOTO_URL = "https://noir.grace.gracianna.web.id/storage/";
        const BASE_PHOTO_URL_FALLBACK = "https://noir.grace.gracianna.web.id/public/";
        const BASE_PHOTO_URL_IMAGES = "https://noir.grace.gracianna.web.id/images/";
 
		let currentPage = 1;
		let totalPages = 1;
		let searchQuery = "";
		let searchTimeout;
 
		const productGrid = document.getElementById('productGrid');
		const loadingIndicator = document.getElementById('loadingIndicator');
		const searchInput = document.getElementById('searchInput');
        const emptyState = document.getElementById('emptyState');
		const paginationControls = document.getElementById('paginationControls');
		const btnPrev = document.getElementById('btnPrev');
		const btnNext = document.getElementById('btnNext');
		const pageInfo = document.getElementById('pageInfo');
 
		async function fetchProducts() {
			loadingIndicator.style.display = 'block';
			productGrid.style.display = 'none';
			paginationControls.style.display = 'none';
			emptyState.style.display = 'none';
 
			try {
				let url = \\\`https://noir.grace.gracianna.web.id/api/v1/beli1?per_page=12&page=\\\${currentPage}\\\`;
				if (searchQuery) {
					url += \\\`&q=\\\${encodeURIComponent(searchQuery)}\\\`;
				}
				const response = await fetch(url);
				const json = await response.json();
				if (json.success && json.data) {
					totalPages = json.meta?.last_page || 1;
					renderProducts(json.data);
					updatePaginationUI();
				} else {
					loadingIndicator.innerHTML = '<p style="color: #ef4444; font-weight: 600;">Gagal memuat data dari API.</p>';
				}
			} catch (err) {
				console.error(err);
				loadingIndicator.innerHTML = '<p style="color: #ef4444; font-weight: 600;">Terjadi kesalahan koneksi saat memuat API.</p>';
			}
		}
 
		function updatePaginationUI() {
			pageInfo.textContent = \\\`Halaman \\\${currentPage} dari \\\${totalPages}\\\`;
			btnPrev.disabled = currentPage <= 1;
			btnNext.disabled = currentPage >= totalPages;
 
			btnPrev.style.opacity = currentPage <= 1 ? "0.5" : "1";
			btnPrev.style.cursor = currentPage <= 1 ? "not-allowed" : "pointer";
			btnNext.style.opacity = currentPage >= totalPages ? "0.5" : "1";
			btnNext.style.cursor = currentPage >= totalPages ? "not-allowed" : "pointer";
 
			paginationControls.style.display = totalPages > 1 ? 'flex' : 'none';
		}
 
		function renderProducts(products) {
			loadingIndicator.style.display = 'none';
			productGrid.style.display = 'grid';
			productGrid.innerHTML = '';
 
            if(products.length === 0) {
                emptyState.style.display = 'block';
                productGrid.style.display = 'none';
                paginationControls.style.display = 'none';
                return;
            } else {
                emptyState.style.display = 'none';
            }
 
			products.forEach(item => {
				const card = document.createElement('div');
				card.className = 'pra-card';
				card.style.background = 'white';
				card.style.borderRadius = 'var(--radius-md)';
				card.style.boxShadow = 'var(--shadow-sm)';
				card.style.overflow = 'hidden';
				card.style.display = 'flex';
				card.style.flexDirection = 'column';
				card.style.border = '1px solid #eee';
				card.style.transition = 'transform 0.2s, box-shadow 0.2s';
 
				// Prioritize foto, fallback to img1
				const photoFile = item.foto || item.img1;
				let photoHtml = \\\`<div style="height: 220px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8;"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>\\\`;
				
				if (photoFile) {
					// Multiple fallbacks can be handled via onerror to find where the image actually lives
					const primaryUrl = BASE_PHOTO_URL + photoFile;
					const fallback1 = BASE_PHOTO_URL_FALLBACK + photoFile;
					const fallback2 = BASE_PHOTO_URL_IMAGES + photoFile;
					
					photoHtml = \\\`
						<div style="height: 220px; overflow: hidden; background: #f8fafc; border-bottom: 1px solid #f1f5f9; position: relative;">
							<img 
								src="\\\${primaryUrl}" 
								onerror="if(!this.dataset.tried){this.dataset.tried='1'; this.src='\\\${fallback1}';} else if(this.dataset.tried==='1'){this.dataset.tried='2'; this.src='\\\${fallback2}';} else { this.style.display='none'; this.nextElementSibling.style.display='flex'; }" 
								alt="\\\${item.nama || 'Produk'}" 
								style="width: 100%; height: 100%; object-fit: cover;" 
								loading="lazy"
							/>
							<div style="display: none; height: 100%; align-items: center; justify-content: center; color: #94a3b8; background: #f1f5f9; flex-direction: column; font-size: 0.75rem; position: absolute; inset: 0;">
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.5rem;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
								Foto tidak ditemukan
							</div>
						</div>
					\\\`;
				}
 
				const price = parseInt(item.hjual || 0);
				const formattedPrice = price > 0 ? \\\`Rp \\\${price.toLocaleString('id-ID')}\\\` : 'Harga tidak tersedia';
 
				const oldPriceHtml = item.old ? \\\`<span style="font-size: 0.75rem; text-decoration: line-through; color: #94a3b8; margin-left: 0.5rem;">Rp \\\${parseInt(item.old).toLocaleString('id-ID')}</span>\\\` : '';
 
				card.innerHTML = \\\`
					\\\${photoHtml}
					<div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column;">
						<div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
							<span style="font-size: 0.65rem; font-weight: 700; color: var(--color-accent); background: #fdf2f8; padding: 0.2rem 0.5rem; border-radius: 4px; letter-spacing: 1px;">
								ITEM: \\\${item.kodeitem || '-'}
							</span>
							<span style="font-size: 0.65rem; font-weight: 600; color: #64748b; background: #f1f5f9; padding: 0.2rem 0.5rem; border-radius: 4px;">
								SKU: \\\${item.counter || '-'}
							</span>
						</div>
						<h3 style="font-size: 1.1rem; margin: 0 0 0.5rem 0; font-weight: 600; color: #0f172a; line-height: 1.3;">
							\\\${item.nama || 'Tanpa Nama'}
						</h3>
						<div style="margin-top: auto; padding-top: 1rem;">
							<div style="font-size: 1.1rem; font-weight: 700; color: #10b981; margin-bottom: 1rem;">
								\\\${formattedPrice}
								\\\${oldPriceHtml}
							</div>
							<a href="/buka-toko/tambah-produk?use_praproduk=\\\${item.id}" class="btn-gunakan" style="display: block; width: 100%; text-align: center; background: var(--color-text); color: white; padding: 0.7rem; border-radius: var(--radius-sm); text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: opacity 0.2s;">
								Gunakan Data Ini
							</a>
						</div>
					</div>
				\\\`;
				productGrid.appendChild(card);
			});
		}
 
		btnPrev.addEventListener('click', () => {
			if (currentPage > 1) {
				currentPage--;
				fetchProducts();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		});
 
		btnNext.addEventListener('click', () => {
			if (currentPage < totalPages) {
				currentPage++;
				fetchProducts();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		});
 
		searchInput.addEventListener('input', (e) => {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(() => {
				searchQuery = e.target.value.trim();
				currentPage = 1; // Reset ke halaman 1 saat pencarian baru
				fetchProducts();
			}, 300);
		});
 
		// Start fetching
		document.addEventListener('DOMContentLoaded', fetchProducts);
	<\/script> `])), maybeRenderHead()) })}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/pra-produk.astro", void 0);

const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/pra-produk.astro";
const $$url = "/buka-toko/pra-produk";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$PraProduk,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
