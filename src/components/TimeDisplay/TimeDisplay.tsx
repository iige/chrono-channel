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
  countdownFinished: boolean;
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
      countdownFinished: false,
    };
  }

  componentDidMount(): void {
    const streamStartDate = this.state.startDate;
    const countdown = setInterval(() => {
      try {
        const startDateJs = DateTime.fromJSDate(streamStartDate);
        const now = DateTime.now();
        if (now < startDateJs) {
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
        } else {
          this.setState({
            ...this.state,
            countdownFinished: true,
          });
          clearInterval(countdown);
        }
      } catch (error) {
        console.log(error);
      }
    }, 1000);

    console.log(`Start Time: ${this.props.streamStartTime}`);
  }

  render() {
    let contentBody = <></>;
    if (this.state.countdownFinished) {
      contentBody = <h2 className="text-3xl">Starting Soon</h2>;
    } else {
      contentBody = (
        <>
          <div className="flex flex-col">
            <h2 className="text-3xl">{this.state.daysUntil}</h2>
            <h3 className="text-xs uppercase">Days</h3>
          </div>
          <span className="self-center px-2 text-5xl">·</span>
          <div className="flex flex-col">
            <h2 className="text-3xl">{this.state.hoursUntil}</h2>
            <h3 className="text-xs uppercase">Hours</h3>
          </div>
          <span className="self-center px-2 text-5xl">·</span>
          <div className="flex flex-col">
            <h2 className="text-3xl">{this.state.minutesUntil}</h2>
            <h3 className="text-xs uppercase">Minutes</h3>
          </div>
          <span className="self-center px-2 text-5xl">·</span>
          <div className="flex flex-col">
            <h2 className="text-3xl">{this.state.secondsUntil}</h2>
            <h3 className="text-xs uppercase">Seconds</h3>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="mt-6 flex flex-row justify-center text-center font-montserrat text-white">
          {contentBody}
        </div>
      </>
    );
  }
}
