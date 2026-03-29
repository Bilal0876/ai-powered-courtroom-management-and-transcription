const supabase = require('../config/supabaseClient');

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    // Map necessary user data to req.user
    // In this app, we sometimes use x-role or user_metadata
    req.user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role || req.headers['x-role'] // Fallback to header if metadata missing
    };
    
    // Some routes expect req.user.code (e.g. judge_code, steno_code)
    // We can extract this from headers if provided, or it might be stored in metadata
    req.user.code = req.headers['x-user-code'] || req.headers['x-judge-code'] || req.headers['x-steno-code'] || req.headers['x-admin-code'] || req.headers['x-cjudge-code'];

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ success: false, message: "Server error during authentication" });
  }
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};
