/**
 * 관리자 API
 * @description GET /api/admin/reservations, PATCH .../status
 */
import httpClient from '../libs/http/httpClient';

/**
 * @param {'ALL'|'PENDING'|'APPROVED'|'REJECTED'|'CANCELLED'} [status='ALL']
 */
export const getAdminReservations = (status = 'ALL') =>
  httpClient(`/api/admin/reservations?status=${status}`);

/**
 * @param {string} reservationId
 * @param {{ status: 'APPROVED'|'REJECTED'|'CANCELLED', adminMemo?: string }} body
 */
export const updateReservationStatus = (reservationId, body) =>
  httpClient(`/api/admin/reservations/${reservationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
