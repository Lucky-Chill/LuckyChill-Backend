# 가천대 강의실 대여 API 명세 (MVP)

## 공통 규칙

- Base URL: `/api`
- DB 컬럼: `snake_case`
- API 응답: `camelCase`
- 응답 포맷:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## 화면 흐름

1. 화면1: `classroomId`, `reservationDate`, `startTime`, `endTime` 선택
2. 화면2: 신청서 필드 입력 (일시/장소 제외)
3. `POST /api/reservations` 시 화면1 + 화면2 필드 합쳐서 전송

---

## 1. GET `/classrooms/:classroomId`

강의실 정보 조회.

Response 200:

```json
{
  "success": true,
  "data": {
    "id": "classroom-uuid",
    "name": "강의실 201",
    "floor": "2층",
    "capacity": 30,
    "equipment": ["빔프로젝터", "화이트보드"],
    "hasProjector": true,
    "hasComputer": false
  },
  "error": null
}
```

---

## 2. GET `/classrooms/:classroomId/unavailable-dates?year=2026&month=5`

월별 예약 불가 날짜 (달력 회색 처리).

Response 200:

```json
{
  "success": true,
  "data": {
    "classroomId": "classroom-uuid",
    "year": 2026,
    "month": 5,
    "unavailableDates": ["2026-05-13"]
  },
  "error": null
}
```

---

## 3. GET `/classrooms/:classroomId/schedule?date=2026-05-28`

특정 날짜 시간 슬롯.

Response 200:

```json
{
  "success": true,
  "data": {
    "classroomId": "classroom-uuid",
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
  },
  "error": null
}
```

`reason`: `CLASS` | `RESERVATION` | `PENDING`

---

## 4. POST `/reservations`

예약 신청 생성. `Authorization: Bearer <token>` 필요.

Request:

```json
{
  "classroomId": "classroom-uuid",
  "reservationDate": "2026-05-28",
  "startTime": "14:00",
  "endTime": "16:00",
  "title": "알고리즘 스터디",
  "participantInfo": "교수 외 학생 10명",
  "eventType": "STUDY_GROUP",
  "eventTypeEtc": null,
  "useProjector": true,
  "useComputer": false,
  "extraEquipment": "",
  "reason": "팀 프로젝트 회의",
  "applicantName": "조윤재",
  "applicantDepartment": "컴퓨터공학과",
  "applicantStudentId": "2024XXXX",
  "applicantPhone": "010-0000-0000",
  "professorName": "홍길동",
  "professorPhone": "010-1111-1111"
}
```

Response 201:

```json
{
  "success": true,
  "data": {
    "reservationId": "reservation-uuid",
    "status": "PENDING"
  },
  "error": null
}
```

---

## 5. GET `/reservations/me`

내 예약 목록. 인증 필요.

---

## 6. GET `/admin/reservations?status=PENDING`

관리자 대기 목록. `ADMIN` 역할 필요.

---

## 7. PATCH `/admin/reservations/:reservationId/status`

관리자 승인/반려.

Request:

```json
{
  "status": "APPROVED",
  "adminMemo": "예약 승인"
}
```

승인 시 동일 강의실·날짜·시간대 `APPROVED` 예약과 겹치면 `409 CONFLICT`.

---

## Enum

**eventType**: `CLASS`, `SELF_STUDY`, `STUDY_GROUP`, `ETC`

**status**: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`
