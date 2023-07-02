import { render, screen } from "@testing-library/react";
import { LiveText } from "./LiveText";

describe("LiveText", () => {
  it("displays the text 'Live'", () => {
    render(<LiveText />);
    const liveTextElem = screen.getByText("Live");
    expect(liveTextElem).toBeInTheDocument();
  });
});
