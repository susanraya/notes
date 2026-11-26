// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Label, Badge, Table, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Plus, Search, Check, X, FileText, Clock, Trash, Filter, AlertCircle, CheckCircle } = Icons;

const withAlpha = (hex, a) => {
  const h = String(hex).replace('#', '');
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(v, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

// Semantic role token: destructive. Muted clay, used only for delete confirmation + save failures.
const DESTRUCTIVE = '#c2806f';

const FAIL_ONCE_ID = 'n-2117';

const FILTERS = [
  { key: 'all', label: 'All notes', wf: 'i-2-0-0' },
  { key: 'folder:Work', label: 'Folder: Work', wf: 'i-2-0-1' },
  { key: 'folder:Personal', label: 'Folder: Personal', wf: 'i-2-0-2' },
  { key: 'tag:ideas', label: 'Tag: ideas', wf: 'i-2-0-3' },
  { key: 'tag:recipes', label: 'Tag: recipes', wf: 'i-2-0-4' },
];

const NOTE_SEED = [
  { id: 'n-4821', title: 'Q1 planning — agenda, owners, open risks', snippet: 'Agenda: headcount freeze, billing migration, two open risks. Owners — Priya (infra), Tomas (data warehouse).', folder: 'Work', tags: [], updated: '2 hours ago' },
  { id: 'n-4817', title: 'Reading list — three books to finish', snippet: 'Still on the pile: The Dawn of Everything, Piranesi, A Pattern Language. Started Piranesi on the train.', folder: null, tags: ['ideas'], updated: 'Yesterday, 21:04' },
  { id: 'n-4790', title: 'Sourdough timings — starter at 9am', snippet: 'Feed starter 9am. Autolyse 12:30, first fold 13:00, four folds at 30 min. Shape 17:00, fridge overnight.', folder: null, tags: ['recipes'], updated: '12 Nov 2026' },
  { id: 'n-4755', title: 'Flat move checklist', snippet: 'Redirect post from 2 Dec. Book lift at Hanbury Court. Cancel broadband, keep the router box for returns.', folder: 'Personal', tags: [], updated: '4 Nov 2026' },
  { id: 'n-4826', title: 'Standup notes — 24 Nov', snippet: 'Search indexing back-filled overnight, 1.2M rows. Tomas blocked on the staging key rotation.', folder: 'Work', tags: [], updated: 'Yesterday, 09:14' },
  { id: 'n-4812', title: 'Miso butter aubergine', snippet: 'Halve, score, 25 min at 210°C. Whisk white miso with butter and mirin, brush twice. Scatter spring onion.', folder: null, tags: ['recipes'], updated: '23 Nov 2026' },
  { id: 'n-4808', title: 'Interview questions — backend hire', snippet: 'Ask about a migration they rolled back. Pair exercise: paginate a feed without offset. Avoid trick puzzles.', folder: 'Work', tags: [], updated: '22 Nov 2026' },
  { id: 'n-4801', title: 'Gift ideas for Mum’s birthday', snippet: 'Seed library membership, the Hokusai print she kept mentioning, or a day at the pottery studio in Deptford.', folder: 'Personal', tags: ['ideas'], updated: '21 Nov 2026' },
  { id: 'n-2117', title: 'Pension transfer — reference numbers', snippet: 'Scheme ref ends 0048. Transfer form posted 18 Nov, allow 10 working days. Chase if nothing by 2 Dec.', folder: 'Personal', tags: [], updated: '20 Nov 2026' },
  { id: 'n-4788', title: 'Side project: tide clock', snippet: 'One hand, 12h25m cycle. Harmonic data from the admiralty feed. Brass face, walnut surround if I can find offcuts.', folder: null, tags: ['ideas'], updated: '19 Nov 2026' },
  { id: 'n-4780', title: 'Dentist — Dr Okonkwo, 3 Dec 14:30', snippet: 'Bring the referral letter. Ask about the night guard quote, £340 was the figure last time.', folder: 'Personal', tags: [], updated: '18 Nov 2026' },
  { id: 'n-4772', title: 'Roast chicken, 40 min at 200°C', snippet: 'Dry brine overnight. Lemon and thyme in the cavity, potatoes underneath. Rest 20 minutes, no foil.', folder: null, tags: ['recipes'], updated: '17 Nov 2026' },
  { id: 'n-4769', title: 'Quarterly review prep — metrics', snippet: 'Retention held at 91%. Support backlog down from 212 to 64. Need a line on the October outage.', folder: 'Work', tags: [], updated: '16 Nov 2026' },
  { id: 'n-4761', title: 'Books lent out and to whom', snippet: 'Rachel has the Calvino. Dad took both Sebalds in August. Hilary borrowed the atlas, said two weeks.', folder: null, tags: ['ideas'], updated: '15 Nov 2026' },
  { id: 'n-4750', title: 'Flat move — utilities and meter readings', snippet: 'Electric 48211 on 4 Nov. Gas 09842. Water account transfers automatically, confirmed on the phone.', folder: 'Personal', tags: [], updated: '14 Nov 2026' },
  { id: 'n-4744', title: 'Retro actions — sprint 42', snippet: 'Stop estimating in hours. Rotate the on-call handover doc. Kill the duplicate staging environment.', folder: 'Work', tags: [], updated: '13 Nov 2026' },
  { id: 'n-4738', title: 'Pasta e ceci — Tuesday dinner', snippet: 'Soffritto, rosemary, half the chickpeas blended. Finish with the starchy water, far more than feels right.', folder: null, tags: ['recipes'], updated: '11 Nov 2026' },
  { id: 'n-4730', title: 'Phrases to use in Portuguese class', snippet: 'fica para a próxima, dá para ver, estou só a ver. Ask Inês about the difference between ficar and estar.', folder: 'Personal', tags: [], updated: '10 Nov 2026' },
  { id: 'n-4722', title: 'Pitch outline — Velvet launch', snippet: 'Open with the cost of a lost note. Three slides of product, one of pricing. Close on the private-by-default line.', folder: 'Work', tags: ['ideas'], updated: '9 Nov 2026' },
  { id: 'n-4715', title: 'Car service quotes', snippet: 'Marlow Garage £285 including MOT. Dealer quoted £460. Brake pads are the difference, ask for the old ones back.', folder: 'Personal', tags: [], updated: '8 Nov 2026' },
  { id: 'n-4708', title: 'Weeknight curry base', snippet: 'Triple batch: onion, ginger, garlic, cook down 40 min. Freeze flat in bags. Add tomato and spice on the night.', folder: null, tags: ['recipes'], updated: '7 Nov 2026' },
  { id: 'n-4701', title: 'Names for the new team space', snippet: 'Drafting Room. The Annexe. Long Table. Priya likes Long Table, Tomas thinks it sounds like a canteen.', folder: 'Work', tags: ['ideas'], updated: '6 Nov 2026' },
  { id: 'n-4693', title: 'Insurance renewal — compare 3 quotes', snippet: 'Renewal is £612, up 18%. Two quotes under £500 with the same excess. Renewal date 1 Dec, cancel before then.', folder: 'Personal', tags: [], updated: '5 Nov 2026' },
  { id: 'n-4681', title: 'Hiring loop debrief — Priya, Tomas', snippet: 'Both strong on systems. Divergence on the schema question — write a clearer prompt before the next round.', folder: 'Work', tags: [], updated: '3 Nov 2026' },
];

const WF_ROW_IDS = { 'n-4821': 'i-3-0-0', 'n-4817': 'i-3-0-1', 'n-4790': 'i-3-0-2', 'n-4755': 'i-3-0-3' };

export default function Screen() {
  const navigate = useNavigate();
  const ink = brand.primaryColor;
  const accent = brand.accentColor;
  const muted = brand.neutralColor;
  const hair = withAlpha(ink, 0.11);
  const panel = withAlpha(ink, 0.035);
  const panelHi = withAlpha(ink, 0.06);

  const [notes, setNotes] = React.useState(NOTE_SEED);
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [pending, setPending] = React.useState(null);
  const [deleteState, setDeleteState] = React.useState('idle'); // idle | working | error
  const [failedOnce, setFailedOnce] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [sync, setSync] = React.useState('live'); // live | stale

  const timers = React.useRef([]);
  const dialogRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  const searchRef = React.useRef(null);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  React.useEffect(() => {
    if (pending && cancelRef.current) cancelRef.current.focus();
  }, [pending]);

  const q = query.trim().toLowerCase();
  const matchesFilter = (n) => {
    if (filter === 'all') return true;
    const [kind, value] = filter.split(':');
    return kind === 'folder' ? n.folder === value : n.tags.indexOf(value) !== -1;
  };
  const matchesQuery = (n) =>
    !q || n.title.toLowerCase().indexOf(q) !== -1 || n.snippet.toLowerCase().indexOf(q) !== -1;

  const visible = notes.filter(matchesFilter).filter(matchesQuery);
  const narrowed = q.length > 0 || filter !== 'all';
  const activeFilter = FILTERS.find((f) => f.key === filter);

  const highlight = (text) => {
    if (!q) return text;
    const lower = text.toLowerCase();
    const out = [];
    let i = 0;
    let k = 0;
    while (i < text.length) {
      const hit = lower.indexOf(q, i);
      if (hit === -1) { out.push(text.slice(i)); break; }
      if (hit > i) out.push(text.slice(i, hit));
      out.push(
        <mark
          key={'m' + k++}
          style={{ backgroundColor: withAlpha(accent, 0.24), color: ink, borderRadius: '2px', padding: '0 2px' }}
        >
          {text.slice(hit, hit + q.length)}
        </mark>
      );
      i = hit + q.length;
    }
    return out;
  };

  const closeModal = () => {
    if (deleteState === 'working') return;
    setPending(null);
    setDeleteState('idle');
  };

  const confirmDelete = () => {
    const note = pending;
    if (!note) return;
    setDeleteState('working');
    const t = setTimeout(() => {
      if (note.id === FAIL_ONCE_ID && !failedOnce) {
        setFailedOnce(true);
        setDeleteState('error');
        setSync('stale');
        return;
      }
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      setPending(null);
      setDeleteState('idle');
      setSync('live');
      setToast('Deleted “' + note.title + '”. It is gone from your list and from search.');
      const t2 = setTimeout(() => setToast(null), 6000);
      timers.current.push(t2);
    }, 720);
    timers.current.push(t);
  };

  const onDialogKeyDown = (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); closeModal(); return; }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const nodes = Array.prototype.slice.call(
      dialogRef.current.querySelectorAll('button:not([disabled])')
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const labelCls = 'text-[11px] uppercase tracking-[0.16em]';
  const panelStyle = { backgroundColor: panel, border: '1px solid ' + hair, borderRadius: brand.radius };

  return (
    <div
      className="velvet min-h-full px-4 pb-20 pt-8 sm:px-8"
      style={{
        backgroundColor: brand.backgroundColor,
        color: ink,
        fontFamily: brand.fontBody,
        '--vlv-accent': accent,
        '--vlv-ink': ink,
      }}
    >
      <style>{`
        .velvet :focus-visible { outline: 2px solid var(--vlv-accent); outline-offset: 2px; border-radius: 4px; }
        @keyframes vlvRise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes vlvFade { from { opacity: 0; } to { opacity: 1; } }
        .vlv-rise { animation: vlvRise .26s cubic-bezier(.2,.7,.3,1) both; }
        .vlv-fade { animation: vlvFade .2s ease-out both; }
        .vlv-row .vlv-spine { transform: scaleY(.35); transform-origin: center; transition: transform .25s ease, opacity .25s ease; opacity: .45; }
        .vlv-row:hover .vlv-spine, .vlv-row:focus-within .vlv-spine { transform: scaleY(1); opacity: 1; }
        .vlv-row:hover .vlv-del, .vlv-row:focus-within .vlv-del { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .velvet *, .velvet *::before, .velvet *::after { animation: none !important; transition: none !important; }
          .velvet .vlv-spine { transform: none; opacity: 1; }
          .velvet .vlv-del { opacity: 1; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-5xl">
        {/* Row 1 — title + primary action */}
        <div className="grid grid-cols-12 items-end gap-4">
          <div className="col-span-12 sm:col-span-8" data-wf="b-0-0">
            <h1
              className="text-[34px] leading-tight sm:text-[40px]"
              style={{ fontFamily: brand.fontHeading, letterSpacing: '-0.01em' }}
            >
              My notes
            </h1>
            <p className="mt-2 text-[13px]" style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}>
              Private to susan.raya@quorq.ai — only notes on this account are ever shown here. Session ends after
              30 minutes idle.
            </p>
          </div>
          <div className="col-span-12 flex sm:col-span-4 sm:justify-end">
            <Button
              data-wf="b-0-1"
              type="button"
              onClick={() => navigate('note-detail')}
              className="inline-flex h-11 w-full items-center justify-center gap-2 px-5 text-[14px] font-semibold transition-opacity hover:opacity-90 sm:w-auto"
              style={{ backgroundColor: accent, color: brand.backgroundColor, borderRadius: brand.radius, border: 'none' }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New note
            </Button>
          </div>
        </div>

        <div className="mt-6" style={{ height: '1px', backgroundColor: withAlpha(accent, 0.45) }} />

        {/* Row 2 — search */}
        <div className="mt-7 grid grid-cols-12 items-end gap-3">
          <div className="col-span-12 sm:col-span-9" data-wf="b-1-0">
            <Label htmlFor="note-search" className={labelCls} style={{ color: muted }}>
              Search your notes
            </Label>
            <div className="relative mt-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
                style={{ color: muted }}
              />
              <Input
                id="note-search"
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles and content"
                className="h-11 w-full bg-transparent pl-10 pr-3 text-[14px] placeholder:opacity-60"
                style={{ color: ink, border: '1px solid ' + hair, backgroundColor: panel, borderRadius: brand.radius }}
              />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-3">
            <Button
              data-wf="b-1-1"
              type="button"
              disabled={!query}
              onClick={() => { setQuery(''); if (searchRef.current) searchRef.current.focus(); }}
              className="h-11 w-full px-4 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: 'transparent',
                color: query ? ink : muted,
                border: '1px solid ' + hair,
                borderRadius: brand.radius,
              }}
            >
              Clear search
            </Button>
          </div>
        </div>

        {/* Row 3 — filters */}
        <section className="mt-7" data-wf="b-2-0" aria-labelledby="filter-heading">
          <h2 id="filter-heading" className={labelCls} style={{ color: muted }}>
            Filter by folder or tag
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.key;
              return (
                <button
                  key={f.key}
                  data-wf={f.wf}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.key)}
                  className="inline-flex h-10 items-center gap-2 px-4 text-[13px] transition-colors"
                  style={{
                    borderRadius: brand.radius,
                    border: '1px solid ' + (on ? withAlpha(accent, 0.55) : hair),
                    backgroundColor: on ? withAlpha(accent, 0.14) : 'transparent',
                    color: on ? ink : muted,
                  }}
                >
                  {on && <Check className="h-3.5 w-3.5" aria-hidden="true" style={{ color: accent }} />}
                  {f.label}
                </button>
              );
            })}
            <button
              data-wf="i-2-0-5"
              type="button"
              disabled={filter === 'all'}
              onClick={() => setFilter('all')}
              className="inline-flex h-10 items-center gap-2 px-3 text-[13px] underline-offset-4 transition-opacity hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
              style={{ color: filter === 'all' ? muted : ink, background: 'transparent', border: 'none' }}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear filter
            </button>
          </div>
        </section>

        {/* Row 4 — list */}
        <section className="mt-8" data-wf="b-3-0" aria-labelledby="list-heading">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="list-heading"
              className="text-[20px]"
              style={{ fontFamily: brand.fontHeading, fontVariantNumeric: 'tabular-nums' }}
            >
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </h2>
            <p
              className="text-[12px]"
              aria-live="polite"
              style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}
            >
              {narrowed
                ? 'Showing ' + visible.length + ' of ' + notes.length +
                  (q ? ' for “' + query.trim() + '”' : '') +
                  (activeFilter && filter !== 'all' ? ' in ' + activeFilter.label.toLowerCase() : '')
                : (sync === 'live' ? 'All notes synced · 09:41' : 'Reconnecting — last synced 09:41')}
            </p>
          </div>

          {toast && (
            <div
              role="status"
              className="vlv-rise mt-4 flex items-start gap-3 px-4 py-3 text-[13px]"
              style={{ ...panelStyle, borderLeft: '2px solid ' + accent }}
            >
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" style={{ color: accent }} />
              <span>{toast}</span>
            </div>
          )}

          {sync === 'stale' && (
            <div
              className="mt-4 flex items-start gap-3 px-4 py-3 text-[13px]"
              style={{ ...panelStyle, borderLeft: '2px solid ' + withAlpha(ink, 0.35), color: muted }}
            >
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                <span style={{ color: ink }}>Showing your last synced list.</span> The server went quiet a moment ago —
                your notes are safe and we are still trying.
              </span>
            </div>
          )}

          {notes.length > 0 && visible.length > 0 && (
            <ul className="mt-4" style={{ ...panelStyle, overflow: 'hidden' }}>
              {visible.map((n, idx) => (
                <li
                  key={n.id}
                  className="vlv-row vlv-fade"
                  style={{ borderTop: idx === 0 ? 'none' : '1px solid ' + hair }}
                >
                  <div className="flex items-stretch">
                    <div className="flex w-[3px] shrink-0 items-center py-4 pl-3">
                      <span
                        className="vlv-spine block h-full w-px"
                        style={{ backgroundColor: accent, minHeight: '44px' }}
                        aria-hidden="true"
                      />
                    </div>
                    <button
                      data-wf={WF_ROW_IDS[n.id]}
                      type="button"
                      onClick={() => navigate('note-detail')}
                      className="min-w-0 flex-1 px-4 py-4 text-left transition-colors sm:px-5"
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = panelHi; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      style={{ background: 'transparent', border: 'none', color: ink }}
                    >
                      <span
                        className="block truncate text-[17px]"
                        style={{ fontFamily: brand.fontHeading }}
                      >
                        {highlight(n.title)}
                      </span>
                      <span className="mt-1 block truncate text-[13px]" style={{ color: muted }}>
                        {highlight(n.snippet)}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <span className={labelCls} style={{ color: n.folder ? ink : muted }}>
                          {n.folder ? n.folder : 'Unfiled'}
                        </span>
                        {n.tags.map((t) => (
                          <Badge
                            key={t}
                            className="px-2 py-0.5 text-[11px]"
                            style={{
                              backgroundColor: withAlpha(accent, 0.13),
                              color: ink,
                              border: '1px solid ' + withAlpha(accent, 0.3),
                              borderRadius: '999px',
                            }}
                          >
                            #{t}
                          </Badge>
                        ))}
                        <span
                          className="text-[12px]"
                          style={{ color: muted, fontVariantNumeric: 'tabular-nums' }}
                        >
                          Updated {n.updated}
                        </span>
                      </span>
                    </button>
                    <div className="flex shrink-0 items-center pr-3 sm:pr-4">
                      <button
                        type="button"
                        aria-label={'Delete note: ' + n.title}
                        onClick={() => { setPending(n); setDeleteState('idle'); }}
                        className="vlv-del flex h-11 w-11 items-center justify-center opacity-0 transition-opacity"
                        style={{ background: 'transparent', border: 'none', color: muted, borderRadius: brand.radius }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = DESTRUCTIVE; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = muted; }}
                      >
                        <Trash className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {notes.length > 0 && visible.length === 0 && (
            <div className="mt-4 px-6 py-12" style={panelStyle}>
              <Empty
                title={q ? 'Nothing matches “' + query.trim() + '”' : 'Nothing filed under ' + (activeFilter ? activeFilter.label.toLowerCase() : 'this filter')}
                description={
                  q
                    ? 'We looked through every title and every line of your ' + notes.length + ' notes. Try a shorter word, or widen the filter.'
                    : 'This folder or tag has no notes yet. Clear the filter to see everything, or start a note here.'
                }
                action={
                  <Button
                    type="button"
                    onClick={() => { setQuery(''); setFilter('all'); if (searchRef.current) searchRef.current.focus(); }}
                    className="h-10 px-4 text-[13px]"
                    style={{ backgroundColor: 'transparent', color: ink, border: '1px solid ' + hair, borderRadius: brand.radius }}
                  >
                    Show all notes
                  </Button>
                }
              />
            </div>
          )}

          {notes.length > 0 && (
            <p className="mt-4 text-[12px]" style={{ color: muted }}>
              Only notes owned by this account are listed or searched.
            </p>
          )}
        </section>

        {/* Row 5 — first-use empty state */}
        {notes.length === 0 && (
          <section className="mt-8" data-wf="b-4-0">
            <div className="px-6 py-16 text-center" style={panelStyle}>
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center" style={{ border: '1px solid ' + withAlpha(accent, 0.5), borderRadius: brand.radius }}>
                <FileText className="h-6 w-6" aria-hidden="true" style={{ color: accent }} />
              </div>
              <h2 className="text-[24px]" style={{ fontFamily: brand.fontHeading }}>
                No notes yet, create your first note
              </h2>
              <p className="mx-auto mt-3 max-w-[52ch] text-[14px] leading-relaxed" style={{ color: muted }}>
                This space is yours alone. Write a meeting, a recipe, a half-formed idea — it saves itself as you type,
                and you can file it under a folder or a tag later.
              </p>
              <div className="mt-7 flex justify-center">
                <Button
                  data-wf="i-4-0-0"
                  type="button"
                  onClick={() => navigate('note-detail')}
                  className="inline-flex h-11 items-center justify-center gap-2 px-6 text-[14px] font-semibold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accent, color: brand.backgroundColor, borderRadius: brand.radius, border: 'none' }}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  New note
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Row 6 — delete confirmation */}
      {pending && (
        <div
          className="vlv-fade fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          style={{ backgroundColor: withAlpha(brand.backgroundColor, 0.82) }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            data-wf="b-5-0"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-body"
            onKeyDown={onDialogKeyDown}
            className="vlv-rise w-full max-w-md p-6"
            style={{
              backgroundColor: '#1b2721',
              border: '1px solid ' + withAlpha(ink, 0.16),
              borderRadius: brand.radius,
              boxShadow: '0 24px 60px ' + withAlpha('#000000', 0.55),
            }}
          >
            <h2 id="delete-title" className="text-[22px] leading-snug" style={{ fontFamily: brand.fontHeading }}>
              Delete this note? This cannot be undone
            </h2>
            <p id="delete-body" className="mt-3 text-[14px] leading-relaxed" style={{ color: muted }}>
              “{pending.title}” will be removed from your list and from search straight away.
            </p>

            {deleteState === 'error' && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-3 px-3 py-3 text-[13px] leading-relaxed"
                style={{
                  border: '1px solid ' + withAlpha(DESTRUCTIVE, 0.5),
                  backgroundColor: withAlpha(DESTRUCTIVE, 0.1),
                  borderRadius: brand.radius,
                }}
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" style={{ color: DESTRUCTIVE }} />
                <span>
                  <span className="font-semibold">Delete didn’t go through.</span> The server stopped answering
                  mid-request, so the note is untouched. Try again, or close this and come back to it.
                </span>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                data-wf="i-5-0-0"
                ref={cancelRef}
                type="button"
                onClick={closeModal}
                disabled={deleteState === 'working'}
                className="h-11 px-5 text-[14px] transition-colors disabled:opacity-40"
                style={{ backgroundColor: 'transparent', color: ink, border: '1px solid ' + hair, borderRadius: brand.radius }}
              >
                Cancel
              </Button>
              <Button
                data-wf="i-5-1-1"
                type="button"
                onClick={confirmDelete}
                disabled={deleteState === 'working'}
                className="inline-flex h-11 items-center justify-center gap-2 px-5 text-[14px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-70"
                style={{ backgroundColor: DESTRUCTIVE, color: brand.backgroundColor, border: 'none', borderRadius: brand.radius }}
              >
                {deleteState === 'working' ? (
                  <React.Fragment>
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    Deleting…
                  </React.Fragment>
                ) : deleteState === 'error' ? (
                  'Try delete again'
                ) : (
                  'Delete note'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
