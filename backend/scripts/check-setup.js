/**
 * 로컬 환경 점검: .env → Supabase → (선택) API 서버
 * 사용: node scripts/check-setup.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { createClient } = require("@supabase/supabase-js");

const errors = [];
const ok = [];

function pass(msg) {
  ok.push(msg);
  console.log("[OK]", msg);
}

function fail(msg) {
  errors.push(msg);
  console.log("[FAIL]", msg);
}

async function main() {
  console.log("=== LuckyChill Backend 로컬 점검 ===\n");

  const cwd = process.cwd();
  if (!cwd.replace(/\\/g, "/").endsWith("/backend") && !cwd.includes("backend")) {
    fail(`현재 폴더가 backend가 아닐 수 있음: ${cwd}`);
    fail("반드시: cd backend 후 실행");
  } else {
    pass(`작업 폴더: ${cwd}`);
  }

  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) fail("SUPABASE_URL 없음 → backend/.env 파일 확인");
  else pass(`SUPABASE_URL: ${url}`);

  if (!anon) fail("SUPABASE_ANON_KEY 없음");
  else if (anon.startsWith("sb_")) fail("SUPABASE_ANON_KEY가 sb_ 형식 → Legacy eyJ... 키 사용");
  else if (!anon.startsWith("eyJ")) fail("SUPABASE_ANON_KEY 형식 이상 (eyJ로 시작해야 함)");
  else if (anon.length < 100) fail(`SUPABASE_ANON_KEY 너무 짧음 (${anon.length}자) — 한 줄 전체 복사`);
  else pass(`SUPABASE_ANON_KEY: ${anon.length}자`);

  if (!service) fail("SUPABASE_SERVICE_ROLE_KEY 없음");
  else if (service.startsWith("sb_")) fail("SERVICE_ROLE이 sb_ 형식 → Legacy eyJ... 키 사용");
  else if (!service.startsWith("eyJ")) fail("SERVICE_ROLE 형식 이상");
  else if (service.length < 100) fail(`SERVICE_ROLE 너무 짧음 (${service.length}자)`);
  else pass(`SUPABASE_SERVICE_ROLE_KEY: ${service.length}자`);

  if (url && anon) {
    const supabase = createClient(url, anon);
    const { data, error } = await supabase
      .from("classrooms")
      .select("id")
      .limit(1);
    if (error) fail(`Supabase 연결 실패: ${error.message}`);
    else pass("Supabase classrooms 조회 성공");
  }

  const port = process.env.PORT || 3000;
  try {
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await res.json();
    if (res.ok && body.success) {
      pass(`API 서버 실행 중 → http://localhost:${port}/api-docs`);
    } else {
      fail(`/health 응답 이상: ${res.status}`);
    }
  } catch {
    fail(`API 서버가 안 떠 있음 → 다른 터미널에서 npm run dev`);
    fail(`브라우저는 본인 PC에서 http://localhost:${port}/api-docs (남의 PC 주소 X)`);
  }

  console.log("\n--- 요약 ---");
  console.log(`통과: ${ok.length}, 실패: ${errors.length}`);
  if (errors.length) {
    console.log("\n팀원 체크:");
    console.log("1. git pull 후 폴더명 backend 인지 (LuckyChill-Backend-main X)");
    console.log("2. backend/.env 파일 위치 (루트 X)");
    console.log("3. npm run dev 켠 뒤 본인 localhost 접속");
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
