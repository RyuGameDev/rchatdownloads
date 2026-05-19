# RChat Download Page

Mini download page yang siap deploy ke Vercel. Halaman ini punya tombol download APK dan counter total download.

## Deploy ke Vercel

1. Import folder `download-page` sebagai project Vercel.
2. Isi environment variable:

```env
APK_DOWNLOAD_URL=https://domain-kamu.com/rchat-release.apk
DOWNLOAD_COUNTER_KEY=rchat:apk:downloads
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

`APK_DOWNLOAD_URL` bisa dari Cloudflare R2, VPS, GitHub Release, atau CDN lain. APK ukuran besar lebih aman ditaruh di storage/CDN, bukan di Vercel.

`KV_REST_API_URL` dan `KV_REST_API_TOKEN` bisa dari Vercel KV atau Upstash Redis REST. Kalau belum diisi, page tetap jalan, tapi total download tidak permanen.

## Local Preview

```bash
npx vercel dev
```

Atau buka `index.html` langsung untuk cek desain statis. API counter hanya jalan lewat Vercel dev/deploy.
