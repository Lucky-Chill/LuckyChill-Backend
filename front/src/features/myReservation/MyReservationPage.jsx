/**
 * 나의 예약 현황 피처 컴포넌트
 * @description 로그인 유저의 이메일과 예약 목록을 조회하여 렌더링합니다.
 *              예약이 없을 경우 Empty State를 표시합니다.
 */
import useMyReservations from './hooks/useMyReservations';

/** 예약 상태 한글 라벨 */
const STATUS_LABEL = {
  PENDING: '승인 대기',
  APPROVED: '승인 완료',
  REJECTED: '반려',
  CANCELLED: '취소',
};

/** 예약 상태별 배지 스타일 */
const STATUS_CLASS = {
  PENDING: 'bg-mudang-red-tint text-mudang-red',
  APPROVED: 'bg-success-green-tint text-success-green',
  REJECTED: 'bg-mudang-red-tint text-mudang-red',
  CANCELLED: 'bg-surface-soft text-text-secondary',
};

/**
 * ISO 날짜 문자열을 한국어 날짜로 포맷합니다.
 * @param {string} date
 * @returns {string}
 */
const formatReservationDate = (date) => {
  if (!date) return '-';

  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

/**
 * 예약 시간을 화면 표시 형식으로 포맷합니다.
 * @param {string} start
 * @param {string} end
 * @returns {string}
 */
const formatReservationTime = (start, end) => {
  if (!start || !end) return '-';

  const startHour = Number(start.slice(0, 2));
  const endHour = Number(end.slice(0, 2));
  const duration = Math.max(endHour - startHour, 0);

  return `${start} - ${end} (${duration}시간)`;
};

const MyReservationPage = () => {
  const { email, reservations, isLoading, error } = useMyReservations();

  return (
    <div className='mx-auto w-full max-w-[860px] py-10'>
      {/* 페이지 제목 */}
      <h1 className='mb-8 border-b border-border-muted pb-5 text-2xl leading-8 font-bold text-text-primary'>
        나의 예약 현황
      </h1>

      {/* 예약자 정보 카드 */}
      <div className='mb-8 rounded-xl bg-gachon-blue-tint px-6 py-5'>
        <p className='mb-1 text-xs font-semibold text-gachon-blue'>예약자 정보</p>
        <p className='text-sm font-medium text-text-primary'>{email || '-'}</p>
      </div>

      {/* 예약 목록 영역 */}
      {isLoading && (
        <div className='flex items-center justify-center py-20'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gachon-blue border-t-transparent' />
        </div>
      )}

      {!isLoading && error && (
        <div className='flex items-center justify-center py-20 text-sm text-red-500'>{error}</div>
      )}

      {!isLoading && !error && reservations.length === 0 && <EmptyState />}

      {!isLoading && !error && reservations.length > 0 && (
        <ul className='flex flex-col gap-4'>
          {reservations.map((item) => (
            <ReservationCard key={item.id} item={item} reserverEmail={email} />
          ))}
        </ul>
      )}
    </div>
  );
};

/* ── 예약 카드 ─────────────────────────────────────────── */

/**
 * 개별 예약 정보 카드
 * @param {Object} props
 * @param {Object} props.item - 예약 데이터
 * @param {string} props.item.classroomName - 강의실 이름
 * @param {string} props.item.reservationDate - 예약 날짜
 * @param {string} props.item.startTime - 시작 시간
 * @param {string} props.item.endTime - 종료 시간
 * @param {string} props.item.status - 예약 상태
 * @param {string} [props.item.applicantEmail] - 신청자 이메일
 * @param {string} [props.item.email] - 신청자 이메일 대체 필드
 * @param {string} [props.item.floor] - 층 정보
 * @param {string} props.reserverEmail - 로그인 예약자 이메일 (상단 예약자 정보와 동일)
 */
const ReservationCard = ({ item, reserverEmail }) => (
  <li className='flex min-h-[118px] items-center justify-between rounded-lg border border-border-default bg-white px-7 py-5'>
    <div>
      <h2 className='mb-3.5 text-base font-bold text-text-primary'>{item.classroomName}</h2>

      <div className='flex flex-wrap items-start gap-x-7 gap-y-1.5 text-xs leading-[1.45] text-text-secondary'>
        <span className='flex items-start gap-1.5'>
          <svg
            className='mt-0.5 size-4 shrink-0'
            viewBox='0 0 24 24'
            fill='none'
            aria-hidden='true'
          >
            <path
              d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span>
            신청자:
            <br />
            {item.applicantEmail ?? item.email ?? reserverEmail ?? '-'}
          </span>
        </span>

        <span className='flex items-center gap-1.5'>
          <svg className='size-4 shrink-0' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path
              d='M8 2v4M16 2v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          {formatReservationDate(item.reservationDate)}
        </span>

        <span className='flex items-center gap-1.5'>
          <svg className='size-4 shrink-0' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path
              d='M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <circle cx='12' cy='10' r='3' stroke='currentColor' strokeWidth='2' />
          </svg>
          {item.floor ?? '6층'}
        </span>

        <span className='flex basis-full items-center gap-1.5'>
          <svg className='size-4 shrink-0' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
            <path
              d='M12 6v6l4 2M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          {formatReservationTime(item.startTime, item.endTime)}
        </span>
      </div>
    </div>

    <span
      className={`shrink-0 rounded-full px-5 py-2 text-lg font-bold ${STATUS_CLASS[item.status] ?? 'bg-surface-soft text-text-secondary'}`}
    >
      {STATUS_LABEL[item.status] ?? item.status}
    </span>
  </li>
);

/* ── Empty State ───────────────────────────────────────── */

const EmptyState = () => (
  <div className='flex flex-col items-center justify-center py-24 gap-4'>
    <svg
      width='56'
      height='56'
      fill='none'
      viewBox='0 0 24 24'
      className='text-text-muted'
      stroke='currentColor'
      strokeWidth='1.5'
    >
      <rect x='3' y='4' width='18' height='18' rx='2' />
      <line x1='16' y1='2' x2='16' y2='6' />
      <line x1='8' y1='2' x2='8' y2='6' />
      <line x1='3' y1='10' x2='21' y2='10' />
    </svg>
    <p className='text-lg font-semibold text-text-primary'>예약 내역이 없습니다.</p>
    <p className='text-sm text-text-muted'>강의실을 예약해보세요!</p>
  </div>
);

export default MyReservationPage;
