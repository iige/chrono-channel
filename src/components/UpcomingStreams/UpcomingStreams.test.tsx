import { render, screen } from "@testing-library/react";
import { ScheduleApiResponse, Segment } from "../types";
import { UpcomingStreams } from "./UpcomingStreams";
import { DateTime } from "luxon";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
let mockScheduleResponse: RecursivePartial<ScheduleApiResponse>;
const daysOfTheWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

describe("UpcomingStreams", () => {
  beforeEach(() => {
    mockScheduleResponse = {
      data: {
        segments: [],
      },
    };
  });

  it("Displays all days of the week", () => {
    render(
      <UpcomingStreams schedule={mockScheduleResponse as ScheduleApiResponse} />
    );
    daysOfTheWeek.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("Makes the current day glow", () => {
    const today = DateTime.now().weekdayShort.toUpperCase();
    render(
      <UpcomingStreams schedule={mockScheduleResponse as ScheduleApiResponse} />
    );
    expect(screen.getByText(today)).toHaveClass("glow");
  });

  it("Does not make days other than the current day glow", () => {
    const today = DateTime.now().weekdayShort.toUpperCase();
    render(
      <UpcomingStreams schedule={mockScheduleResponse as ScheduleApiResponse} />
    );
    daysOfTheWeek.forEach((day) => {
      if (day === today) {
        return;
      }
      expect(screen.getByText(day)).not.toHaveClass("glow");
    });
  });

  it("Properly displays the start time of any streams scheduled for the week", () => {
    // Making a fake stream segment that starts at 1:30 AM every day of the week
    const startOfTheWeek = DateTime.now()
      .startOf("week")
      .plus({ hours: 1, minutes: 30 });
    for (var i = 0; i < 7; i++) {
      const testDay = startOfTheWeek.plus({ days: i });
      const segment = {
        start_time: testDay.toISO(),
        canceled_until: null,
      } as Segment;
      if (mockScheduleResponse.data?.segments) {
        mockScheduleResponse.data.segments.push(segment);
      }
    }
    render(
      <UpcomingStreams schedule={mockScheduleResponse as ScheduleApiResponse} />
    );

    screen.getAllByRole("heading", { level: 3 }).forEach((heading) => {
      expect(heading).toHaveTextContent("1");
      expect(heading).toHaveTextContent(":30");
      expect(heading).toHaveTextContent("AM");
    });
  });

  it("Displays the right meridian for the start time of any streams scheduled for the week", () => {
    // Making a fake stream segment that starts at 1:30 PM every day of the week
    const startOfTheWeek = DateTime.now()
      .startOf("week")
      .plus({ hours: 13, minutes: 30 });
    for (var i = 0; i < 7; i++) {
      const testDay = startOfTheWeek.plus({ days: i });
      const segment = {
        start_time: testDay.toISO(),
        canceled_until: null,
      } as Segment;
      if (mockScheduleResponse.data?.segments) {
        mockScheduleResponse.data.segments.push(segment);
      }
    }
    render(
      <UpcomingStreams schedule={mockScheduleResponse as ScheduleApiResponse} />
    );

    screen.getAllByRole("heading", { level: 3 }).forEach((heading) => {
      expect(heading).toHaveTextContent("PM");
    });
  });
});
