-- Enums
CREATE TYPE event_type AS ENUM ('CLASS', 'SELF_STUDY', 'STUDY_GROUP', 'ETC');
CREATE TYPE reservation_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- Profiles (auth.users 연동, 역할 관리)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Classrooms
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  floor TEXT NOT NULL,
  capacity INT NOT NULL,
  equipment TEXT[] NOT NULL DEFAULT '{}',
  has_projector BOOLEAN NOT NULL DEFAULT FALSE,
  has_computer BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Class schedules (정규 수업 시간표)
CREATE TABLE class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  professor_name TEXT NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  semester TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (start_time < end_time)
);

CREATE INDEX idx_class_schedules_classroom_day
  ON class_schedules (classroom_id, day_of_week);

-- Reservations
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  participant_info TEXT NOT NULL,
  event_type event_type NOT NULL,
  event_type_etc TEXT,
  use_projector BOOLEAN NOT NULL DEFAULT FALSE,
  use_computer BOOLEAN NOT NULL DEFAULT FALSE,
  extra_equipment TEXT DEFAULT '',
  reason TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_department TEXT NOT NULL,
  applicant_student_id TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  professor_name TEXT NOT NULL,
  professor_phone TEXT NOT NULL,
  status reservation_status NOT NULL DEFAULT 'PENDING',
  admin_memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (start_time < end_time)
);

CREATE INDEX idx_reservations_classroom_date
  ON reservations (classroom_id, reservation_date);

CREATE INDEX idx_reservations_approved_overlap
  ON reservations (classroom_id, reservation_date, start_time, end_time)
  WHERE status = 'APPROVED';

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- classrooms: 인증 사용자 조회
CREATE POLICY classrooms_select_authenticated ON classrooms
  FOR SELECT TO authenticated USING (true);

-- class_schedules: 인증 사용자 조회
CREATE POLICY class_schedules_select_authenticated ON class_schedules
  FOR SELECT TO authenticated USING (true);

-- reservations: 본인 조회/생성
CREATE POLICY reservations_select_own ON reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY reservations_insert_own ON reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- reservations: 관리자 전체 조회/상태 변경
CREATE POLICY reservations_admin_select ON reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

CREATE POLICY reservations_admin_update ON reservations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
    )
  );

-- Service role bypasses RLS (Express server uses service role for admin ops)

-- Auth 가입 시 profiles 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    'USER'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
