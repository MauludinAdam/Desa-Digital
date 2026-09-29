# Desa Digital Frontend
Aplikasi Desa Digital yang digunakan untuk mengelola administrasi desa, data kependudukan, surat-menyurat, bantuan sosial, serta operasional BUMDes.
Membangun Aplikasi Frontend ini menggunakan vue.js 3 dan terintegrasi dengan Restful api yang dikembangkan menggunakan Laravel.

# Features
## Authentication
- Login
- Logout
- Authentication menggunakan token
- Protected route
- Session user menggunakan localStorage
- Role-based menu access
- Login rate limiting handling

## User & Role Manajement
- User Manajement
- Role Manajement
- CRUD User
- Role assignment
- Permission Manajement

## Administrasi Desa
- Dashboard Desa
- Profile Desa
- Data Penduduk
- Data kartu keluarga
- Master data kependudukan
- Data surat
- Pengelolaan surat
- Approval surat oleh kepala desa

## Bantuan Sosial /Social Assistance
- Kategori bantuan sosial
- Program bantuan
- Data penerima bantuan
- Approval penerima bantuan
- Reject penerima bantuan
- Status pencairan bantuan

## BUMDes
- Profile BUMDes
- Product Manajement
- Barcode Product
- Stock Manajement
- Point Of Sales(POS)
- Sales Transaction
- Sales Item
- Stock update otomatis
- Generate Nomor Invoice
- Riwayat Transaction
- Filter Transaction
- Export Excel
- Print Laporan Transaction
- BUMDes Dashboard
- Sales Analitik

## Dashboard
- Statistik Penduduk
- Statistik Gender
- Statistik Pendidikan
- Statistik Umur
- Statistik Administrasi Desa
- Statistik Transaksi BUMDes
- Statistik Penjualan

## Tech Stack
| Technology | Usage |
|----------|--------|
| Vue.js 3  | Frontend Framework |
| Vite | Build Tool |
| Javascript | Programming Langusage |
| Axios | Http Client |
| Vue Router | Client-side-Routing |
| Bootstrap | UI Framework |
| Kaiadmin Lite | Admin Dashboard Template |
| SweetAlert2 | Alert & confirmation |
| CHart.js | Data Visualization |
| html2pdf.js | PDF Generate |
| laravel Rest Api | Backend Api |

## Requirements
Sebelum Menjalankan project, pastikan sudah tersedia:
- Node.js
- npm
- Git
-Backend Laravel Api
pastikan backend Api sudah berjalan sebelum menggunakan frontend.

## Installation
1. Clone Repository
git clone https://github.com/MauludinAdam/Desa-Digital.git
Masuk ke directory project:
cd desa-digital
2. Install Dependencies 
npm install
3. Environment Configuration
Buat file .env berdasarkan .env.example.
Contoh: 
VITE_API_URL=http://127.0.0.1:8000/api
Sesuaikan URL API dengan alamat backend laravel.

## Running Application
Jalankan development server:
nom run dev
Frontend biasanya dapat diakses melalui:
http://localhost:5173

## Backend API
Frontend menggunakan Restful Api yang dibangun menggunakan laravel.
Repository backend:
Desa-Digital-Api
Base Api URL:
http://127.0.0.1:8000/api
Authentication menggunakan token yang diberikan oleh backend setelah proses login.
Contoh request:
Authentication: Bearer {token}

## Routing
Frontend menggunkan vue Router untuk mengatur navigasi dan protected routes.
Contoh struktur halaman:
/login
/dashboard
/profile
/users
/roles
/citizens
/family-cards
/letters
/sosial-Assistance
/sosial-Assistance-applicant
/bumdes 
/bumdes
/products 
/bumdes
/sales 
/bumdes
/sales-item 
/bumdes
/transactions

Beberapa route dibatasi berdasarkan authentication dan role pengguna.

## Authentication Flow
Alur authentication pada frontend:

User
 │
 ▼
