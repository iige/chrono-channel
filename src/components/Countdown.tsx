import React, { ReactNode } from "react";

// Type for a stream schedule "segment" as noted here: https://dev.twitch.tv/docs/api/reference/#get-channel-stream-schedule
type Segment = {
  id: string;
  start_time: string;
  end_time: string;
  title: string;
  category: {
    id: string;
    name: string;
  };
  canceled_until: string;
  is_recurring: boolean;
};

type ScheduleApiResponseData = {
  data: {
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    segments: Segment[];
    vacation: {
      start_time: string;
      end_time: string;
    } | null;
  };
  pagination: {
    cursor?: string;
  };
};

type CountdownState = {
  firstMount: boolean;
  scheduleData: ScheduleApiResponseData | null;
  nextStream: Segment | null;
};

export class Countdown extends React.Component<{}, CountdownState> {
  constructor(props: {}) {
    super(props);
    this.state = { firstMount: true, scheduleData: null, nextStream: null };
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<CountdownState>,
    snapshot?: any
  ): void {
    if (this.state.firstMount !== prevState.firstMount) {
      this.fetchData();
    }
  }

  async fetchData(): Promise<void> {
    console.log("fetching data");

    const updateScheduleData = (response: ScheduleApiResponseData) => {
      const nextStream =
        response.data.segments.length > 0 ? response.data.segments[0] : null;
      this.setState({
        ...this.state,
        scheduleData: response,
        nextStream: nextStream,
      });
      console.log("schedule data", response);
    };

    (window as any).Twitch.ext.onAuthorized(async function (auth: any) {
      console.log("The Helix JWT is ", auth.helixToken);
      console.log(auth);

      const response = await fetch(
        `https://api.twitch.tv/helix/schedule?broadcaster_id=${auth.channelId}`,
        {
          headers: {
            "Client-Id": `${auth.clientId}`,
            Authorization: `Extension ${auth.helixToken}`,
          },
        }
      );

      const responseJson = await response.json();
      updateScheduleData(responseJson);
    });
  }

  async componentDidMount(): Promise<void> {
    this.setState({ ...this.state, firstMount: false });
  }

  render(): ReactNode {
    return (
      <>
        <p className="text-white">This is where the countdown timer will be.</p>
        {this.state.nextStream && (
          <p>
            {" "}
            The next stream will begin at {this.state.nextStream.start_time}
          </p>
        )}
      </>
    );
  }
}
