import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ScreenComponent from "./Notes";
import { api } from "@/api/client";

const mockNavigate = vi.fn();

vi.mock("@/api/client", () => ({
  api: { POST: vi.fn() },
}));

vi.mock("@/lib/navigate", () => ({
  useNavigate: () => mockNavigate,
}));

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/notes"]}>
      <ScreenComponent />
    </MemoryRouter>,
  );
}

describe("Notes screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("[AC-011] creates a new empty note owned by the signed-in user and opens it in the editor", async () => {
    const note = {
      id: crypto.randomUUID(),
      title: "",
      contentHtml: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (api.POST as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: note,
      response: { status: 201 },
    });

    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByTestId("new-note-btn"));

    await waitFor(() => expect(api.POST).toHaveBeenCalledWith("/notes", {}));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("note-detail", { state: { note } }),
    );
  });

  it("[AC-011] shows an error and stays on the note list when note creation fails", async () => {
    (api.POST as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: undefined,
      response: { status: 500 },
    });

    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByTestId("new-note-btn"));

    expect(
      await screen.findByText("Something went wrong creating your note. Try again."),
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
