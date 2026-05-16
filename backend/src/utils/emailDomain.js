const ALLOWED_EMAIL_DOMAIN = (process.env.ALLOWED_EMAIL_DOMAIN || "gachon.ac.kr").toLowerCase();

function isAllowedSchoolEmail(email) {
  if (!email || typeof email !== "string") return false;
  return email.trim().toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
}

module.exports = {
  ALLOWED_EMAIL_DOMAIN,
  isAllowedSchoolEmail
};
