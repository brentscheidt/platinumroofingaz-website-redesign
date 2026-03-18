const ALLOWED_CATEGORIES = new Set(["design", "content", "navigation", "conversion", "bug", "other"]);
const ALLOWED_PRIORITIES = new Set(["low", "medium", "high"]);
const ALLOWED_ROUTE_STATUSES = new Set(["claimed", "queued", "dispatch_failed", "resolved"]);
const REVIEW_ROUTE_PATTERN = /^\/api\/review-notes\/([a-z0-9-]+)\/(claim|route)$/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/review-notes/pending") {
      return handlePendingReviewNotes(request, env);
    }

    const routeMatch = url.pathname.match(REVIEW_ROUTE_PATTERN);
    if (routeMatch) {
      return handleReviewRoute(request, env, routeMatch[1], routeMatch[2]);
    }

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
  const screenSummary = textValue(payload.screenSummary, 320);
  const screenContextJson = normalizeJsonText(payload.screenContext, 12000);
  const clientSubmittedAt = textValue(payload.clientSubmittedAt, 60);
  const clientTimezone = textValue(payload.clientTimezone, 80);
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
      screen_summary,
      screen_context_json,
      client_submitted_at,
      client_timezone,
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
      status,
      claimed_at,
      dispatched_at,
      dispatched_to,
      dispatch_error
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      recordId,
      createdAt,
      pageUrl,
      pagePath,
      pageTitle,
      sectionHint,
      screenSummary,
      screenContextJson,
      clientSubmittedAt,
      clientTimezone,
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
      null,
      null,
      null,
      null,
    )
    .run();

  return jsonResponse(
    {
      ok: true,
      noteId: shortId,
      createdAt,
      queuedForAi: true,
    },
    { status: 201, request },
  );
}

async function handlePendingReviewNotes(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  const authError = requireAdminToken(request, env);
  if (authError) return authError;

  if (request.method !== "GET") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, { status: 405, request });
  }

  const url = new URL(request.url);
  const limit = Math.max(1, Math.min(20, normalizeInteger(url.searchParams.get("limit"), 1, 20) || 5));

  const rows = await env.REVIEW_DB.prepare(
    `SELECT
      id,
      created_at,
      page_url,
      page_path,
      page_title,
      section_hint,
      screen_summary,
      screen_context_json,
      client_submitted_at,
      client_timezone,
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
      status,
      claimed_at,
      dispatched_at,
      dispatched_to,
      dispatch_error
    FROM review_notes
    WHERE status='new'
    ORDER BY created_at ASC
    LIMIT ?`,
  )
    .bind(limit)
    .all();

  const notes = Array.isArray(rows.results) ? rows.results.map(serializeReviewNoteRow) : [];

  return jsonResponse(
    {
      ok: true,
      notes,
      count: notes.length,
    },
    { status: 200, request },
  );
}

