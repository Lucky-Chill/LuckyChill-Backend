import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../../../apis/userApi';

const MENU_PATHS = {
  reservations: '/my/reservations',
  login: '/login',
};

/**
 * @typedef {Object} ProfileMenuItem
 * @property {string} label - 메뉴 표시 이름
 * @property {() => void|Promise<void>} onClick - 메뉴 클릭 핸들러
 */

/**
 * 프로필 팝오버의 유저 정보 조회와 메뉴 동작을 관리합니다.
 * @param {Object} params
 * @param {() => void} params.onClose
 * @returns {{ email: string, menuItems: ProfileMenuItem[] }}
 */
const useProfilePopover = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    getMe()
      .then((res) => setEmail(res.data.email))
      .catch(() => setEmail(''));
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // 서버 오류와 무관하게 클라이언트 세션 정리
    } finally {
      onClose();
      navigate(MENU_PATHS.login);
    }
  };

  return {
    email,
    menuItems: [
      { label: '나의 예약 현황', onClick: () => handleNavigate(MENU_PATHS.reservations) },
      { label: '로그아웃', onClick: handleLogout },
    ],
  };
};

export default useProfilePopover;
