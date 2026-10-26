export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
	try {
		const url = new URL(request.url);
		let phone = url.searchParams.get('phone') || '';
		phone = phone.replace(/[^0-9]/g, '');
		if (!phone) {
			return new Response(JSON.stringify({ success: false, message: 'Nomor telepon wajib diisi.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// Try direct format
		let res = await fetch(`https://noir.grace.gracianna.web.id/api/v1/checkPoin?nomor=${phone}`, {
			headers: { 'Accept': 'application/json' }
		});
		let data = await res.json().catch(() => null);

		// If not found and starts with 08, try 628
		if ((!data || !data.success) && phone.startsWith('08')) {
			const altPhone = '62' + phone.slice(1);
			const altRes = await fetch(`https://noir.grace.gracianna.web.id/api/v1/checkPoin?nomor=${altPhone}`, {
				headers: { 'Accept': 'application/json' }
			});
			const altData = await altRes.json().catch(() => null);
			if (altData && altData.success) {
				data = altData;
			}
		}

		// If not found and starts with 628, try 08
		if ((!data || !data.success) && phone.startsWith('628')) {
			const altPhone = '08' + phone.slice(3);
			const altRes = await fetch(`https://noir.grace.gracianna.web.id/api/v1/checkPoin?nomor=${altPhone}`, {
				headers: { 'Accept': 'application/json' }
			});
			const altData = await altRes.json().catch(() => null);
			if (altData && altData.success) {
				data = altData;
			}
		}

		if (data && data.success && data.data) {
			return new Response(JSON.stringify({
				success: true,
				data: data.data
			}), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({
			success: false,
			message: data?.message || 'Data member tidak ditemukan di database Noir.'
		}), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (err: any) {
		return new Response(JSON.stringify({
			success: false,
			error: err.message
		}), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