async function handleReviewRoute(request, env, noteId, action) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }

  const authError = requireAdminToken(request, env);
  if (authError) return authError;

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, { status: 405, request });
  }

  if (action === "claim") {
    const claimedAt = new Date().toISOString();
    const result = await env.REVIEW_DB.prepare(
      "UPDATE review_notes SET status='claimed', claimed_at=?, dispatch_error=NULL WHERE id=? AND status='new'",
    )
      .bind(claimedAt, noteId)
      .run();

    if (!(result.meta?.changes > 0)) {
      return jsonResponse(
        { ok: false, error: "note_not_pending" },
        { status: 409, request },
      );
    }

    const row = await fetchReviewNoteById(env, noteId);
    return jsonResponse(
      {
        ok: true,
        note: serializeReviewNoteRow(row),
      },
      { status: 200, request },
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

  const status = normalizeEnum(payload.status, ALLOWED_ROUTE_STATUSES, "queued");
  const dispatchedAt = textValue(payload.dispatchedAt, 60) || new Date().toISOString();
  const dispatchedTo = textValue(payload.dispatchedTo, 80);
  const dispatchError = textValue(payload.dispatchError, 500);

  const result = await env.REVIEW_DB.prepare(
    `UPDATE review_notes
     SET status=?,
         dispatched_at=?,
         dispatched_to=?,
         dispatch_error=?
     WHERE id=? AND status IN ('new', 'claimed', 'queued', 'dispatch_failed')`,
  )
    .bind(status, dispatchedAt, dispatchedTo, dispatchError, noteId)
    .run();

  if (!(result.meta?.changes > 0)) {
    return jsonResponse(
      { ok: false, error: "note_not_updatable" },
      { status: 409, request },
    );
  }

  const row = await fetchReviewNoteById(env, noteId);
  return jsonResponse(
    {
      ok: true,
      note: serializeReviewNoteRow(row),
    },
    { status: 200, request },
  );
}

async function fetchReviewNoteById(env, noteId) {
  return env.REVIEW_DB.prepare(
    `SELECT
      id,
      created_at,
      page_url,
      page_path,
      page_title,
      section_hint,
      screen_summary,
      screen_context_json,
      client_submitted_at,
      client_timezone,
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
      status,
      claimed_at,
      dispatched_at,
      dispatched_to,
      dispatch_error
    FROM review_notes
    WHERE id=?
    LIMIT 1`,
  )
    .bind(noteId)
    .first();
}

function serializeReviewNoteRow(row) {
  if (!row) return null;
  return {
    id: String(row.id || ""),
    shortId: String(row.id || "").split("-")[0].toUpperCase(),
    createdAt: String(row.created_at || ""),
    pageUrl: String(row.page_url || ""),
    pagePath: String(row.page_path || ""),
    pageTitle: String(row.page_title || ""),
    sectionHint: String(row.section_hint || ""),
    screenSummary: String(row.screen_summary || ""),
    screenContext: parseJsonObject(row.screen_context_json),
    clientSubmittedAt: String(row.client_submitted_at || ""),
    clientTimezone: String(row.client_timezone || ""),
    category: String(row.category || ""),
    priority: String(row.priority || ""),
    note: String(row.note || ""),
    reviewerName: String(row.reviewer_name || ""),
    reviewerEmail: String(row.reviewer_email || ""),
    scrollY: Number(row.scroll_y || 0),
    viewportWidth: Number(row.viewport_width || 0),
    viewportHeight: Number(row.viewport_height || 0),
    userAgent: String(row.user_agent || ""),
    referrer: String(row.referrer || ""),
    submissionHost: String(row.submission_host || ""),
    status: String(row.status || ""),
    claimedAt: String(row.claimed_at || ""),
    dispatchedAt: String(row.dispatched_at || ""),
    dispatchedTo: String(row.dispatched_to || ""),
    dispatchError: String(row.dispatch_error || ""),
  };
}

function requireAdminToken(request, env) {
  const expected = textValue(env.REVIEW_NOTES_ADMIN_TOKEN, 240);
  if (!expected) {
    return jsonResponse(
      { ok: false, error: "review_admin_not_configured" },
      { status: 503, request },
    );
  }

  const authHeader = request.headers.get("Authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
  const provided = bearer || textValue(request.headers.get("X-Review-Admin-Token"), 240);

  if (!provided || provided !== expected) {
    return jsonResponse(
      { ok: false, error: "unauthorized" },
      { status: 401, request },
    );
  }

  return null;
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
    "access-control-allow-headers": "Content-Type, Authorization, X-Review-Admin-Token",
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

function normalizeJsonText(value, maxLength) {
  try {
    const json = JSON.stringify(value && typeof value === "object" ? value : {}, null, 0);
    return json.slice(0, maxLength);
  } catch {
    return "{}";
  }
}

function parseJsonObject(value) {
  if (!value) return {};

  try {
    const parsed = JSON.parse(String(value));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
