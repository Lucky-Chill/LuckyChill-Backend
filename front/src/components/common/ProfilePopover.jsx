/**
 * 프로필 팝오버 컴포넌트
 * @description Header 우측 프로필 아이콘 클릭 시 노출되는 드롭다운 팝오버입니다.
 *              로그인 유저 이메일 표시, 내 정보/예약 현황 라우팅, 로그아웃을 처리합니다.
 */
import univLogo from '../../assets/univ_logo.svg';
import useProfilePopover from './hooks/useProfilePopover';

/**
 * @param {Object}   props
 * @param {Function} props.onClose - 팝오버 닫기 콜백
 */
const ProfilePopover = ({ onClose }) => {
  const { email, menuItems } = useProfilePopover({ onClose });

  return (
    <div className='absolute top-full right-0 z-50 mt-2 min-w-[280px] overflow-hidden rounded-xl border border-border-muted bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]'>
      {/* 이메일 영역 */}
      <div className='flex items-center gap-2.5 border-b border-border-muted px-5 py-[14px] text-sm text-text-primary'>
        <img src={univLogo} alt='' className='size-7 shrink-0' aria-hidden='true' />
        <span className='truncate'>{email || '불러오는 중...'}</span>
      </div>

      {/* 메뉴 항목 */}
      {menuItems.map((item, idx) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className={`w-full cursor-pointer border-none bg-white px-5 py-[14px] text-left text-sm text-text-primary transition-colors hover:bg-surface-muted ${
            idx < menuItems.length - 1 ? 'border-b border-border-muted' : ''
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ProfilePopover;
