import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const defaultFolders = [
    "products/accessories",
    "products/kain",
    "products/kemeja",
    "products/tunik",
    "products/potongan",
    "products/sarong",
    "products/sepatu",
    "products/hem",
    "products/blus",
    "products/outer",
    "products/batik-anak",
    "products",
    "promotions",
    "settings",
    "general"
  ];

  try {
    const bucket = 'katalog-batik';
    const fbUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?prefix=products/`;
    const fbRes = await fetch(fbUrl);

    if (fbRes.ok) {
      const fbData = await fbRes.json();
      const items = fbData.items || [];
      const discoveredSet = new Set<string>();

      items.forEach((item: any) => {
        const parts = item.name.split('/');
        if (parts.length > 1 && parts[1]) {
          discoveredSet.add(`${parts[0]}/${parts[1]}`);
        }
      });

      const discovered = Array.from(discoveredSet);
      if (discovered.length > 0) {
        const combined = Array.from(new Set([...discovered, ...defaultFolders]));
        return new Response(JSON.stringify({ success: true, data: combined }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  } catch (e) {}

  return new Response(JSON.stringify({ success: true, data: defaultFolders }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
