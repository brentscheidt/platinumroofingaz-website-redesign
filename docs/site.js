(() => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const previewLabel = document.querySelector("[data-preview-host]");
  const previewText = document.querySelector(".preview-ribbon__text");
  const page = body?.dataset.page || "";
  const yearTargets = document.querySelectorAll("[data-current-year]");
  const host = window.location.hostname || "";
  const analyticsEndpoint = "https://platinum.gaios.ai/api/doorknock/analytics-event";
  const sessionStorageKey = "platinum_testsite_session_v1";
  const reviewIdentityStorageKey = "platinum_testsite_review_identity_v1";
  const reviewEndpoint = "/api/review-notes";

  function previewCopy() {
    if (host === "localhost" || host === "127.0.0.1") return "Local preview";
    if (host.includes("pages.dev")) return "Pages preview";
    if (host.startsWith("testsite.")) return "Testsite preview";
    return "Preview build";
  }

  function previewMessage() {
    return "Testsite preview for PlatinumRoofingAZ.com";
  }

  if (previewLabel) previewLabel.textContent = previewCopy();
  if (previewText) previewText.textContent = previewMessage();

  yearTargets.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  if (navToggle && siteNav) {
    navToggle.setAttribute("aria-label", "Toggle site navigation");

    function closeNav() {
      navToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    }

    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      siteNav.classList.toggle("is-open", !expanded);
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!siteNav.classList.contains("is-open")) return;
      if (siteNav.contains(target) || navToggle.contains(target)) return;
      closeNav();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 880) closeNav();
    }, { passive: true });
  }

  if (page) {
    const active = document.querySelector(`[data-nav="${page}"]`);
    if (active) active.classList.add("is-current");
  }

  const preferFastUI = window.matchMedia("(max-width: 880px), (prefers-reduced-motion: reduce)").matches;

  const observer = !preferFastUI && "IntersectionObserver" in window
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

  function readReviewIdentity() {
    try {
      const raw = localStorage.getItem(reviewIdentityStorageKey);
      if (!raw) return { reviewerName: "", reviewerEmail: "" };
      const parsed = JSON.parse(raw);
      return {
        reviewerName: typeof parsed.reviewerName === "string" ? parsed.reviewerName : "",
        reviewerEmail: typeof parsed.reviewerEmail === "string" ? parsed.reviewerEmail : "",
      };
    } catch {
      return { reviewerName: "", reviewerEmail: "" };
    }
  }

  function writeReviewIdentity(next) {
    try {
      localStorage.setItem(reviewIdentityStorageKey, JSON.stringify({
        reviewerName: String(next.reviewerName || "").trim().slice(0, 120),
        reviewerEmail: String(next.reviewerEmail || "").trim().slice(0, 160),
      }));
    } catch {}
  }

  function reviewHeadings() {
    const seen = new Set();
    return Array.from(document.querySelectorAll("main h1, main h2, main h3"))
      .map((node) => node.textContent.trim())
      .filter((text) => text && !seen.has(text) && seen.add(text));
  }

  function guessCurrentSection() {
    const headings = Array.from(document.querySelectorAll("main h1, main h2, main h3"));
    if (!headings.length) return "";

    const marker = window.innerHeight * 0.35;
    let current = headings[0];

    headings.forEach((heading) => {
      const rect = heading.getBoundingClientRect();
      if (rect.top <= marker) current = heading;
    });

    return current?.textContent?.trim() || "";
  }

  function createReviewUI() {
    if (!body) return;

    const root = document.createElement("div");
    root.className = "review-widget";
    root.innerHTML = `
      <button class="review-toggle" type="button" aria-expanded="false" aria-controls="review-drawer">
        <span class="review-toggle__eyebrow">Review mode</span>
        <strong>Leave a note</strong>
      </button>
      <div class="review-backdrop" hidden></div>
      <aside class="review-drawer" id="review-drawer" aria-hidden="true">
        <div class="review-drawer__header">
          <div>
            <p class="review-drawer__eyebrow">Testsite review</p>
            <h2>Send feedback from the page you are looking at.</h2>
          </div>
          <button class="review-close" type="button" aria-label="Close review panel">Close</button>
        </div>
        <div class="review-context">
          <div>
            <span class="review-context__label">Page</span>
            <strong data-review-page-title></strong>
          </div>
          <div>
            <span class="review-context__label">Path</span>
            <span data-review-page-path></span>
          </div>
        </div>
        <form class="review-form">
          <div class="review-grid">
            <label class="review-field">
              <span>Name</span>
              <input type="text" name="reviewerName" maxlength="120" placeholder="Brent">
            </label>
            <label class="review-field">
              <span>Email</span>
              <input type="email" name="reviewerEmail" maxlength="160" placeholder="optional">
            </label>
          </div>
          <div class="review-grid">
            <label class="review-field">
              <span>Category</span>
              <select name="category">
                <option value="design">Design</option>
                <option value="content">Content</option>
                <option value="navigation">Navigation</option>
                <option value="conversion">Conversion</option>
                <option value="bug">Bug</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label class="review-field">
              <span>Priority</span>
              <select name="priority">
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
          <label class="review-field">
            <span>Section</span>
            <input type="text" name="sectionHint" maxlength="180" list="review-section-list" placeholder="Hero headline, services grid, footer, etc.">
          </label>
          <datalist id="review-section-list"></datalist>
          <label class="review-field review-field--textarea">
            <span>Note</span>
            <textarea name="note" rows="7" maxlength="4000" placeholder="What should change on this page?"></textarea>
          </label>
          <label class="review-field review-field--hidden" aria-hidden="true" tabindex="-1">
            <span>Website</span>
            <input type="text" name="honeypot" autocomplete="off" tabindex="-1">
          </label>
          <div class="review-actions">
            <div class="review-status" data-review-status>Notes attach the current page, section, viewport, and scroll position automatically.</div>
            <button class="button" type="submit">Send note</button>
          </div>
        </form>
      </aside>
    `;

    body.append(root);

    const toggle = root.querySelector(".review-toggle");
    const backdrop = root.querySelector(".review-backdrop");
    const drawer = root.querySelector(".review-drawer");
    const closeButton = root.querySelector(".review-close");
    const form = root.querySelector(".review-form");
    const status = root.querySelector("[data-review-status]");
    const pageTitleNode = root.querySelector("[data-review-page-title]");
    const pagePathNode = root.querySelector("[data-review-page-path]");
    const sectionInput = form.querySelector('[name="sectionHint"]');
    const noteInput = form.querySelector('[name="note"]');
    const nameInput = form.querySelector('[name="reviewerName"]');
    const emailInput = form.querySelector('[name="reviewerEmail"]');
    const sectionList = root.querySelector("#review-section-list");
    const previewRibbon = document.querySelector(".preview-ribbon");
    const identity = readReviewIdentity();

    nameInput.value = identity.reviewerName;
    emailInput.value = identity.reviewerEmail;

    function refreshContext() {
      const path = `${window.location.pathname}${window.location.search}`;
      const sectionGuess = guessCurrentSection();

      pageTitleNode.textContent = document.title;
      pagePathNode.textContent = path;
      sectionInput.placeholder = sectionGuess
        ? `Current section: ${sectionGuess}`
        : "Hero headline, services grid, footer, etc.";

      sectionList.innerHTML = reviewHeadings()
        .map((text) => `<option value="${text.replace(/"/g, "&quot;")}"></option>`)
        .join("");
    }

    function setOpen(next) {
      const isOpen = Boolean(next);
      toggle.setAttribute("aria-expanded", String(isOpen));
      drawer.setAttribute("aria-hidden", String(!isOpen));
      drawer.classList.toggle("is-open", isOpen);
      backdrop.hidden = !isOpen;
      backdrop.classList.toggle("is-visible", isOpen);
      body.classList.toggle("review-open", isOpen);

      if (isOpen) {
        refreshContext();
        if (!sectionInput.value) sectionInput.value = guessCurrentSection();
        if (!noteInput.value) noteInput.focus();
        sendAnalyticsEvent("review_drawer_opened", {
          page,
          path: window.location.pathname,
        });
      }
    }

    if (previewRibbon) {
      const ribbonButton = document.createElement("button");
      ribbonButton.type = "button";
      ribbonButton.className = "preview-ribbon__action";
      ribbonButton.textContent = "Leave review note";
      ribbonButton.addEventListener("click", () => setOpen(true));
      previewRibbon.append(ribbonButton);
    }

    toggle.addEventListener("click", () => setOpen(true));
    closeButton.addEventListener("click", () => setOpen(false));
    backdrop.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer.classList.contains("is-open")) {
        setOpen(false);
      }
    });

    [nameInput, emailInput].forEach((input) => {
      input.addEventListener("change", () => {
        writeReviewIdentity({
          reviewerName: nameInput.value,
          reviewerEmail: emailInput.value,
        });
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const payload = {
        pageUrl: window.location.href,
        pagePath: `${window.location.pathname}${window.location.search}`,
        pageTitle: document.title,
        sectionHint: sectionInput.value.trim() || guessCurrentSection(),
        category: form.category.value,
        priority: form.priority.value,
        note: noteInput.value.trim(),
        reviewerName: nameInput.value.trim(),
        reviewerEmail: emailInput.value.trim(),
        honeypot: form.honeypot.value,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollY: Math.round(window.scrollY),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      };

      if (payload.note.length < 8) {
        status.textContent = "Add a little more detail so the note is actionable.";
        root.dataset.reviewState = "error";
        noteInput.focus();
        return;
      }

      writeReviewIdentity({
        reviewerName: payload.reviewerName,
        reviewerEmail: payload.reviewerEmail,
      });

      root.dataset.reviewState = "sending";
      status.textContent = "Sending note...";

      try {
        const response = await fetch(reviewEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) {
          throw new Error(data.message || data.error || "Could not save note.");
        }

        root.dataset.reviewState = "success";
        status.textContent = `Saved note ${data.noteId || ""} for this page.`;
        form.reset();
        nameInput.value = payload.reviewerName;
        emailInput.value = payload.reviewerEmail;
        sectionInput.value = guessCurrentSection();
        sendAnalyticsEvent("review_note_submitted", {
          category: payload.category,
          priority: payload.priority,
          page,
        });
      } catch (error) {
        root.dataset.reviewState = "error";
        status.textContent = error.message || "Could not send note. Keep the tab open and try again.";
      }
    });
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

  createReviewUI();
})();
