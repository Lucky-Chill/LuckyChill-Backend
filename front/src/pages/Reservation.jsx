/**
 * 강의실 예약 페이지 진입점
 * @description 메인 레이아웃을 적용한 라우팅 엔트리입니다. 실질적인 UI는 features/reservation에 위임합니다.
 */
import MainLayout from '../layouts/MainLayout';
import ReservationPage from '../features/reservation/ReservationPage';

const Reservation = () => {
  return (
    <MainLayout>
      <ReservationPage />
    </MainLayout>
  );
};

export default Reservation;
