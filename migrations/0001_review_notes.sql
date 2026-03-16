CREATE TABLE IF NOT EXISTS review_notes (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  page_url TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT NOT NULL,
  section_hint TEXT,
  category TEXT NOT NULL,
  priority TEXT NOT NULL,
  note TEXT NOT NULL,
  reviewer_name TEXT,
  reviewer_email TEXT,
  scroll_y INTEGER NOT NULL DEFAULT 0,
  viewport_width INTEGER NOT NULL DEFAULT 0,
  viewport_height INTEGER NOT NULL DEFAULT 0,
  user_agent TEXT,
  referrer TEXT,
  submission_host TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS review_notes_created_at_idx
ON review_notes (created_at DESC);

CREATE INDEX IF NOT EXISTS review_notes_status_idx
ON review_notes (status, created_at DESC);
