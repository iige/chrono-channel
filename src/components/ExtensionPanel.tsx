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
import { NoUpcoming } from "./NoUpcoming";
import { TwitchApiClient } from "../TwitchApiClient";
import { getVacationStatus } from "./util";

type ExtensionPanelState = {
  scheduleData: ScheduleApiResponseData | null;
  categoryData: CategoryApiResponseData | null;
  nextStream: Segment | null;
  onVacation: boolean;
};

export class ExtensionPanel extends React.Component<{}, ExtensionPanelState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      scheduleData: null,
      categoryData: null,
      nextStream: null,
      onVacation: false,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<ExtensionPanelState>,
    snapshot?: any
  ): void {
    console.log(this.state);
  }

  async fetchData(): Promise<void> {
    const updateScheduleData = (
      response: ScheduleApiResponseData,
      nextStream: Segment | null
    ) => {
      const onVacation = getVacationStatus(response);
      this.setState((prevState) => {
        return {
          ...prevState,
          scheduleData: response,
          nextStream: nextStream,
          onVacation: onVacation,
        };
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
      const apiClient = new TwitchApiClient(auth);

      // Fetch the upcoming stream schedule for the channel, should get (up to) the next 20 scheduled streams
      const scheduleResponse = await apiClient.getScheduleData();

      const nextStream =
        scheduleResponse.data.segments.length > 0
          ? scheduleResponse.data.segments[0]
          : null;

      // If next stream has a category specified - fetch the category data so we can use the box art
      if (nextStream?.category?.id) {
        const categoryResponse = await apiClient.getCategoryData(
          nextStream.category.id
        );
        updateCategoryData(categoryResponse);
      }

      updateScheduleData(scheduleResponse, nextStream);
    });
  }

  componentDidMount() {
    this.fetchData();
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

    let contentBody;

    if (this.state.onVacation) {
      contentBody = <NoUpcoming />;
    } else {
      if (this.state.categoryData) {
        categoryUrl = this.state.categoryData.data[0].box_art_url
          .replace("{width}", "270")
          .replace("{height}", "360");
        console.log("categoryUrl: " + categoryUrl);
        contentStyle.background = `linear-gradient(rgba(32,28,43,0.8), rgba(32,28,43,0.8)), url(${categoryUrl}) center / contain no-repeat`;
      }

      contentBody = (
        <>
          {timeDisplay}
          <DaysOfTheWeek></DaysOfTheWeek>
          <Timezone></Timezone>
        </>
      );
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
          {contentBody}
        </div>
      </div>
    );
  }
}
