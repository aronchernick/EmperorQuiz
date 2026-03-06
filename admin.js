// Emperor Quiz — Admin Portal Logic
// Manages CRUD for emperors and questions via localStorage overlay on the base data.

(function() {
  'use strict';

  // ===== CREDENTIAL CHECK =====
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'imperator';

  // ===== STATE =====
  let currentTab = 'emperors';
  let editingEmperor = null;   // emperor key being edited, or null for new
  let editingQuestion = null;  // question id being edited, or null for new

  // ===== DATA LAYER (localStorage overlay) =====
  // The admin can add/edit/delete emperors and questions. Changes are stored
  // in localStorage and merged with the base data from questions.js at runtime.

  function loadEmperors() {
    const override = localStorage.getItem('admin_emperors');
    if (override) {
      try { return JSON.parse(override); } catch(e) { /* fall through */ }
    }
    return JSON.parse(JSON.stringify(EMPERORS));
  }

  function saveEmperors(data) {
    localStorage.setItem('admin_emperors', JSON.stringify(data));
  }

  function loadQuestions() {
    const override = localStorage.getItem('admin_questions');
    if (override) {
      try { return JSON.parse(override); } catch(e) { /* fall through */ }
    }
    return JSON.parse(JSON.stringify(QUESTIONS));
  }

  function saveQuestions(data) {
    localStorage.setItem('admin_questions', JSON.stringify(data));
  }

  // ===== LOGIN =====
  const loginScreen = document.getElementById('login-screen');
  const adminScreen = document.getElementById('admin-screen');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  // Check if already logged in
  if (sessionStorage.getItem('admin_logged_in') === 'true') {
    showDashboard();
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('admin_logged_in', 'true');
      loginError.textContent = '';
      showDashboard();
    } else {
      loginError.textContent = 'Invalid credentials. Please try again.';
      document.getElementById('login-password').value = '';
    }
  });

  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('admin_logged_in');
    loginScreen.classList.remove('hidden');
    adminScreen.classList.add('hidden');
  });

  function showDashboard() {
    loginScreen.classList.add('hidden');
    adminScreen.classList.remove('hidden');
    renderEmperors();
    renderQuestions();
    populateCategoryFilter();
  }

  // ===== TABS =====
  document.querySelectorAll('.admin-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      document.getElementById('tab-emperors').classList.toggle('hidden', currentTab !== 'emperors');
      document.getElementById('tab-questions').classList.toggle('hidden', currentTab !== 'questions');
    });
  });

  // ===== RENDER EMPERORS =====
  function renderEmperors() {
    const emps = loadEmperors();
    const keys = Object.keys(emps);
    document.getElementById('emperor-count').textContent = keys.length;

    const list = document.getElementById('emperor-list');
    if (keys.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No emperors defined. Add one to get started.</p>';
      return;
    }

    list.innerHTML = keys.map(function(key) {
      const emp = emps[key];
      return '<div class="emperor-item" data-key="' + key + '">' +
        '<div class="emperor-color-dot" style="background:' + (emp.color || '#888') + '"></div>' +
        '<span class="emperor-item-icon">' + (emp.icon || '👑') + '</span>' +
        '<div class="emperor-item-info">' +
          '<div class="emperor-item-name">' + escapeHtml(emp.name) + '</div>' +
          '<div class="emperor-item-detail">' + escapeHtml(emp.reign || '') + ' · ' + escapeHtml(emp.title || '') + '</div>' +
        '</div>' +
        '<div class="emperor-item-actions">' +
          '<button class="btn btn-ghost btn-sm edit-emperor-btn" data-key="' + key + '">Edit</button>' +
          '<button class="btn btn-danger btn-sm delete-emperor-btn" data-key="' + key + '">Delete</button>' +
        '</div>' +
      '</div>';
    }).join('');

    // Bind events
    list.querySelectorAll('.edit-emperor-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { openEmperorModal(btn.dataset.key); });
    });
    list.querySelectorAll('.delete-emperor-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { deleteEmperor(btn.dataset.key); });
    });
  }

  // ===== RENDER QUESTIONS =====
  function renderQuestions() {
    const questions = loadQuestions();
    const emps = loadEmperors();
    const empKeys = Object.keys(emps);
    const filterCat = document.getElementById('filter-category').value;

    const filtered = filterCat === 'all' ? questions : questions.filter(function(q) { return q.category === filterCat; });

    document.getElementById('question-count').textContent = questions.length;

    const container = document.getElementById('question-list');
    if (filtered.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">No questions found.</p>';
      return;
    }

    container.innerHTML = filtered.map(function(q, idx) {
      var catInfo = CATEGORIES[q.category] || { name: q.category, icon: '❓' };
      var agreeStr = formatScoring(q.agree, emps);
      var disagreeStr = formatScoring(q.disagree, emps);

      return '<div class="question-item" data-id="' + q.id + '">' +
        '<div class="question-item-header">' +
          '<span class="question-item-id">' + catInfo.icon + ' ' + escapeHtml(q.id) + '</span>' +
          '<div class="question-item-actions" style="display:flex;gap:8px;">' +
            '<button class="btn btn-ghost btn-sm edit-question-btn" data-id="' + q.id + '">Edit</button>' +
            '<button class="btn btn-danger btn-sm delete-question-btn" data-id="' + q.id + '">Delete</button>' +
          '</div>' +
        '</div>' +
        '<div class="question-item-text">' + escapeHtml(q.text) + '</div>' +
        (q.context ? '<div class="question-item-meta">' + escapeHtml(q.context) + '</div>' : '') +
        '<div class="question-scoring">' +
          '<div class="scoring-agree"><span class="scoring-label">✓ ' + escapeHtml(q.likeText || 'Agree') + '</span><div class="scoring-list">' + agreeStr + '</div></div>' +
          '<div class="scoring-disagree"><span class="scoring-label">✗ ' + escapeHtml(q.dislikeText || 'Disagree') + '</span><div class="scoring-list">' + disagreeStr + '</div></div>' +
        '</div>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.edit-question-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { openQuestionModal(btn.dataset.id); });
    });
    container.querySelectorAll('.delete-question-btn').forEach(function(btn) {
      btn.addEventListener('click', function() { deleteQuestion(btn.dataset.id); });
    });
  }

  function formatScoring(scores, emps) {
    if (!scores || Object.keys(scores).length === 0) return '<em style="opacity:0.4">none</em>';
    return Object.keys(scores).map(function(key) {
      var empName = (emps[key] && emps[key].name) || key;
      return escapeHtml(empName) + ' +' + scores[key];
    }).join(' · ');
  }

  function populateCategoryFilter() {
    var sel = document.getElementById('filter-category');
    sel.innerHTML = '<option value="all">All Categories</option>';
    Object.keys(CATEGORIES).forEach(function(key) {
      var cat = CATEGORIES[key];
      sel.innerHTML += '<option value="' + key + '">' + cat.icon + ' ' + escapeHtml(cat.name) + '</option>';
    });
    sel.addEventListener('change', function() { renderQuestions(); });
  }

  // ===== ADD BUTTONS =====
  document.getElementById('add-emperor-btn').addEventListener('click', function() {
    openEmperorModal(null);
  });

  document.getElementById('add-question-btn').addEventListener('click', function() {
    openQuestionModal(null);
  });

  // ===== EMPEROR MODAL =====
  function openEmperorModal(key) {
    editingEmperor = key;
    var emps = loadEmperors();
    var emp = key ? emps[key] : {};

    var html = '<div class="modal-overlay" id="modal-overlay">' +
      '<div class="modal">' +
        '<h3>' + (key ? 'Edit Emperor' : 'Add Emperor') + '</h3>' +
        '<div class="form-group">' +
          '<label class="form-label">Key (unique ID, lowercase, no spaces)</label>' +
          '<input class="form-input" id="emp-key" value="' + escapeAttr(key || '') + '" ' + (key ? 'disabled style="opacity:0.5"' : '') + ' placeholder="e.g. augustus">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Name</label>' +
          '<input class="form-input" id="emp-name" value="' + escapeAttr(emp.name || '') + '" placeholder="Emperor name">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Reign</label>' +
          '<input class="form-input" id="emp-reign" value="' + escapeAttr(emp.reign || '') + '" placeholder="e.g. 27 BC – 14 AD">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Title</label>' +
          '<input class="form-input" id="emp-title" value="' + escapeAttr(emp.title || '') + '" placeholder="e.g. The Architect of Empire">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Icon (emoji)</label>' +
          '<input class="form-input" id="emp-icon" value="' + escapeAttr(emp.icon || '') + '" placeholder="🏛️">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Color (hex)</label>' +
          '<input class="form-input" id="emp-color" value="' + escapeAttr(emp.color || '#C9A84C') + '" placeholder="#C9A84C">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Tagline</label>' +
          '<input class="form-input" id="emp-tagline" value="' + escapeAttr(emp.tagline || '') + '" placeholder="Patient · Strategic · Visionary">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Description</label>' +
          '<textarea class="form-textarea" id="emp-description" rows="4" placeholder="Full personality description...">' + escapeHtml(emp.description || '') + '</textarea>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">GIF URL</label>' +
          '<input class="form-input" id="emp-gif" value="' + escapeAttr(emp.gif || '') + '" placeholder="https://...">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Historical Traits</label>' +
          '<textarea class="form-textarea" id="emp-traits" rows="3" placeholder="Brief historical summary...">' + escapeHtml(emp.traits || '') + '</textarea>' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-ghost" id="modal-cancel">Cancel</button>' +
          '<button class="btn btn-primary btn-sm" id="modal-save">Save Emperor</button>' +
        '</div>' +
      '</div>' +
    '</div>';

    showModal(html);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-save').addEventListener('click', saveEmperor);
    document.getElementById('modal-overlay').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
  }

  function saveEmperor() {
    var key = document.getElementById('emp-key').value.trim().toLowerCase().replace(/\s+/g, '_');
    var name = document.getElementById('emp-name').value.trim();

    if (!key || !name) {
      showToast('Key and Name are required.', true);
      return;
    }

    var emps = loadEmperors();
    if (!editingEmperor && emps[key]) {
      showToast('An emperor with key "' + key + '" already exists.', true);
      return;
    }

    emps[key] = {
      name: name,
      reign: document.getElementById('emp-reign').value.trim(),
      title: document.getElementById('emp-title').value.trim(),
      icon: document.getElementById('emp-icon').value.trim() || '👑',
      color: document.getElementById('emp-color').value.trim() || '#C9A84C',
      tagline: document.getElementById('emp-tagline').value.trim(),
      description: document.getElementById('emp-description').value.trim(),
      gif: document.getElementById('emp-gif').value.trim(),
      traits: document.getElementById('emp-traits').value.trim()
    };

    saveEmperors(emps);
    closeModal();
    renderEmperors();
    showToast(editingEmperor ? 'Emperor updated.' : 'Emperor added.');
  }

  function deleteEmperor(key) {
    var emps = loadEmperors();
    var name = emps[key] ? emps[key].name : key;
    if (!confirm('Delete emperor "' + name + '"? This will also remove their scoring from all questions.')) return;

    delete emps[key];
    saveEmperors(emps);

    // Also strip this emperor from all question scoring
    var questions = loadQuestions();
    questions.forEach(function(q) {
      if (q.agree && q.agree[key]) delete q.agree[key];
      if (q.disagree && q.disagree[key]) delete q.disagree[key];
    });
    saveQuestions(questions);

    renderEmperors();
    renderQuestions();
    showToast('Emperor "' + name + '" deleted.');
  }

  // ===== QUESTION MODAL =====
  function openQuestionModal(id) {
    editingQuestion = id;
    var questions = loadQuestions();
    var q = id ? questions.find(function(x) { return x.id === id; }) : {};
    if (!q) q = {};

    var emps = loadEmperors();
    var empKeys = Object.keys(emps);

    var html = '<div class="modal-overlay" id="modal-overlay">' +
      '<div class="modal">' +
        '<h3>' + (id ? 'Edit Question' : 'Add Question') + '</h3>' +
        '<div class="form-group">' +
          '<label class="form-label">ID (unique, e.g. pow7)</label>' +
          '<input class="form-input" id="q-id" value="' + escapeAttr(q.id || '') + '" ' + (id ? 'disabled style="opacity:0.5"' : '') + ' placeholder="e.g. war5">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Category</label>' +
          '<select class="form-input" id="q-category">' +
            Object.keys(CATEGORIES).map(function(k) {
              return '<option value="' + k + '"' + (q.category === k ? ' selected' : '') + '>' + CATEGORIES[k].icon + ' ' + CATEGORIES[k].name + '</option>';
            }).join('') +
          '</select>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Question Text</label>' +
          '<textarea class="form-textarea" id="q-text" rows="3" placeholder="The statement the player responds to...">' + escapeHtml(q.text || '') + '</textarea>' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Context (optional)</label>' +
          '<input class="form-input" id="q-context" value="' + escapeAttr(q.context || '') + '" placeholder="Brief context shown below the question">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Agree Button Text</label>' +
          '<input class="form-input" id="q-like" value="' + escapeAttr(q.likeText || '') + '" placeholder="e.g. Agree">' +
        '</div>' +
        '<div class="form-group">' +
          '<label class="form-label">Disagree Button Text</label>' +
          '<input class="form-input" id="q-dislike" value="' + escapeAttr(q.dislikeText || '') + '" placeholder="e.g. Disagree">' +
        '</div>' +

        // Agree scores editor
        '<div class="scoring-editor">' +
          '<div class="scoring-editor-title" style="color:var(--success);">✓ Agree Scores</div>' +
          '<div id="agree-scores-container">' +
            buildScoringRows(q.agree || {}, empKeys, emps, 'agree') +
          '</div>' +
          '<button class="btn-add-scoring" id="add-agree-score">+ Add Agree Score</button>' +
        '</div>' +

        // Disagree scores editor
        '<div class="scoring-editor" style="margin-top:16px;">' +
          '<div class="scoring-editor-title" style="color:var(--danger);">✗ Disagree Scores</div>' +
          '<div id="disagree-scores-container">' +
            buildScoringRows(q.disagree || {}, empKeys, emps, 'disagree') +
          '</div>' +
          '<button class="btn-add-scoring" id="add-disagree-score">+ Add Disagree Score</button>' +
        '</div>' +

        '<div class="modal-actions">' +
          '<button class="btn btn-ghost" id="modal-cancel">Cancel</button>' +
          '<button class="btn btn-primary btn-sm" id="modal-save">Save Question</button>' +
        '</div>' +
      '</div>' +
    '</div>';

    showModal(html);
    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('modal-save').addEventListener('click', saveQuestion);
    document.getElementById('modal-overlay').addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
    document.getElementById('add-agree-score').addEventListener('click', function() {
      addScoringRow('agree-scores-container', empKeys, emps);
    });
    document.getElementById('add-disagree-score').addEventListener('click', function() {
      addScoringRow('disagree-scores-container', empKeys, emps);
    });

    bindRemoveButtons();
  }

  function buildScoringRows(scores, empKeys, emps, prefix) {
    if (!scores || Object.keys(scores).length === 0) return '';
    return Object.keys(scores).map(function(key) {
      return '<div class="scoring-row">' +
        '<select class="scoring-emperor-select">' +
          empKeys.map(function(ek) {
            return '<option value="' + ek + '"' + (ek === key ? ' selected' : '') + '>' + escapeHtml(emps[ek].name) + '</option>';
          }).join('') +
        '</select>' +
        '<input type="number" class="scoring-value" value="' + (scores[key] || 1) + '" min="1" max="5">' +
        '<button class="btn-remove-scoring" title="Remove">×</button>' +
      '</div>';
    }).join('');
  }

  function addScoringRow(containerId, empKeys, emps) {
    var container = document.getElementById(containerId);
    var div = document.createElement('div');
    div.className = 'scoring-row';
    div.innerHTML =
      '<select class="scoring-emperor-select">' +
        empKeys.map(function(ek) {
          return '<option value="' + ek + '">' + escapeHtml(emps[ek].name) + '</option>';
        }).join('') +
      '</select>' +
      '<input type="number" class="scoring-value" value="1" min="1" max="5">' +
      '<button class="btn-remove-scoring" title="Remove">×</button>';
    container.appendChild(div);
    bindRemoveButtons();
  }

  function bindRemoveButtons() {
    document.querySelectorAll('.btn-remove-scoring').forEach(function(btn) {
      btn.onclick = function() { btn.closest('.scoring-row').remove(); };
    });
  }

  function collectScores(containerId) {
    var obj = {};
    var rows = document.getElementById(containerId).querySelectorAll('.scoring-row');
    rows.forEach(function(row) {
      var key = row.querySelector('.scoring-emperor-select').value;
      var val = parseInt(row.querySelector('.scoring-value').value, 10) || 1;
      obj[key] = val;
    });
    return obj;
  }

  function saveQuestion() {
    var id = document.getElementById('q-id').value.trim().toLowerCase().replace(/\s+/g, '_');
    var text = document.getElementById('q-text').value.trim();

    if (!id || !text) {
      showToast('ID and Question Text are required.', true);
      return;
    }

    var questions = loadQuestions();

    if (!editingQuestion) {
      // Check for duplicate id
      if (questions.find(function(q) { return q.id === id; })) {
        showToast('A question with ID "' + id + '" already exists.', true);
        return;
      }
    }

    var newQ = {
      id: id,
      category: document.getElementById('q-category').value,
      text: text,
      context: document.getElementById('q-context').value.trim(),
      likeText: document.getElementById('q-like').value.trim() || 'Agree',
      dislikeText: document.getElementById('q-dislike').value.trim() || 'Disagree',
      agree: collectScores('agree-scores-container'),
      disagree: collectScores('disagree-scores-container')
    };

    if (editingQuestion) {
      var idx = questions.findIndex(function(q) { return q.id === editingQuestion; });
      if (idx >= 0) {
        questions[idx] = newQ;
      }
    } else {
      questions.push(newQ);
    }

    saveQuestions(questions);
    closeModal();
    renderQuestions();
    showToast(editingQuestion ? 'Question updated.' : 'Question added.');
  }

  function deleteQuestion(id) {
    if (!confirm('Delete question "' + id + '"?')) return;
    var questions = loadQuestions();
    var filtered = questions.filter(function(q) { return q.id !== id; });
    saveQuestions(filtered);
    renderQuestions();
    showToast('Question deleted.');
  }

  // ===== MODAL HELPERS =====
  function showModal(html) {
    document.getElementById('modal-container').innerHTML = html;
  }

  function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
    editingEmperor = null;
    editingQuestion = null;
  }

  // ===== TOAST =====
  function showToast(msg, isError) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) {
      toast.style.color = 'var(--danger)';
      toast.style.borderColor = 'rgba(225, 112, 85, 0.3)';
    }
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
  }

  // ===== UTILITY =====
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

})();