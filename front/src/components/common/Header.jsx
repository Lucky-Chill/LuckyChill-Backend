/**
 * 공통 헤더 컴포넌트
 * @description 학과명(로고), 알림 아이콘, 프로필 아이콘 + 팝오버를 포함하는 상단 헤더입니다.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/logo.svg';
import profileIcon from '../../assets/profile.svg';
import ProfilePopover from './ProfilePopover';

const Header = () => {
  const navigate = useNavigate();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const profileWrapperRef = useRef(null);

  // 팝오버 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(e.target)) {
        setIsPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  return (
    <header className='flex h-20 shrink-0 items-center justify-between border-b border-border-default bg-white px-6'>
      <button
        className='flex cursor-pointer items-center gap-2.5 border-none bg-transparent p-0 text-2xl font-bold text-gachon-blue'
        type='button'
        onClick={() => navigate('/home')}
      >
        <img src={logoIcon} alt='' className='size-15 shrink-0' aria-hidden='true' />
        컴퓨터공학과
      </button>

      <div className='flex items-center'>
        {/* 프로필 아이콘 + 팝오버 래퍼 */}
        <div className='relative' ref={profileWrapperRef}>
          <button
            className='cursor-pointer border-none bg-transparent p-1'
            aria-label='프로필'
            onClick={handleProfileClick}
          >
            <img src={profileIcon} alt='프로필' className='size-7 shrink-0' />
          </button>

          {isPopoverOpen && <ProfilePopover onClose={() => setIsPopoverOpen(false)} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
