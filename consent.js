"use strict";

const CONSENT_KEY = "analyticsConsent";

function getAnalyticsConsent() {
    return localStorage.getItem(CONSENT_KEY);
}

function hasFullConsent() {
    return getAnalyticsConsent() === "all";
}

function hideConsentOverlay() {
    const overlay = document.getElementById("consent-overlay");
    if (!overlay) return;
    overlay.hidden = true;
    overlay.classList.remove("is-open");
    overlay.style.display = "none";
    overlay.setAttribute("aria-hidden", "true");
}

function showConsentOverlay() {
    const overlay = document.getElementById("consent-overlay");
    if (!overlay) return;
    overlay.hidden = false;
    overlay.classList.add("is-open");
    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
}

function startAnalyticsIfAllowed() {
    if (!hasFullConsent()) return;
    if (typeof window.startAnalytics === "function") {
        window.startAnalytics();
        return;
    }
    window.__pendingAnalyticsStart = true;
}

function currentLang() {
    const saved = localStorage.getItem("lang");
    if (saved === "cs" || saved === "en") return saved;
    return document.documentElement.lang?.startsWith("cs") ? "cs" : "en";
}

function youtubePlaceholderLabel() {
    return currentLang() === "cs"
        ? "Pro přehrání videa přijmi cookies (YouTube)."
        : "Accept cookies to play this YouTube video.";
}

function youtubeLoadButtonLabel() {
    return currentLang() === "cs" ? "Načíst video" : "Load video";
}

function renderYouTubePlaceholder(wrap) {
    wrap.innerHTML = "";
    const box = document.createElement("div");
    box.className = "youtube-consent-placeholder";

    const text = document.createElement("p");
    text.textContent = youtubePlaceholderLabel();

    const button = document.createElement("button");
    button.type = "button";
    button.className = "youtube-consent-btn";
    button.textContent = youtubeLoadButtonLabel();
    button.addEventListener("click", () => {
        acceptAllConsent();
    });

    box.appendChild(text);
    box.appendChild(button);
    wrap.appendChild(box);
}

function loadYouTubeEmbed(wrap) {
    const src = wrap.dataset.youtubeSrc;
    if (!src) return;

    wrap.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = wrap.dataset.youtubeTitle || "YouTube video";
    iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.loading = "lazy";
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);
}

function syncYouTubeEmbeds() {
    document.querySelectorAll("[data-youtube-src]").forEach((wrap) => {
        if (hasFullConsent()) {
            if (!wrap.querySelector("iframe")) loadYouTubeEmbed(wrap);
        } else {
            renderYouTubePlaceholder(wrap);
        }
    });
}

function applyConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
    hideConsentOverlay();

    if (value === "all") {
        startAnalyticsIfAllowed();
        syncYouTubeEmbeds();
        return;
    }

    syncYouTubeEmbeds();
}

function acceptAllConsent() {
    applyConsent("all");
}

function acceptEssentialConsent() {
    applyConsent("essential");
}

function openConsentSettings() {
    showConsentOverlay();
}

window.acceptAll = acceptAllConsent;
window.acceptEssential = acceptEssentialConsent;
window.openConsentSettings = openConsentSettings;
window.syncYouTubeEmbedsFromLang = () => {
    if (!hasFullConsent()) syncYouTubeEmbeds();
};

document.addEventListener("DOMContentLoaded", () => {
    document
        .querySelectorAll("[data-consent-accept='all']")
        .forEach((btn) => btn.addEventListener("click", acceptAllConsent));
    document
        .querySelectorAll("[data-consent-accept='essential']")
        .forEach((btn) => btn.addEventListener("click", acceptEssentialConsent));
    document
        .querySelectorAll("[data-consent-open]")
        .forEach((btn) => btn.addEventListener("click", openConsentSettings));

    const existing = getAnalyticsConsent();
    if (existing === "all" || existing === "essential") {
        hideConsentOverlay();
        if (existing === "all") startAnalyticsIfAllowed();
    } else {
        showConsentOverlay();
    }
    syncYouTubeEmbeds();
});

window.addEventListener("storage", (event) => {
    if (event.key === CONSENT_KEY) syncYouTubeEmbeds();
});
