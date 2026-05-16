/**
 * 홈 카드에서 전달된 강의실 객체 → 예약 페이지 roomData 형식
 * @param {Object | undefined} classroom
 * @returns {{ name: string, floor: string, capacity: number, equipment: string[] } | null}
 */
export function mapHomeClassroomToRoomData(classroom) {
  if (!classroom) return null;

  let equipment = [];
  if (Array.isArray(classroom.equipment)) {
    equipment = classroom.equipment;
  } else if (typeof classroom.equipment === 'string' && classroom.equipment) {
    equipment = classroom.equipment.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return {
    name: classroom.roomName ?? classroom.name ?? '',
    floor: classroom.floor ?? '',
    capacity: classroom.capacity ?? 0,
    equipment,
  };
}

/**
 * @param {string[] | string | undefined} equipment
 */
export function formatEquipment(equipment) {
  if (Array.isArray(equipment)) {
    return equipment.length > 0 ? equipment.join(', ') : '-';
  }
  if (typeof equipment === 'string' && equipment.trim()) {
    return equipment;
  }
  return '-';
}
