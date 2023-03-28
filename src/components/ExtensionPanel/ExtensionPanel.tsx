import React, { ReactNode } from "react";
import { UpcomingStreams } from "../UpcomingStreams/UpcomingStreams";
import { Header } from "../Header/Header";
import { TimeDisplay } from "../TimeDisplay/TimeDisplay";
import { Offset } from "../Offset/Offset";
import { CategoryApiResponse, ScheduleApiResponse, Segment } from "../types";
import { NoUpcoming } from "../NoUpcoming/NoUpcoming";
import { TwitchApiClient } from "../../util/TwitchApiClient";
import { getNextStream, getStreamLiveStatus, getVacationStatus } from "./util";
import { config } from "../../util/Globals";
import { LiveNow } from "../LiveNow/LiveNow";
import abstractBg from "../../assets/abstractBg.jpg";

type ExtensionPanelState = {
  scheduleData: ScheduleApiResponse | null;
  categoryData: CategoryApiResponse | null;
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

  componentDidMount() {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    // Begin state update functions
    const updateScheduleData = (
      response: ScheduleApiResponse,
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

    const updateCategoryData = (response: CategoryApiResponse) => {
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
    // End state update functions

    (window as any).Twitch.ext.onAuthorized(async function (auth: any) {
      const apiClient = new TwitchApiClient(auth);

      // Check if the channel is live
      const streamResponse = await apiClient.getStreamData();

      if (streamResponse) {
        const liveStatus = getStreamLiveStatus(streamResponse);
        updateLiveStatus(liveStatus);
      }

      // Fetch the upcoming stream schedule for the channel, should get (up to) the next 20 scheduled streams
      const scheduleResponse = await apiClient.getScheduleData();
      let nextStream = null;
      if (scheduleResponse) {
        nextStream = getNextStream(scheduleResponse);
        console.log("nextStream", nextStream);
      }

      // If next stream has a category specified - fetch the category data so we can use the box art
      if (nextStream?.category?.id) {
        const categoryResponse = await apiClient.getCategoryData(
          nextStream.category.id
        );
        if (categoryResponse) {
          updateCategoryData(categoryResponse);
        }
      }

      if (scheduleResponse) {
        updateScheduleData(scheduleResponse, nextStream);
      }
    });
  }

  determineContentBody(): {
    contentBody: ReactNode;
    contentBodyStyle: React.CSSProperties;
  } {
    let timeDisplay = <></>;
    let categoryUrl = "";
    let contentBodyStyle: React.CSSProperties = {};

    let contentBody = <NoUpcoming onVacation={false} />;

    if (this.state.onVacation) {
      contentBody = <NoUpcoming onVacation={true} />;
    } else if (this.state.liveNow) {
      contentBody = <LiveNow />;
      contentBodyStyle.background = `linear-gradient(rgba(32,28,43,0.85), rgba(32,28,43,0.85)), url(${abstractBg}) center / cover no-repeat`;
    } else {
      if (this.state.nextStream && this.state.scheduleData) {
        timeDisplay = (
          <TimeDisplay streamStartTime={this.state.nextStream.start_time} />
        );

        if (this.state.categoryData) {
          categoryUrl = this.state.categoryData.data[0].box_art_url
            .replace("{width}", "270")
            .replace("{height}", "360");
          if (config.debugMode) {
            console.log("categoryUrl: " + categoryUrl);
          }
          contentBodyStyle.background = `linear-gradient(rgba(32,28,43,0.8), rgba(32,28,43,0.8)), url(${categoryUrl}) center / contain no-repeat`;
        }
        contentBody = (
          <>
            {timeDisplay}
            <UpcomingStreams
              schedule={this.state.scheduleData}
            ></UpcomingStreams>
            <Offset />
          </>
        );
      }
    }
    return { contentBody, contentBodyStyle };
  }

  render(): ReactNode {
    let { contentBody, contentBodyStyle } = this.determineContentBody();
    return (
      <div className="flex min-h-full flex-col">
        <Header
          channelName={this.state.scheduleData?.data.broadcaster_name ?? ""}
        />
        <div
          className="flex grow flex-col justify-center bg-twitchDarkPurple"
          id="extensionContent"
          style={contentBodyStyle}
        >
          {contentBody}
        </div>
      </div>
    );
  }
}
