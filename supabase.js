class GameDatabase {
  constructor() {
    this.sessionId = null;
  }

  get supabaseUrl() {
    return (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || '';
  }

  get supabaseKey() {
    return (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || '';
  }

  get enabled() {
    return Boolean(this.supabaseUrl && this.supabaseKey);
  }

  async _fetch(path, options = {}) {
    if (!this.enabled) return null;

    const url = `${this.supabaseUrl}/rest/v1/${path}`;
    const headers = {
      apikey: this.supabaseKey,
      Authorization: `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
      ...options.headers
    };

    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
  const errText = await res.text();
  console.error('Supabase error:', res.status, errText);
  return null;
}
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch (err) {
  console.error('Supabase fetch error:', err);
  return null;
}
  }

  async trackEvent(event) {
    await this._fetch('page_hits', {
      method: 'POST',
      body: JSON.stringify({ event })
    });
  }

  async createSession() {
    const data = await this._fetch('game_sessions', {
      method: 'POST',
      body: JSON.stringify({ started_at: new Date().toISOString() })
    });
    if (data && data[0]) this.sessionId = data[0].id;
    return this.sessionId;
  }

  async recordResponse(questionId, branch, liked, timeSpentMs) {
    if (!this.sessionId) return;
    await this._fetch('responses', {
      method: 'POST',
      body: JSON.stringify({
        session_id: this.sessionId,
        question_id: questionId,
        branch,
        liked,
        time_spent_ms: timeSpentMs
      })
    });
  }

  async finalizeSession(questionsAnswered, primaryBranch, secondaryBranch, durationSeconds) {
    if (!this.sessionId) return;
    await this._fetch(`game_sessions?id=eq.${this.sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        finished_at: new Date().toISOString(),
        questions_answered: questionsAnswered,
        primary_branch: primaryBranch,
        secondary_branch: secondaryBranch,
        duration_seconds: durationSeconds,
        completed: true
      })
    });
  }

  async markPlayAgain() {
    if (!this.sessionId) return;
    await this._fetch(`game_sessions?id=eq.${this.sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ played_again: true })
    });
  }

  async _count(path) {
    const data = await this._fetch(path);
    return Array.isArray(data) ? data.length : 0;
  }

  async getTotalPageLoads() {
    return this._count('page_hits?event=eq.page_load&select=id');
  }

  async getTotalStartClicks() {
    return this._count('page_hits?event=eq.start_clicked&select=id');
  }

  async getTotalResultsViewed() {
    return this._count('page_hits?event=eq.results_viewed&select=id');
  }

  async getTotalPlayAgains() {
    return this._count('page_hits?event=eq.play_again&select=id');
  }

  async getCompletedSessions() {
    const data = await this._fetch('game_sessions?completed=eq.true&select=*');
    return Array.isArray(data) ? data : [];
  }

  async getAllResponses() {
    const data = await this._fetch('responses?select=*');
    return Array.isArray(data) ? data : [];
  }

  async getPrimaryBranchPercentage(branch) {
    const sessions = await this.getCompletedSessions();
    if (sessions.length === 0) return 0;
    const matching = sessions.filter(s => s.primary_branch === branch).length;
    return Math.round((matching / sessions.length) * 100);
  }

  async getComboCount(primary, secondary) {
    const sessions = await this.getCompletedSessions();
    return sessions.filter(s => s.primary_branch === primary && s.secondary_branch === secondary).length;
  }

  async getAvgQuestionsCompleted() {
    const sessions = await this.getCompletedSessions();
    if (sessions.length === 0) return 0;
    const total = sessions.reduce((sum, s) => sum + (s.questions_answered || 0), 0);
    return Math.round(total / sessions.length);
  }

  async getAnswerPopularity() {
    const responses = await this.getAllResponses();
    const questionStats = {};

    responses.forEach(r => {
      if (!questionStats[r.question_id]) {
        questionStats[r.question_id] = { likes: 0, dislikes: 0, totalTime: 0, count: 0 };
      }
      questionStats[r.question_id].count += 1;
      questionStats[r.question_id].totalTime += r.time_spent_ms || 0;
      if (r.liked) questionStats[r.question_id].likes += 1;
      else questionStats[r.question_id].dislikes += 1;
    });

    return questionStats;
  }
}

const gameDB = new GameDatabase();
