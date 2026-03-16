const ALLOWED_CATEGORIES = new Set(["design", "content", "navigation", "conversion", "bug", "other"]);
const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/review-notes")) {
      return handleReviewNotes(request, env, url);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleReviewNotes(request, env, url) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  if (request.method === "GET") {
    return jsonResponse(
      {
        ok: true,
        service: "platinum-testsite-review-notes",
        status: "ready",
        host: url.host,
        path: url.pathname,
      },
      { status: 200, request },
    );
  }

  if (request.method !== "POST") {
    return jsonResponse(
      { ok: false, error: "method_not_allowed" },
      { status: 405, request },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      { ok: false, error: "invalid_json" },
      { status: 400, request },
    );
  }

  const honeypot = textValue(payload.honeypot, 120);
  if (honeypot) {
    return jsonResponse({ ok: true, ignored: true }, { status: 202, request });
  }

  const pageUrl = normalizeUrl(payload.pageUrl);
  const pagePath = textValue(payload.pagePath, 260) || safePathFromUrl(pageUrl);
  const pageTitle = textValue(payload.pageTitle, 180);
  const sectionHint = textValue(payload.sectionHint, 180);
  const category = normalizeEnum(payload.category, ALLOWED_CATEGORIES, "other");
  const priority = normalizeEnum(payload.priority, ALLOWED_PRIORITIES, "medium");
  const note = textValue(payload.note, 4000);
  const reviewerName = textValue(payload.reviewerName, 120);
  const reviewerEmail = normalizeEmail(payload.reviewerEmail);
  const scrollY = normalizeInteger(payload.scrollY, 0, 1000000);
  const viewportWidth = normalizeInteger(payload.viewportWidth, 0, 10000);
  const viewportHeight = normalizeInteger(payload.viewportHeight, 0, 10000);
  const userAgent = textValue(payload.userAgent || request.headers.get("User-Agent"), 500);
  const referrer = normalizeUrl(payload.referrer);
  const submissionHost = textValue(url.host, 120);

  if (!pageUrl || !pagePath || !pageTitle || note.length < 8) {
    return jsonResponse(
      {
        ok: false,
        error: "missing_required_fields",
        message: "Page context and a note with at least 8 characters are required.",
      },
      { status: 400, request },
    );
  }

  const recordId = crypto.randomUUID();
  const shortId = recordId.split("-")[0].toUpperCase();
  const createdAt = new Date().toISOString();

  await env.REVIEW_DB.prepare(
    `INSERT INTO review_notes (
      id,
      created_at,
      page_url,
      page_path,
      page_title,
      section_hint,
      category,
      priority,
      note,
      reviewer_name,
      reviewer_email,
      scroll_y,
      viewport_width,
      viewport_height,
      user_agent,
      referrer,
      submission_host,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      recordId,
      createdAt,
      pageUrl,
      pagePath,
      pageTitle,
      sectionHint,
      category,
      priority,
      note,
      reviewerName,
      reviewerEmail,
      scrollY,
      viewportWidth,
      viewportHeight,
      userAgent,
      referrer,
      submissionHost,
      "new",
    )
    .run();

  return jsonResponse(
    {
      ok: true,
      noteId: shortId,
      createdAt,
    },
    { status: 201, request },
  );
}

function jsonResponse(data, options = {}) {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "x-robots-tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
  });

  const cors = corsHeaders(options.request);
  Object.entries(cors).forEach(([key, value]) => headers.set(key, value));

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => headers.set(key, value));
  }

  return new Response(JSON.stringify(data), {
    status: options.status || 200,
    headers,
  });
}

function corsHeaders(request) {
  const origin = request?.headers?.get("Origin") || "*";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "Content-Type",
  };
}

function textValue(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function normalizeEnum(value, allowed, fallback) {
  const normalized = textValue(value, 40).toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeInteger(value, min, max) {
  const next = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(next)) return 0;
  return Math.min(max, Math.max(min, next));
}

function normalizeUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    return url.toString().slice(0, 500);
  } catch {
    return "";
  }
}

function safePathFromUrl(value) {
  try {
    const url = new URL(value);
    return `${url.pathname}${url.search}`.slice(0, 260);
  } catch {
    return "";
  }
}

function normalizeEmail(value) {
  const email = textValue(value, 160).toLowerCase();
  if (!email) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}
