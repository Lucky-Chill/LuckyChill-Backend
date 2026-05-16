const { keysToCamel, keysToSnake } = require("../utils/caseMapper");
const { sendSuccess, sendError } = require("../utils/response");
const { fetchScheduleContext } = require("../services/classroomService");
const { isRangeAvailable } = require("../utils/scheduleUtils");

const REQUIRED_FIELDS = [
  "classroomId",
  "reservationDate",
  "startTime",
  "endTime",
  "title",
  "participantInfo",
  "eventType",
  "reason",
  "applicantName",
  "applicantDepartment",
  "applicantStudentId",
  "applicantPhone",
  "professorName",
  "professorPhone"
];

async function createReservation(req, res) {
  try {
    const body = req.body;

    for (const field of REQUIRED_FIELDS) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return sendError(
          res,
          400,
          "BAD_REQUEST",
          `${field}는 필수입니다.`
        );
      }
    }

    if (body.eventType === "ETC" && !body.eventTypeEtc) {
      return sendError(
        res,
        400,
        "BAD_REQUEST",
        "eventType이 ETC일 때 eventTypeEtc는 필수입니다."
      );
    }

    const { timeSlots } = await fetchScheduleContext(
      body.classroomId,
      body.reservationDate
    );

    if (!isRangeAvailable(timeSlots, body.startTime, body.endTime)) {
      return sendError(
        res,
        409,
        "CONFLICT",
        "선택한 시간대는 예약할 수 없습니다."
      );
    }

    const insertPayload = keysToSnake({
      classroomId: body.classroomId,
      userId: req.user.id,
      title: body.title,
      reservationDate: body.reservationDate,
      startTime: body.startTime,
      endTime: body.endTime,
      participantInfo: body.participantInfo,
      eventType: body.eventType,
      eventTypeEtc: body.eventTypeEtc || null,
      useProjector: Boolean(body.useProjector),
      useComputer: Boolean(body.useComputer),
      extraEquipment: body.extraEquipment || "",
      reason: body.reason,
      applicantName: body.applicantName,
      applicantDepartment: body.applicantDepartment,
      applicantStudentId: body.applicantStudentId,
      applicantPhone: body.applicantPhone,
      professorName: body.professorName,
      professorPhone: body.professorPhone,
      status: "PENDING"
    });

    const { data, error } = await req.supabase
      .from("reservations")
      .insert(insertPayload)
      .select("id, status")
      .single();

    if (error) {
      console.error(error);
      return sendError(res, 500, "INTERNAL_SERVER_ERROR", "예약 생성에 실패했습니다.");
    }

    return sendSuccess(res, 201, {
      reservationId: data.id,
      status: data.status
    });
  } catch (error) {
    if (error.message === "CLASSROOM_NOT_FOUND") {
      return sendError(res, 404, "NOT_FOUND", "강의실을 찾을 수 없습니다.");
    }
    console.error(error);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.");
  }
}

async function getMyReservations(req, res) {
  try {
    const { data, error } = await req.supabase
      .from("reservations")
      .select(
        `
        id,
        reservation_date,
        start_time,
        end_time,
        title,
        status,
        classrooms ( name )
      `
      )
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return sendError(res, 500, "INTERNAL_SERVER_ERROR", "조회에 실패했습니다.");
    }

    const items = (data || []).map((row) =>
      keysToCamel({
        id: row.id,
        classroom_name: row.classrooms?.name,
        reservation_date: row.reservation_date,
        start_time:
          typeof row.start_time === "string"
            ? row.start_time.slice(0, 5)
            : row.start_time,
        end_time:
          typeof row.end_time === "string"
            ? row.end_time.slice(0, 5)
            : row.end_time,
        title: row.title,
        status: row.status
      })
    );

    return sendSuccess(res, 200, items);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.");
  }
}

module.exports = {
  createReservation,
  getMyReservations
};
