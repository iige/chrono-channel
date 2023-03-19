import { DateTime } from "luxon";
import { ScheduleApiResponseData } from "./types";

export function getVacationStatus(
  scheduleData: ScheduleApiResponseData
): boolean {
  if (scheduleData.data.vacation) {
    const vacationStart = DateTime.fromISO(
      scheduleData.data.vacation.start_time
    );
    const vacationEnd = DateTime.fromISO(scheduleData.data.vacation.end_time);
    const now = DateTime.now();
    if (now >= vacationStart && now <= vacationEnd) {
      return true;
    }
  }
  return false;
}
