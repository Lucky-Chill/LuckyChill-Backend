import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReservation } from '../../../apis/reservationApi';
import { getAccessToken } from '../../../libs/auth/session';

const INITIAL_FORM = {
  title: '',
  participantInfo: '',
  eventTypeClass: false,
  eventTypeSelfStudy: false,
  eventTypeStudyGroup: false,
  eventTypeEtc: false,
  eventTypeEtcText: '',
  useProjector: false,
  useComputer: false,
  useExtraEquipment: false,
  extraEquipment: '',
  reason: '',
  applicantName: '',
  applicantDepartment: '',
  applicantStudentId: '',
  applicantPhone: '',
  professorName: '',
  professorPhone: '',
};

/**
 * @typedef {Object} ReservationFormState
 * @property {string} title - 행사명
 * @property {string} participantInfo - 참여 대상/인원
 * @property {boolean} eventTypeClass - 수업 여부
 * @property {boolean} eventTypeSelfStudy - 자습 여부
 * @property {boolean} eventTypeStudyGroup - 스터디 그룹 여부
 * @property {boolean} eventTypeEtc - 기타 행사 여부
 * @property {string} eventTypeEtcText - 기타 행사 내용
 * @property {boolean} useProjector - 빔 프로젝터 사용 여부
 * @property {boolean} useComputer - 전자교탁 컴퓨터 사용 여부
 * @property {boolean} useExtraEquipment - 기타 장비 사용 여부
 * @property {string} extraEquipment - 기타 장비 내용
 * @property {string} reason - 신청 사유
 * @property {string} applicantName - 신청인 이름
 * @property {string} applicantDepartment - 신청인 학과
 * @property {string} applicantStudentId - 신청인 학번
 * @property {string} applicantPhone - 신청인 전화번호
 * @property {string} professorName - 지도교수 이름
 * @property {string} professorPhone - 지도교수 전화번호
 */

/**
 * @typedef {Object} ReservationBaseData
 * @property {string} classroomId - 강의실 ID
 * @property {string|null} reservationDate - 예약 날짜
 * @property {string} startTime - 시작 시간
 * @property {string} endTime - 종료 시간
 */

/**
 * 선택된 행사 종류를 API 값으로 변환합니다.
 * @param {ReservationFormState} form
 * @returns {"CLASS"|"SELF_STUDY"|"STUDY_GROUP"|"ETC"|null}
 */
const getEventType = (form) => {
  if (form.eventTypeClass) return 'CLASS';
  if (form.eventTypeSelfStudy) return 'SELF_STUDY';
  if (form.eventTypeStudyGroup) return 'STUDY_GROUP';
  if (form.eventTypeEtc) return 'ETC';
  return null;
};

/**
 * 예약 신청 폼의 입력 상태와 제출 로직을 관리합니다.
 * @param {Object} params
 * @param {ReservationBaseData} params.reservationData
 * @param {() => void} params.onClose
 * @returns {{
 *   form: ReservationFormState,
 *   handleChange: (event: import('react').ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => void,
 *   handleSubmit: () => Promise<void>
 * }}
 */
const useReservationForm = ({ reservationData, onClose }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    const body = {
      ...reservationData,
      title: form.title,
      participantInfo: form.participantInfo,
      eventType: getEventType(form),
      eventTypeEtc: form.eventTypeEtc ? form.eventTypeEtcText : null,
      useProjector: form.useProjector,
      useComputer: form.useComputer,
      extraEquipment: form.useExtraEquipment ? form.extraEquipment : '',
      reason: form.reason,
      applicantName: form.applicantName,
      applicantDepartment: form.applicantDepartment,
      applicantStudentId: form.applicantStudentId,
      applicantPhone: form.applicantPhone,
      professorName: form.professorName,
      professorPhone: form.professorPhone,
    };

    try {
      const token = await getAccessToken();
      if (!token) {
        alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
        return;
      }

      await createReservation(body);
      alert('예약 신청이 완료되었습니다.');
      onClose();
      navigate('/home', { replace: true });
    } catch (err) {
      console.error('예약 신청 실패:', err);
      alert(err.message || '예약 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
  };
};

export default useReservationForm;
