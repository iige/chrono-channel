import { DateTime } from "luxon";
import React from "react";
import { ScheduleApiResponse } from "../types";

type UpcomingStreamsProps = {
  schedule: ScheduleApiResponse;
};

type Weekday = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
type WeekdayMetadata = {
  startOfDay?: DateTime;
  glow: boolean;
  hourStart?: number;
  minuteStart?: number;
  meridian?: "AM" | "PM";
};

type UpcomingStreamState = {
  weekdays: Record<Weekday, WeekdayMetadata>;
};

const daysOfWeek: Weekday[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function luxonDayToWeekday(day: DateTime): Weekday {
  const luxonDay = day.weekday;
  switch (luxonDay) {
    case 1:
      return "MON";
    case 2:
      return "TUE";
    case 3:
      return "WED";
    case 4:
      return "THU";
    case 5:
      return "FRI";
    case 6:
      return "SAT";
    case 7:
      return "SUN";
    default:
      throw new Error("Invalid luxon day");
  }
}

export class UpcomingStreams extends React.Component<
  UpcomingStreamsProps,
  UpcomingStreamState
> {
  constructor(props: UpcomingStreamsProps) {
    super(props);
    this.state = {
      weekdays: {
        MON: { glow: false },
        TUE: { glow: false },
        WED: { glow: false },
        THU: { glow: false },
        FRI: { glow: false },
        SAT: { glow: false },
        SUN: { glow: false },
      },
    };
  }

  componentDidMount(): void {
    /*
       Create luxon date for next stream
    */

    try {
      const now = DateTime.now();

      const newState: UpcomingStreamState = {
        weekdays: {
          MON: { glow: false },
          TUE: { glow: false },
          WED: { glow: false },
          THU: { glow: false },
          FRI: { glow: false },
          SAT: { glow: false },
          SUN: { glow: false },
        },
      };

      const startOfCurrentDay = now.startOf("day");

      const segments = this.props.schedule.data.segments;

      // Loop through the next seven days and determine if there are any streams scheduled for that day
      for (var i = 0; i < daysOfWeek.length; i++) {
        // Create Luxon date for the start of the current day
        const daysToAdd = i;
        const startOfNextDay = startOfCurrentDay
          .plus({ days: daysToAdd })
          .startOf("day");
        const nextWeekday = luxonDayToWeekday(startOfNextDay);
        newState.weekdays[nextWeekday].startOfDay = startOfNextDay;

        // Make the current day glow
        if (startOfNextDay.hasSame(now, "day")) {
          newState.weekdays[nextWeekday].glow = true;
        }

        // Check if any of the upcoming streams are planned to start on the day we are currently checking
        for (var j = 0; j < segments.length; j++) {
          const segment = segments[j];
          if (segment.canceled_until !== null) {
            continue;
          }
          const segmentStartTime = DateTime.fromISO(segment.start_time);
          if (segmentStartTime.hasSame(startOfNextDay, "day")) {
            const hour = segmentStartTime.hour;
            const meridian = hour >= 12 ? "PM" : "AM";
            const hourStart = hour > 12 ? hour - 12 : hour;
            newState.weekdays[nextWeekday].hourStart = hourStart;
            newState.weekdays[nextWeekday].minuteStart =
              segmentStartTime.minute;
            newState.weekdays[nextWeekday].meridian = meridian;
          }
        }
      }
      this.setState(newState);
    } catch (e) {
      console.log("Error parsing date", e);
    }
  }


  /*
    Builds the content for the upcoming stream component. Makes the current day of the week first and glow. 
    Displays the start times of streams over the next seven days.
  */
  buildContent() {
    let content = <></>
    const now = DateTime.now();
    const startOfCurrentDay = now.startOf("day");
    let dayIdx = startOfCurrentDay.weekday - 1;
    let count = 0;
    while (count < 7) {
      let day = daysOfWeek[dayIdx];
      let timeJSX = null;
      let className = "";
      let currentDayState = this.state.weekdays[day];
      if (currentDayState.glow) {
        className = "glow";
      }
      if (currentDayState.hourStart && currentDayState.meridian) {
        timeJSX = (
          <>
            <br />
            {currentDayState.hourStart}
            {currentDayState.minuteStart
              ? `:${currentDayState.minuteStart}`
              : ""}
            <br />
            {currentDayState.meridian}
          </>
        );
      }

      content =
        <>
          {content}
          <h3 className={className} key={count}>
            {day}
            {timeJSX}
          </h3>
        </>;

      // Loop Condition Updates
      dayIdx = (dayIdx + 1)
      count++;
      if (dayIdx > 6) {
        dayIdx = 0;
      }
    }
    return content;
  }

  render() {
    return (
      <>
        <div className="col-auto mt-10 grid grid-cols-7 grid-rows-1 px-2 text-center font-montserrat text-xs uppercase text-white">
          {this.buildContent()}
        </div>
      </>
    );
  }
}
