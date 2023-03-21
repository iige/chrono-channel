import { render, screen } from "@testing-library/react";
import { DateTime } from "luxon";
import { Offset } from "./Offset";

describe("Offset", () => {
  it("displays the user's current offset (local)", () => {
    const now = DateTime.now();
    render(<Offset />);
    const offsetElement = screen.getByText(now.offsetNameShort);
    expect(offsetElement).toBeInTheDocument();
  });
});
