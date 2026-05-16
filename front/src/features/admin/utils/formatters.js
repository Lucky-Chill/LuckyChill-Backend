export const STATUS_LABEL = {
  PENDING: '승인 대기',
  APPROVED: '승인 완료',
  REJECTED: '반려',
  CANCELLED: '취소',
};

export const formatReservationDateKo = (date) => {
  if (!date) return '-';
  const [year, month, day] = date.split('-');
  return `${year}년 ${month}월 ${day}일`;
};

export const formatReservationTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '-';
  const startHour = Number(startTime.slice(0, 2));
  const endHour = Number(endTime.slice(0, 2));
  const hours = Math.max(endHour - startHour, 0);
  return `${startTime} - ${endTime} (${hours}시간)`;
};

/** 예약 신청서 신청인 → 관리자 화면 표시: 이름(학번) */
export const formatApplicantDisplay = (item) => {
  const name = item?.applicantName?.trim();
  const studentId = item?.applicantStudentId?.trim();

  if (name && studentId) return `${name}(${studentId})`;
  if (name) return name;
  if (studentId) return `(${studentId})`;
  if (item?.applicantEmail) return item.applicantEmail;
  if (item?.applicantDepartment) return item.applicantDepartment;
  return '-';
};

export const toApprovalModalDetail = (item) => ({
  requestNumber: `REQ-${String(item.id).slice(0, 8).toUpperCase()}`,
  applicant: formatApplicantDisplay(item),
  room: item.classroomName ?? '-',
  date: formatReservationDateKo(item.reservationDate),
  time: formatReservationTimeRange(item.startTime, item.endTime),
  purpose: item.title || item.reason || '-',
  status: STATUS_LABEL[item.status] ?? item.status,
});
