import {
  CategoryApiResponseData,
  ScheduleApiResponseData,
} from "./components/types";

export class TwitchApiClient {
  auth: any;
  constructor(auth: any) {
    this.auth = auth;
  }

  async getScheduleData(): Promise<ScheduleApiResponseData> {
    const scheduleResponse = await fetch(
      `https://api.twitch.tv/helix/schedule?broadcaster_id=${this.auth.channelId}`,
      {
        headers: {
          "Client-Id": `${this.auth.clientId}`,
          Authorization: `Extension ${this.auth.helixToken}`,
        },
      }
    );

    const scheduleResponseJson = await scheduleResponse.json();
    return scheduleResponseJson;
  }

  async getCategoryData(categoryId: string): Promise<CategoryApiResponseData> {
    const categoryResponse = await fetch(
      `https://api.twitch.tv/helix/games?id=${categoryId}`,
      {
        headers: {
          "Client-Id": `${this.auth.clientId}`,
          Authorization: `Extension ${this.auth.helixToken}`,
        },
      }
    );
    const categoryResponseJson = await categoryResponse.json();
    return categoryResponseJson;
  }
}
