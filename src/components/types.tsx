// Type for a stream schedule "segment" as noted here: https://dev.twitch.tv/docs/api/reference/#get-channel-stream-schedule
export type Segment = {
  id: string;
  start_time: string;
  end_time: string;
  title: string;
  category: {
    id: string;
    name: string;
  };
  canceled_until: string | null;
  is_recurring: boolean;
};

export type ScheduleApiResponse = {
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

export type CategoryApiResponse = {
  data: {
    id: string;
    name: string;
    box_art_url: string;
    igdb_id: number;
  }[];
};

/* 
  There is more available but this is all we need for now.
  https://dev.twitch.tv/docs/api/reference/#get-streams
*/
export type StreamApiResponse = {
  data: {
    user_name: string;
    type: "live" | "";
  }[];
};

export type GetUserApiResponse = {
  data: {
    id: string;
    login: string;
    display_name: string;
  }[];
};
