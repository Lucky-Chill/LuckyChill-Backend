import { useEffect, useState } from 'react';
import { getMyReservations } from '../../../apis/reservationApi';
import { getMe } from '../../../apis/userApi';

/**
 * @typedef {Object} MyReservation
 * @property {string} id - 예약 ID
 * @property {string} classroomName - 강의실 이름
 * @property {string} reservationDate - 예약 날짜
 * @property {string} startTime - 시작 시간
 * @property {string} endTime - 종료 시간
 * @property {string} title - 예약 제목
 * @property {string} status - 예약 상태
 * @property {string} [applicantEmail] - 신청자 이메일
 * @property {string} [email] - 신청자 이메일 대체 필드
 * @property {string} [floor] - 층 정보
 */

/**
 * 로그인 유저의 이메일과 예약 목록 조회 상태를 관리합니다.
 * @returns {{
 *   email: string,
 *   reservations: MyReservation[],
 *   isLoading: boolean,
 *   error: string|null
 * }}
 */
const useMyReservations = () => {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getMe(), getMyReservations()])
      .then(([meRes, listRes]) => {
        setEmail(meRes.data.email);
        setReservations(listRes.data);
      })
      .catch(() => setError('데이터를 불러오는 데 실패했습니다.'))
      .finally(() => setIsLoading(false));
  }, []);

  return {
    email,
    reservations,
    isLoading,
    error,
  };
};

export default useMyReservations;
