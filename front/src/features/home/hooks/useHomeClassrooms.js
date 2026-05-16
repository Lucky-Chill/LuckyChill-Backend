import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CLASSROOMS_BY_FLOOR } from '../../classroom/constants/classrooms';
import { resolveClassroomId } from '../../../constants/classroom';
import { getClassroomImageUrl } from '../../../utils/classroomImage';

/**
 * @typedef {Object} Classroom
 * @property {string} id - 강의실 ID
 * @property {string} roomName - 강의실 표시 이름
 * @property {string} floor - 층 정보
 * @property {number} capacity - 수용 인원
 * @property {string} equipment - 보유 장비
 */

/**
 * 홈 화면 강의실 목록 상태와 이동을 관리합니다.
 * @returns {{
 *   activeFloor: string,
 *   classrooms: Classroom[],
 *   setActiveFloor: (floor: string) => void,
 *   handleClassroomClick: (classroom: Classroom) => void
 * }}
 */
const useHomeClassrooms = () => {
  const navigate = useNavigate();
  const [activeFloor, setActiveFloor] = useState('3F');
  const classrooms = CLASSROOMS_BY_FLOOR[activeFloor];

  const handleClassroomClick = (classroom) => {
    const classroomId = resolveClassroomId(classroom.id);
    navigate('/reservation', {
      state: {
        classroomId,
        classroom: { ...classroom, apiId: classroomId },
        classroomImageUrl: getClassroomImageUrl(classroom.id),
      },
    });
  };

  return {
    activeFloor,
    classrooms,
    setActiveFloor,
    handleClassroomClick,
  };
};

export default useHomeClassrooms;
