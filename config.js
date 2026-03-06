window.APP_CONFIG = {
  ...(window.APP_CONFIG || {}),
  SUPABASE_URL: (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || '',
  SUPABASE_ANON_KEY: (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || '',
  DEVELOPER_EMAIL: (window.APP_CONFIG && window.APP_CONFIG.DEVELOPER_EMAIL) || ''
};

window.loadAppConfig = window.loadAppConfig || (async () => {
  try {
    const res = await fetch('/api/config', { cache: 'no-store' });
    if (!res.ok) return window.APP_CONFIG;

    const runtimeConfig = await res.json();
    window.APP_CONFIG = {
      ...(window.APP_CONFIG || {}),
      ...(runtimeConfig || {})
    };
    return window.APP_CONFIG;
  } catch {
    return window.APP_CONFIG;
  }
})();
