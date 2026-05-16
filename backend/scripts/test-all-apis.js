/**
 * MVP API 전체 스모크 테스트
 * 사용: node scripts/test-all-apis.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const { createClient } = require("@supabase/supabase-js");

const BASE = `http://localhost:${process.env.PORT || 3000}`;
const API = `${BASE}/api`;
const CLASSROOM_ID = "11111111-1111-1111-1111-111111111101";

const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const tag = ok ? "PASS" : "FAIL";
  console.log(`[${tag}] ${name}${detail ? ` — ${detail}` : ""}`);
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { res, body };
}

async function main() {
  // 1. Health
  try {
    const { res, body } = await fetchJson(`${BASE}/health`);
    record(
      "1. GET /health",
      res.status === 200 && body?.success === true,
      `status=${res.status}`
    );
  } catch (e) {
    record("1. GET /health", false, e.message);
  }

  // 2. Classroom detail
  try {
    const { res, body } = await fetchJson(`${API}/classrooms/${CLASSROOM_ID}`);
    record(
      "2. GET /api/classrooms/:id",
      res.status === 200 && body?.data?.name,
      body?.data?.name || `status=${res.status}`
    );
  } catch (e) {
    record("2. GET /api/classrooms/:id", false, e.message);
  }

  // 3. Unavailable dates
  try {
    const { res, body } = await fetchJson(
      `${API}/classrooms/${CLASSROOM_ID}/unavailable-dates?year=2026&month=5`
    );
    record(
      "3. GET /api/classrooms/:id/unavailable-dates",
      res.status === 200 && Array.isArray(body?.data?.unavailableDates),
      `dates=${body?.data?.unavailableDates?.length ?? "?"}`
    );
  } catch (e) {
    record("3. GET unavailable-dates", false, e.message);
  }

  // 4. Schedule
  try {
    const { res, body } = await fetchJson(
      `${API}/classrooms/${CLASSROOM_ID}/schedule?date=2026-05-28`
    );
    const slots = body?.data?.timeSlots;
    record(
      "4. GET /api/classrooms/:id/schedule",
      res.status === 200 && Array.isArray(slots) && slots.length > 0,
      `slots=${slots?.length ?? 0}`
    );
  } catch (e) {
    record("4. GET schedule", false, e.message);
  }

  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;
  if (!email || !password) {
    record("5–8. 인증 필요 API", false, ".env에 TEST_EMAIL, TEST_PASSWORD 없음");
    printSummary();
    process.exit(1);
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.session) {
    record("5. Supabase 로그인", false, authError?.message);
    printSummary();
    process.exit(1);
  }
  record("5. Supabase 이메일 로그인", true, email);

  const token = authData.session.access_token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  // 6. POST reservation
  let reservationId = null;
  try {
    const body = {
      classroomId: CLASSROOM_ID,
      reservationDate: "2026-06-10",
      startTime: "09:00",
      endTime: "10:00",
      title: "API 전체 테스트",
      participantInfo: "테스트",
      eventType: "STUDY_GROUP",
      eventTypeEtc: null,
      useProjector: false,
      useComputer: false,
      extraEquipment: "",
      reason: "스모크 테스트",
      applicantName: "테스트",
      applicantDepartment: "컴퓨터공학과",
      applicantStudentId: "20249999",
      applicantPhone: "010-0000-0000",
      professorName: "교수",
      professorPhone: "010-1111-1111"
    };
    const { res, body: resBody } = await fetchJson(`${API}/reservations`, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
    reservationId = resBody?.data?.reservationId;
    const ok =
      (res.status === 201 || res.status === 200) &&
      resBody?.success &&
      resBody?.data?.status === "PENDING";
    record(
      "6. POST /api/reservations",
      ok,
      ok ? `id=${reservationId}` : `${res.status} ${resBody?.error?.message}`
    );
  } catch (e) {
    record("6. POST /api/reservations", false, e.message);
  }

  // 7. GET my reservations
  try {
    const { res, body } = await fetchJson(`${API}/reservations/me`, { headers });
    const list = body?.data?.reservations ?? body?.data;
    const count = Array.isArray(list) ? list.length : 0;
    record(
      "7. GET /api/reservations/me",
      res.status === 200 && body?.success,
      `count=${count}`
    );
  } catch (e) {
    record("7. GET /api/reservations/me", false, e.message);
  }

  // 8. Admin list
  try {
    const { res, body } = await fetchJson(
      `${API}/admin/reservations?status=PENDING`,
      { headers }
    );
    if (res.status === 403) {
      record(
        "8. GET /api/admin/reservations",
        true,
        "USER 계정 → 403 예상 (ADMIN이면 200 필요)"
      );
    } else if (res.status === 200 && body?.success) {
      record(
        "8. GET /api/admin/reservations",
        true,
        `ADMIN 계정, pending=${body?.data?.reservations?.length ?? "?"}`
      );

      // 9. PATCH approve (only if admin and we have reservationId)
      if (reservationId) {
        const { res: patchRes, body: patchBody } = await fetchJson(
          `${API}/admin/reservations/${reservationId}/status`,
          {
            method: "PATCH",
            headers,
            body: JSON.stringify({ status: "APPROVED", adminMemo: "테스트 승인" })
          }
        );
        record(
          "9. PATCH /api/admin/reservations/:id/status",
          patchRes.status === 200 && patchBody?.success,
          `status=${patchRes.status} ${patchBody?.error?.message || patchBody?.data?.status || ""}`
        );
      }
    } else {
      record(
        "8. GET /api/admin/reservations",
        false,
        `${res.status} ${body?.error?.message}`
      );
    }
  } catch (e) {
    record("8. GET /api/admin/reservations", false, e.message);
  }

  // 10. Google OAuth (백엔드 라우트 없음 — 404 예상)
  try {
    const { res } = await fetchJson(`${API}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "x@test.com", name: "x" })
    });
    record(
      "10. POST /api/auth/google (미연결)",
      res.status === 404,
      `status=${res.status} (404면 정상 — Supabase OAuth 사용)`
    );
  } catch (e) {
    record("10. POST /api/auth/google", false, e.message);
  }

  printSummary();
  const failed = results.filter((r) => !r.ok).length;
  process.exit(failed > 0 ? 1 : 0);
}

function printSummary() {
  const passed = results.filter((r) => r.ok).length;
  console.log(`\n--- 요약: ${passed}/${results.length} 통과 ---`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
