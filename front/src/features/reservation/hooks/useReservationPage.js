import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getClassroom, getSchedule, getUnavailableDates } from '../../../apis/classroomApi';
import { findClassroomById } from '../../classroom/constants/classrooms';
import { TIME_SLOTS } from '../constants/timeSlots';

const DEFAULT_CLASSROOM_ID = 'classroom-301';

/**
 * @typedef {Object} RoomInfoData
 * @property {string|number} location - 강의실 위치
 * @property {string|number} capacity - 수용 인원
 * @property {string} equipment - 장비 목록
 */

/**
 * @typedef {Object} ReservationData
 * @property {string} classroomId - 강의실 ID
 * @property {string|null} reservationDate - 예약 날짜
 * @property {string} startTime - 시작 시간
 * @property {string} endTime - 종료 시간
 */

/**
 * @typedef {Object} UseReservationPageResult
 * @property {string} roomName - 강의실 이름
 * @property {RoomInfoData} room - 강의실 정보
 * @property {number[]} unavailableDates - 예약 불가 날짜 목록
 * @property {string[]} reservedTimes - 예약 불가 시간 목록
 * @property {string|null} selectedDateStr - 선택 날짜 문자열
 * @property {string|null} startTime - 선택 시작 시간
 * @property {string|null} endTime - 선택 종료 시간
 * @property {boolean} canReserve - 예약 가능 여부
 * @property {boolean} isModalOpen - 예약 신청 모달 표시 여부
 * @property {ReservationData} reservationData - 예약 신청 기본 데이터
 * @property {(year: number, month: number) => void} handleMonthChange - 월 변경 핸들러
 * @property {(date: number, year: number, month: number) => void} handleDateSelect - 날짜 선택 핸들러
 * @property {(time: string) => void} handleTimeSelect - 시간 선택 핸들러
 * @property {() => void} handleCancel - 선택 취소 핸들러
 * @property {() => void} openReservationModal - 모달 열기 핸들러
 * @property {() => void} closeReservationModal - 모달 닫기 핸들러
 */

/**
 * "YYYY-MM-DD" 배열에서 일(day) 숫자만 추출합니다.
 * @param {string[]} dateStrings
 * @returns {number[]}
 */
const parseDayNumbers = (dateStrings = []) =>
  dateStrings.map((dateString) => Number(dateString.split('-')[2]));

/**
 * 날짜 값을 YYYY-MM-DD 문자열로 변환합니다.
 * @param {number} date
 * @param {number} year
 * @param {number} month - 1-based
 * @returns {string}
 */
const formatDateString = (date, year, month) =>
  `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

/**
 * 예약 페이지의 API 조회, 날짜/시간 선택, 모달 상태를 관리합니다.
 * @returns {UseReservationPageResult}
 */
const useReservationPage = () => {
  const { classroomId = DEFAULT_CLASSROOM_ID } = useParams();
  const { state } = useLocation();
  const fallbackClassroom = state?.classroom ?? findClassroomById(classroomId);
  const [roomData, setRoomData] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [reservedTimes, setReservedTimes] = useState([]);
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const today = new Date();

    Promise.all([
      getClassroom(classroomId),
      getUnavailableDates(classroomId, today.getFullYear(), today.getMonth() + 1),
    ])
      .then(([classroomRes, datesRes]) => {
        setRoomData(classroomRes.data);
        setUnavailableDates(parseDayNumbers(datesRes.data?.unavailableDates));
      })
      .catch((error) => {
        console.error(error);
        setRoomData(null);
        setUnavailableDates([]);
      });
  }, [classroomId]);

  const handleMonthChange = (year, month) => {
    getUnavailableDates(classroomId, year, month)
      .then((res) => setUnavailableDates(parseDayNumbers(res.data?.unavailableDates)))
      .catch((error) => {
        console.error(error);
        setUnavailableDates([]);
      });
  };

  const handleDateSelect = (date, year, month) => {
    setStartTime(null);
    setEndTime(null);

    const dateStr = formatDateString(date, year, month);
    setSelectedDateStr(dateStr);

    getSchedule(classroomId, dateStr)
      .then((res) => {
        const reserved = (res.data?.timeSlots ?? [])
          .filter((slot) => slot.status === 'UNAVAILABLE')
          .map((slot) => slot.startTime.slice(0, 2));
        setReservedTimes(reserved);
      })
      .catch((error) => {
        console.error(error);
        setReservedTimes([]);
      });
  };

  const handleTimeSelect = (time) => {
    if (!startTime || (startTime && endTime)) {
      setStartTime(time);
      setEndTime(null);
      return;
    }

    const start = Number(startTime);
    const end = Number(time);

    if (end <= start) {
      setStartTime(time);
      setEndTime(null);
      return;
    }

    const hasBlockedTime = TIME_SLOTS.some((timeSlot) => {
      const timeNumber = Number(timeSlot);
      return timeNumber >= start && timeNumber <= end && reservedTimes.includes(timeSlot);
    });

    if (hasBlockedTime) {
      alert('선택 범위에 예약 불가 시간이 포함되어 있습니다.');
      return;
    }

    setEndTime(time);
  };

  const handleCancel = () => {
    setSelectedDateStr(null);
    setStartTime(null);
    setEndTime(null);
  };

  const openReservationModal = () => setIsModalOpen(true);
  const closeReservationModal = () => setIsModalOpen(false);
  const canReserve = selectedDateStr !== null && startTime !== null && endTime !== null;
  const roomName = roomData?.name ?? fallbackClassroom?.roomName ?? '강의실 301';
  const roomFloor = roomData?.floor ?? fallbackClassroom?.floor ?? '-';
  const roomCapacity = roomData?.capacity ?? fallbackClassroom?.capacity ?? '-';
  const roomEquipment = roomData?.equipment?.join(', ') ?? fallbackClassroom?.equipment ?? '-';
  const room = {
    location: roomFloor,
    capacity: roomCapacity,
    equipment: roomEquipment,
  };
  const reservationData = {
    classroomId,
    reservationDate: selectedDateStr,
    startTime: `${startTime}:00`,
    endTime: `${endTime}:00`,
  };

  return {
    roomName,
    room,
    unavailableDates,
    reservedTimes,
    selectedDateStr,
    startTime,
    endTime,
    canReserve,
    isModalOpen,
    reservationData,
    handleMonthChange,
    handleDateSelect,
    handleTimeSelect,
    handleCancel,
    openReservationModal,
    closeReservationModal,
  };
};

export default useReservationPage;
