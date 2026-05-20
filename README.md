# RChat APK Download Page

Production-ready download page untuk APK RChat, dibuat untuk Vercel.

Fitur:

- Landing page responsive untuk download APK.
- Wrapper invite grup: `https://rchat.ryudev.site/join-group/<token>` mencoba membuka aplikasi via `rchat://join-group/<token>`, lalu fallback ke download APK.
- Counter total download yang persistent dengan Vercel KV atau Upstash Redis REST.
- API download yang aman: tidak redirect kalau `APK_DOWNLOAD_URL` belum dikonfigurasi.
- Metadata versi dan ukuran APK dari environment variable.
- Siap dipakai dengan APK yang disimpan di CDN/storage seperti Cloudflare R2, GitHub Release, atau VPS.

## Environment Variables

Buat file `.env.local` untuk local preview, lalu isi env yang sama di Vercel Project Settings.

```env
APK_DOWNLOAD_URL=https://cdn.example.com/rchat/rchat-release.apk
APP_VERSION=1.0.0
APK_SIZE_LABEL=109 MB
DOWNLOAD_COUNTER_KEY=rchat:apk:downloads
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

`APK_DOWNLOAD_URL` wajib di production. Gunakan URL publik HTTPS dari storage/CDN. Jangan taruh APK besar langsung di Vercel kecuali ukuran dan bandwidth masih aman.

`KV_REST_API_URL` dan `KV_REST_API_TOKEN` dipakai untuk menyimpan total download. Buat lewat Vercel Storage KV atau Upstash Redis, lalu copy REST URL dan REST token ke env Vercel.

## Deploy ke Vercel

1. Push folder `download-page` ke repository.
2. Buat project baru di Vercel.
3. Set **Root Directory** ke `download-page`.
4. Isi environment variables di **Settings > Environment Variables**.
5. Deploy.

Build command bisa dikosongkan. Output directory juga bisa dikosongkan karena ini static files + serverless functions.

## API

`GET /api/download`

Menambah counter download, lalu redirect ke `APK_DOWNLOAD_URL`.

`GET /api/stats`

Mengembalikan total download:

```json
{
  "configured": true,
  "total": 120
}
```

`GET /api/release`

Mengembalikan metadata APK:

```json
{
  "version": "1.0.0",
  "apkSize": "109 MB"
}
```

## Local Check

```bash
npm run check
npx vercel dev
```

Untuk local preview dengan env:

```bash
copy .env.example .env.local
npx vercel dev
```
