import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("displays 'Next Stream' when no channel name is provided", () => {
    render(<Header channelName="" />);
    const headerTextElem = screen.getByText("Next Stream");
    expect(headerTextElem).toBeInTheDocument();
  });

  it("displays the proper text when a channel name is provided", () => {
    render(<Header channelName="Streamer" />);
    const headerTextElem = screen.getByText("Streamer's Next Stream");
    expect(headerTextElem).toBeInTheDocument();
  });

  it("Renders the header text in uppercase", () => {
    render(<Header channelName="Streamer" />);
    const headerTextElem = screen.getByText("Streamer's Next Stream");
    expect(headerTextElem).toHaveClass("uppercase");
  });
});
