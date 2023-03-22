import { act, render, screen } from "@testing-library/react";
import { ExtensionPanel } from "./ExtensionPanel";
import { TwitchApiClient } from "../../util/TwitchApiClient";
import { StreamApiResponse } from "../types";

describe("ExtensionPanel", () => {
   let mockedTwitchApiClient;
   let windowSpy;
    beforeEach(() => {
    windowSpy = jest.spyOn(global, "window", "get") as jest.Mock;
    windowSpy.mockImplementation(() => ({
        Twitch: {
            ext: {
                onAuthorized: (func: any => {func()}),
            },
        }
    })
    jest.clearAllMocks();
    mockedTwitchApiClient = jest.mock("../../util/TwitchApiClient", () => {
        const notLiveResponse: StreamApiResponse = {
          data: [
            {
              user_name: "testuser",
              type: "live",
            },
          ],
        };
        return {
          getStreamLiveStatus: jest.fn().mockResolvedValue(notLiveResponse),
          getScheduleData: jest.fn(),
          getCategoryData: jest.fn(),
        };
      });
  });

  it("Shows the vacation component if the user is on vacation", () => {

    render(<ExtensionPanel />);
    const vacationElement = screen.getByText("On Vacation");
    expect(vacationElement).toBeInTheDocument();
  });
});
