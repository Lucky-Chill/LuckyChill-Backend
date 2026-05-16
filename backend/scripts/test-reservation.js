/**
 * 로컬 예약 API 테스트: 로그인 → POST /api/reservations → GET /api/reservations/me
 * 사용: node scripts/test-reservation.js
 * .env에 TEST_EMAIL, TEST_PASSWORD 설정 필요
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { createClient } = require("@supabase/supabase-js");

const API_BASE = `http://localhost:${process.env.PORT || 3000}/api`;

async function main() {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    console.error("FAIL: .env에 TEST_EMAIL, TEST_PASSWORD를 넣어주세요.");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.session) {
    console.error("FAIL: 로그인 실패 -", authError?.message);
    process.exit(1);
  }

  const token = authData.session.access_token;
  console.log("OK: 로그인 성공");

  const reservationBody = {
    classroomId: "11111111-1111-1111-1111-111111111101",
    reservationDate: "2026-05-28",
    startTime: "09:00",
    endTime: "10:00",
    title: "알고리즘 스터디",
    participantInfo: "교수 외 학생 10명",
    eventType: "STUDY_GROUP",
    eventTypeEtc: null,
    useProjector: true,
    useComputer: false,
    extraEquipment: "",
    reason: "팀 프로젝트 회의",
    applicantName: "조윤재",
    applicantDepartment: "컴퓨터공학과",
    applicantStudentId: "20240001",
    applicantPhone: "010-0000-0000",
    professorName: "홍길동",
    professorPhone: "010-1111-1111"
  };

  const createRes = await fetch(`${API_BASE}/reservations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reservationBody)
  });

  const createJson = await createRes.json();
  console.log("\n--- POST /api/reservations ---");
  console.log(JSON.stringify(createJson, null, 2));

  if (!createJson.success) {
    process.exit(1);
  }

  const meRes = await fetch(`${API_BASE}/reservations/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meJson = await meRes.json();
  console.log("\n--- GET /api/reservations/me ---");
  console.log(JSON.stringify(meJson, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
