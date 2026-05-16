import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/auth/RequireAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import Reservation from './pages/Reservation';
import MyReservations from './pages/MyReservations';
import AdminPage from './pages/adminpage';

function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/auth/callback' element={<AuthCallbackPage />} />

      <Route element={<RequireAuth />}>
        <Route path='/home' element={<HomePage />} />
        <Route path='/reservation' element={<Reservation />} />
        <Route path='/reservation/:classroomId' element={<Reservation />} />
        <Route path='/my/reservations' element={<MyReservations />} />
        <Route path='/admin' element={<AdminPage />} />
      </Route>

      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  );
}

export default AppRouter;
