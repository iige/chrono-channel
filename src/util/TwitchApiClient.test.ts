import { TwitchApiClient } from "./TwitchApiClient";

var auth = { clientId: "test", helixToken: "test", channelId: "test" };
const twitchClient = new TwitchApiClient(auth);

describe("TwitchApiClient", () => {
  it("Should always fetch with the appropriate headers", async () => {
    const spy = jest.spyOn(twitchClient as any, "fetchWithAuth");
    const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      })
    );
    await twitchClient.getScheduleData();
    await twitchClient.getCategoryData("test");
    await twitchClient.getStreamData();
    expect(spy).toBeCalledTimes(3);
  });

  it("Schedule Data: Should return null if the response is not ok", async () => {
    const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => jest.fn().mockResolvedValue({}),
      })
    );
    const result = await twitchClient.getScheduleData();
    expect(result).toBeNull();
  });

  it("Schedule Data: Returns the json if the response is ok", async () => {
    const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => jest.fn().mockResolvedValue({}),
      })
    );
    const result = await twitchClient.getScheduleData();
    expect(result).not.toBeNull();
  });

  it("Category Data: Should return null if the response is not ok", async () => {
    const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => jest.fn().mockResolvedValue({}),
      })
    );
    const result = await twitchClient.getCategoryData("test");
    expect(result).toBeNull();
  });

  it("Stream Data: Should return null if the response is not ok", async () => {
    const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: false,
        json: () => jest.fn().mockResolvedValue({}),
      })
    );
    const result = await twitchClient.getStreamData();
    expect(result).toBeNull();
  });
});
