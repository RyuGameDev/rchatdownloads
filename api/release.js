function releaseInfo() {
  return {
    apkSize: process.env.APK_SIZE_LABEL || "Android APK",
    version: process.env.APP_VERSION || "1.0.0"
  };
}

module.exports = async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
  response.status(200).json(releaseInfo());
};
