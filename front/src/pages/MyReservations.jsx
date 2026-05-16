/**
 * 나의 예약 현황 페이지 진입점
 * @description MainLayout을 적용한 라우팅 엔트리입니다. 실질적인 UI는 features/myReservation에 위임합니다.
 */
import MainLayout from '../layouts/MainLayout';
import MyReservationPage from '../features/myReservation/MyReservationPage';

const MyReservations = () => (
  <MainLayout>
    <MyReservationPage />
  </MainLayout>
);

export default MyReservations;
