# 프론트엔드 연동 가이드 (백엔드 → FE 전달용)

가천대학교 컴퓨터공학과 **강의실 대여 시스템** 백엔드 API 연동 문서입니다.

---

## 1. 연결 정보

| 항목 | 값 |
|------|-----|
| API Base URL (로컬) | `http://localhost:3000/api` |
| Health Check | `http://localhost:3000/health` |
| Swagger JSON | `http://localhost:3000/api-docs.json` |
| 상세 API 명세 | 레포 내 `api-spec-mvp.md` |

> 백엔드 서버 실행: `backend` 폴더에서 `npm run dev`  
> 프론트 연동 전에 백엔드 담당자에게 서버 실행 여부 확인

---

## 2. Supabase (프론트 Auth)

프론트는 **백엔드와 동일한 Supabase 프로젝트**를 사용합니다.

| 항목 | 값 |
|------|-----|
| Project URL | `https://kuznvdykikdriublizve.supabase.co` |
| 프론트에 줄 키 | **anon public key 만** (Legacy `eyJ...` 형식) |

**절대 프론트에 주지 말 것**

- `service_role` 키
- `.env` 파일 전체
- Database password

### 로그인 후 API 호출

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kuznvdykikdriublizve.supabase.co",
  "YOUR_ANON_KEY"
);

const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "password"
});

const accessToken = data.session.access_token;

const res = await fetch("http://localhost:3000/api/reservations/me", {
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});
```

---

## 3. 공통 규칙

### Content-Type

`application/json`

### 응답 형식 (모든 API 공통)

성공:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

실패:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "BAD_REQUEST",
    "message": "에러 메시지"
  }
}
```

### 에러 코드

| code | HTTP | 설명 |
|------|------|------|
| BAD_REQUEST | 400 | 요청값 오류 |
| UNAUTHORIZED | 401 | 로그인 필요 / 토큰 무효 |
| FORBIDDEN | 403 | 권한 없음 (관리자 전용 등) |
| NOT_FOUND | 404 | 리소스 없음 |
| CONFLICT | 409 | 시간 겹침 등 |
| CONFIG_ERROR | 500 | 서버 Supabase 설정 오류 |
| INTERNAL_SERVER_ERROR | 500 | 서버 오류 |

### 네이밍

- DB: `snake_case`
- API 요청/응답: **camelCase** (`reservationDate`, `classroomId`, `hasProjector` 등)

### 인증이 필요한 API

Header:

```http
Authorization: Bearer {supabase_access_token}
```

---

## 4. 화면 흐름 (중요)

### 화면 1 — 강의실·날짜·시간 선택

사용자가 선택한 값을 **state로 보관**합니다.

- `classroomId`
- `reservationDate` (예: `2026-05-28`)
- `startTime` (예: `14:00`)
- `endTime` (예: `16:00`)

호출 API:

1. `GET /classrooms/:classroomId` — 강의실 정보
2. `GET /classrooms/:classroomId/unavailable-dates?year=2026&month=5` — 달력 회색 처리용
3. `GET /classrooms/:classroomId/schedule?date=YYYY-MM-DD` — 시간 슬롯 표시용

### 화면 2 — 신청서 작성

**일시/장소는 입력받지 않음** (화면 1에서 선택한 값 사용).

입력 필드:

- 행사명 (`title`)
- 참여대상/인원 (`participantInfo`)
- 행사종류 (`eventType`, `eventTypeEtc`)
- 기자재 (`useProjector`, `useComputer`, `extraEquipment`)
- 신청 사유 (`reason`)
- 신청인 정보 (`applicantName`, `applicantDepartment`, `applicantStudentId`, `applicantPhone`)
- 지도교수 (`professorName`, `professorPhone`)

제출 시:

- `POST /reservations`
- Body = **화면 1 네 필드 + 화면 2 필드** 를 합쳐서 전송
- 성공 시 `status: "PENDING"`

---

