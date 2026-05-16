/**
 * 강의실 예약 기능의 메인 컴포넌트
 * @description 예약 상태(날짜, 시간)를 관리하고 하위 컴포넌트를 조합합니다.
 *              화면 1 → 화면 2 흐름: 날짜·시간 선택 후 ReservationFormModal로 예약 정보 전달.
 */
import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import TimeSelector from './TimeSelector';
import RoomInfo from './RoomInfo';
import ReservationButtons from './ReservationButtons';
import ReservationFormModal from './ReservationFormModal';
import { useLocation, useParams } from 'react-router-dom';
import { getClassroom, getUnavailableDates, getSchedule } from '../../apis/classroomApi';
import { DEFAULT_CLASSROOM_ID, resolveClassroomId } from '../../constants/classroom';
import { getClassroomImageUrl } from '../../utils/classroomImage';
import { formatEquipment, mapHomeClassroomToRoomData } from './utils/roomData';

const TIME_SLOTS = [
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
];

/**
 * 강의실 예약 페이지 컴포넌트
 * @description 날짜·시간 선택 상태를 통합 관리하며, 예약 가능 여부를 판단합니다.
 */
const ReservationPage = () => {
  const location = useLocation();
  const { classroomId: classroomIdParam } = useParams();
  const classroomId = resolveClassroomId(
    location.state?.classroomId ?? classroomIdParam ?? DEFAULT_CLASSROOM_ID,
  );
  const classroomImageKey = location.state?.classroom?.id ?? classroomId;
  const classroomImageUrl =
    location.state?.classroomImageUrl ?? getClassroomImageUrl(classroomImageKey);

  const [roomData, setRoomData] = useState(() =>
    mapHomeClassroomToRoomData(location.state?.classroom),
  );
  const [unavailableDateStrings, setUnavailableDateStrings] = useState([]);
  const [reservedTimes, setReservedTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 홈에서 넘어온 경우 즉시 표시 후, 서버 데이터로 보정
  useEffect(() => {
    const preview = mapHomeClassroomToRoomData(location.state?.classroom);
    if (preview) {
      setRoomData(preview);
    }

    let cancelled = false;
    getClassroom(classroomId)
      .then((classroomRes) => {
        if (!cancelled && classroomRes.data) {
          setRoomData(classroomRes.data);
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [classroomId, location.state?.classroom]);

  // 캘린더 불가 날짜는 별도 로드 (강의실 정보 렌더를 막지 않음)
  useEffect(() => {
    const today = new Date();
    let cancelled = false;

    getUnavailableDates(classroomId, today.getFullYear(), today.getMonth() + 1)
      .then((datesRes) => {
        if (!cancelled) {
          setUnavailableDateStrings(datesRes.data?.unavailableDates ?? []);
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [classroomId]);

  /**
   * 월 변경 시 해당 월의 불가 날짜 재조회
   * @param {number} year
   * @param {number} month - 1-based
   */
  const handleMonthChange = (year, month) => {
    getUnavailableDates(classroomId, year, month)
      .then((res) => setUnavailableDateStrings(res.data?.unavailableDates ?? []))
      .catch(console.error);
  };

  /**
   * 날짜 선택 시 해당 날짜의 시간 슬롯 상태 조회
   * @param {number} date - 일(day) 숫자
   * @param {number} year
   * @param {number} month - 1-based
   */
  const handleDateSelect = (date, year, month) => {
    setSelectedDate(date);
    setStartTime(null);
    setEndTime(null);

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    setSelectedDateStr(dateStr);

    getSchedule(classroomId, dateStr)
      .then((res) => {
        // UNAVAILABLE 슬롯의 startTime 시간(HH)만 추출 → "09:00" → "09"
        const reserved = res.data.timeSlots
          .filter((slot) => slot.status === 'UNAVAILABLE')
          .map((slot) => slot.startTime.slice(0, 2));
        setReservedTimes(reserved);
      })
      .catch(console.error);
  };

  /**
   * 시간 슬롯 선택 핸들러
   * startTime+endTime 모두 있거나 startTime이 없을 때 → 새 startTime 설정
   * startTime만 있을 때 → endTime 설정 (예약불가 범위 포함 시 alert)
   * @param {string} time - "09" ~ "22"
   */
  const handleTimeSelect = (time) => {
    if (!startTime || (startTime && endTime)) {
      setStartTime(time);
      setEndTime(null);
      return;
    }

    const s = parseInt(startTime);
    const e = parseInt(time);

    if (e < s) {
      setStartTime(time);
      setEndTime(null);
      return;
    }

    const blocked = TIME_SLOTS.filter((ts) => {
      const n = parseInt(ts);
      return n >= s && n <= e && reservedTimes.includes(ts);
    });

    if (blocked.length > 0) {
      alert('선택 범위에 예약 불가 시간이 포함되어 있습니다.');
      return;
    }

    setEndTime(time);
  };

  const handleCancel = () => {
    setSelectedDate(null);
    setSelectedDateStr(null);
    setStartTime(null);
    setEndTime(null);
  };

  const canReserve = selectedDate !== null && startTime !== null && endTime !== null;

  return (
    <div className='w-full pt-12 pb-16'>
      {/* Room Header */}
      <h1 className='m-0 text-base leading-6 font-bold tracking-normal text-[#111827]'>
        {roomData?.name || '강의실'} 예약
      </h1>

      {/* Room Image */}
      <div className='mt-10 h-[360px] overflow-hidden rounded-lg bg-white shadow-[0_8px_22px_-16px_rgb(0_0_0_/_0.2)]'>
        <img
          src={classroomImageUrl}
          alt={`${roomData?.name ?? '강의실'} 이미지`}
          className='size-full object-cover'
        />
      </div>

      {/* Room Info */}
      <RoomInfo
        room={{
          location: roomData?.floor || '-',
          capacity: roomData?.capacity ?? '-',
          equipment: formatEquipment(roomData?.equipment),
        }}
      />

      {/* Calendar Section */}
      <div className='mt-8 rounded-lg bg-white px-8 py-8'>
        <Calendar
          disabledDateStrings={unavailableDateStrings}
          reservedDateStrings={[]}
          selectedDateStr={selectedDateStr}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
        />
      </div>

      {/* Divider */}
      <div className='h-px bg-[#f0f0f0]' />

      {/* Time Section */}
      <div className='rounded-lg bg-white px-8 py-8'>
        <TimeSelector
          reservedTimes={reservedTimes}
          startTime={startTime}
          endTime={endTime}
          onTimeSelect={handleTimeSelect}
        />
      </div>

      {/* Buttons */}
      <ReservationButtons
        canReserve={canReserve}
        onCancel={handleCancel}
        onReserve={() => setIsModalOpen(true)}
      />

      {/* 화면 2: 예약 신청서 모달 — 화면 1에서 선택한 정보 전달 */}
      {isModalOpen && (
        <ReservationFormModal
          onClose={() => setIsModalOpen(false)}
          reservationData={{
            classroomId,
            reservationDate: selectedDateStr,
            startTime: `${startTime}:00`,
            endTime: `${endTime}:00`,
          }}
        />
      )}
    </div>
  );
};

export default ReservationPage;