Login Page
 │
 ▼
Laravel Api
 │
 ▼
Authentication Token
 │
 ▼
localStorage
 │
 ▼
vue Router
 │
 ▼
Protected Pages

Token digunakan untuk mengakses endpoint API yang membutuhkan authentication.
saat user melakukan lakan logout, token dan data session user akan dihapus dari localStorage.

## Role Based Access
Frontend menerapkan pembatasan akses berdasarkan role pengguna.
Role yang digunakan dalam aplikasi:
- Admin
Digunakan untuk mengelola administrasi desa.
- Kepala Desa
Memilik akses untuk melihat data administrasi desa dan melakukan proses approval tertentu seperti approval surat, approval bantuan sosial, melihat dashboard, melihat bumdes melihat dashboard bumdes.
- Operator BUMDes
Digunakan untuk mengelola operasional BUMDes.

## Project Structur
Struktur folder utama frontend:

desa-dgital:
├── public/
├── src/
│    ├── assets/
│    ├── components/
│    ├── layouts/
│    ├── router/
│    ├── Services/
│    ├── utils/
│    └── views/
│         ├── auth/
│         ├── Bumdes/
│         ├── BumdesProduct/
│         ├── BumdesSales/
│         ├── BumdesSalesItem/
│         ├── BumdesUnit/
│         ├── Citizen/
│         ├── CitizenAttachment/
│         ├── Dashboard/
│         ├── Education/
│         ├── FamilyCard/
│         ├── LetterType/
│         ├── Letter/
│         ├── Occupation/
│         ├── ProfileUser/
│         ├── ProfileVillage/
│         ├── RiwayatTransaksi/
│         ├── RolePermission/
│         ├── SosialAssistance/
│         ├── SosialAssistanceRecepient/
│         ├── SosialCategory/
│         └── Users/
│
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md


## API Integration
Frontend menggunakan Axios sebagai HTTP client untuk berkomunikasi dengan RESTful API Laravel.

Axios dikonfigurasi menggunakan centralized API instance sehingga konfigurasi baseURL, header, dan authentication token dapat digunakan secara konsisten pada seluruh service.
contoh konfigurasi Api:

import axios from 'axios';

import axios from "axios";
 const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
 })

 api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
 },(error) => {
    return Promise.reject(error);
 });

 export default api

 ## Data Visualization
 Dashboard menggunakan chart.js dan vue-chartJS untuk menampilkan data dalam bentuk visual.
 contoh informasi yang divisualisasikan:
 - Data Penduduk
 - Data Pendidikan
 - Data Umur
 - Statistik Penjualan BUMDes
 - Statistik metode pembayaran

 ## Reporting
 Frontend menyediakan beberapa fitur untuk kebutuhan laporan:
 - Filtering Transaksi
 - Riwayat Transaksi
 - Export Excel melalui Api
 - Print Laporan Transaksi PDF
 - Generate PDF menggunakan html2pdf

 ## Development
Project dikembangkan menggunakan pendekatan component-based architecture dari vue.js
Beberapa konsep yang digunakan:
- Vue Components
- Composition Api
- Props
- Emits
- Lifecycle Hooks
- vue Router
- API Services
- Form Validation
- Reusable Components
- Protected Routes
- Role-base UI Access

## Application Flow
Secara umum aplikasi bekerja dengan alur:

Vue.js Frontend
      │
      │ Http Request
      ▼
Laravel REST API
      │
      ▼
Authentication & Authorization
      │
      ▼
  Database
      │
      ▼
JSON Response
      │
      ▼
Vue.js Frontend
      │
      ▼
UI / Dashboard


## Related Repository
Backend Api:
Desa-Digital-Api

Frontend:
Desa-Digital

Kedua repository merupakan bagian dari satu sistem Desa Digital.


## Author
Mauludin Adam

Frontend & Backend Development

Project: Desa Digital

## License
Project ini dibangun  untuk portofolio dan Edukasi.
