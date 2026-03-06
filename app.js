class PhilosophyGame {
  constructor() {
    this.totalCards = 20;
    this.currentIndex = 0;
    this.responses = [];
    this.branchScores = {};
    this.askedIds = new Set();
    this.currentQuestion = null;
    this.isAnimating = false;
    this.startTime = null;
    this.questionStartTime = null;
    this.primaryBranch = null;
    this.secondaryBranch = null;
    this.durationSeconds = 0;

    Object.keys(BRANCHES).forEach(branch => {
      this.branchScores[branch] = { likes: 0, dislikes: 0, asked: 0 };
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
    try {
      await window.appReady;
    } catch {
      // no-op
    }
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
      window.location.href = `mailto:${email}?subject=Philosophy%20Game%20Feedback`;
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
    Object.keys(BRANCHES).forEach(branch => {
      this.branchScores[branch] = { likes: 0, dislikes: 0, asked: 0 };
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

    if (totalAsked < Object.keys(BRANCHES).length) {
      const branchesAsked = new Set(this.responses.map(r => r.branch));
      const unaskedBranches = Object.keys(BRANCHES).filter(b => !branchesAsked.has(b));

      if (unaskedBranches.length > 0) {
        const branch = unaskedBranches[Math.floor(Math.random() * unaskedBranches.length)];
        const branchQuestions = remaining.filter(q => q.branch === branch);
        if (branchQuestions.length > 0) {
          return branchQuestions[Math.floor(Math.random() * branchQuestions.length)];
        }
      }
    }

    if (totalAsked < Object.keys(BRANCHES).length * 2) {
      const branchCounts = {};
      Object.keys(BRANCHES).forEach(b => branchCounts[b] = 0);
      this.responses.forEach(r => branchCounts[r.branch]++);

      const underRepresented = Object.keys(BRANCHES).filter(b => branchCounts[b] < 2);
      if (underRepresented.length > 0) {
        const branch = underRepresented[Math.floor(Math.random() * underRepresented.length)];
        const branchQuestions = remaining.filter(q => q.branch === branch);
        if (branchQuestions.length > 0) {
          return branchQuestions[Math.floor(Math.random() * branchQuestions.length)];
        }
      }
    }

    if (Math.random() < 0.7) {
      const weights = {};
      let totalWeight = 0;

      Object.keys(BRANCHES).forEach(branch => {
        const score = this.branchScores[branch];
        const w = score.likes + 1;
        weights[branch] = w;
        totalWeight += w;
      });

      let pick = Math.random() * totalWeight;
      let selectedBranch = null;
      for (const branch of Object.keys(weights)) {
        pick -= weights[branch];
        if (pick <= 0) {
          selectedBranch = branch;
          break;
        }
      }

      const branchQuestions = remaining.filter(q => q.branch === selectedBranch);
      if (branchQuestions.length > 0) {
        return branchQuestions[Math.floor(Math.random() * branchQuestions.length)];
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

    const branchInfo = BRANCHES[question.branch];
    document.getElementById('card-branch').textContent = `${branchInfo.icon} ${branchInfo.name}`;
    document.getElementById('card-branch').style.background = branchInfo.color;
    document.getElementById('card-text').textContent = question.text;
    document.getElementById('card-context').textContent = question.context;

    const card = document.getElementById('question-card');
    card.classList.remove('card-exit-left', 'card-exit-right');
    card.classList.add('card-enter');
    requestAnimationFrame(() => card.classList.remove('card-enter'));
  }

  respond(liked) {
    if (this.isAnimating || !this.currentQuestion) return;
    this.isAnimating = true;

    const question = this.currentQuestion;
    const branch = question.branch;
    const timeSpentMs = Date.now() - this.questionStartTime;

    this.responses.push({ questionId: question.id, branch, liked, timeSpentMs });

    this.branchScores[branch].asked++;
    if (liked) this.branchScores[branch].likes++;
    else this.branchScores[branch].dislikes++;

    gameDB.recordResponse(question.id, branch, liked, timeSpentMs);

    const card = document.getElementById('question-card');
    card.classList.add(liked ? 'card-exit-right' : 'card-exit-left');

    const btn = liked ? document.getElementById('like-btn') : document.getElementById('dislike-btn');
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
    const ranked = Object.keys(BRANCHES)
      .map(branch => {
        const score = this.branchScores[branch];
        const total = score.likes + score.dislikes;
        const rate = total > 0 ? score.likes / total : 0;
        return { branch, rate, likes: score.likes, total };
      })
      .sort((a, b) => {
        if (b.rate !== a.rate) return b.rate - a.rate;
        if (b.likes !== a.likes) return b.likes - a.likes;
        return b.total - a.total;
      });

    this.primaryBranch = ranked[0].branch;
    this.secondaryBranch = ranked[1] ? ranked[1].branch : ranked[0].branch;

    const primary = BRANCH_DESCRIPTIONS[this.primaryBranch];
    const secondary = BRANCH_DESCRIPTIONS[this.secondaryBranch];
    const comboKey = `${this.primaryBranch}-${this.secondaryBranch}`;
    const comboName = COMBO_LABELS[comboKey] || `${primary.tagline} × ${secondary.tagline}`;

    document.getElementById('type-title').textContent = comboName;
    document.getElementById('type-subtitle').textContent = `${primary.icon} ${primary.name} · ${secondary.icon} ${secondary.name}`;
    document.getElementById('type-description').textContent =
      `${primary.name}. ${primary.description}\n\n   ${secondary.name}. ${secondary.description}`;

    document.getElementById('result-gif').src = RESULT_GIFS[this.primaryBranch] || RESULT_GIFS.ethics;

    if (typeof gtag === 'function') {
      gtag('event', 'result_identity', {
        primary_branch: this.primaryBranch,
        secondary_branch: this.secondaryBranch,
        combo_name: comboName
      });
    }

    this.renderStats();
    this.renderBooks();

    gameDB.finalizeSession(
      this.responses.length,
      this.primaryBranch,
      this.secondaryBranch,
      this.durationSeconds
    );
  }

  renderStats() {
    const container = document.getElementById('branch-stats');
    container.innerHTML = '';

    const totalResponses = this.responses.length;
    const sorted = Object.keys(BRANCHES)
      .map(branch => ({ branch, ...this.branchScores[branch] }))
      .filter(s => s.likes + s.dislikes > 0)
      .sort((a, b) => b.likes - a.likes);

    sorted.forEach(({ branch, likes, dislikes }) => {
      const info = BRANCHES[branch];
      const total = likes + dislikes;
      const likePercent = total > 0 ? Math.round((likes / total) * 100) : 0;
      const dislikePercent = 100 - likePercent;

      const statEl = document.createElement('div');
      statEl.className = 'branch-stat';
      statEl.innerHTML = `
        <div class="branch-stat-header">
          <span class="branch-stat-name">${info.icon} ${info.name}</span>
          <span class="branch-stat-count">${likes} liked / ${total} shown</span>
        </div>
        <div class="stat-bar-container">
          <div class="stat-bar" style="width: ${likePercent}%; background: ${info.color}">${likePercent > 15 ? `👍 ${likes}` : ''}</div>
          <div class="stat-bar stat-bar-dislike" style="width: ${dislikePercent}%">${dislikePercent > 15 ? `👎 ${dislikes}` : ''}</div>
        </div>
      `;
      container.appendChild(statEl);
    });

    const totalLikes = this.responses.filter(r => r.liked).length;
    const totalDislikes = this.responses.filter(r => !r.liked).length;
    document.getElementById('total-stats').textContent =
      `${totalResponses} questions answered · ${totalLikes} enjoyed · ${totalDislikes} not for you`;
  }

  renderBooks() {
    const container = document.getElementById('book-recommendations');
    container.innerHTML = '';

    const primaryBooks = (BOOK_RECOMMENDATIONS[this.primaryBranch] || []).slice(0, 3);
    const secondaryBooks = (BOOK_RECOMMENDATIONS[this.secondaryBranch] || []).slice(0, 2);

    const primaryInfo = BRANCH_DESCRIPTIONS[this.primaryBranch];
    const secondaryInfo = BRANCH_DESCRIPTIONS[this.secondaryBranch];

    [...primaryBooks, ...secondaryBooks].forEach((book, idx) => {
      const isSecondary = idx >= 3;
      const info = isSecondary ? secondaryInfo : primaryInfo;

      const card = document.createElement('div');
      card.className = 'book-card';
      card.style.borderLeftColor = info.color;
      card.innerHTML = `
        <div class="book-branch-label">${info.icon} ${info.name} · ${isSecondary ? 'Secondary' : 'Primary'}</div>
        <div class="book-title">${book.title}</div>
        <div class="book-author">by ${book.author}</div>
        <div class="book-hook">${book.hook}</div>
      `;

      const bookUrl = book.url || `https://www.amazon.com/s?k=${encodeURIComponent(`${book.title} ${book.author}`)}`;
      const link = document.createElement('a');
      link.className = 'book-link';
      link.href = bookUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.appendChild(card);

      container.appendChild(link);
    });
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

      const el = document.createElement('div');
      el.className = 'stat-list-item';
      el.innerHTML = `
        <strong>${i + 1}. ${question.text.slice(0, 90)}...</strong>
        <div class="stat-detail"><span class="stat-highlight">${(r.timeSpentMs / 1000).toFixed(1)}s</span> · ${BRANCHES[r.branch].icon} ${BRANCHES[r.branch].name}</div>
      `;
      userSlowestContainer.appendChild(el);
    });

    const [primaryPct, comboCount, totalHits, totalStarts, totalFinishes, totalReplays, avgQ, answerPop] = await Promise.all([
      gameDB.getPrimaryBranchPercentage(this.primaryBranch),
      gameDB.getComboCount(this.primaryBranch, this.secondaryBranch),
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

    this.renderGlobalList('global-most-popular', rows.slice().sort((a, b) => b.likeRate - a.likeRate).slice(0, 3), item => `${Math.round(item.likeRate * 100)}% enjoyed · ${item.count} responses`);
    this.renderGlobalList('global-least-popular', rows.slice().sort((a, b) => a.likeRate - b.likeRate).slice(0, 3), item => `${Math.round(item.likeRate * 100)}% enjoyed · ${item.count} responses`);
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
        <strong>${idx + 1}. ${item.q.text.slice(0, 90)}...</strong>
        <div class="stat-detail"><span class="stat-highlight">${detailBuilder(item)}</span></div>
      `;
      container.appendChild(el);
    });
  }

  async restart() {
    gameDB.trackEvent('play_again');
    if (typeof gtag === 'function') gtag('event', 'play_again');
    await gameDB.markPlayAgain();
    this.currentIndex = 0;
    this.responses = [];
    this.askedIds = new Set();
    this.currentQuestion = null;
    this.primaryBranch = null;
    this.secondaryBranch = null;
    Object.keys(BRANCHES).forEach(branch => {
      this.branchScores[branch] = { likes: 0, dislikes: 0, asked: 0 };
    });
    this.showScreen('start-screen');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new PhilosophyGame();
});