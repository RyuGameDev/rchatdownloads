const statusEl = document.querySelector("#joinStatus");
const openButton = document.querySelector("#openAppButton");
const downloadButton = document.querySelector("#joinDownloadButton");

function inviteTokenFromPath() {
  const queryToken = new URLSearchParams(window.location.search).get("token");

  if (queryToken) {
    try {
      return decodeURIComponent(queryToken);
    } catch {
      return queryToken;
    }
  }

  const match = window.location.pathname.match(/\/join-group\/([^/?#\s]+)/i);

  if (!match?.[1]) {
    return null;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

const inviteToken = inviteTokenFromPath();
const appUrl = inviteToken ? `rchat://join-group/${encodeURIComponent(inviteToken)}` : null;

function setStatus(message) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function openRChat() {
  if (!appUrl) {
    setStatus("Link undangan tidak valid.");
    return;
  }

  setStatus("Membuka RChat...");
  window.location.href = appUrl;

  window.setTimeout(() => {
    if (!document.hidden) {
      setStatus("Aplikasi belum terbuka. Tekan tombol buka lagi atau download APK RChat.");
    }
  }, 1400);
}

openButton?.addEventListener("click", openRChat);
downloadButton?.addEventListener("click", () => {
  downloadButton.textContent = "Menyiapkan download...";
});

window.setTimeout(openRChat, 450);
