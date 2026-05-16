/**
 * 강의실 관련 API 함수
 * @description GET /api/classrooms/:classroomId
 *              GET /api/classrooms/:classroomId/unavailable-dates?year=&month=
 *              GET /api/classrooms/:classroomId/schedule?date=YYYY-MM-DD
 */
import httpClient from '../libs/http/httpClient';

/**
 * 강의실 정보 조회
 * @param {string} classroomId
 * @returns {Promise<{ success: boolean, data: { id, name, floor, capacity, equipment, hasProjector, hasComputer } }>}
 */
export const getClassroom = (classroomId) =>
  httpClient(`/api/classrooms/${classroomId}`);

/**
 * 월별 예약 불가 날짜 조회 — 캘린더 disabled 처리용
 * @param {string} classroomId
 * @param {number} year
 * @param {number} month - 1-based (1~12)
 * @returns {Promise<{ success: boolean, data: { unavailableDates: string[] } }>}
 */
export const getUnavailableDates = (classroomId, year, month) =>
  httpClient(`/api/classrooms/${classroomId}/unavailable-dates?year=${year}&month=${month}`);

/**
 * 특정 날짜 시간 슬롯 상태 조회 — 시간 선택기 reserved 처리용
 * @param {string} classroomId
 * @param {string} date - "YYYY-MM-DD"
 * @returns {Promise<{ success: boolean, data: { timeSlots: Array<{ startTime, endTime, status, reason? }> } }>}
 */
export const getSchedule = (classroomId, date) =>
  httpClient(`/api/classrooms/${classroomId}/schedule?date=${date}`);
