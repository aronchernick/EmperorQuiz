CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  questions_answered INTEGER DEFAULT 0,
  primary_branch TEXT,
  secondary_branch TEXT,
  completed BOOLEAN DEFAULT false,
  played_again BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id),
  question_id TEXT NOT NULL,
  branch TEXT NOT NULL,
  liked BOOLEAN NOT NULL,
  time_spent_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_hits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_hits ENABLE ROW LEVEL SECURITY;

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
