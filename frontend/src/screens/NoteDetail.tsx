// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Label, Select } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Check, X, User, Trash, ArrowLeft, AlertCircle } = Icons;

const NOTE = {
  id: "N-2041",
  title: "Q1 planning",
  folder_id: "f-work",
  tags: ["planning", "q1"],
  created_at: "18 Nov 2026",
  updated_at: "26 Nov 2026",
  content_html:
    '<h3>Agenda</h3><p>Budget review, hiring plan, open risks. <strong>Three decisions needed before 12 Dec.</strong></p><ul><li>Budget review — Nadia walks through the revised Q1 envelope (£1.4m)</li><li>Hiring plan — two engineers, one product designer</li><li>Open risks — Hallam renewal, the data migration window</li></ul><h3>Follow-ups</h3><ol><li>Send the revised envelope to Priya by Friday</li><li>Book the migration window with Infrastructure</li><li>Confirm the designer brief with Studio</li></ol><p>Notes from the 24 Nov pre-read are in the <strong>Research</strong> folder.</p>',
};

const FOLDERS = [
  { id: "", name: "No folder" },
  { id: "f-work", name: "Work" },
  { id: "f-personal", name: "Personal" },
  { id: "f-reading", name: "Reading list" },
  { id: "f-research", name: "Research" },
];

const OWNER_EMAIL = "susan.raya@quorq.ai";

