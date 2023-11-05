/* eslint-disable testing-library/no-node-access */
import { act, render, screen } from "@testing-library/react";
import { DateTime } from "luxon";
import { TimeDisplay } from "./TimeDisplay";

describe("TimeDisplay", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("Displays 'Starting Soon' if the current time is after the stream starting time", () => {
    const streamStartTime = DateTime.now().minus({ minutes: 1 }).toISO(); // Set the stream start time to 1 minute ago
    render(<TimeDisplay streamStartTime={streamStartTime} />);
    const startingSoonElement = screen.getByText("Starting Soon");
    expect(startingSoonElement).toBeInTheDocument();
  });

  it("Displays a countdown time if the current time is before the stream starting time", () => {
    const streamStartTime = DateTime.now().plus({ hours: 1 }).toISO(); // Set the stream start time to 1 hour from now
    render(<TimeDisplay streamStartTime={streamStartTime} />);
    const textToFind = ["Days", "Hours", "Minutes", "Seconds"];
    textToFind.forEach((word) => {
      const element = screen.getByText(word);
      expect(element).toBeInTheDocument();
    });
    const countdownNumbers = screen.getAllByRole("heading", { level: 2 });
    expect(countdownNumbers.length).toBe(4); // There should be 4 numbers in the countdown
  });

  it("Properly advances the second counter", async () => {
    const streamStartTime = DateTime.now().plus({ seconds: 5 }).toISO(); // Set the stream start time to 5 seconds from now
    render(<TimeDisplay streamStartTime={streamStartTime} />);
    const secondElem = document.getElementById("secondCountNumber");
    act(() => {
      jest.advanceTimersByTime(1000); // Advance the timer by 1 second
    });
    expect(secondElem?.textContent).toBe("4");
  });

  it("Properly advances the minute counter", async () => {
    const streamStartTime = DateTime.now().plus({ minutes: 5 }).toISO(); // Set the stream start time to 5 minutes from now
    render(<TimeDisplay streamStartTime={streamStartTime} />);
    const minuteElem = document.getElementById("minuteCountNumber");
    act(() => {
      jest.advanceTimersByTime(1000 * 60); // Advance the timer by 1 minute
    });
    expect(minuteElem?.textContent).toBe("4");
  });

  it("Properly advances the hour counter", async () => {
    const streamStartTime = DateTime.now().plus({ hours: 5 }).toISO(); // Set the stream start time to 5 hours from now
    render(<TimeDisplay streamStartTime={streamStartTime} />);
    const hourElem = document.getElementById("hourCountNumber");
    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 60); // Advance the timer by 1 hour
    });
    expect(hourElem?.textContent).toBe("4");
  });

  it("Properly advances the day counter", async () => {
    const streamStartTime = DateTime.now().plus({ days: 5 }).toISO(); // Set the stream start time to 5 days from now
    render(<TimeDisplay streamStartTime={streamStartTime} />);
    const dayElem = document.getElementById("dayCountNumber");
    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 60 * 24); // Advance the timer by 1 day
    });
    expect(dayElem?.textContent).toBe("4");
  });

  it("Uses proper pluralization (singular)", async () => {
    const streamStartTime = DateTime.now().plus({ days: 1, hours: 1, minutes: 1, seconds: 2 }).toISO(); // Offset all units by 1, except seconds
    render(<TimeDisplay streamStartTime={streamStartTime} />);
    const dayNoun = document.getElementById("dayNoun");
    const hourNoun = document.getElementById("hourNoun");
    const minuteNoun = document.getElementById("minuteNoun");
    const secondNoun = document.getElementById("secondNoun");
    act(() => {
      jest.advanceTimersByTime(1000); // Advance the timer by 1 second (makes the component update and use pluralize function)
    });
    expect(dayNoun?.textContent).toBe("Day");
    expect(hourNoun?.textContent).toBe("Hour");
    expect(minuteNoun?.textContent).toBe("Minute");
    expect(secondNoun?.textContent).toBe("Second");
  });

  it("Uses proper pluralization (plural)", async () => {
    const streamStartTime = DateTime.now().plus({ days: 2, hours: 2, minutes: 2, seconds: 3 }).toISO(); // Offset all units by 2, except seconds
    render(<TimeDisplay streamStartTime={streamStartTime} />);
    const dayNoun = document.getElementById("dayNoun");
    const hourNoun = document.getElementById("hourNoun");
    const minuteNoun = document.getElementById("minuteNoun");
    const secondNoun = document.getElementById("secondNoun");
    act(() => {
      jest.advanceTimersByTime(1000); // Advance the timer by 1 second (makes the component update and use pluralize function)
    });
    expect(dayNoun?.textContent).toBe("Days");
    expect(hourNoun?.textContent).toBe("Hours");
    expect(minuteNoun?.textContent).toBe("Minutes");
    expect(secondNoun?.textContent).toBe("Seconds");
  });
});
