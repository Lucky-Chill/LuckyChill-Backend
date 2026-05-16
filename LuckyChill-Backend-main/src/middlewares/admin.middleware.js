const { supabaseAdmin } = require("../lib/supabase");
const { sendError } = require("../utils/response");

async function requireAdmin(req, res, next) {
  if (!req.user) {
    return sendError(res, 401, "UNAUTHORIZED", "로그인이 필요합니다.");
  }

  if (!supabaseAdmin) {
    return sendError(
      res,
      500,
      "INTERNAL_SERVER_ERROR",
      "서버 Supabase 설정이 완료되지 않았습니다."
    );
  }

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", req.user.id)
    .single();

  if (error || !profile) {
    return sendError(res, 403, "FORBIDDEN", "프로필을 찾을 수 없습니다.");
  }

  if (profile.role !== "ADMIN") {
    return sendError(res, 403, "FORBIDDEN", "관리자 권한이 필요합니다.");
  }

  req.supabaseAdmin = supabaseAdmin;
  return next();
}

module.exports = {
  requireAdmin
};
