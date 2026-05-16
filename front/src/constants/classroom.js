/** Supabase seed 강의실 — API 연동용 UUID */
export const DEFAULT_CLASSROOM_ID = '11111111-1111-1111-1111-111111111101';

/** 시드에 등록된 강의실 번호 → UUID */
export const SEEDED_CLASSROOM_IDS_BY_ROOM_NUMBER = {
  201: '11111111-1111-1111-1111-111111111101',
  301: '11111111-1111-1111-1111-111111111102',
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * 홈 더미 id(classroom-301 등) 또는 UUID 를 API용 classroomId 로 변환
 * @param {string|undefined} rawId
 * @returns {string}
 */
export function resolveClassroomId(rawId) {
  if (rawId && UUID_RE.test(rawId)) {
    return rawId;
  }

  const roomNumber = rawId?.match(/(\d{3})\s*$/)?.[1];
  if (roomNumber && SEEDED_CLASSROOM_IDS_BY_ROOM_NUMBER[Number(roomNumber)]) {
    return SEEDED_CLASSROOM_IDS_BY_ROOM_NUMBER[Number(roomNumber)];
  }

  return DEFAULT_CLASSROOM_ID;
}
