import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("displays 'Next Stream' when no channel name is provided", () => {
    render(<Header channelName="" />);
    const headerText = screen.getByText("Next Stream");
    expect(headerText).toBeInTheDocument();
  });

  it("displays the proper text when a channel name is provided", () => {
    render(<Header channelName="Streamer" />);
    const headerText = screen.getByText("Streamer's Next Stream");
    expect(headerText).toBeInTheDocument();
  });

  it("Renders the header text in uppercase", () => {
    render(<Header channelName="Streamer" />);
    const headerText = screen.getByText("Streamer's Next Stream");
    expect(headerText).toHaveClass("uppercase");
  });
});
