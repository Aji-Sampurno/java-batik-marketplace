export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json();
		const {
			to,
			nickname = '',
			fullName = '',
			poin = '0',
			transaksi = '1x belanja',
			lastTrx = '-',
			imageUrl = 'https://javabatikgallery.com/images/promo_cinematic.png',
			// Compatibility fallbacks
			name = '',
			voucher = '',
			outlet = '',
			additional = ''
		} = body;

		if (!to) {
			return new Response(JSON.stringify({
				success: false,
				error: 'Nomor WhatsApp tujuan wajib diisi.'
			}), { status: 400, headers: { 'Content-Type': 'application/json' } });
		}

		// Normalize phone number to international format without + or dashes (e.g. 628123456789)
		let cleanPhone = String(to).replace(/[^0-9]/g, '');
		if (cleanPhone.startsWith('0')) {
			cleanPhone = '62' + cleanPhone.slice(1);
		} else if (cleanPhone.startsWith('8')) {
			cleanPhone = '62' + cleanPhone;
		}

		const phoneId = process.env.WA_PHONE_NUMBER_ID || '1418528344669776';
		const accessToken = process.env.WA_ACCESS_TOKEN || '';

		if (!phoneId || !accessToken) {
			return new Response(JSON.stringify({
				success: false,
				error: 'Kredensial Meta WhatsApp Cloud API belum lengkap di server.'
			}), { status: 500, headers: { 'Content-Type': 'application/json' } });
		}

		// Map to 5 variables of reminder_member template:
		// {{1}} = Nama Panggilan (Halo Kak {{1}}!)
		// {{2}} = Nama Lengkap (Nama : {{2}})
		// {{3}} = Total Poin (Total Poin : {{3}} poin)
		// {{4}} = Total Transaksi (Total Transaksi : {{4}})
		// {{5}} = Transaksi Terakhir (Transaksi Terakhir : {{5}})
		const paramNickname = (nickname || (name ? name.split(' ')[0] : 'Kakak')).trim();
		const paramFullName = (fullName || name || paramNickname).trim();
		const paramPoin = String(poin || '0').trim();
		const paramTransaksi = String(transaksi || outlet || '1x belanja').trim();
		const paramLastTrx = String(lastTrx || additional || voucher || '-').trim();

		// Prepare payload for Meta WhatsApp Cloud API
		const payload = {
			messaging_product: 'whatsapp',
			recipient_type: 'individual',
			to: cleanPhone,
			type: 'template',
			template: {
				name: 'reminder_member',
				language: {
					code: 'id'
				},
				components: [
					{
						type: 'header',
						parameters: [
							{
								type: 'image',
								image: {
									link: imageUrl
								}
							}
						]
					},
					{
						type: 'body',
						parameters: [
							{ type: 'text', text: paramNickname },
							{ type: 'text', text: paramFullName },
							{ type: 'text', text: paramPoin },
							{ type: 'text', text: paramTransaksi },
							{ type: 'text', text: paramLastTrx }
						]
					}
				]
			}
		};

		const metaRes = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const metaData = await metaRes.json();

		if (!metaRes.ok || metaData.error) {
			console.error('❌ Meta WABA API Error:', metaData);
			return new Response(JSON.stringify({
				success: false,
				error: metaData.error?.message || 'Gagal mengirim pesan dari Meta WhatsApp API',
				details: metaData.error || metaData
			}), { status: metaRes.status || 400, headers: { 'Content-Type': 'application/json' } });
		}

		return new Response(JSON.stringify({
			success: true,
			message: `Pesan template WABA "reminder_member" berhasil dikirim ke +${cleanPhone}!`,
			data: metaData
		}), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});

	} catch (err: any) {
		console.error('❌ Internal server error in send-reminder-waba:', err);
		return new Response(JSON.stringify({
			success: false,
			error: err.message || 'Terjadi kesalahan internal pada server.'
		}), { status: 500, headers: { 'Content-Type': 'application/json' } });
	}
};
