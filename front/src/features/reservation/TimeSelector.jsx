/**
 * 시간 슬롯 선택 컴포넌트
 * @description 시작/종료 시간을 순차 선택하고 선택 범위를 하이라이트합니다.
 *              가로 스크롤 방식으로 표시됩니다.
 */
import { TIME_SLOTS } from './constants/timeSlots';

/**
 * @param {Object} props
 * @param {string[]} props.reservedTimes - 이미 예약된 시간 슬롯 배열
 * @param {string|null} props.startTime - 선택된 시작 시간
 * @param {string|null} props.endTime - 선택된 종료 시간
 * @param {(time: string) => void} props.onTimeSelect - 시간 선택 콜백
 */
const TimeSelector = ({ reservedTimes, startTime, endTime, onTimeSelect }) => {
  /**
   * 시간 버튼의 스타일 클래스를 반환
   * @param {string} time
   * @returns {string}
   */
  const getTimeClass = (time) => {
    const base =
      'shrink-0 flex-1 h-[86px] flex items-center justify-center text-sm font-semibold border-none cursor-pointer transition-all duration-150 first:rounded-l-lg last:rounded-r-lg ';

    if (reservedTimes.includes(time)) {
      return base + 'bg-disabled-gray text-white cursor-not-allowed';
    }

    const tNum = parseInt(time);
    const sNum = startTime ? parseInt(startTime) : null;
    const eNum = endTime ? parseInt(endTime) : null;

    if (sNum !== null && eNum !== null) {
      const lo = Math.min(sNum, eNum);
      const hi = Math.max(sNum, eNum);
      if (tNum >= lo && tNum <= hi) {
        return base + 'bg-gachon-blue text-white';
      }
      return base + 'bg-gachon-orange text-white hover:bg-middle-blue';
    }

    if (sNum !== null && time === startTime) {
      return base + 'bg-gachon-blue text-white';
    }

    return base + 'bg-gachon-orange text-white hover:bg-middle-blue';
  };

  return (
    <div>
      <div className='mb-5 flex items-center gap-2 text-base font-bold text-text-primary'>
        <svg
          width='20'
          height='20'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <circle cx='12' cy='12' r='10' />
          <polyline points='12 6 12 12 16 14' />
        </svg>
        시간 선택
      </div>

      <div className='mb-4 text-right text-sm text-gachon-blue'>
        시작 시간과 종료 시간을 클릭하세요
      </div>

      <div className='flex overflow-hidden rounded-lg'>
        {TIME_SLOTS.map((time) => (
          <button
            key={time}
            className={getTimeClass(time)}
            disabled={reservedTimes.includes(time)}
            onClick={() => onTimeSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>

      <div className='mt-5 flex items-center gap-6 text-sm text-text-secondary'>
        <div className='flex items-center gap-2'>
          <div className='size-4 rounded-lg bg-gachon-orange' />
          <span>예약가능</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-4 rounded-lg bg-gachon-blue' />
          <span>선택됨</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-4 rounded-lg bg-disabled-gray' />
          <span>예약불가</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSelector;
