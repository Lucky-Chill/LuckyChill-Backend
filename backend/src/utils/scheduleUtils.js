const SLOT_START_HOUR = 9;
const SLOT_END_HOUR = 22;

function padTime(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function intervalsOverlap(startA, endA, startB, endB) {
  const a1 = timeToMinutes(startA);
  const a2 = timeToMinutes(endA);
  const b1 = timeToMinutes(startB);
  const b2 = timeToMinutes(endB);
  return a1 < b2 && b1 < a2;
}

function generateHourlySlots() {
  const slots = [];
  for (let hour = SLOT_START_HOUR; hour < SLOT_END_HOUR; hour++) {
    slots.push({
      startTime: padTime(hour),
      endTime: padTime(hour + 1)
    });
  }
  return slots;
}

function getDayOfWeek(dateStr) {
  return new Date(`${dateStr}T00:00:00`).getDay();
}

function buildTimeSlotsForDate({ date, classSchedules, reservations }) {
  const baseSlots = generateHourlySlots().map((slot) => ({
    ...slot,
    status: "AVAILABLE"
  }));

  for (const schedule of classSchedules) {
    const start =
      typeof schedule.start_time === "string"
        ? schedule.start_time.slice(0, 5)
        : schedule.start_time;
    const end =
      typeof schedule.end_time === "string"
        ? schedule.end_time.slice(0, 5)
        : schedule.end_time;

    for (const slot of baseSlots) {
      if (intervalsOverlap(slot.startTime, slot.endTime, start, end)) {
        slot.status = "UNAVAILABLE";
        slot.reason = "CLASS";
      }
    }
  }

  for (const reservation of reservations) {
    const start =
      typeof reservation.start_time === "string"
        ? reservation.start_time.slice(0, 5)
        : reservation.start_time;
    const end =
      typeof reservation.end_time === "string"
        ? reservation.end_time.slice(0, 5)
        : reservation.end_time;
    const reason =
      reservation.status === "APPROVED" ? "RESERVATION" : "PENDING";

    for (const slot of baseSlots) {
      if (intervalsOverlap(slot.startTime, slot.endTime, start, end)) {
        slot.status = "UNAVAILABLE";
        slot.reason = reason;
      }
    }
  }

  return baseSlots;
}

function isRangeAvailable(timeSlots, startTime, endTime) {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);

  if (startMin >= endMin) {
    return false;
  }

  for (let minute = startMin; minute < endMin; minute += 60) {
    const slotStart = minutesToTime(minute);
    const slotEnd = minutesToTime(minute + 60);
    const slot = timeSlots.find(
      (s) => s.startTime === slotStart && s.endTime === slotEnd
    );

    if (!slot || slot.status !== "AVAILABLE") {
      return false;
    }
  }

  return true;
}

function getDatesInMonth(year, month) {
  const dates = [];
  const lastDay = new Date(year, month, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    dates.push(`${year}-${mm}-${dd}`);
  }

  return dates;
}

module.exports = {
  SLOT_START_HOUR,
  SLOT_END_HOUR,
  timeToMinutes,
  intervalsOverlap,
  generateHourlySlots,
  getDayOfWeek,
  buildTimeSlotsForDate,
  isRangeAvailable,
  getDatesInMonth
};
