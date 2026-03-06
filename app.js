// Emperor Quiz — Main Game Logic
// Scores questions toward specific Roman emperors based on agree/disagree weights.
'use strict';

/** Escapes HTML special characters to prevent XSS in innerHTML contexts. */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

class EmperorQuiz {
  constructor() {
    this.totalCards = 30;
    this.currentIndex = 0;
    this.responses = [];
    this.emperorScores = {};
    this.categoryStats = {};
    this.askedIds = new Set();
    this.currentQuestion = null;
    this.isAnimating = false;
    this.startTime = null;
    this.questionStartTime = null;
    this.primaryEmperor = null;
    this.secondaryEmperor = null;
    this.durationSeconds = 0;

    Object.keys(EMPERORS).forEach(key => {
      this.emperorScores[key] = 0;
    });

    Object.keys(CATEGORIES).forEach(cat => {
      this.categoryStats[cat] = { agrees: 0, disagrees: 0, asked: 0 };
    });

    this.init();
  }

  async init() {
    this.bindEvents();
    this.showScreen('start-screen');
    await this.ensureConfigReady();
    gameDB.trackEvent('page_load');
  }

  async ensureConfigReady() {
    if (window.appReady) {
      try { await window.appReady; } catch { /* no-op */ }
    }
  }

  bindEvents() {
    document.getElementById('start-btn').addEventListener('click', () => this.startGame());
    document.getElementById('like-btn').addEventListener('click', () => this.respond(true));
    document.getElementById('dislike-btn').addEventListener('click', () => this.respond(false));
    document.getElementById('finish-btn').addEventListener('click', () => this.finishGame());
    document.getElementById('play-again-btn').addEventListener('click', () => this.restart());
    document.getElementById('play-again-btn-2').addEventListener('click', () => this.restart());

    document.getElementById('tab-results').addEventListener('click', () => this.switchTab('results'));
    document.getElementById('tab-stats').addEventListener('click', () => this.switchTab('stats'));

    document.getElementById('email-btn').addEventListener('click', async () => {
      await this.ensureConfigReady();
      const email = (window.APP_CONFIG && window.APP_CONFIG.DEVELOPER_EMAIL) || '';
      if (!email) {
        alert('Developer email is not configured yet.');
        return;
      }
      window.location.href = `mailto:${email}?subject=Emperor%20Quiz%20Feedback`;
    });

    document.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;
      const gameScreen = document.getElementById('game-screen');
      if (gameScreen.classList.contains('hidden')) return;
      if (e.key === 'ArrowRight' || e.key === 'l') this.respond(true);
      if (e.key === 'ArrowLeft' || e.key === 'd') this.respond(false);
    });
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
  }

  switchTab(tab) {
    if (tab === 'results') {
      document.getElementById('results-tab-content').classList.remove('hidden');
      document.getElementById('stats-tab-content').classList.add('hidden');
      document.getElementById('tab-results').classList.add('tab-active');
      document.getElementById('tab-stats').classList.remove('tab-active');
      return;
    }

    document.getElementById('results-tab-content').classList.add('hidden');
    document.getElementById('stats-tab-content').classList.remove('hidden');
    document.getElementById('tab-stats').classList.add('tab-active');
    document.getElementById('tab-results').classList.remove('tab-active');
    this.loadGlobalStats();
  }

  async startGame() {
    await this.ensureConfigReady();

    this.currentIndex = 0;
    this.responses = [];
    this.askedIds = new Set();
    Object.keys(EMPERORS).forEach(key => { this.emperorScores[key] = 0; });
    Object.keys(CATEGORIES).forEach(cat => {
      this.categoryStats[cat] = { agrees: 0, disagrees: 0, asked: 0 };
    });
    this.startTime = Date.now();

    gameDB.trackEvent('start_clicked');
    if (typeof gtag === 'function') gtag('event', 'game_start');
    await gameDB.createSession();

    this.showScreen('game-screen');
    this.showNextCard();
  }

  pickNextQuestion() {
    const remaining = QUESTIONS.filter(q => !this.askedIds.has(q.id));
    if (remaining.length === 0) return null;

    const totalAsked = this.currentIndex;
    const categories = Object.keys(CATEGORIES);

    // Phase 1: Ensure each category is asked at least once
    if (totalAsked < categories.length) {
      const categoriesAsked = new Set(this.responses.map(r => r.category));
      const unasked = categories.filter(c => !categoriesAsked.has(c));

      if (unasked.length > 0) {
        const cat = unasked[Math.floor(Math.random() * unasked.length)];
        const catQuestions = remaining.filter(q => q.category === cat);
        if (catQuestions.length > 0) {
          return catQuestions[Math.floor(Math.random() * catQuestions.length)];
        }
      }
    }

    // Phase 2: Ensure each category gets at least 2
    if (totalAsked < categories.length * 2) {
      const catCounts = {};
      categories.forEach(c => catCounts[c] = 0);
      this.responses.forEach(r => catCounts[r.category]++);

      const underRep = categories.filter(c => catCounts[c] < 2);
      if (underRep.length > 0) {
        const cat = underRep[Math.floor(Math.random() * underRep.length)];
        const catQuestions = remaining.filter(q => q.category === cat);
        if (catQuestions.length > 0) {
          return catQuestions[Math.floor(Math.random() * catQuestions.length)];
        }
      }
    }

    // Phase 3: Weighted random toward categories with more agrees
    if (Math.random() < 0.7) {
      const weights = {};
      let totalWeight = 0;

      categories.forEach(cat => {
        const w = this.categoryStats[cat].agrees + 1;
        weights[cat] = w;
        totalWeight += w;
      });

      let pick = Math.random() * totalWeight;
      let selectedCat = null;
      for (const cat of Object.keys(weights)) {
        pick -= weights[cat];
        if (pick <= 0) { selectedCat = cat; break; }
      }

      const catQuestions = remaining.filter(q => q.category === selectedCat);
      if (catQuestions.length > 0) {
        return catQuestions[Math.floor(Math.random() * catQuestions.length)];
      }
    }

    return remaining[Math.floor(Math.random() * remaining.length)];
  }

  showNextCard() {
    if (this.currentIndex >= this.totalCards) {
      this.finishGame();
      return;
    }

    const question = this.pickNextQuestion();
    if (!question) {
      this.finishGame();
      return;
    }

    this.currentQuestion = question;
    this.askedIds.add(question.id);
    this.questionStartTime = Date.now();

    const progress = (this.currentIndex / this.totalCards) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('card-count').textContent = `${this.currentIndex + 1} / ${this.totalCards}`;

    const catInfo = CATEGORIES[question.category];
    document.getElementById('card-branch').textContent = `${catInfo.icon} ${catInfo.name}`;
    document.getElementById('card-branch').style.background = catInfo.color;
    document.getElementById('card-text').textContent = question.text;
    document.getElementById('card-context').textContent = question.context;

    // Update button labels with question-specific text
    const likeTextEl = document.getElementById('like-btn-text');
    const dislikeTextEl = document.getElementById('dislike-btn-text');
    if (likeTextEl) likeTextEl.textContent = question.likeText || 'Agree';
    if (dislikeTextEl) dislikeTextEl.textContent = question.dislikeText || 'Disagree';

    const card = document.getElementById('question-card');
    card.classList.remove('card-exit-left', 'card-exit-right');
    card.classList.add('card-enter');
    requestAnimationFrame(() => card.classList.remove('card-enter'));
  }

  respond(agreed) {
    if (this.isAnimating || !this.currentQuestion) return;
    this.isAnimating = true;

    const question = this.currentQuestion;
    const category = question.category;
    const timeSpentMs = Date.now() - this.questionStartTime;

    this.responses.push({ questionId: question.id, category, agreed, timeSpentMs });

    this.categoryStats[category].asked++;
    if (agreed) this.categoryStats[category].agrees++;
    else this.categoryStats[category].disagrees++;

    // Apply emperor scoring based on agree/disagree weights
    const scoring = agreed ? question.agree : question.disagree;
    if (scoring) {
      Object.entries(scoring).forEach(([emperor, points]) => {
        this.emperorScores[emperor] = (this.emperorScores[emperor] || 0) + points;
      });
    }

    gameDB.recordResponse(question.id, category, agreed, timeSpentMs);

    const card = document.getElementById('question-card');
    card.classList.add(agreed ? 'card-exit-right' : 'card-exit-left');

    const btn = agreed ? document.getElementById('like-btn') : document.getElementById('dislike-btn');
    btn.classList.add('btn-flash');
    setTimeout(() => btn.classList.remove('btn-flash'), 300);

    this.currentIndex++;

    setTimeout(() => {
      this.isAnimating = false;
      this.showNextCard();
    }, 400);
  }

  finishGame() {
    this.durationSeconds = Math.max(0, Math.round((Date.now() - this.startTime) / 1000));
    this.showScreen('results-screen');
    this.switchTab('results');
    this.calculateResults();
    gameDB.trackEvent('results_viewed');
    if (typeof gtag === 'function') {
      gtag('event', 'game_complete', {
        questions_answered: this.responses.length,
        duration_seconds: this.durationSeconds
      });
    }
  }

  calculateResults() {
    // Rank all emperors by accumulated score
    const ranked = Object.entries(this.emperorScores)
      .map(([key, score]) => ({ key, score, emperor: EMPERORS[key] }))
      .filter(e => e.emperor)
      .sort((a, b) => b.score - a.score);

    this.primaryEmperor = ranked[0] ? ranked[0].key : null;
    this.secondaryEmperor = ranked[1] ? ranked[1].key : (ranked[0] ? ranked[0].key : null);

    const primary = this.primaryEmperor ? EMPERORS[this.primaryEmperor] : null;
    const secondary = this.secondaryEmperor ? EMPERORS[this.secondaryEmperor] : null;

    if (primary) {
      document.getElementById('emperor-name').textContent = primary.name;
      document.getElementById('emperor-reign').textContent = primary.reign;
      document.getElementById('emperor-title-sub').textContent = primary.title;
      document.getElementById('emperor-tagline').textContent = primary.tagline;
      document.getElementById('emperor-description').textContent = primary.description;
      document.getElementById('emperor-icon-large').textContent = primary.icon;
      document.getElementById('result-gif').src = primary.gif || '';

      const traitsEl = document.getElementById('emperor-traits');
      if (traitsEl) {
        let traitsText = `Your Emperor: ${primary.name}\n${primary.traits}`;
        if (secondary && this.secondaryEmperor !== this.primaryEmperor) {
          traitsText += `\n\nRunner-up: ${secondary.name}\n${secondary.traits}`;
        }
        traitsEl.textContent = traitsText;
      }
    }

    if (typeof gtag === 'function') {
      gtag('event', 'result_identity', {
        primary_emperor: this.primaryEmperor,
        secondary_emperor: this.secondaryEmperor
      });
    }

    this.renderStats(ranked);

    gameDB.finalizeSession(
      this.responses.length,
      this.primaryEmperor,
      this.secondaryEmperor,
      this.durationSeconds
    );
  }

  renderStats(ranked) {
    // ===== Emperor Ranking =====
    const container = document.getElementById('emperor-ranking');
    container.innerHTML = '';

    const topEmperors = ranked.filter(e => e.score > 0).slice(0, 5);
    const maxScore = topEmperors.length > 0 ? topEmperors[0].score : 1;

    topEmperors.forEach(({ key, score, emperor }, index) => {
      const pct = Math.round((score / maxScore) * 100);
      const el = document.createElement('div');
      el.className = 'ranking-item' + (index === 0 ? ' ranking-top' : '');
      el.innerHTML = `
        <div class="ranking-header">
          <span class="ranking-position">${index === 0 ? '👑' : '#' + (index + 1)}</span>
          <span class="ranking-name">${escapeHTML(emperor.icon)} ${escapeHTML(emperor.name)}</span>
          <span class="ranking-score">${score} pts</span>
        </div>
        <div class="ranking-bar-container">
          <div class="ranking-bar" style="width: ${pct}%; background: ${escapeHTML(emperor.color)}"></div>
        </div>
      `;
      container.appendChild(el);
    });

    const totalAgrees = this.responses.filter(r => r.agreed).length;
    const totalDisagrees = this.responses.filter(r => !r.agreed).length;
    document.getElementById('total-stats').textContent =
      `${this.responses.length} questions answered · ${totalAgrees} agreed · ${totalDisagrees} disagreed`;

    // ===== Category Breakdown =====
    const catContainer = document.getElementById('category-stats');
    catContainer.innerHTML = '';

    Object.keys(CATEGORIES).forEach(cat => {
      const info = CATEGORIES[cat];
      const stat = this.categoryStats[cat];
      const total = stat.agrees + stat.disagrees;
      if (total === 0) return;

      const likePercent = Math.round((stat.agrees / total) * 100);
      const dislikePercent = 100 - likePercent;

      const el = document.createElement('div');
      el.className = 'branch-stat';
      el.innerHTML = `
        <div class="branch-stat-header">
          <span class="branch-stat-name">${escapeHTML(info.icon)} ${escapeHTML(info.name)}</span>
          <span class="branch-stat-count">${total} questions</span>
        </div>
        <div class="stat-bar-container">
          <div class="stat-bar stat-bar-like" style="width: ${likePercent}%; background: ${escapeHTML(info.color)}">
            ${likePercent > 15 ? `👍 ${stat.agrees}` : ''}
          </div>
          <div class="stat-bar stat-bar-dislike" style="width: ${dislikePercent}%">
            ${dislikePercent > 15 ? `👎 ${stat.disagrees}` : ''}
          </div>
        </div>
      `;
      catContainer.appendChild(el);
    });

    // Add results animation class
    document.getElementById('results-screen').classList.add('results-animate');
  }

  async loadGlobalStats() {
    const minutes = Math.floor(this.durationSeconds / 60);
    const seconds = this.durationSeconds % 60;
    document.getElementById('stat-duration').textContent = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const userSlowest = [...this.responses].sort((a, b) => b.timeSpentMs - a.timeSpentMs).slice(0, 3);
    const userSlowestContainer = document.getElementById('user-slowest-questions');
    userSlowestContainer.innerHTML = '';
    userSlowest.forEach((r, i) => {
      const question = QUESTIONS.find(q => q.id === r.questionId);
      if (!question) return;
      const catInfo = CATEGORIES[question.category] || { icon: '❓', name: question.category };

      const el = document.createElement('div');
      el.className = 'stat-list-item';
      el.innerHTML = `
        <strong>${i + 1}. ${escapeHTML(question.text.slice(0, 90))}...</strong>
        <div class="stat-detail"><span class="stat-highlight">${(r.timeSpentMs / 1000).toFixed(1)}s</span> · ${escapeHTML(catInfo.icon)} ${escapeHTML(catInfo.name)}</div>
      `;
      userSlowestContainer.appendChild(el);
    });

    const [primaryPct, comboCount, totalHits, totalStarts, totalFinishes, totalReplays, avgQ, answerPop] = await Promise.all([
      gameDB.getPrimaryEmperorPercentage(this.primaryEmperor),
      gameDB.getComboCount(this.primaryEmperor, this.secondaryEmperor),
      gameDB.getTotalPageLoads(),
      gameDB.getTotalStartClicks(),
      gameDB.getTotalResultsViewed(),
      gameDB.getTotalPlayAgains(),
      gameDB.getAvgQuestionsCompleted(),
      gameDB.getAnswerPopularity()
    ]);

    document.getElementById('stat-same-primary').textContent = `${primaryPct}%`;
    document.getElementById('stat-same-combo').textContent = String(comboCount);
    document.getElementById('stat-total-hits').textContent = String(totalHits);
    document.getElementById('stat-total-starts').textContent = String(totalStarts);
    document.getElementById('stat-total-finishes').textContent = String(totalFinishes);
    document.getElementById('stat-total-replays').textContent = String(totalReplays);
    document.getElementById('stat-avg-questions').textContent = String(avgQ);

    const rows = Object.entries(answerPop)
      .map(([id, stats]) => {
        const q = QUESTIONS.find(item => item.id === id);
        const likeRate = stats.count > 0 ? stats.likes / stats.count : 0;
        const avgTime = stats.count > 0 ? stats.totalTime / stats.count : 0;
        return { id, q, likeRate, avgTime, count: stats.count };
      })
      .filter(item => item.q && item.count >= 1);

    this.renderGlobalList('global-most-popular', rows.slice().sort((a, b) => b.likeRate - a.likeRate).slice(0, 3), item => `${Math.round(item.likeRate * 100)}% agreed · ${item.count} responses`);
    this.renderGlobalList('global-least-popular', rows.slice().sort((a, b) => a.likeRate - b.likeRate).slice(0, 3), item => `${Math.round(item.likeRate * 100)}% agreed · ${item.count} responses`);
    this.renderGlobalList('global-slowest-questions', rows.slice().sort((a, b) => b.avgTime - a.avgTime).slice(0, 3), item => `${(item.avgTime / 1000).toFixed(1)}s average response time`);
  }

  renderGlobalList(containerId, items, detailBuilder) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'stat-list-item';
      empty.textContent = 'Not enough data yet. Share the app to build richer stats.';
      container.appendChild(empty);
      return;
    }

    items.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'stat-list-item';
      el.innerHTML = `
        <strong>${idx + 1}. ${escapeHTML(item.q.text.slice(0, 90))}...</strong>
        <div class="stat-detail"><span class="stat-highlight">${escapeHTML(detailBuilder(item))}</span></div>
      `;
      container.appendChild(el);
    });
  }

  async restart() {
    gameDB.trackEvent('play_again');
    if (typeof gtag === 'function') gtag('event', 'play_again');
    await gameDB.markPlayAgain();
    document.getElementById('results-screen').classList.remove('results-animate');
    this.currentIndex = 0;
    this.responses = [];
    this.askedIds = new Set();
    this.currentQuestion = null;
    this.primaryEmperor = null;
    this.secondaryEmperor = null;
    Object.keys(EMPERORS).forEach(key => { this.emperorScores[key] = 0; });
    Object.keys(CATEGORIES).forEach(cat => {
      this.categoryStats[cat] = { agrees: 0, disagrees: 0, asked: 0 };
    });
    this.showScreen('start-screen');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new EmperorQuiz();
});