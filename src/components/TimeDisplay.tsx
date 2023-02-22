import React from "react";
import { DateTime } from "luxon";

type TimeDisplayProps = {
  streamStartTime: string;
};

type TimeDisplayState = {
  startDate: Date;
  daysUntil: number;
  hoursUntil: number;
  minutesUntil: number;
  secondsUntil: number;
};

export class TimeDisplay extends React.Component<
  TimeDisplayProps,
  TimeDisplayState
> {
  constructor(props: TimeDisplayProps) {
    super(props);
    this.state = {
      startDate: new Date(props.streamStartTime),
      daysUntil: 0,
      hoursUntil: 0,
      minutesUntil: 0,
      secondsUntil: 0,
    };
  }

  componentDidMount(): void {
    const streamStartDate = this.state.startDate;
    setInterval(() => {
      const now = DateTime.now();
      const startDateJs = DateTime.fromJSDate(streamStartDate);
      const diff = startDateJs
        .diff(now, ["days", "hours", "minutes", "seconds"])
        .toObject();

      const days = diff.days ? Math.floor(diff.days) : 0;
      const hours = diff.hours ? Math.floor(diff.hours) : 0;
      const minutes = diff.minutes ? Math.floor(diff.minutes) : 0;
      const seconds = diff.seconds ? Math.floor(diff.seconds) : 0;

      this.setState({
        ...this.state,
        daysUntil: days,
        hoursUntil: hours,
        minutesUntil: minutes,
        secondsUntil: seconds,
      });
    }, 1000);
  }

  render() {
    return (
      <>
        <p>
          The next stream begins in {this.state.daysUntil} days,{" "}
          {this.state.hoursUntil} hours, {this.state.minutesUntil} minutes,{" "}
          {this.state.secondsUntil} seconds
        </p>
      </>
    );
  }
}
