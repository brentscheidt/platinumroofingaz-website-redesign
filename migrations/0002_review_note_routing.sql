ALTER TABLE review_notes ADD COLUMN screen_summary TEXT;
ALTER TABLE review_notes ADD COLUMN screen_context_json TEXT DEFAULT '{}';
ALTER TABLE review_notes ADD COLUMN client_submitted_at TEXT;
ALTER TABLE review_notes ADD COLUMN client_timezone TEXT;
ALTER TABLE review_notes ADD COLUMN claimed_at TEXT;
ALTER TABLE review_notes ADD COLUMN dispatched_at TEXT;
ALTER TABLE review_notes ADD COLUMN dispatched_to TEXT;
ALTER TABLE review_notes ADD COLUMN dispatch_error TEXT;

CREATE INDEX IF NOT EXISTS review_notes_status_claimed_idx
ON review_notes (status, claimed_at, created_at DESC);
