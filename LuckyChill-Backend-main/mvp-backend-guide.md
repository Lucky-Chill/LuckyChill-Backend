# 가천대 강의실 대여 백엔드 가이드

## 프로젝트 개요

- 가천대학교 컴퓨터공학과 강의실 대여 시스템
- 사용자: 강의실·날짜·시간 선택 후 신청서 작성
- 관리자: `PENDING` 신청 승인/반려
- 스택: Node.js, Express, Supabase (PostgreSQL + Auth)

## 화면 흐름

```text
화면1: classroomId, reservationDate, startTime, endTime 선택
  → GET /api/classrooms/:id
  → GET /api/classrooms/:id/unavailable-dates
  → GET /api/classrooms/:id/schedule?date=

화면2: 행사명, 인원, 행사종류, 기자재, 사유, 신청인/지도교수 입력
  → POST /api/reservations (화면1 값 + 화면2 값)

관리자: GET /api/admin/reservations → PATCH status
```

## 폴더 구조

```text
src/
  app.js
  server.js
  lib/supabase.js
  middlewares/
  controllers/
  routes/
  services/
  utils/
supabase/
  migrations/001_init.sql
  seed.sql
```

## Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_init.sql` 실행
3. `supabase/seed.sql` 실행
4. `.env`에 URL/키 입력 (`.env.example` 참고)
5. 관리자 계정: Auth 가입 후 `profiles.role = 'ADMIN'` 업데이트

## 실행

```bash
npm install
npm run dev
```

- Health: `GET http://localhost:3000/health`
- Swagger JSON: `GET http://localhost:3000/api-docs.json`

## MVP 우선 API

1. `GET /api/classrooms/:classroomId`
2. `GET /api/classrooms/:classroomId/schedule?date=`
3. `POST /api/reservations`

## 응답 규칙

- 성공: `{ success: true, data, error: null }`
- 실패: `{ success: false, data: null, error: { code, message } }`
