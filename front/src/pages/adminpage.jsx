import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../assets/logo.svg';
import profileIcon from '../assets/profile.svg';
import ApprovalModal from '../components/modal/ApprovalModal';
import ProfilePopover from '../components/common/ProfilePopover';
import {
  ADMIN_ARIA,
  ADMIN_EMPTY_LIST,
  ADMIN_FILTER_LABELS,
  ADMIN_FORBIDDEN_HINT,
  ADMIN_HEADER_TITLE,
  ADMIN_LIST_LABELS,
  ADMIN_LOADING,
  ADMIN_PAGE_TITLE,
  ADMIN_SEARCH_ARIA,
  ADMIN_SEARCH_PLACEHOLDER,
  ADMIN_STAT_LABELS,
} from '../features/admin/constants/adminLabels';
import useAdminPage, { FILTER_TAB_STYLES } from '../features/admin/hooks/useAdminPage';
import {
  StatIconCalendar,
  StatIconCheck,
  StatIconClock,
  BellIcon,
  SearchIcon,
} from '../features/admin/ui/AdminStatIcons';
import {
  STATUS_LABEL,
  formatApplicantDisplay,
  formatReservationDateKo,
  formatReservationTimeRange,
} from '../features/admin/utils/formatters';

const STAT_CARDS = [
  {
    key: 'ALL',
    labelKey: 'ALL',
    countKey: 'total',
    valueClass: 'text-text-primary',
    iconWrapClass: 'bg-gachon-blue-tint text-gachon-blue',
    Icon: StatIconCalendar,
    activeBorder: 'border-gachon-blue shadow-[0_0_0_1px_#014f9e]',
  },
  {
    key: 'PENDING',
    labelKey: 'PENDING',
    countKey: 'pending',
    valueClass: 'text-mudang-red',
    iconWrapClass: 'bg-mudang-red-tint text-mudang-red',
    Icon: StatIconClock,
    activeBorder: 'border-mudang-red shadow-[0_0_0_1px_#dc1b1b]',
  },
  {
    key: 'APPROVED',
    labelKey: 'APPROVED',
    countKey: 'approved',
    valueClass: 'text-success-green',
    iconWrapClass: 'bg-success-green-tint text-success-green',
    Icon: StatIconCheck,
    activeBorder: 'border-success-green shadow-[0_0_0_1px_#00a63e]',
  },
];

const FILTER_TABS = [
  { key: 'ALL', labelKey: 'ALL', countKey: 'total' },
  { key: 'PENDING', labelKey: 'PENDING', countKey: 'pending' },
  { key: 'APPROVED', labelKey: 'APPROVED', countKey: 'approved' },
];

