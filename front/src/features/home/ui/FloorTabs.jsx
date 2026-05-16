import { FLOORS } from '../../classroom/constants/classrooms';

/**
 * 층 선택 탭 컴포넌트
 * @param {Object} props
 * @param {string} props.activeFloor - 현재 선택된 층
 * @param {(floor: string) => void} props.onFloorChange - 층 변경 핸들러
 */
function FloorTabs({ activeFloor, onFloorChange }) {
  return (
    <div className='flex gap-3' aria-label='강의실 층 선택'>
      {FLOORS.map((floor) => {
        const isActive = floor === activeFloor;

        return (
          <button
            key={floor}
            className={`h-11 w-20 cursor-pointer rounded-lg border-none text-sm leading-none font-semibold transition-colors ${
              isActive
                ? 'bg-gachon-blue text-white'
                : 'bg-surface-soft text-gachon-blue hover:bg-gachon-light-blue'
            }`}
            type='button'
            aria-pressed={isActive}
            onClick={() => onFloorChange(floor)}
          >
            {floor}
          </button>
        );
      })}
    </div>
  );
}

export default FloorTabs;
