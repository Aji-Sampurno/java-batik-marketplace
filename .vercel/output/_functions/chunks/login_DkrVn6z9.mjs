import { c as createComponent } from './astro-component_B99hSxkT.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_B7dm8yGT.mjs';
import { $ as $$Layout } from './Layout_CnwklWu_.mjs';

const $$Login = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  let errorMessage = "";
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const password = formData.get("password");
      const adminPassword = undefined                               || "admin123";
      if (password === adminPassword) {
        Astro2.cookies.set("admin_session", "authenticated", {
          path: "/",
          httpOnly: true,
          maxAge: 60 * 60 * 24
        });
        return Astro2.redirect("/buka-toko");
      } else {
        errorMessage = "Password salah. Silakan coba lagi.";
      }
    } catch (e) {
      errorMessage = "Terjadi kesalahan sistem.";
    }
  }
  const session = Astro2.cookies.get("admin_session");
  if (session?.value === "authenticated") {
    return Astro2.redirect("/buka-toko");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login Admin - Batik Marketplace" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section style="display: flex; align-items: center; justify-content: center; min-height: 70vh; padding: var(--spacing-xl) 0;"> <div style="background: white; border: 1px solid var(--color-border); padding: var(--spacing-xl); width: 100%; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);"> <h1 class="text-uppercase" style="font-size: 1.2rem; margin-bottom: var(--spacing-lg); text-align: center;">Admin Login</h1> ${errorMessage && renderTemplate`<div style="padding: 0.8rem; margin-bottom: 1.5rem; background: #fff5f5; border: 1px solid #ff4d4d; color: #ff4d4d; font-size: 0.9rem; text-align: center;"> ${errorMessage} </div>`} <form method="POST" style="display: flex; flex-direction: column; gap: var(--spacing-md);"> <div> <label class="text-uppercase opacity-50" style="font-size: 0.7rem; display: block; margin-bottom: 0.3rem;">Password</label> <input name="password" type="password" required placeholder="Masukkan password admin" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; outline: none;" autofocus> </div> <div style="margin-top: 0.5rem;"> <button type="submit" style="background: var(--color-text); color: white; padding: 1rem; border: none; text-transform: uppercase; letter-spacing: 2px; width: 100%; cursor: pointer; font-weight: bold;">
Masuk
</button> </div> </form> <p style="text-align: center; margin-top: 1.5rem; font-size: 0.8rem; opacity: 0.5;">
Halaman ini hanya untuk pengelola toko.
</p> </div> </section> ` })}`;
}, "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/login.astro", void 0);
const $$file = "/Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
