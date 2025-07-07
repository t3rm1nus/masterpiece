import React from "react";
import { render, fireEvent } from "@testing-library/react";
import WelcomePopup, { WELCOME_POPUP_KEY } from "../WelcomePopup";

describe("WelcomePopup", () => {
  it("renders Spanish text", () => {
    const { getByText } = render(<WelcomePopup open={true} onClose={() => {}} />);
    expect(getByText(/Durante 46 años/i)).toBeInTheDocument();
  });

  it("calls onClose when clicking overlay or popup", () => {
    const onClose = jest.fn();
    const { getByRole } = render(<WelcomePopup open={true} onClose={onClose} />);
    fireEvent.click(getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });
});
