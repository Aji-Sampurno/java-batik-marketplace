import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const urlObj = new URL(request.url);
  const folder = urlObj.searchParams.get('folder') || 'products/accessories';
  const bucket = 'katalog-batik';

  try {
    const cleanFolder = folder.replace(/\/$/, '') + '/';
    const fbUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?prefix=${encodeURIComponent(cleanFolder)}`;
    const fbRes = await fetch(fbUrl);

    if (!fbRes.ok) {
      return new Response(JSON.stringify({ success: false, message: 'Firebase Storage response error', data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fbData = await fbRes.json();
    const items = fbData.items || [];

    const files = items.map((item: any) => {
      const name = item.name;
      const filename = name.substring(name.lastIndexOf('/') + 1);
      if (!filename) return null;
      const encodedPath = encodeURIComponent(name);
      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
      const isRaw = filename.includes('_raw_') || filename.toLowerCase().endsWith('.jpg') || filename.toLowerCase().endsWith('.jpeg');
      
      return {
        name: name,
        filename: filename,
        url: fileUrl,
        size: 0,
        updated_at: '',
        is_raw: isRaw
      };
    }).filter(Boolean);

    return new Response(JSON.stringify({
      success: true,
      folder: folder,
      total: files.length,
      data: files
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, message: e.message, data: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
