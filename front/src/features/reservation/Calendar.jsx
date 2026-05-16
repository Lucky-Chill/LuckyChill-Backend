/**
 * 날짜 선택 캘린더 컴포넌트
 */
import { useState } from 'react';

const WEEK_DAYS = [
  { label: '일', color: 'text-mudang-red' },
  { label: '월', color: 'text-text-muted' },
  { label: '화', color: 'text-text-muted' },
  { label: '수', color: 'text-text-muted' },
  { label: '목', color: 'text-text-muted' },
  { label: '금', color: 'text-text-muted' },
  { label: '토', color: 'text-gachon-blue' },
];

/**
 * @param {Object} props
 * @param {string[]} [props.disabledDateStrings] - 예약 불가 날짜 (YYYY-MM-DD)
 * @param {string[]} [props.reservedDateStrings] - 이미 예약된 날짜 (YYYY-MM-DD)
 * @param {string|null} props.selectedDateStr - 선택된 날짜 (YYYY-MM-DD)
 * @param {(date: number, year: number, month: number) => void} props.onDateSelect - month는 1-based
 * @param {(year: number, month: number) => void} [props.onMonthChange]
 */
const Calendar = ({
  disabledDateStrings = [],
  reservedDateStrings = [],
  selectedDateStr,
  onDateSelect,
  onMonthChange,
}) => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const formatDateString = (date) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

  const isToday = (date) =>
    today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === date;

  const isPast = (date) => new Date(viewYear, viewMonth, date) < todayStart;

  const isDateDisabled = (date) => {
    const dateStr = formatDateString(date);
    return (
      isPast(date) ||
      disabledDateStrings.includes(dateStr) ||
      reservedDateStrings.includes(dateStr)
    );
  };

  const handlePrevMonth = () => {
    const newYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const newMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    setViewYear(newYear);
    setViewMonth(newMonth);
    onMonthChange?.(newYear, newMonth + 1);
  };

  const handleNextMonth = () => {
    const newYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const newMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    setViewYear(newYear);
    setViewMonth(newMonth);
    onMonthChange?.(newYear, newMonth + 1);
  };

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getDateClass = (date) => {
    const base =
      'flex h-10 w-full max-w-[48px] items-center justify-center rounded-lg text-sm font-medium border-none transition-colors duration-150 ';

    if (isDateDisabled(date)) {
      return `${base} cursor-not-allowed text-disabled-gray bg-transparent`;
    }
    if (selectedDateStr === formatDateString(date)) {
      return `${base} cursor-pointer rounded-full bg-gachon-blue text-white font-bold`;
    }
    if (isToday(date)) {
      return `${base} cursor-pointer border-2 border-gachon-orange text-text-primary font-bold bg-transparent hover:bg-gachon-light-blue`;
    }
    return `${base} cursor-pointer text-text-primary bg-transparent hover:bg-gachon-light-blue`;
  };

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return;
    onDateSelect(date, viewYear, viewMonth + 1);
  };

  return (
    <div>
      <div className='mb-8 flex items-center gap-2 text-base font-bold text-text-primary'>
        <svg
          width='20'
          height='20'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <rect x='3' y='4' width='18' height='18' rx='2' />
          <line x1='16' y1='2' x2='16' y2='6' />
          <line x1='8' y1='2' x2='8' y2='6' />
          <line x1='3' y1='10' x2='21' y2='10' />
        </svg>
        날짜 선택
      </div>

      <div className='mb-9 flex items-center justify-center gap-4'>
        <button
          type='button'
          onClick={handlePrevMonth}
          className='cursor-pointer rounded-lg border-none bg-transparent px-2 py-1 text-base text-text-secondary transition-colors hover:bg-border-muted'
          aria-label='이전 달'
        >
          ‹
        </button>
        <div className='min-w-[120px] text-center text-base font-bold text-text-primary'>
          {viewYear}년 {viewMonth + 1}월
        </div>
        <button
          type='button'
          onClick={handleNextMonth}
          className='cursor-pointer rounded-lg border-none bg-transparent px-2 py-1 text-base text-text-secondary transition-colors hover:bg-border-muted'
          aria-label='다음 달'
        >
          ›
        </button>
      </div>

      <div className='grid grid-cols-7 gap-1 sm:gap-2'>
        {WEEK_DAYS.map((day) => (
          <div key={day.label} className={`pb-2 text-center text-sm font-semibold ${day.color}`}>
            {day.label}
          </div>
        ))}
        {cells.map((date, idx) =>
          date === null ? (
            <div key={`empty-${idx}`} aria-hidden='true' />
          ) : (
            <div key={date} className='flex justify-center'>
              <button
                type='button'
                className={getDateClass(date)}
                disabled={isDateDisabled(date)}
                onClick={() => handleDateClick(date)}
                aria-label={`${viewMonth + 1}월 ${date}일`}
                aria-pressed={selectedDateStr === formatDateString(date)}
              >
                {date}
              </button>
            </div>
          ),
        )}
      </div>

      <div className='mt-8 flex flex-wrap items-center gap-4 text-sm text-text-secondary'>
        <div className='flex items-center gap-2'>
          <div className='size-4 rounded-lg bg-disabled-gray' />
          <span>예약불가·지난 날</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-4 rounded-lg border-2 border-gachon-orange' />
          <span>오늘</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='size-4 rounded-lg bg-gachon-blue' />
          <span>선택</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
