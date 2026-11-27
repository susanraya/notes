import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import ScreenComponent from "./NoteDetail";

const mockNavigate = vi.fn();

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
