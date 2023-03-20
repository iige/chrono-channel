import React, { ReactNode } from "react";
import { UpcomingStreams } from "./UpcomingStreams";
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
import { getNextStream, getStreamLiveStatus, getVacationStatus } from "./util";
import { config } from "../Globals";
import { LiveNow } from "./LiveNow";
import abstractBg from "../assets/abstractBg.jpg";

type ExtensionPanelState = {
  scheduleData: ScheduleApiResponseData | null;
  categoryData: CategoryApiResponseData | null;
  nextStream: Segment | null;
  onVacation: boolean;
  liveNow: boolean;
};

export class ExtensionPanel extends React.Component<{}, ExtensionPanelState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      scheduleData: null,
      categoryData: null,
      nextStream: null,
      onVacation: false,
      liveNow: false,
    };
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
      if (config.debugMode) {
        console.log("schedule data", response);
      }
    };

    const updateCategoryData = (response: CategoryApiResponseData) => {
      this.setState((prevState) => {
        return { ...prevState, categoryData: response };
      });
      if (config.debugMode) {
        console.log("category data", response);
      }
    };

    const updateLiveStatus = (status: boolean) => {
      this.setState((prevState) => {
        return { ...prevState, liveNow: status };
      });
    };

    (window as any).Twitch.ext.onAuthorized(async function (auth: any) {
      const apiClient = new TwitchApiClient(auth);

      // Check if the channel is live
      const streamResponse = await apiClient.getStreamData();
      const liveStatus = getStreamLiveStatus(streamResponse);
      updateLiveStatus(liveStatus);

      // Fetch the upcoming stream schedule for the channel, should get (up to) the next 20 scheduled streams
      const scheduleResponse = await apiClient.getScheduleData();

      const nextStream = getNextStream(scheduleResponse);
      console.log("nextStream", nextStream);

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

    let contentBody = <NoUpcoming onVacation={false} />;

    if (this.state.onVacation) {
      contentBody = <NoUpcoming onVacation={true} />;
    } else if (this.state.liveNow) {
      contentBody = <LiveNow />;
      contentStyle.background = `linear-gradient(rgba(32,28,43,0.85), rgba(32,28,43,0.85)), url(${abstractBg}) center / cover no-repeat`;
    } else {
      if (this.state.categoryData) {
        categoryUrl = this.state.categoryData.data[0].box_art_url
          .replace("{width}", "270")
          .replace("{height}", "360");
        console.log("categoryUrl: " + categoryUrl);
        contentStyle.background = `linear-gradient(rgba(32,28,43,0.8), rgba(32,28,43,0.8)), url(${categoryUrl}) center / contain no-repeat`;
      }

      if (this.state.nextStream && this.state.scheduleData) {
        timeDisplay = (
          <TimeDisplay streamStartTime={this.state.nextStream.start_time} />
        );

        contentBody = (
          <>
            {timeDisplay}
            <UpcomingStreams
              schedule={this.state.scheduleData}
            ></UpcomingStreams>
            <Timezone />
          </>
        );
      }
    }

    return (
      <div className="flex min-h-full flex-col">
        <Header
          channelName={this.state.scheduleData?.data.broadcaster_name ?? ""}
        />
        <div
          className="flex grow flex-col justify-center bg-twitchDarkPurple"
          id="extensionContent"
          style={contentStyle}
        >
          {contentBody}
        </div>
      </div>
    );
  }
}
