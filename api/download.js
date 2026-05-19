const counterKey = process.env.DOWNLOAD_COUNTER_KEY || "rchat:apk:downloads";
const allowedProtocols = new Set(["http:", "https:"]);

function configuredApkUrl() {
  const value = process.env.APK_DOWNLOAD_URL?.trim();

  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return allowedProtocols.has(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

async function incrementDownloadCount() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/incr/${encodeURIComponent(counterKey)}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`KV incr failed with ${response.status}`);
  }

  const data = await response.json();
  return data?.result ?? null;
}

module.exports = async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apkUrl = configuredApkUrl();

  if (!apkUrl) {
    response.setHeader("Cache-Control", "no-store");
    response.status(503).json({
      error: "APK download URL belum dikonfigurasi"
    });
    return;
  }

  try {
    const total = await incrementDownloadCount();

    if (total !== null && total !== undefined) {
      response.setHeader("X-RChat-Download-Count", String(total));
    }
  } catch (error) {
    console.warn("Download counter failed", error);
  }

  response.writeHead(302, {
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    Location: apkUrl
  });
  response.end();
};
