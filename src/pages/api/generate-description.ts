import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
	try {
		const { name, category, motif, price } = await request.json();

		const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
		if (!apiKey) {
			return new Response(JSON.stringify({
				error: 'GEMINI_API_KEY belum dikonfigurasi di file .env Anda. Silakan tambahkan GEMINI_API_KEY=key_anda untuk menggunakan fitur asisten AI ini.'
			}), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const prompt = `Anda adalah seorang desainer dan copywriter profesional dari butik batik eksklusif. 
Tuliskan deskripsi produk batik yang sangat menarik, elegan, profesional, dan persuasif berdasarkan spesifikasi produk berikut:

- Nama Produk: ${name || 'Batik Klasik'}
- Kategori/Jenis: ${category || 'Batik Eksklusif'}
- Motif: ${motif || 'Motif Indah'}
- Harga Perkiraan: Rp ${price ? Number(price).toLocaleString('id-ID') : 'Hubungi Admin'}

Aturan penulisan deskripsi:
1. Analisis jenis produk dan bahan secara cerdas berdasarkan Nama Produk dan Kategori (misalnya: jika produk adalah kemeja, tunik, dress, atau berupa lembaran kain/bakalan kain; serta jika menggunakan bahan sutra, katun premium, dolby, atau viscose). Sesuaikan deskripsi kenyamanan dan kelembutan kain dengan jenis bahan rill tersebut secara presisi. Jika bahan tidak disebutkan secara spesifik, asumsikan menggunakan bahan premium pilihan berkualitas tinggi yang halus, adem, dan nyaman dipakai.
2. Jelaskan kualitas pewarnaan bermutu tinggi yang membuat warna batik awet, tegas, hidup, dan tidak mudah pudar.
3. Sebutkan detail pengerjaan: jika pakaian jadi, tekankan jahitan rapi standar butik dengan pola potong motif yang simetris dan presisi; jika berupa kain lembaran/bakalan kain, tekankan bahwa kain ini siap dijahit menjadi kemeja lengan panjang/pendek atau busana elegan lainnya dengan pola motif yang fleksibel dan leluasa disesuaikan.
4. Berikan rekomendasi penggunaan produk secara fleksibel berdasarkan karakternya (misal untuk acara formal, resepsi, seragam kantor mewah, busana kasual berkelas, atau sebagai hadiah/hantaran eksklusif).

Tulis deskripsi dalam Bahasa Indonesia yang mengalir indah, hangat, meyakinkan pembeli, dan gunakan paragraf serta poin-poin terstruktur yang rapi. Hindari menggunakan tanda bintang ganda (**) berlebihan untuk teks tebal agar tampilan deskripsi tetap bersih dan elegan.`;

		const models = ['gemini-3.0-preview', 'gemini-3.0-flash', 'gemini-2.5-flash', 'gemini-2.0-flash'];
		let response: any = null;
		let lastError = '';

		for (const model of models) {
			try {
				response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						contents: [{
							parts: [{ text: prompt }]
						}]
					})
				});

				if (response.ok) {
					break;
				} else {
					const errorData = await response.json().catch(() => ({}));
					lastError = errorData.error?.message || `Gagal menggunakan model ${model}`;
				}
			} catch (err: any) {
				lastError = err.message || `Kendala koneksi pada model ${model}`;
			}
		}

		if (!response || !response.ok) {
			return new Response(JSON.stringify({
				error: lastError || 'Gagal memanggil Gemini API.'
			}), {
				status: response ? response.status : 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		const data = await response.json();
		const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

		return new Response(JSON.stringify({ description: generatedText.trim() }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error: any) {
		return new Response(JSON.stringify({ error: error.message || 'Terjadi kesalahan sistem.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
