import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_B7dm8yGT.mjs';
import { $ as $$Layout } from './Layout_CnwklWu_.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tentang Kami" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container" style="padding: var(--spacing-2xl) var(--spacing-md); max-width: 800px; margin: 0 auto;"> <h1 class="text-uppercase" style="font-size: 1rem; margin-bottom: var(--spacing-lg);">Tentang Kami</h1> <p style="font-size: 1.2rem; line-height: 1.8; margin-bottom: var(--spacing-md);">
Koleksi kami adalah kurasi batik eksklusif yang menghubungkan warisan budaya Indonesia dengan gaya hidup modern yang minimalis.
</p> <p style="margin-bottom: var(--spacing-md);">
Koleksi kami dipilih secara teliti, mulai dari kemeja slim-fit hingga kain sutra premium. Kami percaya bahwa setiap motif batik menceritakan sebuah filosofi yang dalam, dan melalui desain website yang bersih, kami ingin filosofi tersebut menjadi pusat perhatian.
</p> <div style="margin-top: var(--spacing-xl); padding: var(--spacing-lg); border-left: 2px solid var(--color-accent); background: #f9f9f9;"> <h3 class="text-uppercase" style="font-size: 0.8rem; margin-bottom: 0.5rem;">Visi Kami</h3> <p>Menjadikan Batik sebagai pilihan utama dalam berpakaian modern tanpa menghilangkan esensi tradisinya.</p> </div> <div style="margin-top: var(--spacing-xl); text-align: center;"> <a href="/products" class="text-uppercase" style="border-bottom: 1px solid currentColor;">Eksplorasi Koleksi Kami</a> </div> </section> ` })}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/about.astro", void 0);

const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$About,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
