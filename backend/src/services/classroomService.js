const { supabaseAdmin } = require("../lib/supabase");
const {
  getDayOfWeek,
  buildTimeSlotsForDate
} = require("../utils/scheduleUtils");

async function getClassroomOrThrow(classroomId) {
  const { data, error } = await supabaseAdmin
    .from("classrooms")
    .select("*")
    .eq("id", classroomId)
    .single();

  if (error) {
    if (error.message?.includes("Invalid API key")) {
      const err = new Error("INVALID_SUPABASE_KEY");
      err.code = "CONFIG_ERROR";
      throw err;
    }
    if (error.code === "PGRST116") {
      const err = new Error("CLASSROOM_NOT_FOUND");
      err.code = "NOT_FOUND";
      throw err;
    }
    throw error;
  }

  if (!data) {
    const err = new Error("CLASSROOM_NOT_FOUND");
    err.code = "NOT_FOUND";
    throw err;
  }

  return data;
}

async function fetchScheduleContext(classroomId, date) {
  await getClassroomOrThrow(classroomId);

  const dayOfWeek = getDayOfWeek(date);

  const { data: classSchedules, error: scheduleError } = await supabaseAdmin
    .from("class_schedules")
    .select("*")
    .eq("classroom_id", classroomId)
    .eq("day_of_week", dayOfWeek);

  if (scheduleError) {
    throw scheduleError;
  }

  const { data: reservations, error: reservationError } = await supabaseAdmin
    .from("reservations")
    .select("start_time, end_time, status")
    .eq("classroom_id", classroomId)
    .eq("reservation_date", date)
    .in("status", ["PENDING", "APPROVED"]);

  if (reservationError) {
    throw reservationError;
  }

  const timeSlots = buildTimeSlotsForDate({
    date,
    classSchedules: classSchedules || [],
    reservations: reservations || []
  });

  return { timeSlots, classSchedules: classSchedules || [], reservations: reservations || [] };
}

module.exports = {
  getClassroomOrThrow,
  fetchScheduleContext
};
