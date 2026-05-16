-- Seed: 강의실 및 수업 시간표 (Supabase SQL Editor에서 migration 후 실행)
-- 고정 UUID로 API 테스트 용이

INSERT INTO classrooms (id, name, floor, capacity, equipment, has_projector, has_computer)
VALUES
  (
    '11111111-1111-1111-1111-111111111101',
    '강의실 201',
    '2층',
    30,
    ARRAY['빔프로젝터', '화이트보드'],
    TRUE,
    FALSE
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    '강의실 301',
    '3층',
    40,
    ARRAY['빔프로젝터', '화이트보드', '전자교탁'],
    TRUE,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- 월요일(1) 10:00-12:00 수업 (강의실 201)
INSERT INTO class_schedules (
  classroom_id, title, professor_name, day_of_week, start_time, end_time, semester
)
VALUES
  (
    '11111111-1111-1111-1111-111111111101',
    '자료구조',
    '김교수',
    1,
    '10:00',
    '12:00',
    '2026-1'
  ),
  (
    '11111111-1111-1111-1111-111111111101',
    '운영체제',
    '이교수',
    3,
    '14:00',
    '16:00',
    '2026-1'
  )
ON CONFLICT DO NOTHING;

-- reservations는 auth.users 생성 후 앱에서 INSERT
-- 테스트 관리자: Supabase Auth 가입 후 profiles.role = 'ADMIN' 으로 업데이트
