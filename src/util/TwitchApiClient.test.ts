import { TwitchApiClient } from "./TwitchApiClient";

/**
 * Note that Create React App sets 'resetMocks' to true by for Jest by default.
 * This means that any mocks you create will be reset between tests.
 * This was causing issues with manually mocking 'fetch' calls mock, so I've set it to false in the package.json
 *
 * Refer to: https://stackoverflow.com/questions/68168516/why-does-my-mock-fetch-always-returns-null-jest
 */

var auth = { clientId: "test", helixToken: "test", channelId: "test" };
const twitchClient = new TwitchApiClient(auth);

describe("TwitchApiClient", () => {
  const fetchSpy = jest.spyOn(global, "fetch") as jest.Mock;
  fetchSpy.mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    })
  );
  it("Should always fetch with the appropriate headers", async () => {
    const spy = jest.spyOn(twitchClient as any, "fetchWithAuth");
    await twitchClient.getScheduleData();
    await twitchClient.getCategoryData("test");
    await twitchClient.getStreamData();
    expect(spy).toBeCalledTimes(3);
  });

  it("Schedule Data: Should return null if the fetch status is not ok", async () => {
    fetchSpy.mockImplementation(() => Promise.resolve({ ok: false }));
    const result = await twitchClient.getScheduleData();
    expect(result).toBeNull();
  });

  it("Schedule Data: Should return an object if the fetch status is ok", async () => {
    fetchSpy.mockImplementation(() =>
      Promise.resolve({ ok: true, json: jest.fn().mockResolvedValue({}) })
    );
    const result = await twitchClient.getScheduleData();
    expect(result).not.toBeNull();
  });

  it("Category Data: Should return null if the fetch status is not ok", async () => {
    fetchSpy.mockImplementation(() => Promise.resolve({ ok: false }));
    const result = await twitchClient.getCategoryData("test");
    expect(result).toBeNull();
  });

  it("Category Data: Should return an object if the fetch status is ok", async () => {
    fetchSpy.mockImplementation(() =>
      Promise.resolve({ ok: true, json: jest.fn().mockResolvedValue({}) })
    );
    const result = await twitchClient.getCategoryData("test");
    expect(result).not.toBeNull();
  });

  it("Stream Data: Should return null if the fetch status is not ok", async () => {
    fetchSpy.mockImplementation(() => Promise.resolve({ ok: false }));
    const result = await twitchClient.getStreamData();
    expect(result).toBeNull();
  });

  it("Stream Data: Should return an object if the fetch status is ok", async () => {
    fetchSpy.mockImplementation(() =>
      Promise.resolve({ ok: true, json: jest.fn().mockResolvedValue({}) })
    );
    const result = await twitchClient.getStreamData();
    expect(result).not.toBeNull();
  });
});
