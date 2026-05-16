/**
 * 승인 모달 컴포넌트
 */
import { useState, useEffect } from 'react';

/**
 * @param {Object}   props
 * @param {boolean}  props.open
 * @param {Function} props.onClose
 * @param {Function} props.onApprove
 * @param {Function} props.onReject
 * @param {boolean}  [props.canReview=true]
 * @param {Object}   props.detail
 */
const ApprovalModal = ({ open, onClose, onApprove, onReject, detail, canReview = true }) => {
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (open) setMemo('');
  }, [open, detail?.requestNumber]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!open || !detail) return null;

  const DETAIL_ROWS = [
    { label: '신청 번호', value: detail.requestNumber },
    { label: '신청자', value: detail.applicant },
    { label: '강의실', value: detail.room },
    { label: '신청 일자', value: detail.date },
    { label: '사용 시간', value: detail.time },
    { label: '사용 목적', value: detail.purpose },
    { label: '신청 상태', value: detail.status },
  ];

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
      onClick={onClose}
    >
      <div
        className='w-[720px] rounded-2xl border border-border-default bg-white p-8 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-10 flex items-start justify-between'>
          <h2 className='text-[40px] font-bold text-black'>신청 상세 정보</h2>
          <button
            type='button'
            className='cursor-pointer border-none bg-transparent text-4xl leading-none font-bold text-black'
            onClick={onClose}
            aria-label='모달 닫기'
          >
            ×
          </button>
        </div>

        <div className='mb-10 flex flex-col gap-6'>
          {DETAIL_ROWS.map(({ label, value }) => (
            <div key={label} className='flex items-center gap-12'>
              <span className='w-[120px] shrink-0 text-[24px] font-semibold text-text-muted'>
                {label}
              </span>
              <span className='text-[24px] font-semibold text-text-secondary'>{value}</span>
            </div>
          ))}
        </div>

        {canReview ? (
          <>
            <div className='mb-10 flex flex-col gap-4'>
              <label className='text-[24px] font-semibold text-black'>메모</label>
              <textarea
                className='h-[180px] w-full resize-none rounded-xl border border-border-default p-6 text-[24px] outline-none transition-colors focus:border-gachon-blue'
                placeholder='메모를 입력하세요'
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <div className='flex justify-end gap-4'>
              <button
                type='button'
                className='h-[72px] w-[140px] cursor-pointer rounded-xl border-none bg-mudang-red text-[28px] font-bold text-white transition hover:opacity-90 active:scale-[0.98]'
                onClick={() => onReject(memo)}
              >
                반려
              </button>
              <button
                type='button'
                className='h-[72px] w-[140px] cursor-pointer rounded-xl border-none bg-gachon-blue text-[28px] font-bold text-white transition hover:opacity-90 active:scale-[0.98]'
                onClick={() => onApprove(memo)}
              >
                승인
              </button>
            </div>
          </>
        ) : (
          <div className='flex justify-end'>
            <button
              type='button'
              className='cursor-pointer rounded-xl border-none bg-gachon-blue px-8 py-3 text-base font-bold text-white transition hover:opacity-90 active:scale-[0.98]'
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalModal;
