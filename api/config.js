module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.WINDOW_APP_CONFIG_SUPABASE_URL ||
    process.env['window.app_config.SUPABASE_URL'] ||
    '';

  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.WINDOW_APP_CONFIG_SUPABASE_ANON_KEY ||
    process.env['window.app_config.SUPABASE_ANON_KEY'] ||
    '';

  const developerEmail =
    process.env.DEVELOPER_EMAIL ||
    process.env.WINDOW_APP_CONFIG_DEVELOPER_EMAIL ||
    process.env['window.app_config.DEVELOPER_EMAIL'] ||
    '';

  res.status(200).json({
    SUPABASE_URL: supabaseUrl,
    SUPABASE_ANON_KEY: supabaseAnonKey,
    DEVELOPER_EMAIL: developerEmail
  });
};
