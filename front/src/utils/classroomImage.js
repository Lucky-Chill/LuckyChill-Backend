const CLASSROOM_IMAGE_COUNT = 7;

/**
 * 강의실 ID 기준으로 1~7 이미지 인덱스를 안정적으로 반환합니다.
 * (매 렌더마다 바뀌지 않으며, 카드와 예약 화면에서 동일합니다.)
 */
export function getClassroomImageIndex(classroomKey) {
  const key = String(classroomKey ?? '');
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % CLASSROOM_IMAGE_COUNT) + 1;
}

/** @param {string} classroomKey */
export function getClassroomImageUrl(classroomKey) {
  const index = getClassroomImageIndex(classroomKey);
  return `/classroom-images/${index}.jpg`;
}
