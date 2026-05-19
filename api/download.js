const counterKey = process.env.DOWNLOAD_COUNTER_KEY || "rchat:apk:downloads";
const fallbackApkPath = "/rchat-release.apk";

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

module.exports = async function handler(_request, response) {
  const apkUrl = process.env.APK_DOWNLOAD_URL || fallbackApkPath;

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
    Location: apkUrl
  });
  response.end();
};
