/** 관리자 통계 카드용 아이콘 (디자인 시안 outline 스타일) */

function iconProps(className) {
  return {
    className: className ?? 'size-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  };
}

export function StatIconCalendar({ className }) {
  return (
    <svg {...iconProps(className)}>
      <path
        d='M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function StatIconClock({ className }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx='12' cy='12' r='9' stroke='currentColor' strokeWidth='2' />
      <path
        d='M12 7v5l3 2'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function StatIconCheck({ className }) {
  return (
    <svg {...iconProps(className)}>
      <path
        d='M20 6 9 17l-5-5'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export function SearchIcon({ className }) {
  return (
    <svg {...iconProps(className)}>
      <circle cx='11' cy='11' r='7' stroke='currentColor' strokeWidth='2' />
      <path
        d='m20 20-3.5-3.5'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
}

export function BellIcon({ className }) {
  return (
    <svg {...iconProps(className)}>
      <path
        d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M13.73 21a2 2 0 0 1-3.46 0'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