## 5. 테스트 데이터

| 항목 | 값 |
|------|-----|
| 테스트 강의실 ID | `11111111-1111-1111-1111-111111111101` |
| 강의실 이름 | 강의실 201 |
| 테스트 날짜 예시 | `2026-05-28` |

시간 슬롯 `status`:

- `AVAILABLE` — 예약 가능
- `UNAVAILABLE` — 불가 (`reason`: `CLASS` | `RESERVATION` | `PENDING`)

---

## 6. API 목록

### 6-1. 강의실 정보 조회

```http
GET /api/classrooms/:classroomId
```

인증: 불필요

Response `data` 예시:

```json
{
  "id": "11111111-1111-1111-1111-111111111101",
  "name": "강의실 201",
  "floor": "2층",
  "capacity": 30,
  "equipment": ["빔프로젝터", "화이트보드"],
  "hasProjector": true,
  "hasComputer": false,
  "createdAt": "2026-05-16T10:59:19.339093+00:00"
}
```

---

### 6-2. 월별 예약 불가 날짜

```http
GET /api/classrooms/:classroomId/unavailable-dates?year=2026&month=5
```

인증: 불필요

Response `data` 예시:

```json
{
  "classroomId": "11111111-1111-1111-1111-111111111101",
  "year": 2026,
  "month": 5,
  "unavailableDates": ["2026-05-13"]
}
```

---

### 6-3. 특정 날짜 시간표

```http
GET /api/classrooms/:classroomId/schedule?date=2026-05-28
```

인증: 불필요

Response `data` 예시:

```json
{
  "classroomId": "11111111-1111-1111-1111-111111111101",
  "date": "2026-05-28",
  "timeSlots": [
    {
      "startTime": "09:00",
      "endTime": "10:00",
      "status": "AVAILABLE"
    },
    {
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "UNAVAILABLE",
      "reason": "CLASS"
    }
  ]
}
```

---

### 6-4. 예약 신청 생성

```http
POST /api/reservations
Authorization: Bearer {token}
Content-Type: application/json
```

Request Body:

```json
{
  "classroomId": "11111111-1111-1111-1111-111111111101",
  "reservationDate": "2026-05-28",
  "startTime": "09:00",
  "endTime": "10:00",
  "title": "알고리즘 스터디",
  "participantInfo": "교수 외 학생 10명",
  "eventType": "STUDY_GROUP",
  "eventTypeEtc": null,
  "useProjector": true,
  "useComputer": false,
  "extraEquipment": "",
  "reason": "팀 프로젝트 회의",
  "applicantName": "홍길동",
  "applicantDepartment": "컴퓨터공학과",
  "applicantStudentId": "20240001",
  "applicantPhone": "010-0000-0000",
  "professorName": "김교수",
  "professorPhone": "010-1111-1111"
}
```

Response `data` 예시:

```json
{
  "reservationId": "uuid",
  "status": "PENDING"
}
```

검증:

- `eventType` 이 `ETC` 이면 `eventTypeEtc` 필수
- 선택 시간이 `schedule` 에서 `AVAILABLE` 이어야 함 (아니면 409)

---

### 6-5. 내 예약 목록

```http
GET /api/reservations/me
Authorization: Bearer {token}
```

Response `data` 예시 (배열):

```json
[
  {
    "id": "uuid",
    "classroomName": "강의실 201",
    "reservationDate": "2026-05-28",
    "startTime": "09:00",
    "endTime": "10:00",
    "title": "알고리즘 스터디",
    "status": "PENDING"
  }
]
```

---

### 6-6. 관리자 — 예약 신청 목록

```http
GET /api/admin/reservations?status=PENDING
Authorization: Bearer {token}
```

요구: `profiles.role = 'ADMIN'` (Supabase에서 설정)

Response `data` 예시 (배열):

