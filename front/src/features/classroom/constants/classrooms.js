const FLOOR_NUMBERS = [3, 4, 5];
const CLASSROOM_COUNT_BY_FLOOR = {
  3: 5,
  4: 10,
  5: 10,
};
const DEFAULT_CAPACITY = 30;

/**
 * 층별 강의실 목록
 * @description API 연동 전 홈/예약 화면에서 함께 사용하는 임시 강의실 데이터입니다.
 */
export const CLASSROOMS_BY_FLOOR = FLOOR_NUMBERS.reduce((classroomsByFloor, floor) => {
  const floorKey = `${floor}F`;

  classroomsByFloor[floorKey] = Array.from(
    { length: CLASSROOM_COUNT_BY_FLOOR[floor] },
    (_, index) => {
      const roomNumber = floor * 100 + index + 1;

      return {
        id: `classroom-${roomNumber}`,
        roomName: `강의실 ${roomNumber}`,
        floor: `${floor}층`,
        capacity: DEFAULT_CAPACITY,
        equipment: '빔프로젝터, 화이트보드',
      };
    },
  );

  return classroomsByFloor;
}, {});

export const FLOORS = Object.keys(CLASSROOMS_BY_FLOOR);

/**
 * 강의실 ID로 임시 강의실 데이터를 조회합니다.
 * @param {string} classroomId
 * @returns {{ id: string, roomName: string, floor: string, capacity: number, equipment: string }|undefined}
 */
export const findClassroomById = (classroomId) =>
  Object.values(CLASSROOMS_BY_FLOOR)
    .flat()
    .find((classroom) => classroom.id === classroomId);
