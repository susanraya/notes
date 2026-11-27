import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ScreenComponent from "./SignIn";
import { api } from "@/api/client";
import * as apiLib from "@/lib/api";

const mockNavigate = vi.fn();

vi.mock("@/api/client", () => ({
  api: { POST: vi.fn() },
}));

vi.mock("@/lib/navigate", () => ({
  useNavigate: () => mockNavigate,
}));

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/sign-in"]}>
      <ScreenComponent />
    </MemoryRouter>,
  );
}

async function fillForm(user: ReturnType<typeof userEvent.setup>, email: string, password: string) {
  await user.type(screen.getByTestId("email-address-input"), email);
  await user.type(screen.getByTestId("password-input"), password);
}

describe("SignIn screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("[AC-005] submits correct credentials, stores the session token and goes to the note list home screen", async () => {
    const token = crypto.randomUUID();
    const password = `pass-${crypto.randomUUID()}`;
    (api.POST as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { token },
      response: { status: 200 },
    });
    const setSessionTokenSpy = vi.spyOn(apiLib, "setSessionToken");

    const user = userEvent.setup();
    renderScreen();

    await fillForm(user, "person@example.com", password);
    await user.click(screen.getByTestId("sign-in-btn"));

    await waitFor(() =>
      expect(api.POST).toHaveBeenCalledWith("/auth/login", {
        body: { email: "person@example.com", password },
      }),
    );
    await waitFor(() => expect(setSessionTokenSpy).toHaveBeenCalledWith(token));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("notes"));
  });

  it("[AC-006] shows the generic incorrect-credentials message and does not store a session token", async () => {
    const password = `pass-${crypto.randomUUID()}`;
    (api.POST as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: undefined,
      response: { status: 401 },
    });
    const setSessionTokenSpy = vi.spyOn(apiLib, "setSessionToken");

    const user = userEvent.setup();
    renderScreen();

    await fillForm(user, "person@example.com", password);
    await user.click(screen.getByTestId("sign-in-btn"));

    expect(await screen.findByText("Email or password is incorrect")).toBeInTheDocument();
    expect(setSessionTokenSpy).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("[AC-006] shows the same generic message for an unknown email as for a wrong password", async () => {
    (api.POST as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: undefined,
      response: { status: 401 },
    });

    const user = userEvent.setup();
    renderScreen();

    await fillForm(user, "nobody@example.com", `pass-${crypto.randomUUID()}`);
    await user.click(screen.getByTestId("sign-in-btn"));

    expect(await screen.findByText("Email or password is incorrect")).toBeInTheDocument();
  });
});
