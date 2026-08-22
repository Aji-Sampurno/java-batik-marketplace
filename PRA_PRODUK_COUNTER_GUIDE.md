# 📖 Dokumentasi Fitur Pra-Produk Baru (Skema Counter & Multi-Motif)

Dokumen ini merupakan panduan arsitektur, alur data, dan perbandingan komprehensif antara **Fitur Pra-Produk Lama** dan **Fitur Pra-Produk Baru (Skema Counter)** pada Marketplace Batik Nusantara.

---

## 📑 Daftar Isi
1. [Gambaran Umum & Perubahan Paradigma](#1-gambaran-umum--perubahan-paradigma)
2. [Tabel Perbandingan: Pra-Produk Lama vs Pra-Produk Baru](#2-tabel-perbandingan-pra-produk-lama-vs-pra-produk-baru)
3. [Arsitektur & Spesifikasi Alur Data Baru](#3-arsitektur--spesifikasi-alur-data-baru)
4. [Mesin Pemetaan Motif & Counter Otomatis](#4-mesin-pemetaan-motif--counter-otomatis)
5. [Sistem Pemrosesan & Penyimpanan Foto (Firebase Storage)](#5-sistem-pemrosesan--penyimpanan-foto-firebase-storage)
6. [Penanganan Model Fit (Regular Fit vs Slim Fit)](#6-penanganan-model-fit-regular-fit-vs-slim-fit)
7. [Aturan Khusus: Setelan, Kain, Gulungan & Kategori Lainnya](#7-aturan-khusus-setelan-kain-gulungan--kategori-lainnya)
8. [Tampilan & Alur Pembeli di Halaman Detail Produk](#8-tampilan--alur-pembeli-di-halaman-detail-produk)
9. [Arsitektur Berkas & Referensi Kode](#9-arsitektur-berkas--referensi-kode)

---

## 1. Gambaran Umum & Perubahan Paradigma

Pada sistem **Pra-Produk Lama**, satu barang POS dipetakan ke satu produk dengan varian ukuran statis (`All Size`, `S`, `M`, `L`, `XL`). Pendekatan ini memiliki keterbatasan saat satu kode barang di POS memiliki banyak counter fisik, outlet berbeda, atau motif batik yang berbeda antar-counter.

Pada sistem **Pra-Produk Baru (Skema Counter)**:
* Setiap baris **Counter/Outlet** dipertahankan secara modular dalam tabel varian interaktif.
* Mendukung **Multi-Motif (Motif A, B, C, dst.)** dengan foto & thumbnail spesifik per motif.
* Mengunggah langsung foto hasil watermark dan foto raw ke **Firebase Storage** dalam format **WebP**.
* Menyediakan kontrol batch cepat (set ukuran serentak, set model fit serentak, set harga serentak).
* Menyajikan alur belanja 2-langkah yang mewah bagi pembeli (**Pilih Motif $\rightarrow$ Pilih Ukuran $\rightarrow$ Model Fit**).

---

## 2. Tabel Perbandingan: Pra-Produk Lama vs Pra-Produk Baru

| Fitur / Parameter | Pra-Produk Lama (`tambah-produk.astro`) | Pra-Produk Baru (`tambah-produk-counter.astro`) |
| :--- | :--- | :--- |
| **Konsep Varian** | Checkbox ukuran statis (`S`, `M`, `L`, `XL`, `All Size`). | **Tabel Modular Per Counter/Outlet** dengan data stok, harga, dan SKU masing-masing. |
| **Dukungan Multi-Motif** | Terbatas pada pemisahan warna/kain dasar. | **Full Multi-Motif (`Motif A`, `Motif B`, dst.)** dengan foto & thumbnail per motif. |
| **Penyimpanan Foto** | Diunggah via Laravel CDN (nama file hash acak). | **Direct Firebase Storage**: File WebP terstruktur (`${code}_${motif}_${time}.webp`). |
| **Foto Raw (Master)** | Tidak tersimpan / hanya foto ter-watermark. | **Tersimpan Otomatis di Firebase** (`raw_images`) terpisah dari foto katalog (`images`). |
| **Watermark Engine** | Standar canvas client-side. | **Watermark Emas + Kode SKU** presisi tinggi dengan fallback visual badge & nama motif. |
| **Fitur Unggah Foto** | Input file biasa. | **Drag & Drop**, **Copy-Paste (Clipboard)**, dan klik langsung pada thumbnail. |
| **Pilihan Model Fit** | Berdasarkan checkbox deteksi nama string. | **Dropdown MODEL FIT per baris (`Regular Fit` vs `Slim Fit`)** + alat **Batch Fit Serentak**. |
| **Pengaturan Serentak** | Pengisian per field terpisah. | **Toolbar Batch Cepat**: *Set Motif*, *Set Ukuran*, *Set Model Fit*, *Set Harga*, *Set Furing*. |
| **Loading Feedback** | Tanpa indikator visual saat proses berat. | **Modal Loading Overlay** dengan backdrop blur & animasi spinner saat kompresi & upload. |
| **Alur UI Pembeli** | Memilih ukuran umum langsung. | **Alur Bertingkat Mewah**: Pembeli memilih **Motif** $\rightarrow$ **Ukuran** $\rightarrow$ **Model Fit**, foto berganti otomatis. |
| **Format Pesan WA** | Format varian standar. | **Format Pesan Lengkap**: Menyertakan motif, ukuran, fit, dan furing secara presisi. |

---

## 3. Arsitektur & Spesifikasi Alur Data Baru

```mermaid
graph TD
    A[API POS /pra-produk] -->|Fetch / Cache| B[Halaman Pra-Produk Counter]
    B -->|Pilih Item| C[Form Tambah Produk Counter]
    C --> D[Parsing SKU & Auto-Fill Kategori/Bahan]
    C --> E[Render Tabel Varian Counter]
    E --> F[Pilihan Motif A/B/C + Model Fit REG/SF]
    E --> G[Upload / Drag & Drop Foto Per Motif]
    G --> H[Kompresi WebP & Watermark Emas]
    H --> I[Direct Upload ke Firebase Storage]
    I --> J[Simpan Produk ke Database Katalog]
    J --> K[PUT AI_Foto ke API POS Noir]
```

### Pemetaan Data API POS ke Form Counter:
* `item.kodeitem`: Dasar pembuatan nama produk & kode prefix motif.
* `item.kode`: SKU POS yang di-parse menggunakan rumus 7 posisi (`$tipe1` s/d `$supplier`).
* `details[]`: Setiap elemen array menjadi 1 baris dalam tabel counter dan disimpan ke payload varian database:
  * `d.counter` $\rightarrow$ `variant.counter` & `variant.sku` (Nomor Counter unik POS).
  * `d.outlet` $\rightarrow$ `variant.outlet` (Nama outlet / lokasi fisik counter).
  * `d.size` $\rightarrow$ `variant.size_name` (Murni nama ukuran dasar: `S`, `M`, `L`, `XL`, `ALL SIZE`).
  * `sleeve` (deteksi LP/PD) $\rightarrow$ `variant.sleeve` (`Panjang` / `Pendek` / `3/4` / `-`).
  * `d.size` / `d.kode` (deteksi `SF`) $\rightarrow$ `variant.fit` (`REG` = Regular Fit / `SF` = Slim Fit).
  * `d.hjual` $\rightarrow$ `variant.price` (Harga jual per counter).
  * `d.stok` $\rightarrow$ `variant.stock` (Stok fisik per counter).
  * `d.dalaman` $\rightarrow$ `variant.dalaman` (`F` = Furing / `TF` = Non Furing).
  * `motif` $\rightarrow$ `variant.motif` & `variant.image_url` (Foto spesifik motif counter).

---

## 4. Mesin Pemetaan Motif & Counter Otomatis

Setiap counter secara otomatis diberikan abjad motif berdasarkan indeks urutan:
* Baris 1 $\rightarrow$ `Motif A`
* Baris 2 $\rightarrow$ `Motif B`
* Baris 3 $\rightarrow$ `Motif C`
* ...dan seterusnya.

### Sinkronisasi Foto Per Motif:
Jika seller mengunggah foto baru untuk `Motif A`:
1. Sistem otomatis memperbarui thumbnail seluruh baris counter yang memiliki motif `Motif A`.
2. Kartu ringkasan foto motif di bagian bawah tabel otomatis terupdate.
3. Seller tidak perlu mengunggah foto berulang kali untuk counter yang memiliki motif yang sama.

---

## 5. Sistem Pemrosesan & Penyimpanan Foto (Firebase Storage)

### A. Format Struktur Folder & Penamaan Berkas
Berkas disimpan langsung ke Google Firebase Storage bucket `katalog-batik` dengan struktur hierarki folder rapi:
```text
📂 [jenis_produk]/
   └── 📂 [kode_item]/
       └── 📂 [motif]/
           ├── 📂 raw/
           │   └── [kode_item]_[motif]_raw_[timestamp]_[idx].webp
           └── 📂 katalog/
               └── [kode_item]_[motif]_[timestamp]_[idx].webp
```

* **Foto Katalog (Dengan Watermark Logo Emas & Kode)**:  
  `${jenis_produk}/${kode_item}/${motif}/katalog/${actualCode}_${cleanMotifTag}_${timestamp}_${motifIdx}.webp`  
  *(Contoh: `kemeja/NK157Q/motif-a/katalog/NK157Q_motif-a_1787302492_1.webp`)*
* **Foto Raw (Arsip Master Bersih Tanpa Watermark)**:  
  `${jenis_produk}/${kode_item}/${motif}/raw/${actualCode}_${cleanMotifTag}_raw_${timestamp}_${motifIdx}.webp`  
  *(Contoh: `kemeja/NK157Q/motif-a/raw/NK157Q_motif-a_raw_1787302492_1.webp`)*

### B. Spesifikasi Kompresi WebP (Sharp)
* **Katalog**: Format WebP, Quality `80`, dilengkapi Logo Emas Java Batik & Kode SKU.
* **Raw**: Format WebP, Quality `85`, bersih tanpa teks & logo (arsip jernih).

### C. Sinkronisasi Balik ke POS Noir
Setelah produk tersimpan di marketplace, sistem mengirimkan request:
```http
PUT /api/v1/beli1/{id}/ai-foto
Content-Type: application/json

{
  "AI_foto": "https://storage.googleapis.com/.../motif-a/katalog/NK157Q_motif-a_xxx.webp"
}
```

---

## 6. Penanganan Model Fit (Regular Fit vs Slim Fit)

Pada Pra-Produk Baru, penanganan model fit diatur secara eksplisit:
1. **Deteksi Otomatis POS**:
   * Jika ukuran mengandung `"SF"` (misal `XL SF` atau kode barang SF), dropdown baris otomatis terset ke **`Slim Fit (SF)`**.
   * Jika tidak ada `"SF"`, otomatis terset ke **`Regular Fit`**.
2. **Pengaturan Manual & Batch**:
   * Seller dapat mengganti fit pada masing-masing baris counter melalui dropdown **`MODEL FIT`**.
   * Atau menggunakan tombol **`✂️ Model Fit: [ Regular Fit / Slim Fit ]` $\rightarrow$ `Set Fit`** pada toolbar batch.
3. **Format Sinkronisasi Varian**:
   * Saat disimpan, nama varian (`size_name`) secara otomatis menambahkan akhiran ` SF` jika Slim Fit dipilih (misal `XL SF` atau `Motif A - XL SF`).

---

## 7. Aturan Khusus: Setelan, Kain, Gulungan & Kategori Lainnya

### A. Produk Setelan (STELAN / 1 Set Lengkap)
* **Identifikasi**: Kode SKU posisi ke-2 bernilai **`S`** (contoh: `WS...`) atau nama kategori memuat kata `STELAN` / `SETELAN`.
* **Karakteristik POS**: Di sistem POS gudang, setelan sering dicatat per potong (Atasan sendiri, Bawahan sendiri) dengan harga terpisah (misal @ Rp 495.000).
* **Perlakuan di Marketplace**:
  * **Harga Otomatis Terakumulasi**: Sistem secara otomatis menjumlahkan harga Atasan + Bawahan ($\text{Rp } 495.000 + \text{Rp } 495.000 = \text{Rp } 990.000$).
  * **Stok Setelan Terpadu**: Dihitung dari batas minimum pasangan lengkap yang tersedia ($\min(\text{stok atasan}, \text{stok bawahan})$).
  * **Di Halaman Detail Produk**: Menampilkan opsi ukuran sebagai **1 Set Lengkap** (`[ S (1 Set) ]`, `[ M (1 Set) ]`, `[ L (1 Set) ]`) tanpa memecah atasan/bawahan, karena setelan dipasarkan sebagai satu kesatuan busana lengkap.

---

### B. Produk Kain Potongan (Kain Batik Lembaran)
* **Identifikasi**: Kode SKU posisi ke-1 bernilai **`I`** (KAIN) atau kategori `KAIN`.
* **Perlakuan di Marketplace**:
  * **Ukuran Default**: Otomatis disetel ke `ALL SIZE` (atau panjang kain misal `2.00 Meter`).
  * **Model Fit**: Dinonaktifkan (karena kain lembaran belum dijahit menjadi pakaian).
  * **Furing**: Otomatis bernilai `Tanpa Furing`.
  * **Multi-Motif**: Jika dalam 1 kode barang terdapat beberapa lembar kain dengan motif corak berbeda di tiap counter, masing-masing counter langsung dipetakan sebagai **Motif A**, **Motif B**, dst. lengkap dengan foto kain aslinya.

---

### C. Kain Gulungan / Meteran Roll
* **Identifikasi**: Kode SKU posisi ke-1 bernilai **`G`** (GULUNGAN) atau **`C`** (METERAN).
* **Perlakuan di Marketplace**:
  * **Kuantitas Stok**: Jika diawali huruf `'G'`, stok otomatis di-set ke **`55 Meter`** (standar 1 roll gulungan kain batik).
  * **Deteksi Meteran**: Jika nama barang memuat angka meteran (misal `2.00 78122`), sistem mendeteksi kain panjang 2 Meter dan membagi harga jual sesuai divider meteran.

---

### D. Pembedaan Kategori Atasan vs Non-Atasan (Sleeve & Fit Logic)
* **Kategori Atasan** (`KEMEJA`, `HEM`, `BLOUSE`, `TUNIK`, `KOKO`, `PDH`, `JAKET`, `ATASAN`):
  * Mengaktifkan kontrol **Pilihan Lengan** (Pendek vs Panjang).
  * Mengaktifkan opsi **Model Fit** (`Regular Fit` vs `Slim Fit`).
* **Kategori Non-Atasan** (`DRESS`, `GAUN`, `GAMIS`, `ROK`, `CELANA`, `KAIN`, `SARUNG`, `JAS`, `SYAL`):
  * Sakelar lengan dan opsi Slim Fit spesifik kemeja otomatis dinonaktifkan/dikunci agar data katalog tetap presisi.

---

### E. Produk Sarimbit (Couple Pasangan)
* **Identifikasi**: Kode SKU posisi ke-1 bernilai **`R`** (SARIMBIT) atau posisi ke-2 bernilai **`M`**.
* **Perlakuan di Marketplace**:
  * Menyatukan busana Pria & Wanita dalam 1 display produk dengan opsi pasangan ukuran (contoh: Kemeja Pria L + Dress Wanita M).

---

## 8. Tampilan & Alur Pembeli di Halaman Detail Produk

Pada halaman detail produk pembeli ([`/products/[id].astro`](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/products/[id].astro)):

```
┌────────────────────────────────────────────────────────┐
│  Kemeja Sutra Tulis Bunga Abu-abu NK157Q               │
│  Rp 3.750.000                                          │
│                                                        │
│  [ Panel Spesifikasi: Kategori › Motif › Warna Utama ] │
│                                                        │
│  PILIHAN MOTIF & UKURAN                                │
│  1. Pilih Motif:                                       │
│     [ 📷 Motif A ]  [ 📷 Motif B ]                      │
│                                                        │
│  2. Pilih Ukuran:                                      │
│     [ S ]  [ M ]  [ L ]  [ XL ]                        │
│                                                        │
│  3. Model & Harga (Jika ada opsi Fit):                 │
│     [ Regular Fit - Ready ]  [ Slim Fit - Sisa 1 ]     │
│                                                        │
│  [ Chat Admin WhatsApp ]                               │
└────────────────────────────────────────────────────────┘
```

1. **Langkah 1 (Pilih Motif)**: Mengklik motif langsung mengganti foto utama katalog ke motif tersebut.
2. **Langkah 2 (Pilih Ukuran)**: Hanya menampilkan ukuran yang tersedia untuk motif yang sedang aktif.
3. **Langkah 3 (Pilih Model Fit)**: Jika motif & ukuran tersebut memiliki pilihan Regular Fit dan Slim Fit, pembeli dapat memilih model yang diinginkan.
4. **Pesan WhatsApp Real-Time**:
   > *"Halo, saya tertarik dengan produk Kemeja Sutra Tulis Bunga Abu-abu (NK157Q) variasi Motif A - XL (Slim Fit - Dengan Furing). Apakah masih tersedia?"*

---

## 9. Arsitektur Berkas & Referensi Kode

1. **Halaman Pra-Produk Baru (Tabel Counter & Batch Engine)**:
   - [`src/pages/buka-toko/tambah-produk-counter.astro`](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/tambah-produk-counter.astro)
   - [`src/pages/buka-toko/pra-produk-counter.astro`](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/pra-produk-counter.astro)

2. **Halaman Pra-Produk Lama (Skema Checkbox Statis)**:
   - [`src/pages/buka-toko/tambah-produk.astro`](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/tambah-produk.astro)
   - [`src/pages/buka-toko/pra-produk.astro`](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/pra-produk.astro)

3. **Halaman Katalog & Detail Varian Pembeli**:
   - [`src/pages/products/[id].astro`](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/products/[id].astro)
   - [`src/components/ProductCard.astro`](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/components/ProductCard.astro)

4. **Layanan Firebase Storage Direct Upload**:
   - [`src/lib/firebase.ts`](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/lib/firebase.ts)
