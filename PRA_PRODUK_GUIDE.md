# 📖 Dokumentasi Fitur Pra-Produk & Auto-Fill Katalog Marketplace

Dokumen ini merupakan panduan arsitektur dan pedoman bisnis global untuk **Fitur Pra-Produk (Integrasi POS Gudang & Katalog Marketplace Batik)**. Fitur ini berfungsi memetakan data barang dari sistem POS secara otomatis ke form Tambah/Edit Produk marketplace berdasarkan spesifikasi API resmi: `https://noir.grace.gracianna.web.id/api/v1/tipe`.

---

## 📑 Daftar Isi
1. [Gambaran Umum & Tujuan Fitur](#1-gambaran-umum--tujuan-fitur)
2. [Spesifikasi Pemetaan Data API POS](#2-spesifikasi-pemetaan-data-api-pos)
3. [Formula & Urutan Karakter Kode SKU POS](#3-formula--urutan-karakter-kode-sku-pos)
4. [Detail Pemetaan Karakter SKU (Posisi 1 s/d Posisi 7+)](#4-detail-pemetaan-karakter-sku-posisi-1-sd-posisi-7)
   - [Posisi 1: `$tipe1` - Target Pemakai / Jenis Utama](#posisi-1-tipe1---target-pemakai--jenis-utama)
   - [Posisi 2: `$tipe2` - Kategori Pakaian](#posisi-2-tipe2---kategori-pakaian)
   - [Posisi 3: `$tipe5` - Kode Ukuran](#posisi-3-tipe5---kode-ukuran)
   - [Posisi 4: `$tipe3` - Jenis Bahan / Kain](#posisi-4-tipe3---jenis-bahan--kain)
   - [Posisi 5: `$tipe6` - Teknik Pengerjaan Batik](#posisi-5-tipe6---teknik-pengerjaan-batik)
   - [Posisi 6: `$tipe4` - Warna Utama](#posisi-6-tipe4---warna-utama)
   - [Posisi 7+: `$supplier` - Kode Supplier / Counter ID](#posisi-7-supplier---kode-supplier--counter-id)
5. [Logika Generasi Nama Produk Otomatis](#5-logika-generasi-nama-produk-otomatis)
6. [Aturan Penentuan Varian & Fitur Cerdas](#6-aturan-penentuan-varian--fitur-cerdas)
7. [Arsitektur Berkas & Referensi Kode](#7-arsitektur-berkas--referensi-kode)

---

## 1. Gambaran Umum & Tujuan Fitur

Fitur Pra-Produk adalah jembatan integrasi antara **Database POS Gudang Batik** dan **Form Input Katalog Seller/Admin Marketplace**. 

**Tujuan Utama:**
- Mengeliminasi pengisian manual nama, harga, stok, SKU, foto, dan kategori.
- Mengurangi kesalahan input data (*human error*) oleh staf input catalog.
- Memastikan penamaan dan kategorisasi produk di marketplace konsisten sesuai standar penamaan Batik.

---

## 2. Spesifikasi Pemetaan Data API POS

Setiap barang yang ditarik dari API POS (`/pra-produk`) memiliki struktur data yang dipetakan ke field form marketplace sebagai berikut:

| Field API POS | Deskripsi / Contoh | Target Field Form | Aturan & Fungsi |
| :--- | :--- | :--- | :--- |
| `item.kodeitem` | `I578`, `K102`, `G01` | `KODE BARANG (AUTO-NAME)` | Digunakan untuk **Auto-Generate Nama Produk** (misal: `Dress Katun I578`). |
| `item.kode` | `WP0TT0IMM01850480` | Klasifikasi Kode SKU | Digunakan untuk **Auto-Detect Gender, Kategori & Bahan** dari SKU POS. |
| `item.counter` | `01850480` | `KODE SKU` | Nomor unik barang untuk tracking stok & transaksi. |
| `item.nama` | `S KTN TLS NAGA MRH PTH` | `NAMA ASLI POS` | Nama mentah dari POS, digunakan untuk ekstrak warna/meteran/fit. |
| `item.hjual` | `1250000` | `HARGA (RP)` | Harga jual utama produk di toko. |
| `item.foto` / `img1` | `01850480_xxx.jpeg` | Preview & Proxy Download | Menampilkan foto bawaan POS & menyediakan tombol download. |
| `details[]` | Array Varian | Checkbox Varian & Stok | Memuat list varian ukuran, stok per ukuran, dan opsi dalaman (`F`/`TF`). |

---

## 3. Formula & Urutan Karakter Kode SKU POS

Seluruh kode SKU produk POS dibentuk dari penggabungan string (*concatenation*) dengan rumus berikut:

```php
$tipe = $tipe1 . $tipe2 . $tipe5 . $tipe3 . $tipe6 . $tipe4 . $supplier;
```

> ⚠️ **Catatan Penting Naming Variable**:
> Di sistem database POS, variabel `$tipe5` diletakkan di **Posisi Ke-3** (Ukuran), `$tipe3` diletakkan di **Posisi Ke-4** (Bahan), dan seterusnya.

### 📐 Tabel Pemetaan Posisi SKU (Contoh: `WP0TT0IMM01850480`)

| Urutan Posisi | Kode Variabel | Fungsi / Arti | Karakter Contoh | Hasil Arti |
| :---: | :---: | :--- | :---: | :--- |
| **Posisi 1** | `$tipe1` | Target Pemakai / Jenis Utama | **`W`** | **WANITA** |
| **Posisi 2** | `$tipe2` | Kategori Pakaian | **`P`** | **DRESS** |
| **Posisi 3** | `$tipe5` | Kode Ukuran | **`0`** | **ALL SIZE (00)** |
| **Posisi 4** | `$tipe3` | Jenis Bahan / Kain | **`T`** | **KATUN** |
| **Posisi 5** | `$tipe6` | Teknik Pengerjaan Batik | **`T`** | **TULIS** |
| **Posisi 6** | `$tipe4` | Warna Utama | **`0`** | **BLANK** |
| **Posisi 7+** | `$supplier` | Kode Supplier + No. Counter | **`IMM01850480`** | **Kode Counter Unik** |

---

## 4. Detail Pemetaan Karakter SKU (Posisi 1 s/d Posisi 7+)

*(Berdasarkan data API resmi: `https://noir.grace.gracianna.web.id/api/v1/tipe`)*

### Posisi 1: `$tipe1` - Target Pemakai / Jenis Utama
*(Diambil dari `item.kode.charAt(0)`)*

| Kode SKU | Keterangan API POS | Kategori / Target |
| :---: | :--- | :--- |
| **W** | **WANITA** | Busana & Aksesoris Wanita |
| **M** | **MAN** | Busana & Aksesoris Pria |
| **L** | **LADYS** | Busana Wanita Special |
| **A** | **ASESORIS** | Aksesoris |
| **T** | **TAS** | Tas Batik / Kulit |
| **J** | **JAM** | Jam Tangan / Aksesoris |
| **K** | **KOSMETIK** | Produk Kecantikan / Perawatan |
| **S** | **SEPATU** | Alas Kaki Sepatu |
| **D** | **SANDAL** | Alas Kaki Sandal |
| **E** | **DOMPET** | Aksesoris Dompet |
| **Y** | **YUAN-YUAN** | Koleksi Spesial Yuan-Yuan |
| **X** | **KONSI** | Produk Konsinyasi |
| **I** | **KAIN** | Kain Batik Potongan |
| **R** | **SARIMBIT** | Pasangan / Couple |
| **G** | **GULUNGAN** | Kain Meteran Roll / Gulungan |
| **C** | **METERAN** | Kain Potongan Meteran |
| **P** | **KPJ** | Pakaian KPJ |
| **B** | **BLANK** | Tidak Didefinisikan |

---

### Posisi 2: `$tipe2` - Kategori Pakaian
*(Diambil dari `item.kode.charAt(1)`)*

| Kode SKU | Keterangan API POS | Kategori Marketplace | Keterangan Tipe |
| :---: | :--- | :--- | :--- |
| **P** | **DRESS** | **DRESS** | Terusan Wanita |
| **G** | **GAUN** | **GAUN** | Gaun / Dress Pesta |
| **X** | **GAMIS** | **GAMIS** | Busana Muslim Panjang |
| **V** | **KEBAYA** | **KEBAYA** | Kebaya Wanita |
| **R** | **ROK** | **ROK** | Bawahan Rok |
| **C** | **CELANA** | **CELANA** | Bawahan Celana |
| **S** | **STELAN** | **STELAN** | Setelan Atasan + Bawahan |
| **K** | **KEMEJA** | **KEMEJA** | Atasan Pria/Unisex |
| **B** | **BLUES** | **BLUES** | Blouse Atasan Wanita |
| **N** | **TANK TOP** | **TANK TOP** | Tanktop / Inner |
| **T** | **T - SHIRT** | **T - SHIRT** | Kaos Batik |
| **J** | **JAKET** | **JAKET** | Outer / Jaket |
| **A** | **JAS** | **JAS** | Jas / Blazer |
| **M** | **SARIMBIT** / **KEMBEN** | **SARIMBIT** | Pasangan / Kemben |
| **F** | **SARUNG** | **SARUNG** | Sarung Batik |
| **O** | **OUTER** | **OUTER** | Cardigan / Outerwear |
| **U** | **JUMPSUIT** | **JUMPSUIT** | Jumpsuit |
| **L** | **SYAL** | **SYAL** | Aksesoris Syal / Scarf |
| **I** | **TOPI** | **TOPI** | Aksesoris Topi |
| **D** | **SABUK** | **SABUK** | Ikat Pinggang |
| **E** | **LEGGING** | **LEGGING** | Celana Legging |
| **H** | **SELENDANG** | **SELENDANG** | Aksesoris Selendang |
| **Q** | **KLG/ANTG** | **AKSESORIS** | Kalung / Anting |
| **W** | **BROS** | **AKSESORIS** | Aksesoris Bros |
| **0** | **BLANK** | **LAINNYA** | Belum Didefinisikan |

---

### Posisi 3: `$tipe5` - Kode Ukuran
*(Diambil dari `item.kode.charAt(2)`)*

| Kode SKU | Ukuran |
| :---: | :--- |
| **0** | 00 (ALL SIZE) |
| **S** | S |
| **M** | M |
| **L** | L |
| **X** | XL |
| **Y** | XXL |
| **2** | 2L |
| **3** | 3L |
| **4** | 4L |
| **5** | 5L |
| **6** | 6L |
| **7** | 7L |

---

### Posisi 4: `$tipe3` - Jenis Bahan / Kain
*(Diambil dari `item.kode.charAt(3)`)*

| Kode SKU | Jenis Bahan |
| :---: | :--- |
| **T** | **KATUN** |
| **G** | **SUTRA** |
| **D** | **DOBY** |
| **J** | **JEANS** |
| **K** | **KAOS** |
| **E / H** | **PARIS** |
| **M** | **TENUN** |
| **P** | **PARASIT** |
| **N** | **NILON** |
| **B** | **BENANG** |
| **L** | **KALDORE** |
| **A** | **BROKLAT** |
| **F** | **SIFONE** |
| **S** | **SATEN** |
| **V** | **VISCOS** |
| **W** | **SILKY** |
| **X** | **KREP** |
| **U** | **KULIT** |
| **R** | **BLUDRU** |
| **C** | **JERUK** |
| **I** | **BABY** |
| **0** | **BLANK** |

---

### Posisi 5: `$tipe6` - Teknik Pengerjaan Batik
*(Diambil dari `item.kode.charAt(4)`)*

| Kode SKU | Teknik Pengerjaan | Keterangan |
| :---: | :--- | :--- |
| **T** | **TULIS** | Batik Tulis Asli |
| **C** | **CAP** | Batik Cap |
| **P** | **PRINT** | Batik Print |
| **R** | **PERADA** | Batik Perada |
| **S** | **TULISP** | Batik Tulis Kombinasi |
| **Q** | **PERADAP** | Batik Perada Print |
| **0** | **BLANK** | Tidak Spesifik |

---

### Posisi 6: `$tipe4` - Warna Utama
*(Diambil dari `item.kode.charAt(5)`)*

| Kode SKU | Warna |
| :---: | :--- |
| **B** | BIRU |
| **K** | KUNING |
| **H** | HITAM |
| **I** | HIJAU |
| **A** | ABU-ABU |
| **C** | COKLAT |
| **J** | JINGGA |
| **M** | MERAH |
| **N** | PINK |
| **O** | ORANGE |
| **P** | PUTIH |
| **S** | SILVER |
| **U** | UNGU |
| **R** | KREM |
| **W** | WARNAWARNI |
| **0** | BLANK |

---

### Posisi 7+: `$supplier` - Kode Supplier / Counter ID
*(Diambil dari `item.kode.substring(6)`)*

- Merupakan gabungan **Kode Supplier** + **Nomor Counter Unik** (misal `IMM01850480`).

---

## 5. Logika Generasi Nama Produk Otomatis

Nama produk di-generate secara real-time pada input `NAMA PRODUK` saat kategori, bahan, atau kode barang diubah:

$$\text{Nama Produk} = \text{Nama Kategori} + \text{" "} + \text{Nama Bahan/Batik} + \text{" "} + \text{Kode Barang (item.kodeitem)}$$

**Contoh Pembacaan Real SKU (`WP0TT0IMM01850480`):**
- **Posisi 1 (`$tipe1` = `W`)** $\rightarrow$ `WANITA`
- **Posisi 2 (`$tipe2` = `P`)** $\rightarrow$ `DRESS`
- **Posisi 3 (`$tipe5` = `0`)** $\rightarrow$ `ALL SIZE (00)`
- **Posisi 4 (`$tipe3` = `T`)** $\rightarrow$ `KATUN`
- **Posisi 5 (`$tipe6` = `T`)** $\rightarrow$ `TULIS`
- **Posisi 6 (`$tipe4` = `0`)** $\rightarrow$ `BLANK`
- **Posisi 7+ (`$supplier`)** $\rightarrow$ `IMM01850480`
- Kode Barang (`item.kodeitem`): `I578`

$$\text{Hasil Auto-Name:} \quad \mathbf{\text{Dress Katun I578}}$$

---

## 6. Aturan Penentuan Varian & Fitur Cerdas

### A. Aturan Fitur Pilihan Lengan (Sleeve Split)
Sistem memiliki kontrol cerdas untuk mengaktifkan/mematikan pilihan lengan (Pendek vs Panjang):

- **OTOMATIS AKTIF (ON)**: 
  Hanya untuk kategori atasan (`KEMEJA`, `HEM`, `ATASAN`, `BLOUSE`, `TUNIK`, `KOKO`, `PDH`, `JAKET`).
- **DIKUNCI MATI (OFF)**: 
  Sakelar lengan otomatis tersembunyi & dimatikan untuk kategori Non-Atasan (**DRESS**, **GAUN**, **GAMIS**, **ROK**, **CELANA**, **KAIN**, **SARUNG**, **JAS**, **SYAL**).

### B. Aturan Fit (Regular Fit vs Slim Fit / SF)
Form menyediakan 2 opsi fit untuk setiap ukuran dasar:
1. `Regular Fit` (Tanpa imbuhan "SF")
2. `Slim Fit` (Dengan imbuhan " SF")

**Pencocokan Presisi (Exact Fit Matching):**
- Jika nama/detail item **TIDAK mengandung kata "SF"**, maka **HANYA** varian **Regular Fit** (`All Size`, `M`, `L`, dst.) yang dicentang.
- Varian Slim Fit (`All Size SF`, `M SF`, dst.) **TIDAK AKAN** tercentang kecuali jika nama/detail item di POS memang secara eksplisit mengandung kata `"SF"`.
- Mencegah duplikasi imbuhan `SF` ganda (`SF SF`, `SF SF SF`).

### C. Mode Setelan Cerdas (Pair Split Atasan & Bawahan)
Jika produk terdeteksi sebagai kategori **STELAN** (dari kode SKU posisi ke-2 `S` atau nama kategori `STELAN`/`SETELAN`):
- Sistem memecah 1 pasang data detail dari POS menjadi 2 baris terpisah (**Atasan** & **Bawahan**).
- Disediakan tombol **"Tukar Atasan/Bawahan"** (*Swap Engine*) jika urutan dari POS terbalik.
- **Perhitungan Harga Setelan**: Harga utama produk setelan otomatis dihitung dari **penjumlahan 2 item/detail produk yang memiliki harga tertinggi** (*sum of 2 highest prices*), bukan hanya harga baris pertama atau harga satuan POS.

### D. Mode Multi-Warna (Color Split Engine)
Jika dalam 1 item POS memiliki beberapa detail dengan nama warna berbeda (misal `HITAM`, `MERAH`):
- Sistem otomatis beralih ke **Mode Varian Warna**.
- Membuat daftar varian dinamis berformat `[NAMA WARNA] - [UKURAN]` (misal: `HITAM - ALL SIZE`).

### E. Mode Kain & Gulungan Meteran
- Jika SKU diawali huruf `'G'` (Gulungan Kain), stok otomatis di-set ke `55` meter.
- Jika nama produk mengandung angka desimal meter (misal `2.00 78122`), sistem mendeteksi kain ukuran 2 Meter dan membagi harga jual sesuai divider meteran.

---

## 7. Arsitektur Berkas & Referensi Kode

Semua logika di atas diimplementasikan pada berkas berikut di repositori:

1. **[src/pages/buka-toko/tambah-produk.astro](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/tambah-produk.astro)**
   - Line 2248-2280: Kontrol Visibilitas Sleeve Toggle (`sleeveKeywords`)
   - Line 3345-3450: Integrasi Auto-Fill Pra-Produk & Parsing SKU POS (`$tipe1` s/d `$supplier`)
   - Line 3560-3915: Mode Setelan Cerdas (Setelan Pair Split)
   - Line 3940-4153: Mode Multi-Warna (Color Split Engine)
   - Line 4154-4270: Logika Auto-Fill Checkbox Varian Statis & Dynamic Matcher

2. **[src/pages/buka-toko/edit/[id].astro](file:///Users/ajisampurno/Project/Batik/java-batik-marketplace/src/pages/buka-toko/edit/[id].astro)**
   - Line 486-503: Visibilitas Sleeve Toggle Mode Edit
   - Line 508-640: Sanitasi & Render Varian Produk Eksisting

---
*Dokumen ini disusun berdasarkan Formula SKU: `$tipe = $tipe1 . $tipe2 . $tipe5 . $tipe3 . $tipe6 . $tipe4 . $supplier;` dan API Resmi: `https://noir.grace.gracianna.web.id/api/v1/tipe`.*
