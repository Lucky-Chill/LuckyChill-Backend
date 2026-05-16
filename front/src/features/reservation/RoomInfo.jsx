/**
 * 강의실 정보 표시 컴포넌트
 * @description 위치, 수용 인원, 장비 등의 강의실 기본 정보를 렌더링합니다.
 * @param {Object} props
 * @param {Object} props.room - 강의실 정보 객체
 * @param {string} props.room.location - 위치
 * @param {number} props.room.capacity - 수용 인원
 * @param {string} props.room.equipment - 장비 목록
 */
const RoomInfo = ({ room }) => {
  return (
    <div className='mt-8 rounded-lg bg-white px-8 py-6'>
      <div className='mb-6 text-base font-bold text-text-primary'>강의실 정보</div>
      <div className='mb-5 grid grid-cols-2 text-sm text-text-secondary'>
        <span>위치: {room.location}</span>
        <span>수용 인원: {room.capacity}명</span>
      </div>
      <div className='text-sm text-text-secondary'>
        <span>장비: {room.equipment}</span>
      </div>
    </div>
  );
};

export default RoomInfo;
