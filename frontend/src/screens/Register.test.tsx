import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import Screen from "./Register";
import { api } from "@/api/client";
import * as apiLib from "@/lib/api";

vi.mock("@/api/client", () => ({
  api: { POST: vi.fn() },
}));

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/register"]}>
      <Screen />
    </MemoryRouter>,
  );
}

async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
  confirm = password,
) {
  await user.type(screen.getByTestId("email-address-input"), email);
  await user.type(screen.getByTestId("password-input"), password);
  await user.type(screen.getByTestId("confirm-password-input"), confirm);
}

describe("Register screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it("[AC-003] shows the invalid email format message and never calls the API", async () => {
    const user = userEvent.setup();
    renderScreen();

    await fillForm(user, "not-an-email", `goodPass${crypto.randomUUID()}`.slice(0, 20));
    await user.click(screen.getByTestId("create-account-btn"));

    expect(await screen.findByText("Enter a valid email address")).toBeInTheDocument();
    expect(api.POST).not.toHaveBeenCalled();
  });

  it("[AC-003] shows the password length message and never calls the API", async () => {
    const user = userEvent.setup();
    renderScreen();

    await fillForm(user, "person@example.com", "short1");
    await user.click(screen.getByTestId("create-account-btn"));

    expect(await screen.findByText("Password must be at least 10 characters")).toBeInTheDocument();
    expect(api.POST).not.toHaveBeenCalled();
  });

  it("[AC-001] submits a valid email and password, stores the session and signs in", async () => {
    const token = crypto.randomUUID();
    const password = `Valid${crypto.randomUUID()}`.slice(0, 16);
    (api.POST as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { token, user: { id: crypto.randomUUID(), email: "new@example.com" } },
      response: { status: 201 },
    });
    const setSessionTokenSpy = vi.spyOn(apiLib, "setSessionToken");

    const user = userEvent.setup();
    renderScreen();

    await fillForm(user, "new@example.com", password);
    await user.click(screen.getByTestId("create-account-btn"));

    await waitFor(() =>
      expect(api.POST).toHaveBeenCalledWith("/auth/register", {
        body: { email: "new@example.com", password },
      }),
    );
    await waitFor(() => expect(setSessionTokenSpy).toHaveBeenCalledWith(token));
  });

  it("[AC-002] shows the taken-email message on a 409 response without revealing note content", async () => {
    const password = `Valid${crypto.randomUUID()}`.slice(0, 16);
    (api.POST as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: undefined,
      response: { status: 409 },
    });

    const user = userEvent.setup();
    renderScreen();

    await fillForm(user, "taken@example.com", password);
    await user.click(screen.getByTestId("create-account-btn"));

    expect(await screen.findByText("This email is already in use")).toBeInTheDocument();
  });
});
