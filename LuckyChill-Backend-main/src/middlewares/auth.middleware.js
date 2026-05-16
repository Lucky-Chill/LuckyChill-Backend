const { createSupabaseClient } = require("../lib/supabase");
const { sendError } = require("../utils/response");

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  const token = authHeader.slice(7);
  const supabase = createSupabaseClient(token);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return sendError(res, 401, "UNAUTHORIZED", "유효하지 않은 토큰입니다.");
  }

  req.user = data.user;
  req.accessToken = token;
  req.supabase = supabase;
  return next();
}

module.exports = {
  requireAuth
};
