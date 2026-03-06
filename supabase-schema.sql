CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  questions_answered INTEGER DEFAULT 0,
  primary_emperor TEXT,
  secondary_emperor TEXT,
  completed BOOLEAN DEFAULT false,
  played_again BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id),
  question_id TEXT NOT NULL,
  category TEXT NOT NULL,
  liked BOOLEAN NOT NULL,
  time_spent_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_hits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin data store: holds emperor/question overrides from the admin portal
CREATE TABLE IF NOT EXISTS admin_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data_type TEXT NOT NULL UNIQUE,  -- 'emperors' or 'questions'
  payload JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert game_sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow anonymous select game_sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow anonymous update game_sessions" ON game_sessions;
DROP POLICY IF EXISTS "Allow anonymous insert responses" ON responses;
DROP POLICY IF EXISTS "Allow anonymous select responses" ON responses;
DROP POLICY IF EXISTS "Allow anonymous insert page_hits" ON page_hits;
DROP POLICY IF EXISTS "Allow anonymous select page_hits" ON page_hits;

CREATE POLICY "Allow anonymous insert game_sessions" ON game_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select game_sessions" ON game_sessions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous update game_sessions" ON game_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous insert responses" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select responses" ON responses FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert page_hits" ON page_hits FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous select page_hits" ON page_hits FOR SELECT USING (true);

-- Admin data is managed by the service role key via the serverless API, so
-- we allow all operations only through service role (no anon access).
-- If using the anon key in the API, grant access here:
DROP POLICY IF EXISTS "Allow all admin_data" ON admin_data;
CREATE POLICY "Allow all admin_data" ON admin_data FOR ALL USING (true) WITH CHECK (true);
