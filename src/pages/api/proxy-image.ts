import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const urlObj = new URL(request.url);
  const targetUrl = urlObj.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
        return new Response('Gagal mengambil gambar dari sumber.', { status: 502 });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    // Extract simple filename from url path
    let filename = "praproduk_img";
    try {
        const parsedTarget = new URL(targetUrl);
        const pathParts = parsedTarget.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && lastPart.includes('.')) {
            filename = lastPart;
        } else {
            // guess extension
            if (contentType.includes('png')) filename += ".png";
            else filename += ".jpg";
        }
    } catch (e) {}

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e: any) {
    return new Response('Server error saat memproses gambar: ' + e.message, { status: 500 });
  }
};
