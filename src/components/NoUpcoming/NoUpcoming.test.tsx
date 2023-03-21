import { render, screen } from "@testing-library/react";
import { NoUpcoming } from "./NoUpcoming";

describe("NoUpcoming", () => {
  it("displays 'Nothing Scheduled' when user is not on vacation", () => {
    render(<NoUpcoming onVacation={false} />);
    const nothingScheduledElem = screen.getByText("Nothing Scheduled");
    expect(nothingScheduledElem).toBeInTheDocument();
  });
  it("displays 'On Vacation' when user is on vacation", () => {
    render(<NoUpcoming onVacation={true} />);
    const onVacationElem = screen.getByText("On Vacation");
    expect(onVacationElem).toBeInTheDocument();
  });
  it("displays a sleepy face", () => {
    render(<NoUpcoming onVacation={false} />);
    const sleepyFaceElem = screen.getByAltText("A cartoon sleepy face");
    expect(sleepyFaceElem).toBeInTheDocument();
    expect(sleepyFaceElem).toHaveAttribute("src", "sleepyFace.svg");
  });
  it("Doesn't display 'Nothing Scheduled' when user is on vacation", () => {
    render(<NoUpcoming onVacation={true} />);
    const nothingScheduledElem = screen.queryByText("Nothing Scheduled");
    expect(nothingScheduledElem).not.toBeInTheDocument();
  });
  it("Doesn't display 'On Vacation' when user is not on vacation", () => {
    render(<NoUpcoming onVacation={false} />);
    const onVacationElem = screen.queryByText("On Vacation");
    expect(onVacationElem).not.toBeInTheDocument();
  });
});