const withAlpha = (hex, a) => {
  const h = String(hex || "#000000").replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  if (Number.isNaN(n)) return `rgba(0,0,0,${a})`;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

const clockNow = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

export default function Screen() {
  const navigate = useNavigate();
  const hair = withAlpha(brand.primaryColor, 0.12);
  const hairSoft = withAlpha(brand.primaryColor, 0.07);
  const surface = withAlpha(brand.primaryColor, 0.035);
  const surfaceHi = withAlpha(brand.primaryColor, 0.06);
  const muted = brand.neutralColor;
  const accent = brand.accentColor;

  const [title, setTitle] = React.useState(NOTE.title);
  const [folder, setFolder] = React.useState(NOTE.folder_id);
  const [tags, setTags] = React.useState(NOTE.tags);
  const [newTag, setNewTag] = React.useState("");
  const [tagError, setTagError] = React.useState("");
  const [saveState, setSaveState] = React.useState("saved"); // saved | saving | error
  const [savedAt, setSavedAt] = React.useState("14:32");
  const [words, setWords] = React.useState(0);
  const [fmt, setFmt] = React.useState({ bold: false, h: false, ul: false, ol: false });
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const editorRef = React.useRef(null);
  const selRef = React.useRef(null);
  const saveTimer = React.useRef(null);
  const deleteTimer = React.useRef(null);
  const attempts = React.useRef(0);
  const deleteBtnRef = React.useRef(null);
  const cancelBtnRef = React.useRef(null);

  const countWords = React.useCallback(() => {
    const text = editorRef.current ? editorRef.current.innerText : "";
    const t = text.trim();
    setWords(t ? t.split(/\s+/).length : 0);
  }, []);

  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML.trim() === "") {
      editorRef.current.innerHTML = NOTE.content_html;
    }
    countWords();
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (deleteTimer.current) clearTimeout(deleteTimer.current);
    };
  }, [countWords]);

  const scheduleSave = React.useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(() => {
      attempts.current += 1;
      if (attempts.current % 5 === 0) {
        setSaveState("error");
      } else {
        setSaveState("saved");
        setSavedAt(clockNow());
      }
    }, 900);
  }, []);

  const retrySave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(() => {
      setSaveState("saved");
      setSavedAt(clockNow());
    }, 700);
  };

  const rememberSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && editorRef.current && editorRef.current.contains(sel.anchorNode)) {
      selRef.current = sel.getRangeAt(0);
    }
  };

  const refreshFormats = () => {
    try {
      const block = String(document.queryCommandValue("formatBlock") || "").toLowerCase();
      setFmt({
        bold: document.queryCommandState("bold"),
        ul: document.queryCommandState("insertUnorderedList"),
        ol: document.queryCommandState("insertOrderedList"),
        h: block === "h3" || block === "<h3>",
      });
    } catch (e) {
      /* selection not in a formattable context */
    }
  };

  const handleInput = () => {
    countWords();
    scheduleSave();
    rememberSelection();
    refreshFormats();
  };

  const exec = (command, value) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (selRef.current && sel) {
      try {
        sel.removeAllRanges();
        sel.addRange(selRef.current);
      } catch (e) {
        /* range no longer valid */
      }
    }
    try {
      document.execCommand(command, false, value);
    } catch (e) {
      /* command unsupported */
    }
    handleInput();
  };

  const toolbar = [
    { id: "b-2-0", glyph: "B", label: "Bold", span: "sm:col-span-2", active: fmt.bold, run: () => exec("bold") },
    {
      id: "b-2-1",
      glyph: "H",
      label: "Heading",
      span: "sm:col-span-3",
      active: fmt.h,
      run: () => exec("formatBlock", fmt.h ? "<p>" : "<h3>"),
    },
    { id: "b-2-2", glyph: "•", label: "Bulleted list", span: "sm:col-span-3", active: fmt.ul, run: () => exec("insertUnorderedList") },
    { id: "b-2-3", glyph: "1.", label: "Numbered list", span: "sm:col-span-4", active: fmt.ol, run: () => exec("insertOrderedList") },
  ];

  const addTag = (e) => {
    e.preventDefault();
    const value = newTag.trim().toLowerCase();
    if (!value) {
      setTagError("Type a tag name first — for example “budget”.");
      return;
    }
    if (value.length > 24) {
      setTagError("Keep tags under 24 characters so they fit the note list.");
      return;
    }
    if (tags.includes(value)) {
      setTagError(`This note already carries “${value}”.`);
      return;
    }
    setTags((t) => [...t, value]);
    setNewTag("");
    setTagError("");
    scheduleSave();
  };

  const removeTag = (value) => {
    setTags((t) => t.filter((x) => x !== value));
    setTagError("");
    scheduleSave();
  };

  const changeFolder = (e) => {
    setFolder(e.target.value);
    scheduleSave();
  };

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => {
    setConfirmOpen(false);
    if (deleteBtnRef.current) deleteBtnRef.current.focus();
  };

  React.useEffect(() => {
    if (!confirmOpen) return undefined;
    if (cancelBtnRef.current) cancelBtnRef.current.focus();
    const onKey = (e) => {
      if (e.key === "Escape" && !deleting) {
        e.preventDefault();
        closeConfirm();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmOpen, deleting]);

  const confirmDelete = () => {
    setDeleting(true);
    deleteTimer.current = setTimeout(() => navigate("notes"), 650);
  };

  const folderName = (FOLDERS.find((f) => f.id === folder) || FOLDERS[0]).name;

  const statusCopy =
    saveState === "saved"
      ? `All changes saved · ${savedAt}`
      : saveState === "saving"
      ? "Saving your changes…"
      : "Not saved — we couldn’t reach your notes";

  return (
    <div
      className="min-h-full w-full px-4 py-8 sm:px-8 sm:py-12"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.primaryColor,
        fontFamily: brand.fontBody,
        ["--vel-accent"]: accent,
        ["--vel-hair"]: hair,
      }}
    >
      <style>{`
        .vel *:focus { outline: none; }
        .vel .vf:focus-visible {
          outline: 2px solid var(--vel-accent);
          outline-offset: 2px;
          border-radius: 4px;
        }
        .vel-rise { animation: velRise .28s cubic-bezier(.2,.7,.3,1) both; }
        .vel-chip { animation: velChip .2s ease-out both; }
        .vel-fade { animation: velFade .18s ease-out both; }
        @keyframes velRise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes velChip { from { opacity: 0; transform: scale(.92); } to { opacity: 1; transform: none; } }
        @keyframes velFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes velPulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
        .vel-pulse { animation: velPulse 1.1s ease-in-out infinite; }
        .vel-prose { line-height: 1.65; }
        .vel-prose h3 {
          font-family: ${brand.fontHeading};
          font-size: 21px;
          line-height: 1.3;
          margin: 28px 0 8px;
          letter-spacing: .01em;
        }
        .vel-prose h3:first-child { margin-top: 0; }
        .vel-prose p { margin: 0 0 16px; }
        .vel-prose ul, .vel-prose ol { margin: 0 0 16px; padding-left: 24px; }
        .vel-prose ul { list-style: disc; }
        .vel-prose ol { list-style: decimal; }
        .vel-prose li { margin: 0 0 6px; padding-left: 4px; }
        .vel-prose li::marker { color: ${accent}; }
        .vel-prose strong { font-weight: 700; }
        .vel-prose:empty::before {
          content: "Start writing — your words save themselves.";
          color: ${muted};
        }
        @media (prefers-reduced-motion: reduce) {
          .vel *, .vel *::before, .vel *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}</style>

      <div className="vel mx-auto w-full max-w-5xl">
        {/* Row 1 ─ back · save status · delete */}
        <div className="grid grid-cols-12 items-center gap-x-4 gap-y-5">
          <div className="col-span-12 sm:col-span-2">
            <button
              type="button"
              data-wf="b-0-0"
              onClick={() => navigate("notes")}
              className="vf group inline-flex items-center gap-2 py-2 text-[13px] transition-colors"
              style={{ color: muted }}
              onMouseEnter={(e) => (e.currentTarget.style.color = brand.primaryColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="text-left">Back to my notes</span>
            </button>
          </div>

          <div className="col-span-12 sm:col-span-6" data-wf="b-0-1">
            <div
              role="status"
              aria-live="polite"
              className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full py-1.5 pl-3 pr-4"
              style={{
                border: `1px solid ${saveState === "error" ? withAlpha(brand.primaryColor, 0.28) : hairSoft}`,
                backgroundColor: saveState === "error" ? surfaceHi : "transparent",
                borderRadius: 999,
              }}
            >
              {saveState === "saved" && <Check className="h-3.5 w-3.5" aria-hidden="true" style={{ color: accent }} />}
              {saveState === "saving" && (
                <span
                  className="vel-pulse inline-block h-2 w-2 rounded-full"
                  aria-hidden="true"
                  style={{ backgroundColor: accent }}
                />
              )}
              {saveState === "error" && <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" style={{ color: brand.primaryColor }} />}
              <span
                className="text-[13px]"
                style={{
                  color: saveState === "error" ? brand.primaryColor : muted,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {statusCopy}
              </span>
              {saveState === "error" && (
                <button
                  type="button"
                  onClick={retrySave}
                  className="vf text-[13px] underline underline-offset-4"
                  style={{ color: accent }}
                >
                  Retry save
                </button>
              )}
            </div>
          </div>

          <div className="col-span-12 flex sm:col-span-4 sm:justify-end">
            <Button
              type="button"
              ref={deleteBtnRef}
              data-wf="b-0-2"
              onClick={openConfirm}
              aria-haspopup="dialog"
              aria-expanded={confirmOpen}
              className="vf inline-flex min-h-[44px] items-center gap-2 px-4 text-[13px] transition-colors"
              style={{
                backgroundColor: "transparent",
                color: brand.primaryColor,
                border: `1px solid ${hair}`,
                borderRadius: brand.radius,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = surfaceHi)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Trash className="h-4 w-4" aria-hidden="true" />
              Delete note
            </Button>
          </div>
        </div>

        <div className="mt-6 h-px w-full" style={{ backgroundColor: hairSoft }} />

        {/* Row 2 ─ title */}
        <div className="mt-8 grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <div className="flex items-baseline justify-between gap-4">
              <Label
                htmlFor="note-title"
                className="text-[11px] font-medium uppercase tracking-[0.18em]"
                style={{ color: muted }}
              >
                Title
              </Label>
              <span
                className="text-[11px] uppercase tracking-[0.18em]"
                style={{ color: accent, fontVariantNumeric: "tabular-nums" }}
              >
                {NOTE.id}
              </span>
            </div>
            <h1 className="mt-2">
              <Input
                id="note-title"
                data-wf="b-1-0"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  scheduleSave();
                }}
                placeholder="Untitled note"
                className="vf w-full px-0 py-2"
                style={{
                  fontFamily: brand.fontHeading,
                  fontSize: 34,
                  lineHeight: 1.2,
                  color: brand.primaryColor,
                  backgroundColor: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${hairSoft}`,
                  borderRadius: 0,
                  height: "auto",
                }}
              />
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]" style={{ color: muted }}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>Created {NOTE.created_at}</span>
              <span aria-hidden="true" style={{ color: hair }}>
                /
              </span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>Updated {NOTE.updated_at}</span>
              <span aria-hidden="true" style={{ color: hair }}>
                /
              </span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{words} words</span>
              <span aria-hidden="true" style={{ color: hair }}>
                /
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" aria-hidden="true" />
                Private to {OWNER_EMAIL}
              </span>
            </p>
          </div>
        </div>

        {/* Row 3 ─ formatting */}
        <div className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: muted }} id="format-rail-label">
            Format
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-12" role="group" aria-labelledby="format-rail-label">
            {toolbar.map((t) => (
              <button
                key={t.id}
                type="button"
                data-wf={t.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={t.run}
                aria-pressed={t.active}
                className={`vf flex min-h-[44px] items-center justify-center gap-2 px-3 text-[13px] transition-colors ${t.span}`}
                style={{
                  borderRadius: brand.radius,
                  border: `1px solid ${t.active ? withAlpha(accent, 0.55) : hair}`,
                  backgroundColor: t.active ? withAlpha(accent, 0.14) : surface,
                  color: t.active ? accent : brand.primaryColor,
                }}
              >
                <span
                  aria-hidden="true"
                  className="text-[14px]"
                  style={{
                    fontFamily: brand.fontHeading,
                    fontWeight: t.glyph === "B" ? 700 : 400,
                    fontStyle: t.glyph === "H" ? "italic" : "normal",
                    color: t.active ? accent : muted,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {t.glyph}
                </span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4 ─ content */}
        <div className="mt-4">
          <Label id="note-content-label" className="sr-only">
            Note content
          </Label>
          <div
            className="vel-rise flex"
            style={{
              border: `1px solid ${hair}`,
              borderLeft: `2px solid ${withAlpha(accent, 0.5)}`,
              borderRadius: brand.radius,
              backgroundColor: surface,
            }}
          >
            <div
              ref={editorRef}
              data-wf="b-3-0"
              role="textbox"
              aria-multiline="true"
              aria-labelledby="note-content-label"
              aria-describedby="note-content-help"
              contentEditable
              suppressContentEditableWarning
              spellCheck
              tabIndex={0}
              onInput={handleInput}
              onKeyUp={() => {
                rememberSelection();
                refreshFormats();
              }}
              onMouseUp={() => {
                rememberSelection();
                refreshFormats();
              }}
              onBlur={rememberSelection}
              className="vf vel-prose min-h-[340px] w-full px-5 py-6 text-[15px] sm:px-8 sm:py-8"
              style={{ color: brand.primaryColor, borderRadius: brand.radius }}
            />
          </div>
          <p id="note-content-help" className="mt-2 text-[12px]" style={{ color: muted }}>
            Text only in this version — bold, headings and lists. Images and file attachments aren’t supported yet.
          </p>
        </div>

        {/* Row 5 ─ organise */}
        <form
          data-wf="b-4-0"
          onSubmit={addTag}
          className="mt-10"
          style={{
            border: `1px solid ${hair}`,
            borderRadius: brand.radius,
            backgroundColor: surface,
          }}
        >
          <div className="px-5 pt-5 sm:px-8 sm:pt-7">
            <h2
              className="text-[20px]"
              style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}
            >
              Organise this note
            </h2>
            <p className="mt-1 text-[13px]" style={{ color: muted }}>
              A folder keeps it in one place; tags let it show up in several. Both save as you set them.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-x-8 gap-y-8 px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="col-span-12 md:col-span-5">
              <Label
                htmlFor="note-folder"
                className="text-[11px] font-medium uppercase tracking-[0.18em]"
                style={{ color: muted }}
              >
                Folder
              </Label>
              <Select
                id="note-folder"
                data-wf="i-4-0-0"
                value={folder}
                onChange={changeFolder}
                className="vf mt-2 min-h-[44px] w-full"
                style={{
                  backgroundColor: withAlpha(brand.backgroundColor, 0.6),
                  color: brand.primaryColor,
                  border: `1px solid ${hair}`,
                  borderRadius: brand.radius,
                }}
              >
                {FOLDERS.map((f) => (
                  <option key={f.id || "none"} value={f.id} style={{ backgroundColor: brand.backgroundColor }}>
                    {f.name}
                  </option>
                ))}
              </Select>
              <p className="mt-2 text-[12px]" style={{ color: muted }}>
                {folder ? `Filed under ${folderName}.` : "Not in a folder — it still appears in My notes."}
              </p>
            </div>

            <div className="col-span-12 md:col-span-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: muted }} id="tags-label">
                Tags
              </p>

              {tags.length > 0 ? (
                <ul data-wf="i-4-0-1" aria-labelledby="tags-label" className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <li
                      key={t}
                      className="vel-chip inline-flex items-center gap-1 py-1 pl-3 pr-1"
                      style={{
                        border: `1px solid ${withAlpha(accent, 0.4)}`,
                        backgroundColor: withAlpha(accent, 0.1),
                        borderRadius: 999,
                      }}
                    >
                      <span className="text-[13px]" style={{ color: accent }}>
                        {t}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        aria-label={`Remove tag ${t}`}
                        className="vf inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors"
                        style={{ color: muted }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = brand.primaryColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = muted)}
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div data-wf="i-4-0-1" aria-labelledby="tags-label">
                  <p className="mt-3 text-[13px]" style={{ color: muted }}>
                    No tags on this note yet. Add one below — “planning” or “q1” are good starts.
                  </p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-end gap-3">
                <div className="min-w-[180px] flex-1">
                  <Label htmlFor="new-tag" className="text-[12px]" style={{ color: muted }}>
                    Add a tag
                  </Label>
                  <Input
                    id="new-tag"
                    value={newTag}
                    onChange={(e) => {
                      setNewTag(e.target.value);
                      if (tagError) setTagError("");
                    }}
                    aria-invalid={tagError ? "true" : "false"}
                    aria-describedby={tagError ? "tag-error" : undefined}
                    placeholder="budget"
                    className="vf mt-2 min-h-[44px] w-full"
                    style={{
                      backgroundColor: withAlpha(brand.backgroundColor, 0.6),
                      color: brand.primaryColor,
                      border: `1px solid ${tagError ? withAlpha(brand.primaryColor, 0.4) : hair}`,
                      borderRadius: brand.radius,
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  className="vf min-h-[44px] px-4 text-[13px] transition-opacity"
                  style={{
                    backgroundColor: accent,
                    color: brand.backgroundColor,
                    borderRadius: brand.radius,
                    border: `1px solid ${accent}`,
                    fontWeight: 600,
                  }}
                >
                  <Plus className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
                  Add tag
                </Button>
              </div>
              {tagError && (
                <p id="tag-error" className="mt-2 inline-flex items-center gap-1.5 text-[12px]" style={{ color: brand.primaryColor }}>
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {tagError}
                </p>
              )}
            </div>
          </div>
        </form>

        <p className="mt-6 text-[12px]" style={{ color: muted }}>
          Only you can open, edit or delete this note.
        </p>
      </div>

      {/* Row 6 ─ delete confirmation */}
      {confirmOpen && (
        <div
          data-wf="b-5-0"
          className="vel-fade fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          style={{ backgroundColor: withAlpha(brand.backgroundColor, 0.82) }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) closeConfirm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
            className="vel-rise w-full max-w-md"
            style={{
              backgroundColor: withAlpha(brand.primaryColor, 0.05),
              backdropFilter: "none",
              border: `1px solid ${withAlpha(brand.primaryColor, 0.16)}`,
              borderRadius: brand.radius,
              boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
            }}
          >
            <div className="px-6 pt-6" style={{ backgroundColor: brand.backgroundColor, borderRadius: `${brand.radius} ${brand.radius} 0 0` }}>
              <h2 id="delete-title" className="text-[22px]" style={{ fontFamily: brand.fontHeading, color: brand.primaryColor }}>
                Delete this note? This cannot be undone
              </h2>
              <p id="delete-desc" className="mt-3 text-[14px] leading-relaxed" style={{ color: muted }}>
                “{title || "Untitled note"}” and its {tags.length} {tags.length === 1 ? "tag" : "tags"} will be removed from your notes
                and from search. There is no trash to restore it from.
              </p>
              <div className="mt-6 h-px w-full" style={{ backgroundColor: hairSoft }} />
            </div>
            <div
              className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end"
              style={{ backgroundColor: brand.backgroundColor, borderRadius: `0 0 ${brand.radius} ${brand.radius}` }}
            >
              <Button
                type="button"
                ref={cancelBtnRef}
                data-wf="i-5-0-0"
                onClick={closeConfirm}
                disabled={deleting}
                className="vf min-h-[44px] px-4 text-[13px]"
                style={{
                  backgroundColor: "transparent",
                  color: brand.primaryColor,
                  border: `1px solid ${hair}`,
                  borderRadius: brand.radius,
                  opacity: deleting ? 0.5 : 1,
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-wf="i-5-0-1"
                onClick={confirmDelete}
                disabled={deleting}
                className="vf inline-flex min-h-[44px] items-center justify-center gap-2 px-4 text-[13px]"
                style={{
                  backgroundColor: brand.primaryColor,
                  color: brand.backgroundColor,
                  border: `1px solid ${brand.primaryColor}`,
                  borderRadius: brand.radius,
                  fontWeight: 600,
                  opacity: deleting ? 0.75 : 1,
                }}
              >
                <Trash className="h-4 w-4" aria-hidden="true" />
                {deleting ? "Deleting…" : "Delete note"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
