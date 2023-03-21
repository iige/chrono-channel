import { render, screen } from "@testing-library/react";
import { LiveNow } from "./LiveNow";

describe("LiveNow", () => {
  it("displays the text 'Live Now'", () => {
    render(<LiveNow />);
    const liveText = screen.getByText("Live");
    expect(liveText).toBeInTheDocument();
    const nowText = screen.getByText("Now");
    expect(nowText).toBeInTheDocument();
  });
});
