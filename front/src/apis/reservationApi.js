/**
 * 예약 관련 API 함수
 * @description POST /api/reservations, GET /api/reservations/me
 */
import httpClient from '../libs/http/httpClient';

/**
 * 예약 신청 생성
 * @param {Object} body
 * @param {string} body.classroomId
 * @param {string} body.reservationDate - "YYYY-MM-DD"
 * @param {string} body.startTime       - "HH:mm"
 * @param {string} body.endTime         - "HH:mm"
 * @param {string} body.title
 * @param {string} body.participantInfo
 * @param {string} body.eventType       - "CLASS" | "SELF_STUDY" | "STUDY_GROUP" | "ETC"
 * @param {string|null} body.eventTypeEtc
 * @param {boolean} body.useProjector
 * @param {boolean} body.useComputer
 * @param {string} body.extraEquipment
 * @param {string} body.reason
 * @param {string} body.applicantName
 * @param {string} body.applicantDepartment
 * @param {string} body.applicantStudentId
 * @param {string} body.applicantPhone
 * @param {string} body.professorName
 * @param {string} body.professorPhone
 * @returns {Promise<{ success: boolean, data: { reservationId: string, status: string } }>}
 */
export const createReservation = (body) =>
  httpClient('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(body),
  });

/**
 * 내 예약 신청 목록 조회
 * @returns {Promise<{ success: boolean, data: Array<{ id, classroomName, reservationDate, startTime, endTime, title, status }> }>}
 */
export const getMyReservations = () => httpClient('/api/reservations/me');
