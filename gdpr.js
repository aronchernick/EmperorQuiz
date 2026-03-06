// GDPR Cookie Consent — Only shown to visitors from countries that require it by law
// EU/EEA (GDPR), UK (UK GDPR), Brazil (LGPD), South Africa (POPIA), Switzerland (FADP)

(function () {
  'use strict';

  // Countries that legally require cookie/privacy consent
  const CONSENT_REQUIRED_COUNTRIES = new Set([
    // EU member states
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
    // EEA (non-EU)
    'IS', 'LI', 'NO',
    // UK (UK GDPR)
    'GB',
    // Brazil (LGPD)
    'BR',
    // South Africa (POPIA)
    'ZA',
    // Switzerland (FADP)
    'CH'
  ]);

  const CONSENT_KEY = 'emperor_quiz_cookie_consent';
  const banner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');

  if (!banner || !acceptBtn || !rejectBtn) return;

  // Check if user has already made a choice
  const existingConsent = localStorage.getItem(CONSENT_KEY);
  if (existingConsent !== null) {
    // Already decided — apply their choice silently
    if (existingConsent === 'accepted') {
      enableAnalytics();
    }
    return;
  }

  // Detect country via Vercel geo header (served by /api/geo)
  detectCountry().then(function (country) {
    if (!country || !CONSENT_REQUIRED_COUNTRIES.has(country.toUpperCase())) {
      // Not in a consent-required country — enable analytics automatically
      localStorage.setItem(CONSENT_KEY, 'accepted');
      enableAnalytics();
      return;
    }

    // Show the consent banner for users in consent-required countries
    banner.classList.remove('hidden');

    acceptBtn.addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      banner.classList.add('hidden');
      enableAnalytics();
    });

    rejectBtn.addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      banner.classList.add('hidden');
    });
  });

  async function detectCountry() {
    try {
      const res = await fetch('/api/geo', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.country || null;
    } catch {
      return null;
    }
  }

  function enableAnalytics() {
    // Update Google Analytics consent
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }
})();
