import { DateTime } from "luxon";
import React from "react";
import { config } from "../Globals";
import { ScheduleApiResponseData } from "./types";

type UpcomingStreamsProps = {
  schedule: ScheduleApiResponseData;
};

type Weekday = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
type WeekdayMetadata = {
  startOfDay?: DateTime;
  glow: boolean;
  hourStart?: number;
  meridian?: "AM" | "PM";
};

type UpcomingStreamState = {
  weekdays: Record<Weekday, WeekdayMetadata>;
};

const daysOfWeek: Weekday[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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
      const startOfWeek = now.startOf("week");

      const segments = this.props.schedule.data.segments;

      for (var i = 0; i < daysOfWeek.length; i++) {
        const daysToAdd = i;
        const startOfDay = startOfWeek.plus({ days: daysToAdd }).startOf("day");
        newState.weekdays[daysOfWeek[i]].startOfDay = startOfDay;
        if (startOfDay.hasSame(now, "day")) {
          newState.weekdays[daysOfWeek[i]].glow = true;
        }

        for (var j = 0; j < segments.length; j++) {
          const segment = segments[j];
          if (segment.canceled_until !== null) {
            continue;
          }
          const segmentStartTime = DateTime.fromISO(segment.start_time);
          if (segmentStartTime.hasSame(startOfDay, "day")) {
            const hour = segmentStartTime.hour;
            const meridian = hour >= 12 ? "PM" : "AM";
            const hourStart = hour > 12 ? hour - 12 : hour;
            newState.weekdays[daysOfWeek[i]].hourStart = hourStart;
            newState.weekdays[daysOfWeek[i]].meridian = meridian;
          }
        }
      }

      this.setState(newState);
    } catch (e) {
      if (config.debugMode) {
        console.log("Error parsing date", e);
      }
    }
  }

  render() {
    return (
      <>
        <div className="col-auto mt-9 grid grid-cols-7 grid-rows-1 px-2 text-center font-montserrat text-xs uppercase text-white">
          {daysOfWeek.map((day, idx) => {
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
                  {currentDayState.hourStart} {currentDayState.meridian}
                </>
              );
            }
            return (
              <span className={className} key={idx}>
                {day}
                {timeJSX}
              </span>
            );
          })}
        </div>
      </>
    );
  }
}
