export const prerender = false;
import type { APIRoute } from 'astro';
import { generateMemberCardPng } from '../../services/memberCardService';

export const GET: APIRoute = async ({ request }) => {
	try {
		const url = new URL(request.url);
		const phone = url.searchParams.get('phone') || '081234567890';
		const name = url.searchParams.get('name') || 'Member Setia';
		const outlet = url.searchParams.get('outlet') || 'Galeri & Online';
		const business = url.searchParams.get('business') || 'JAVA BATIK';

		const pngBuffer = await generateMemberCardPng({
			name,
			phone,
			businessName: business,
			outlet
		});

		return new Response(new Uint8Array(pngBuffer), {
			status: 200,
			headers: {
				'Content-Type': 'image/png',
				'Content-Length': String(pngBuffer.length),
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (err: any) {
		console.error('Error generating member card:', err);
		return new Response(`Error generating card: ${err?.message}`, { status: 500 });
	}
};
