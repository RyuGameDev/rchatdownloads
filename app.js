const formatter = new Intl.NumberFormat("id-ID");
const countEl = document.querySelector("#downloadCount");
const noteEl = document.querySelector("#counterNote");
const downloadButton = document.querySelector("#downloadButton");
const versionLabel = document.querySelector("#versionLabel");
const sizeLabel = document.querySelector("#sizeLabel");

async function refreshStats() {
  try {
    const response = await fetch("/api/stats", {
      cache: "no-store"
    });
    const stats = await response.json();
    const total = Number.isFinite(Number(stats.total)) ? Number(stats.total) : 0;

    countEl.textContent = formatter.format(total);
    noteEl.textContent = stats.configured
      ? "Statistik dihitung dari klik tombol download."
      : "Counter belum aktif. Isi Vercel KV env untuk menyimpan total download.";
  } catch {
    noteEl.textContent = "Statistik download belum bisa dimuat.";
  }
}

async function refreshReleaseInfo() {
  try {
    const response = await fetch("/api/release", {
      cache: "force-cache"
    });
    const release = await response.json();

    if (release.version && versionLabel) {
      versionLabel.textContent = `Versi ${release.version}`;
    }

    if (release.apkSize && sizeLabel) {
      sizeLabel.textContent = release.apkSize;
    }
  } catch {
    // Release metadata is non-critical.
  }
}

downloadButton?.addEventListener("click", () => {
  const current = Number((countEl.textContent || "0").replace(/\D/g, ""));

  if (Number.isFinite(current)) {
    countEl.textContent = formatter.format(current + 1);
  }
});

refreshStats();
refreshReleaseInfo();
