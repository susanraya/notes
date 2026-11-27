import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ScreenComponent from "./NoteDetail";
import { api } from "@/api/client";

const mockNavigate = vi.fn();

vi.mock("@/api/client", () => ({
  api: { GET: vi.fn() },
}));

vi.mock("@/lib/navigate", () => ({
  useNavigate: () => mockNavigate,
}));

function renderScreen(state?: unknown) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/note-detail", state }]}>
      <ScreenComponent />
    </MemoryRouter>,
  );
}

function selectTextNode(node: Node, start: number, end: number) {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

describe("NoteDetail screen", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("[AC-011] opens a freshly created note empty and ready for typing, owned by the account", () => {
    const note = {
      id: crypto.randomUUID(),
      title: "",
      contentHtml: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    renderScreen({ note });

    expect(screen.getByTestId("title-q1-planning-input")).toHaveValue("");
    expect(screen.getByTestId("note-content-agenda-budget-review-input").textContent).toBe("");
    expect(screen.getByText(/Private to susan\.raya@quorq\.ai/)).toBeInTheDocument();
  });

  it("[AC-012] applies bold to the selected text and preserves it in the note content", async () => {
    renderScreen();
    const editor = screen.getByTestId("note-content-agenda-budget-review-input");

    const heading = editor.querySelector("h3") as HTMLElement;
    const textNode = heading.firstChild as Text;
    selectTextNode(textNode, 0, textNode.textContent!.length);
    fireEvent.mouseUp(editor);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("bold-btn"));

    expect(editor.querySelector("h3 strong")?.textContent).toBe("Agenda");
  });

  it("[AC-012] applies a heading to the current block and preserves it in the note content", async () => {
    renderScreen();
    const editor = screen.getByTestId("note-content-agenda-budget-review-input");

    const paragraphs = editor.querySelectorAll("p");
    const target = paragraphs[paragraphs.length - 1] as HTMLElement;
    const originalText = target.textContent;
    const textNode = target.firstChild as Text;
    selectTextNode(textNode, 0, 0);
    fireEvent.mouseUp(editor);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("heading-btn"));

    expect(editor.contains(target)).toBe(false);
    const headings = Array.from(editor.querySelectorAll("h3"));
    expect(headings.some((h) => h.textContent === originalText)).toBe(true);
  });

  it("[AC-012] applies a bulleted list to the current block and preserves it in the note content", async () => {
    renderScreen();
    const editor = screen.getByTestId("note-content-agenda-budget-review-input");

    const paragraphs = editor.querySelectorAll("p");
    const target = paragraphs[paragraphs.length - 1] as HTMLElement;
    const originalText = target.textContent;
    const textNode = target.firstChild as Text;
    selectTextNode(textNode, 0, 0);
    fireEvent.mouseUp(editor);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("bulleted-list-btn"));

    const lastBlock = editor.lastElementChild as HTMLElement;
    expect(lastBlock.tagName).toBe("UL");
    expect(lastBlock.querySelector("li")?.textContent).toBe(originalText);
  });

  it("[AC-012] applies a numbered list to the current block and preserves it in the note content", async () => {
    renderScreen();
    const editor = screen.getByTestId("note-content-agenda-budget-review-input");

    const paragraphs = editor.querySelectorAll("p");
    const target = paragraphs[paragraphs.length - 1] as HTMLElement;
    const originalText = target.textContent;
    const textNode = target.firstChild as Text;
    selectTextNode(textNode, 0, 0);
    fireEvent.mouseUp(editor);

    const user = userEvent.setup();
    await user.click(screen.getByTestId("numbered-list-btn"));

    const lastBlock = editor.lastElementChild as HTMLElement;
    expect(lastBlock.tagName).toBe("OL");
    expect(lastBlock.querySelector("li")?.textContent).toBe(originalText);
  });

  it("[AC-017] opens the note selected from the list with its saved content and formatting intact", async () => {
    const note = {
      id: crypto.randomUUID(),
      title: "Sourdough timings",
      contentHtml: "<h3>Starter</h3><p>Feed at <strong>9am</strong>, then rest.</p>",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    (api.GET as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: note,
      response: { status: 200 },
    });

    renderScreen({ noteId: note.id });

    expect(await screen.findByDisplayValue("Sourdough timings")).toBeInTheDocument();
    expect(api.GET).toHaveBeenCalledWith("/notes/{note_id}", {
      params: { path: { note_id: note.id } },
    });

    const editor = screen.getByTestId("note-content-agenda-budget-review-input");
    await waitFor(() => expect(editor.querySelector("h3")?.textContent).toBe("Starter"));
    expect(editor.querySelector("p strong")?.textContent).toBe("9am");
  });

  it("[AC-017] disables the title and content while the selected note is opening", () => {
    (api.GET as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));

    renderScreen({ noteId: crypto.randomUUID() });

    expect(screen.getByTestId("title-q1-planning-input")).toBeDisabled();
    expect(screen.getByTestId("note-content-agenda-budget-review-input")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("[AC-017] returns to the note list when the selected note cannot be opened", async () => {
    (api.GET as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: undefined,
      response: { status: 404 },
    });

    renderScreen({ noteId: crypto.randomUUID() });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("notes"));
  });

  it("[AC-013] offers no option to add images or file attachments", () => {
    renderScreen();

    const toolbar = screen.getByRole("group", { name: "Format" });
    expect(within(toolbar).getAllByRole("button")).toHaveLength(4);
    expect(screen.queryByRole("button", { name: /image/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /attach/i })).not.toBeInTheDocument();
    expect(
      screen.getByText(/Images and file attachments aren.t supported yet\./),
    ).toBeInTheDocument();
  });
});