```json
[
  {
    "id": "uuid",
    "classroomName": "강의실 201",
    "reservationDate": "2026-05-28",
    "startTime": "09:00",
    "endTime": "10:00",
    "title": "알고리즘 스터디",
    "applicantName": "홍길동",
    "applicantDepartment": "컴퓨터공학과",
    "status": "PENDING"
  }
]
```

---

### 6-7. 관리자 — 승인 / 반려

```http
PATCH /api/admin/reservations/:reservationId/status
Authorization: Bearer {token}
Content-Type: application/json
```

Request Body:

```json
{
  "status": "APPROVED",
  "adminMemo": "예약 승인"
}
```

`status` 허용값: `APPROVED` | `REJECTED` | `CANCELLED`

Response `data` 예시:

```json
{
  "reservationId": "uuid",
  "status": "APPROVED"
}
```

승인 시 동일 강의실·날짜·시간에 이미 `APPROVED` 예약이 있으면 **409 CONFLICT**.

---

## 7. Enum 값

### eventType (요청)

| 값 | 설명 |
|----|------|
| CLASS | 수업 |
| SELF_STUDY | 자습 |
| STUDY_GROUP | 스터디 그룹 |
| ETC | 기타 (`eventTypeEtc` 필수) |

### reservation status (응답)

| 값 | 설명 |
|----|------|
| PENDING | 승인 대기 |
| APPROVED | 승인 완료 |
| REJECTED | 반려 |
| CANCELLED | 취소 |

---

## 8. 프론트 fetch 예시 (TypeScript 스타일)

```typescript
const API_BASE = "http://localhost:3000/api";

async function apiGet(path: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  return res.json();
}

async function apiPost(path: string, body: unknown, token: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

// 화면1
const classroom = await apiGet("/classrooms/11111111-1111-1111-1111-111111111101");
const schedule = await apiGet(
  "/classrooms/11111111-1111-1111-1111-111111111101/schedule?date=2026-05-28"
);

// 화면2 제출
const result = await apiPost("/reservations", { /* merge body */ }, accessToken);
```

---

## 9. 관리자 계정 설정 (백엔드/DB)

Supabase SQL Editor:

```sql
UPDATE profiles
SET role = 'ADMIN'
WHERE email = '관리자@이메일.com';
```

---

## 10. 연동 시 자주 나는 문제

| 증상 | 원인 | 해결 |
|------|------|------|
| Network Error / 연결 실패 | 백엔드 서버 꺼짐 | `npm run dev` 실행 확인 |
| 401 Unauthorized | 토큰 없음/만료 | Supabase 재로그인 |
| 403 Forbidden | 관리자 아님 | `profiles.role = ADMIN` |
| 404 강의실 없음 | 잘못된 classroomId | 테스트 ID 사용 |
| 409 CONFLICT | 시간 겹침 | 다른 시간대 선택 |
| CORS | (현재 서버 cors 전체 허용) | 백엔드에 문의 |

---

## 11. 백엔드 담당자 연락 시 포함할 정보

버그/연동 이슈 시 아래를 캡처해서 전달:

1. Request URL + Method
2. Request Headers (토큰은 마스킹)
3. Request Body
4. Response JSON 전체
5. 재현 화면 (화면1 / 화면2 / 관리자)

---

## 12. 관련 파일 (레포)

| 파일 | 설명 |
|------|------|
| `api-spec-mvp.md` | API 상세 명세 |
| `mvp-backend-guide.md` | 백엔드 실행/Supabase 설정 |
| `supabase/migrations/001_init.sql` | DB 스키마 |
| `supabase/seed.sql` | 샘플 데이터 |
| `convention.md` | 코드 컨벤션 |

---

## 13. 백엔드 로컬 테스트 (참고)

```bash
cd backend
npm run dev
npm run test:reservation
```

`.env`에 `TEST_EMAIL`, `TEST_PASSWORD` 필요 (백엔드 전용, FE에 공유 X).

---

**문서 버전:** MVP 1.0  
**최종 업데이트:** 2026-05-16
