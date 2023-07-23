import {
  CategoryApiResponse,
  GetUserApiResponse,
  ScheduleApiResponse,
  StreamApiResponse,
} from "../components/types";

/** This class is a collection of functions for interacting with the Twitch API for this panel extension */
export class TwitchApiClient {
  auth: any;
  constructor(auth: any) {
    this.auth = auth;
  }

  // This is a helper function that adds the required headers to the request for use with the Twitch API
  private async fetchWithAuth(url: string): Promise<Response> {
    return await fetch(url, {
      headers: {
        "Client-Id": `${this.auth.clientId}`,
        Authorization: `Extension ${this.auth.helixToken}`,
      },
    });
  }

  /**
   *  Fetches the schedule data from the Twitch API for the channel which the extension is installed on
   * @returns The schedule data as returned by the Twitch API, or null if there was an error
   */
  async getScheduleData(): Promise<ScheduleApiResponse | null> {
    try {
      const scheduleResponse = await this.fetchWithAuth(
        `https://api.twitch.tv/helix/schedule?broadcaster_id=${this.auth.channelId}`
      );

      if (scheduleResponse.ok) {
        const scheduleResponseJson = await scheduleResponse.json();
        return scheduleResponseJson;
      } else {
        return null;
      }
    } catch (e) {
      console.log("Error fetching schedule data: ", e);
      return null;
    }
  }

  /**
   * Gets extra medatada for a Category on Twitch
   *
   * @param categoryId The ID of the category to fetch data for
   * @returns The category data as returned by the Twitch API, or null if there was an error
   */
  async getCategoryData(
    categoryId: string
  ): Promise<CategoryApiResponse | null> {
    try {
      const categoryResponse = await this.fetchWithAuth(
        `https://api.twitch.tv/helix/games?id=${categoryId}`
      );
      if (categoryResponse.ok) {
        const categoryResponseJson = await categoryResponse.json();
        return categoryResponseJson;
      } else {
        return null;
      }
    } catch (e) {
      console.log("Error fetching category data: ", e);
      return null;
    }
  }

  /**
   * Gets information about the current stream from the Twitch API.
   * This is used to check if the channel in which this extension is installed on is currently live.
   *
   * @returns The stream data as returned by the Twitch API, or null if there was an error
   */
  async getStreamData(): Promise<StreamApiResponse | null> {
    const streamResponse = await this.fetchWithAuth(
      `https://api.twitch.tv/helix/streams?user_id=${this.auth.channelId}`
    );

    try {
      if (streamResponse.ok) {
        const streamResponseJson = await streamResponse.json();
        return streamResponseJson;
      } else {
        return null;
      }
    } catch (e) {
      console.log("Error fetching stream data: ", e);
      return null;
    }
  }

  async getUserInfo(channelId: string): Promise<GetUserApiResponse | null> {
    const channelInfoResponse = await this.fetchWithAuth(`https://api.twitch.tv/helix/users?id=${channelId}`);
    try {
      if (channelInfoResponse.ok) {
        const channelInfoResponseJson = await channelInfoResponse.json();
        return channelInfoResponseJson;
      } else {
        return null;
      }
    } catch (e) {
      console.log("Error fetching channel info: ", e);
      return null;
    }
  }
}
