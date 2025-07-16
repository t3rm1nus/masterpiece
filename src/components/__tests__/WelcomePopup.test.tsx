import React from "react";
import { render, fireEvent } from "@testing-library/react";
import WelcomePopup, { WELCOME_POPUP_KEY } from "../WelcomePopup";
import { LanguageProvider } from "../../LanguageContext";
import MaterialThemeProvider from "../MaterialThemeProvider";

describe("WelcomePopup", () => {
  it("renders Spanish text", () => {
    const { getByText } = render(
      <LanguageProvider>
        <MaterialThemeProvider>
          <WelcomePopup open={true} onClose={() => {}} />
        </MaterialThemeProvider>
      </LanguageProvider>
    );
    expect(getByText(/Durante 46 años/i)).toBeInTheDocument();
  });

  it("calls onClose when clicking overlay or popup", () => {
    const onClose = jest.fn();
    const { getByRole } = render(
      <LanguageProvider>
        <MaterialThemeProvider>
          <WelcomePopup open={true} onClose={onClose} />
        </MaterialThemeProvider>
      </LanguageProvider>
    );
    fireEvent.click(getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });
}); 