import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { r as renderTemplate, m as maybeRenderHead } from './entrypoint_B7dm8yGT.mjs';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$DeleteConfirmModal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["<!-- Modal Confirmation -->", `<div id="confirmModal" style="display: none; position: fixed; inset: 0; z-index: 9999; align-items: center; justify-content: center; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);"> <div style="max-width: 400px; width: 90%; background: white; padding: 2.5rem 2rem; border-radius: var(--radius-md); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); text-align: center; border: 1px solid rgba(255,255,255,0.1);"> <div style="background: #fff5f5; color: #ff4d4d; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;"> <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> </div> <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: #1a1a1a;">Konfirmasi Hapus</h3> <p id="confirmText" style="font-size: 0.95rem; line-height: 1.5; color: #666; margin-bottom: 2rem;">Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan.</p> <div style="display: flex; gap: 0.8rem;"> <button id="cancelBtn" type="button" style="flex: 1; padding: 0.75rem; border: 1px solid #e5e7eb; background: white; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; font-size: 0.85rem; color: #374151; transition: background 0.2s;" onmouseover="this.style.background='#f9fafb'" onmouseout="this.style.background='white'">BATAL</button> <button id="confirmBtn" type="button" style="flex: 1; padding: 0.75rem; background: #ff4d4d; color: white; border: none; border-radius: var(--radius-sm); cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: background 0.2s;" onmouseover="this.style.background='#e63939'" onmouseout="this.style.background='#ff4d4d'">YA, HAPUS</button> </div> </div> </div> <script>
	let formToSubmit = null;
	const modal = document.getElementById('confirmModal');
	const confirmBtn = document.getElementById('confirmBtn');
	const cancelBtn = document.getElementById('cancelBtn');
	const confirmText = document.getElementById('confirmText');

	window.showDeleteConfirm = (form, message) => {
		formToSubmit = form;
		if (message) confirmText.textContent = message;
		modal.style.display = 'flex';
		return false; 
	};

	confirmBtn?.addEventListener('click', () => {
		if (formToSubmit) {
			formToSubmit.submit();
		}
		modal.style.display = 'none';
	});

	cancelBtn?.addEventListener('click', () => {
		modal.style.display = 'none';
		formToSubmit = null;
	});

	modal?.addEventListener('click', (e) => {
		if (e.target === modal) {
			modal.style.display = 'none';
			formToSubmit = null;
		}
	});
<\/script>`])), maybeRenderHead());
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/components/DeleteConfirmModal.astro", void 0);

export { $$DeleteConfirmModal as $ };