function AdminPage() {
  const navigate = useNavigate();
  const profileWrapperRef = useRef(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const {
    filter,
    setFilter,
    counts,
    filteredReservations,
    isLoading,
    error,
    isModalOpen,
    modalDetail,
    canReview,
    openDetail,
    closeDetail,
    handleApprove,
    handleReject,
  } = useAdminPage();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(e.target)) {
        setIsPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabButtonClass = (tabKey) => {
    const styles = FILTER_TAB_STYLES[tabKey];
    const isActive = filter === tabKey;
    return (
      'cursor-pointer rounded-lg border-none px-[15px] py-2.5 text-sm font-bold transition-all duration-150 active:scale-[0.97] ' +
      (isActive ? styles.active : styles.inactive)
    );
  };

  const isForbiddenError =
    error &&
    (error.includes('\uad00\ub9ac\uc790') ||
      error.includes('403') ||
      error.includes('FORBIDDEN'));

  return (
    <div className='min-h-screen bg-surface-muted text-text-primary'>
      <header className='flex h-16 shrink-0 items-center gap-6 border-b border-border-default bg-white px-7'>
        <button
          type='button'
          onClick={() => navigate('/home')}
          className='flex shrink-0 cursor-pointer items-center gap-2.5 border-none bg-transparent p-0'
        >
          <img src={logoIcon} alt='' className='size-9' aria-hidden='true' />
          <span className='text-[22px] font-extrabold text-gachon-blue'>{ADMIN_HEADER_TITLE}</span>
        </button>

        <div className='flex h-9 min-w-0 flex-1 max-w-[320px] items-center gap-2 rounded-lg border border-border-default bg-white px-3'>
          <SearchIcon className='size-4 shrink-0 text-text-muted' />
          <input
            className='min-w-0 flex-1 border-none bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-muted'
            placeholder={ADMIN_SEARCH_PLACEHOLDER}
            readOnly
            aria-label={ADMIN_SEARCH_ARIA}
          />
        </div>

        <div className='ml-auto flex items-center gap-4'>
          <button
            type='button'
            className='flex size-9 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-text-muted transition hover:bg-surface-soft'
            aria-label={ADMIN_ARIA.notification}
          >
            <BellIcon className='size-5' />
          </button>

          <div className='relative' ref={profileWrapperRef}>
            <button
              type='button'
              className='flex size-9 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent transition hover:bg-surface-soft'
              aria-label={ADMIN_ARIA.profile}
              onClick={() => setIsPopoverOpen((prev) => !prev)}
            >
              <img src={profileIcon} alt='' className='size-5' />
            </button>
            {isPopoverOpen && <ProfilePopover onClose={() => setIsPopoverOpen(false)} />}
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-[1200px] px-7 py-6'>
        <h2 className='mb-5 text-[22px] font-extrabold tracking-tight'>{ADMIN_PAGE_TITLE}</h2>

        <section className='mb-5 flex flex-wrap gap-3'>
          {STAT_CARDS.map((card) => {
            const isActive = filter === card.key;
            const { Icon } = card;
            return (
              <button
                key={card.key}
                type='button'
                onClick={() => setFilter(card.key)}
                className={
                  'flex h-[78px] w-[174px] cursor-pointer items-center justify-between rounded-lg border bg-white px-[18px] py-4 text-left transition-all duration-150 hover:shadow-md active:scale-[0.98] ' +
                  (isActive ? card.activeBorder : 'border-border-default')
                }
              >
                <div className='flex flex-col justify-center'>
                  <p className='mb-0.5 text-xs font-medium text-text-muted'>
                    {ADMIN_STAT_LABELS[card.labelKey]}
                  </p>
                  <strong className={'text-[28px] font-extrabold leading-none ' + card.valueClass}>
                    {counts[card.countKey]}
                  </strong>
                </div>
                <span
                  className={
                    'flex size-[38px] shrink-0 items-center justify-center rounded-full ' +
                    card.iconWrapClass
                  }
                >
                  <Icon />
                </span>
              </button>
            );
          })}
        </section>

        <section className='mb-5 flex flex-wrap gap-2 rounded-lg border border-border-default bg-white p-3'>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type='button'
              className={tabButtonClass(tab.key)}
              onClick={() => setFilter(tab.key)}
            >
              {ADMIN_FILTER_LABELS[tab.labelKey]}
              {tab.key !== 'ALL' ? ` (${counts[tab.countKey]})` : ''}
            </button>
          ))}
        </section>

        {isLoading && (
          <div className='flex justify-center py-20 text-sm text-text-muted'>{ADMIN_LOADING}</div>
        )}

        {!isLoading && error && (
          <div className='rounded-lg border border-mudang-red-tint bg-mudang-red-tint/40 px-4 py-3 text-sm text-mudang-red'>
            {error}
            {isForbiddenError ? (
              <p className='mt-1 text-xs'>{ADMIN_FORBIDDEN_HINT}</p>
            ) : null}
          </div>
        )}

        {!isLoading && !error && filteredReservations.length === 0 && (
          <div className='rounded-lg border border-border-default bg-white py-16 text-center text-sm text-text-muted'>
            {ADMIN_EMPTY_LIST}
          </div>
        )}

        {!isLoading && !error && filteredReservations.length > 0 && (
          <section className='overflow-hidden rounded-lg border border-border-default bg-white'>
            {filteredReservations.map((item) => {
              const isPending = item.status === 'PENDING';
              return (
                <article
                  key={item.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => openDetail(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openDetail(item);
                    }
                  }}
                  className='flex min-h-[116px] cursor-pointer items-center justify-between gap-4 border-b border-border-default px-[22px] py-5 transition-colors last:border-b-0 hover:bg-surface-muted active:bg-gachon-blue-tint/30'
                >
                  <div className='min-w-0 flex-1'>
                    <h3 className='mb-3 text-base font-extrabold text-text-primary'>
                      {item.classroomName}
                    </h3>
                    <div className='flex flex-wrap items-start gap-x-8 gap-y-2 text-xs leading-snug text-text-secondary'>
                      <p className='max-w-[200px]'>
                        <span className='font-semibold text-text-muted'>
                          {ADMIN_LIST_LABELS.applicant}
                        </span>
                        <br />
                        <span className='text-text-primary'>{formatApplicantDisplay(item)}</span>
                      </p>
                      <p>
                        <span className='font-semibold text-text-muted'>
                          {ADMIN_LIST_LABELS.date}
                        </span>
                        <br />
                        {formatReservationDateKo(item.reservationDate)}
                      </p>
                      <p>
                        <span className='font-semibold text-text-muted'>
                          {ADMIN_LIST_LABELS.location}
                        </span>
                        <br />
                        {item.classroomFloor ?? '-'}
                      </p>
                      <p>
                        <span className='font-semibold text-text-muted'>
                          {ADMIN_LIST_LABELS.time}
                        </span>
                        <br />
                        {formatReservationTimeRange(item.startTime, item.endTime)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={
                      'shrink-0 rounded-full px-4 py-2 text-sm font-extrabold ' +
                      (isPending
                        ? 'bg-mudang-red-tint text-mudang-red'
                        : item.status === 'APPROVED'
                          ? 'bg-success-green-tint text-success-green'
                          : 'bg-surface-soft text-text-secondary')
                    }
                  >
                    {STATUS_LABEL[item.status] ?? item.status}
                  </span>
                </article>
              );
            })}
          </section>
        )}
      </main>

      <ApprovalModal
        open={isModalOpen}
        onClose={closeDetail}
        onApprove={handleApprove}
        onReject={handleReject}
        detail={modalDetail}
        canReview={canReview}
      />
    </div>
  );
}

export default AdminPage;
