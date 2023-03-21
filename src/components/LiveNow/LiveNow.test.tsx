import { render, screen } from "@testing-library/react";
import { LiveNow } from "./LiveNow";

describe("LiveNow", () => {
  it("displays the text 'Live Now'", () => {
    render(<LiveNow />);
    const liveTextElem = screen.getByText("Live");
    expect(liveTextElem).toBeInTheDocument();
    const nowTextElem = screen.getByText("Now");
    expect(nowTextElem).toBeInTheDocument();
  });
});
