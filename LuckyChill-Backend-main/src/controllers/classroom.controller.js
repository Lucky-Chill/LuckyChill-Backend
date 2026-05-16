const { supabaseAdmin } = require("../lib/supabase");
const { keysToCamel } = require("../utils/caseMapper");
const { sendSuccess, sendError } = require("../utils/response");
const {
  getClassroomOrThrow,
  fetchScheduleContext
} = require("../services/classroomService");
const {
  getDatesInMonth,
  buildTimeSlotsForDate,
  getDayOfWeek
} = require("../utils/scheduleUtils");

async function getClassroomById(req, res) {
  try {
    if (!supabaseAdmin) {
      return sendError(
        res,
        500,
        "INTERNAL_SERVER_ERROR",
        "Supabase 서버 설정이 필요합니다."
      );
    }

    const classroom = await getClassroomOrThrow(req.params.classroomId);
    return sendSuccess(res, 200, keysToCamel(classroom));
  } catch (error) {
    if (error.message === "INVALID_SUPABASE_KEY") {
      return sendError(
        res,
        500,
        "CONFIG_ERROR",
        "Supabase API 키가 올바르지 않습니다. Legacy anon/service_role 키를 .env에 넣어주세요."
      );
    }
    if (error.message === "CLASSROOM_NOT_FOUND") {
      return sendError(res, 404, "NOT_FOUND", "강의실을 찾을 수 없습니다.");
    }
    console.error(error);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.");
  }
}

async function getScheduleByDate(req, res) {
  try {
    if (!supabaseAdmin) {
      return sendError(
        res,
        500,
        "INTERNAL_SERVER_ERROR",
        "Supabase 서버 설정이 필요합니다."
      );
    }

    const { classroomId } = req.params;
    const { date } = req.query;

    if (!date) {
      return sendError(res, 400, "BAD_REQUEST", "date 쿼리가 필요합니다.");
    }

    const { timeSlots } = await fetchScheduleContext(classroomId, date);

    return sendSuccess(res, 200, {
      classroomId,
      date,
      timeSlots
    });
  } catch (error) {
    if (error.message === "CLASSROOM_NOT_FOUND") {
      return sendError(res, 404, "NOT_FOUND", "강의실을 찾을 수 없습니다.");
    }
    console.error(error);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.");
  }
}

async function getUnavailableDates(req, res) {
  try {
    if (!supabaseAdmin) {
      return sendError(
        res,
        500,
        "INTERNAL_SERVER_ERROR",
        "Supabase 서버 설정이 필요합니다."
      );
    }

    const { classroomId } = req.params;
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!year || !month) {
      return sendError(
        res,
        400,
        "BAD_REQUEST",
        "year, month 쿼리가 필요합니다."
      );
    }

    await getClassroomOrThrow(classroomId);

    const dates = getDatesInMonth(year, month);
    const unavailableDates = [];

    for (const date of dates) {
      const dayOfWeek = getDayOfWeek(date);

      const { data: classSchedules } = await supabaseAdmin
        .from("class_schedules")
        .select("*")
        .eq("classroom_id", classroomId)
        .eq("day_of_week", dayOfWeek);

      const { data: reservations } = await supabaseAdmin
        .from("reservations")
        .select("start_time, end_time, status")
        .eq("classroom_id", classroomId)
        .eq("reservation_date", date)
        .in("status", ["PENDING", "APPROVED"]);

      const timeSlots = buildTimeSlotsForDate({
        date,
        classSchedules: classSchedules || [],
        reservations: reservations || []
      });

      const allUnavailable = timeSlots.every((slot) => slot.status === "UNAVAILABLE");
      if (allUnavailable) {
        unavailableDates.push(date);
      }
    }

    return sendSuccess(res, 200, {
      classroomId,
      year,
      month,
      unavailableDates
    });
  } catch (error) {
    if (error.message === "CLASSROOM_NOT_FOUND") {
      return sendError(res, 404, "NOT_FOUND", "강의실을 찾을 수 없습니다.");
    }
    console.error(error);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.");
  }
}

module.exports = {
  getClassroomById,
  getScheduleByDate,
  getUnavailableDates
};
