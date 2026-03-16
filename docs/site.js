(() => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const previewLabel = document.querySelector("[data-preview-host]");
  const page = body?.dataset.page || "";
  const yearTargets = document.querySelectorAll("[data-current-year]");
  const analyticsEndpoint = "https://platinum.gaios.ai/api/doorknock/analytics-event";
  const sessionStorageKey = "platinum_testsite_session_v1";

  function previewCopy() {
    const host = window.location.hostname || "";
    if (host === "localhost" || host === "127.0.0.1") return "Local preview";
    if (host.includes("pages.dev")) return "Pages preview";
    if (host.startsWith("testsite.")) return "Testsite preview";
    return "Preview build";
  }

  if (previewLabel) previewLabel.textContent = previewCopy();

  yearTargets.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      siteNav.classList.toggle("is-open", !expanded);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
      });
    });
  }

  if (page) {
    const active = document.querySelector(`[data-nav="${page}"]`);
    if (active) active.classList.add("is-current");
  }

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -10% 0px" })
    : null;

  document.querySelectorAll(".reveal").forEach((node) => {
    if (observer) {
      observer.observe(node);
    } else {
      node.classList.add("is-visible");
    }
  });

  function sessionId() {
    try {
      const existing = sessionStorage.getItem(sessionStorageKey);
      if (existing) return existing;
      const next = `platinum-testsite-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(sessionStorageKey, next);
      return next;
    } catch {
      return `platinum-testsite-${Date.now()}`;
    }
  }

  function sendAnalyticsEvent(name, details = {}) {
    const host = window.location.hostname || "";
    if (host === "localhost" || host === "127.0.0.1") return;

    const payload = {
      event_name: String(name || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "_").slice(0, 80),
      event_category: "marketing_preview",
      session_id: sessionId(),
      route: `${window.location.pathname}${window.location.search}`.slice(0, 200),
      source: "testsite_platinum_redesign",
      details: {
        host,
        page,
        ...details,
      },
    };

    if (!payload.event_name) return;
    const bodyText = JSON.stringify(payload);

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([bodyText], { type: "text/plain;charset=UTF-8" });
        navigator.sendBeacon(analyticsEndpoint, blob);
        return;
      }
    } catch {}

    try {
      fetch(analyticsEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=UTF-8",
        },
        body: bodyText,
        keepalive: true,
      });
    } catch {}
  }

  sendAnalyticsEvent("page_view", { title: document.title });

  document.querySelectorAll("[data-analytics]").forEach((node) => {
    node.addEventListener("click", () => {
      sendAnalyticsEvent("cta_click", {
        target: node.getAttribute("data-analytics") || "",
        label: node.textContent.trim().slice(0, 120),
      });
    });
  });
})();
