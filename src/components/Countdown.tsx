import React, { ReactNode } from "react";
import { DaysOfTheWeek } from "./DaysOfTheWeek";
import { Header } from "./Header";
import { TimeDisplay } from "./TimeDisplay";
import { Timezone } from "./Timezone";
import {
  CategoryApiResponseData,
  ScheduleApiResponseData,
  Segment,
} from "./types";

type CountdownState = {
  firstMount: boolean;
  scheduleData: ScheduleApiResponseData | null;
  categoryData: CategoryApiResponseData | null;
  nextStream: Segment | null;
};

export class Countdown extends React.Component<{}, CountdownState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      firstMount: true,
      scheduleData: null,
      categoryData: null,
      nextStream: null,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<CountdownState>,
    snapshot?: any
  ): void {
    if (this.state.firstMount !== prevState.firstMount) {
      this.fetchData();
    }
    console.log(this.state);
  }

  async fetchData(): Promise<void> {
    console.log("fetching data");

    const updateScheduleData = (
      response: ScheduleApiResponseData,
      nextStream: Segment | null
    ) => {
      this.setState((prevState) => {
        return { ...prevState, scheduleData: response, nextStream: nextStream };
      });
      console.log("schedule data", response);
    };

    const updateCategoryData = (response: CategoryApiResponseData) => {
      this.setState((prevState) => {
        return { ...prevState, categoryData: response };
      });
      console.log("category data", response);
    };

    (window as any).Twitch.ext.onAuthorized(async function (auth: any) {
      console.log("The Helix JWT is ", auth.helixToken);
      console.log(auth);

      // Fetch the upcoming stream schedule for the channel
      const scheduleResponse = await fetch(
        `https://api.twitch.tv/helix/schedule?broadcaster_id=${auth.channelId}`,
        {
          headers: {
            "Client-Id": `${auth.clientId}`,
            Authorization: `Extension ${auth.helixToken}`,
          },
        }
      );

      const scheduleResponseJson = await scheduleResponse.json();
      const nextStream =
        scheduleResponseJson.data.segments.length > 0
          ? scheduleResponseJson.data.segments[0]
          : null;

      // If there is an upcoming stream, fetch the category data for it
      if (nextStream?.category?.id) {
        const categoryResponse = await fetch(
          `https://api.twitch.tv/helix/games?id=${nextStream.category.id}`,
          {
            headers: {
              "Client-Id": `${auth.clientId}`,
              Authorization: `Extension ${auth.helixToken}`,
            },
          }
        );
        const categoryResponseJson = await categoryResponse.json();
        updateCategoryData(categoryResponseJson);
      }

      updateScheduleData(scheduleResponseJson, nextStream);
    });
  }

  componentDidMount() {
    this.setState({ ...this.state, firstMount: false });
  }

  render(): ReactNode {
    let timeDisplay = <></>;
    let categoryUrl = "";
    let contentStyle: React.CSSProperties = {};

    if (this.state.nextStream) {
      timeDisplay = (
        <TimeDisplay streamStartTime={this.state.nextStream.start_time} />
      );
    }

    if (this.state.categoryData) {
      categoryUrl = this.state.categoryData.data[0].box_art_url
        .replace("{width}", "270")
        .replace("{height}", "360");
      console.log("categoryUrl: " + categoryUrl);
      contentStyle.background = `linear-gradient(rgba(32,28,43,0.8), rgba(32,28,43,0.8)), url(${categoryUrl}) center / contain no-repeat`;
    }

    return (
      <div className="flex min-h-full flex-col">
        <Header
          channelName={this.state.scheduleData?.data.broadcaster_name ?? ""}
        />
        <div
          className="grow bg-twitchDarkPurple"
          id="extensionContent"
          style={contentStyle}
        >
          {timeDisplay}
          <DaysOfTheWeek></DaysOfTheWeek>
          <Timezone></Timezone>
        </div>
      </div>
    );
  }
}
