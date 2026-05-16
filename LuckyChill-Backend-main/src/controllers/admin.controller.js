const { keysToCamel } = require("../utils/caseMapper");
const { sendSuccess, sendError } = require("../utils/response");
const { intervalsOverlap } = require("../utils/scheduleUtils");

async function getAdminReservations(req, res) {
  try {
    const status = req.query.status || "PENDING";

    const { data, error } = await req.supabaseAdmin
      .from("reservations")
      .select(
        `
        id,
        reservation_date,
        start_time,
        end_time,
        title,
        applicant_name,
        applicant_department,
        status,
        classrooms ( name )
      `
      )
      .eq("status", status)
      .order("created_at", { ascending: true });

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
        applicant_name: row.applicant_name,
        applicant_department: row.applicant_department,
        status: row.status
      })
    );

    return sendSuccess(res, 200, items);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.");
  }
}

async function updateReservationStatus(req, res) {
  try {
    const { reservationId } = req.params;
    const { status, adminMemo } = req.body;

    if (!["APPROVED", "REJECTED", "CANCELLED"].includes(status)) {
      return sendError(
        res,
        400,
        "BAD_REQUEST",
        "status는 APPROVED, REJECTED, CANCELLED 중 하나여야 합니다."
      );
    }

    const { data: target, error: fetchError } = await req.supabaseAdmin
      .from("reservations")
      .select("*")
      .eq("id", reservationId)
      .single();

    if (fetchError || !target) {
      return sendError(res, 404, "NOT_FOUND", "예약을 찾을 수 없습니다.");
    }

    if (status === "APPROVED") {
      const { data: approvedList, error: overlapError } = await req.supabaseAdmin
        .from("reservations")
        .select("id, start_time, end_time")
        .eq("classroom_id", target.classroom_id)
        .eq("reservation_date", target.reservation_date)
        .eq("status", "APPROVED")
        .neq("id", reservationId);

      if (overlapError) {
        console.error(overlapError);
        return sendError(res, 500, "INTERNAL_SERVER_ERROR", "중복 검사에 실패했습니다.");
      }

      const targetStart =
        typeof target.start_time === "string"
          ? target.start_time.slice(0, 5)
          : target.start_time;
      const targetEnd =
        typeof target.end_time === "string"
          ? target.end_time.slice(0, 5)
          : target.end_time;

      const hasOverlap = (approvedList || []).some((item) => {
        const start =
          typeof item.start_time === "string"
            ? item.start_time.slice(0, 5)
            : item.start_time;
        const end =
          typeof item.end_time === "string"
            ? item.end_time.slice(0, 5)
            : item.end_time;
        return intervalsOverlap(targetStart, targetEnd, start, end);
      });

      if (hasOverlap) {
        return sendError(
          res,
          409,
          "CONFLICT",
          "이미 승인된 예약과 시간이 겹칩니다."
        );
      }
    }

    const { data, error } = await req.supabaseAdmin
      .from("reservations")
      .update({
        status,
        admin_memo: adminMemo || null
      })
      .eq("id", reservationId)
      .select("id, status")
      .single();

    if (error) {
      console.error(error);
      return sendError(res, 500, "INTERNAL_SERVER_ERROR", "상태 변경에 실패했습니다.");
    }

    return sendSuccess(res, 200, {
      reservationId: data.id,
      status: data.status
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, "INTERNAL_SERVER_ERROR", "서버 오류가 발생했습니다.");
  }
}

module.exports = {
  getAdminReservations,
  updateReservationStatus
};
