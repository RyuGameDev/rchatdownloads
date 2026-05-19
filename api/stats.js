const counterKey = process.env.DOWNLOAD_COUNTER_KEY || "rchat:apk:downloads";

async function kvCommand(command, key) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/${command}/${encodeURIComponent(key)}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`KV ${command} failed with ${response.status}`);
  }

  const data = await response.json();
  return data?.result ?? null;
}

module.exports = async function handler(_request, response) {
  try {
    const result = await kvCommand("get", counterKey);
    const total = Number.parseInt(String(result ?? "0"), 10);

    response.setHeader("Cache-Control", "no-store");
    response.status(200).json({
      configured: !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN,
      total: Number.isFinite(total) ? total : 0
    });
  } catch (error) {
    response.setHeader("Cache-Control", "no-store");
    response.status(200).json({
      configured: true,
      error: error instanceof Error ? error.message : "Counter unavailable",
      total: 0
    });
  }
};
