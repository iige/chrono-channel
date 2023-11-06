/**
 * This is the main component for the extension panel. It is responsible for fetching various data from the Twitch API and determining what to display
 */

import React, { ReactNode } from "react";
import { UpcomingStreams } from "../UpcomingStreams/UpcomingStreams";
import { Header } from "../Header/Header";
import { TimeDisplay } from "../TimeDisplay/TimeDisplay";
import { Offset } from "../Offset/Offset";
import { CategoryApiResponse, ScheduleApiResponse, Segment } from "../types";
import { NoUpcoming } from "../NoUpcoming/NoUpcoming";
import { TwitchApiClient } from "../../util/TwitchApiClient";
import { getNextStream, getStreamLiveStatus, getVacationStatus } from "./util";
import { LiveText } from "../LiveText/LiveText";
import hexagonBg from "../../assets/hexagonBg.png";
import ReactGA from "react-ga4";

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
    ReactGA.event({ category: "Extension", action: "Panel Loaded" });
  }

  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<ExtensionPanelState>, snapshot?: any): void {
    if (this.state.scheduleData !== prevState.scheduleData) {
      ReactGA.event({ category: "Extension", action: "Schedule Data Loaded", label: this.state.scheduleData?.data.broadcaster_name ?? "Unknown"});
    }
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
      console.log("schedule data", response);
    };

    const updateCategoryData = (response: CategoryApiResponse) => {
      this.setState((prevState) => {
        return { ...prevState, categoryData: response };
      });
      console.log("category data", response);
    };

    const updateLiveStatus = (status: boolean) => {
      this.setState((prevState) => {
        return { ...prevState, liveNow: status };
      });
    };
    // End state update functions

    // This is the callback that the Twitch extension helper provides us. Will update whenever the JWT is refreshed
    (window as any).Twitch.ext.onAuthorized(async function (auth: any) {
      const apiClient = new TwitchApiClient(auth);

      // Check if the channel is live
      const liveStatusResponse = await apiClient.getStreamData();

      if (liveStatusResponse) {
        const liveStatus = getStreamLiveStatus(liveStatusResponse);
        updateLiveStatus(liveStatus);
      }

      // Fetch the upcoming stream schedule for the channel, should get (up to) the next 20 scheduled streams
      const scheduleResponse = await apiClient.getScheduleData();
      let nextStream = null;
      if (scheduleResponse) {
        nextStream = getNextStream(scheduleResponse);
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

      // Update the state with the schedule data for the channel's upcoming streams
      if (scheduleResponse) {
        updateScheduleData(scheduleResponse, nextStream);
        
      }
    });
  }

  /**
   * This function determines what content to display in the extension panel based on the current state, as well as the appropriate styles.
   *
   * Depending on what information we get from the Twitch API, we may display a "No upcoming streams" message, a "Live now" message, or the countdown timer with upcoming streams
   * @returns An object containing the content body to display and the style to apply to the content body
   */
  determineContentBody(): {
    contentBody: ReactNode;
    contentBodyStyle: React.CSSProperties;
  } {
    let categoryUrl = hexagonBg;
    let contentBodyStyle: React.CSSProperties = {};

    let contentBody = <NoUpcoming onVacation={false} />; // Default to "No upcoming streams" or "Nothing Scheduled" message

    const hasDataForMainDisplay =
      this.state.scheduleData && this.state.nextStream;

    if (this.state.onVacation) {
      contentBody = <NoUpcoming onVacation={true} />;
    } else if (hasDataForMainDisplay) {
      if (this.state.categoryData) {
        // If we have category data, use the box art as the background
        categoryUrl = this.state.categoryData.data[0].box_art_url
          .replace("{width}", "270")
          .replace("{height}", "360");
        console.log("categoryUrl: " + categoryUrl);
        contentBodyStyle.background = `linear-gradient(rgba(32,28,43,0.8), rgba(32,28,43,0.8)), url(${categoryUrl}) center / contain no-repeat`;
      } else {
        contentBodyStyle.background = `linear-gradient(rgba(32,28,43,0.92), rgba(32,28,43,0.92)), url(${categoryUrl}) center`;
      }
      contentBody = (
        <>
          {this.state.liveNow && <LiveText />}
          {this.state.nextStream && !this.state.liveNow && (
            <TimeDisplay streamStartTime={this.state.nextStream.start_time} />
          )}
          {this.state.scheduleData && (
            <UpcomingStreams
              schedule={this.state.scheduleData}
            ></UpcomingStreams>
          )}
          <Offset />
        </>
      );
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
