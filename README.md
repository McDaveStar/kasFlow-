KasFlow - Platform Akuntabilitas Keuangan Berbasis Blockchain 
"Transparency is not a Policy, it's a Code."

KasFlow adalah prototipe sistem manajemen keuangan instansi yang menggabungkan kecepatan Cloud Database dengan keamanan mutlak Blockchain untuk mencegah manipulasi data. Sistem ini memastikan setiap transaksi memiliki "sidik jari digital" yang tidak dapat diubah secara sepihak.

Tautan Penting
Live Demo (Netlify): https://kasflowapp.netlify.app/

Repositori Kode: https://github.com/McDaveStar/kasFlow

Arsitektur Sistem (3-Layer Architecture)
KasFlow dibangun menggunakan arsitektur tiga lapis yang saling terintegrasi:

Frontend Layer: Antarmuka web responsif menggunakan Tailwind CSS untuk pengalaman pengguna yang optimal.

Supporting Layer (Supabase): Mengelola autentikasi pengguna, metadata instansi, dan penyimpanan data transaksi secara real-time.

Blockchain Layer (Node.js & Sepolia): Bertindak sebagai bridge untuk melakukan hashing kriptografis dan pencatatan permanen pada jaringan Ethereum Sepolia Testnet.

Kredensial Akses Pengujian (Reviewer)
Untuk memudahkan pengujian fungsionalitas penuh tanpa perlu registrasi manual, dewan juri dapat menggunakan akun berikut:

Email: juri@kasflow.id

Password: pkmkc2025

Role: Administrator (Akses Penuh Verifikasi Blockchain)

Panduan Alur Pengujian (End-to-End Flow)
Dewan juri disarankan mengikuti urutan langkah berikut untuk memvalidasi fungsionalitas sistem:

1. Autentikasi & Personalisasi
Masuk menggunakan kredensial di atas melalui modal Akses Dashboard.

Sistem akan menampilkan nama "Juri PKM-KC 2025" dan nama instansi secara personal di dashboard.

2. Aktivasi Fitur SaaS (Sandbox Payment)
Fitur verifikasi blockchain adalah fitur Enterprise.

Gulir ke bagian Pricing, klik "Pilih Pro" pada paket Instansi.

Lakukan Simulasi Pembayaran untuk mengaktifkan akses penulisan data ke Blockchain Layer.

3. Pencatatan & Verifikasi Blockchain (Fitur Utama)
Klik tombol "Tambah Transaksi" di Dashboard.

Isi data transaksi (misal: "Hibah Penelitian PKM").

Setelah disimpan, sistem akan menjalankan dua tahap:

Tahap 1: Pencatatan metadata ke Supporting Layer.

Tahap 2: Penguncian data secara permanen ke Sepolia Testnet melalui Node.js Bridge.

Perhatikan status transaksi akan berubah menjadi hijau: "verified on-chain".

4. Audit Publik (Transparansi)
Salin (copy) Transaction Hash yang muncul di tabel dashboard.

Verifikasi keberadaan data tersebut secara independen melalui penjelajah blok eksternal di Sepolia Etherscan.

5. Sesi Selesai
Gunakan fitur Logout untuk mengakhiri sesi pengujian dan mengamankan akses akun.

Instalasi Lokal (Untuk Pengembangan)
Jika ingin menjalankan backend secara lokal, pastikan folder node_modules telah diinstal:

Bash

cd Backend
npm install
node server.js
Catatan: File .env yang berisi private key tidak disertakan dalam repositori ini demi alasan keamanan.

KasFlow Team - PKM-KC 2025
