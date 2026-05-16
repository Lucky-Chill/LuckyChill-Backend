import useReservationForm from './hooks/useReservationForm';

const labelClass = 'mt-3.5 mb-2 block w-full text-left text-[13px] font-bold text-text-primary';
const sectionLabelClass =
  'mt-6 mb-2 block w-full text-left text-[13px] font-bold text-text-primary';
const inputClass =
  'h-[34px] w-full rounded-md border border-border-default bg-white px-2.5 py-[9px] text-[13px] text-text-primary outline-none placeholder:text-text-muted focus:border-middle-blue focus:shadow-[0_0_0_2px_rgb(105_152_209_/_0.15)]';
const textareaClass =
  'h-[58px] w-full resize-none rounded-md border border-border-default bg-white px-2.5 py-[9px] text-[13px] leading-[1.4] text-text-primary outline-none placeholder:text-text-muted focus:border-middle-blue focus:shadow-[0_0_0_2px_rgb(105_152_209_/_0.15)]';
const checkboxRowClass = 'mt-1 mb-2 flex items-center gap-2.5';
const checkboxLabelClass =
  'inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[13px] text-text-primary';
const checkboxClass = 'size-3 cursor-pointer accent-gachon-blue';

/**
 * 예약 신청서 모달 (화면 2)
 * @param {Object} props
 * @param {() => void} props.onClose - 모달 닫기 콜백
 * @param {Object} props.reservationData - 화면 1에서 전달된 예약 기본 정보
 * @param {string} props.reservationData.classroomId
 * @param {string} props.reservationData.reservationDate - "YYYY-MM-DD"
 * @param {string} props.reservationData.startTime - "HH:mm"
 * @param {string} props.reservationData.endTime   - "HH:mm"
 */
function ReservationFormModal({ onClose, reservationData }) {
  const { form, handleChange, handleSubmit } = useReservationForm({
    reservationData,
    onClose,
  });

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/35'>
      <div className='scrollbar-hidden max-h-[92vh] w-[550px] overflow-y-auto rounded-2xl bg-white px-[18px] pb-[18px]'>
        <div className='flex h-12 items-center justify-between border-b border-border-muted'>
          <h2 className='m-0 text-[17px] font-bold text-text-primary'>예약 사유 제출</h2>
          <button
            type='button'
            onClick={onClose}
            className='cursor-pointer border-none bg-transparent text-[26px] leading-none text-text-primary'
          >
            ×
          </button>
        </div>

        <div className='pt-[17px]'>
          <label className={labelClass}>
            행사명<span className='text-mudang-red'>*</span>
          </label>
          <input
            className={inputClass}
            name='title'
            placeholder='제목을 입력하세요'
            value={form.title}
            onChange={handleChange}
          />

          <label className={labelClass}>
            참여대상/인원<span className='text-mudang-red'>*</span>
          </label>
          <input
            className={inputClass}
            name='participantInfo'
            placeholder='교수 외 인원'
            value={form.participantInfo}
            onChange={handleChange}
          />

          <label className={labelClass}>
            행사종류<span className='text-mudang-red'>*</span>
          </label>
          <div className={checkboxRowClass}>
            <label className={checkboxLabelClass}>
              <input
                className={checkboxClass}
                type='checkbox'
                name='eventTypeClass'
                checked={form.eventTypeClass}
                onChange={handleChange}
              />
              수업
            </label>

            <label className={checkboxLabelClass}>
              <input
                className={checkboxClass}
                type='checkbox'
                name='eventTypeSelfStudy'
                checked={form.eventTypeSelfStudy}
                onChange={handleChange}
              />
              자습
            </label>

            <label className={checkboxLabelClass}>
              <input
                className={checkboxClass}
                type='checkbox'
                name='eventTypeStudyGroup'
                checked={form.eventTypeStudyGroup}
                onChange={handleChange}
              />
              스터디 그룹
            </label>
          </div>

          <div className='mt-0.5 mb-2 flex items-center gap-2.5'>
            <label className={checkboxLabelClass}>
              <input
                className={checkboxClass}
                type='checkbox'
                name='eventTypeEtc'
                checked={form.eventTypeEtc}
                onChange={handleChange}
              />
              기타
            </label>
          </div>

          <textarea
            className={textareaClass}
            name='eventTypeEtcText'
            placeholder='내용을 입력하세요'
            value={form.eventTypeEtcText}
            onChange={handleChange}
          />

          <label className={sectionLabelClass}>기자재 사용 여부</label>
          <div className={checkboxRowClass}>
            <label className={checkboxLabelClass}>
              <input
                className={checkboxClass}
                type='checkbox'
                name='useProjector'
                checked={form.useProjector}
                onChange={handleChange}
              />
              빔 프로젝터 사용 여부
            </label>

            <label className={checkboxLabelClass}>
              <input
                className={checkboxClass}
                type='checkbox'
                name='useComputer'
                checked={form.useComputer}
                onChange={handleChange}
              />
              전자교탁 컴퓨터 사용 여부
            </label>
          </div>

          <div className='mt-0.5 mb-2 flex items-center gap-2.5'>
            <label className={checkboxLabelClass}>
              <input
                className={checkboxClass}
                type='checkbox'
                name='useExtraEquipment'
                checked={form.useExtraEquipment}
                onChange={handleChange}
              />
              기타 장비
            </label>
          </div>

          <textarea
            className={textareaClass}
            name='extraEquipment'
            placeholder='내용을 입력하세요'
            value={form.extraEquipment}
            onChange={handleChange}
          />

          <label className={labelClass}>
            신청사유<span className='text-mudang-red'>*</span>
          </label>
          <textarea
            className={`${textareaClass} h-[104px]`}
            name='reason'
            placeholder='내용을 입력하세요'
            value={form.reason}
            onChange={handleChange}
          />

          <label className={labelClass}>
            신청인<span className='text-mudang-red'>*</span>
          </label>
          <div className='grid grid-cols-2 gap-2.5'>
            <input
              className={inputClass}
              name='applicantName'
              placeholder='이름'
              value={form.applicantName}
              onChange={handleChange}
            />
            <input
              className={inputClass}
              name='applicantDepartment'
              placeholder='학과'
              value={form.applicantDepartment}
              onChange={handleChange}
            />
            <input
              className={inputClass}
              name='applicantStudentId'
              placeholder='학번'
              value={form.applicantStudentId}
              onChange={handleChange}
            />
            <input
              className={inputClass}
              name='applicantPhone'
              placeholder='전화번호'
              value={form.applicantPhone}
              onChange={handleChange}
            />
          </div>

          <label className={`${sectionLabelClass} mt-2.5`}>지도교수</label>
          <div className='flex items-center gap-2.5'>
            <input
              className={`${inputClass} w-[84px]`}
              name='professorName'
              placeholder='이름'
              value={form.professorName}
              onChange={handleChange}
            />
            <input
              className={`${inputClass} w-[250px]`}
              name='professorPhone'
              placeholder='전화번호'
              value={form.professorPhone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className='mt-[26px] flex gap-2 px-0.5'>
          <button
            type='button'
            className='h-[34px] flex-1 cursor-pointer rounded-md border-none bg-gachon-blue text-[13px] font-bold text-white hover:bg-middle-blue'
            onClick={handleSubmit}
          >
            작성 완료
          </button>
          <button
            type='button'
            className='h-[34px] w-[54px] cursor-pointer rounded-md border-none bg-surface-soft text-[13px] font-semibold text-text-secondary hover:bg-border-default'
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationFormModal;
