import { DateTime } from "luxon";
import { config } from "../Globals";
import { ScheduleApiResponse, Segment, StreamApiResponse } from "./types";

/**
 *
 * @param scheduleData The schedule data as returned by the Twitch API
 * @returns boolean indicating whether the streamer is on vacation
 */
export function getVacationStatus(scheduleData: ScheduleApiResponse): boolean {
  if (scheduleData.data.vacation) {
    try {
      const vacationStart = DateTime.fromISO(
        scheduleData.data.vacation.start_time
      );
      const vacationEnd = DateTime.fromISO(scheduleData.data.vacation.end_time);
      const now = DateTime.now();
      if (now >= vacationStart && now <= vacationEnd) {
        return true;
      }
    } catch (e) {
      if (config.debugMode) {
        console.log(e);
      }
    }
  }
  return false;
}

/**
 *
 * @param scheduleResponse The schedule data as returned by the Twitch API
 * @returns The segment of the next valid stream, or null if there is no next stream
 */
export function getNextStream(
  scheduleResponse: ScheduleApiResponse
): Segment | null {
  const segments = scheduleResponse.data.segments;
  for (var i = 0; i < segments.length; i++) {
    const currentSegment = segments[i];
    try {
      const now = DateTime.now();
      const startTime = DateTime.fromISO(currentSegment.start_time);
      if (now < startTime && currentSegment.canceled_until === null) {
        return currentSegment;
      }
    } catch (e) {
      if (config.debugMode) {
        console.log(e);
      }
      continue;
    }
  }
  return null;
}

export function getStreamLiveStatus(
  streamResponse: StreamApiResponse
): boolean {
  if (streamResponse.data.length > 0) {
    return streamResponse.data[0].type === "live";
  }
  return false;
}
