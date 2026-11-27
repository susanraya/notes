/**
 * DOM helpers behind the note editor's formatting toolbar (AC-012, US-005).
 *
 * `document.execCommand` is deprecated, behaves differently across browsers,
 * and is a no-op in the test environment, so bold, heading and list
 * formatting are applied here as plain, testable DOM surgery on the editor's
 * own selection Range. Every function mutates the editor element in place;
 * the caller reads `root.innerHTML` afterwards to persist the result -- the
 * same way it already persists everything else the user types.
 */

const BLOCK_TAGS = new Set(["P", "H3", "LI"]);

function closestBlock(node: Node | null, root: HTMLElement): HTMLElement | null {
  let current: Node | null = node;
  while (current && current !== root) {
    if (current instanceof HTMLElement && BLOCK_TAGS.has(current.tagName)) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

function elementAt(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

// The block the caret or selection is in, or -- for a brand new, still empty
// note -- a paragraph created on the spot to hold whatever is there so far.
function ensureBlock(root: HTMLElement, range: Range): HTMLElement {
  const existing = closestBlock(range.startContainer, root);
  if (existing) return existing;
  const p = document.createElement("p");
  while (root.firstChild) p.appendChild(root.firstChild);
  root.appendChild(p);
  return p;
}

/** Applies, or removes, bold on the selected text. Does nothing with no selection. */
export function applyBold(root: HTMLElement, range: Range | null): void {
  if (!range || range.collapsed) return;

  const startStrong = elementAt(range.startContainer)?.closest("strong");
  const endStrong = elementAt(range.endContainer)?.closest("strong");
  if (startStrong && startStrong === endStrong && root.contains(startStrong)) {
    const parent = startStrong.parentNode;
    while (startStrong.firstChild) parent?.insertBefore(startStrong.firstChild, startStrong);
    parent?.removeChild(startStrong);
    return;
  }

  const wrapper = document.createElement("strong");
  wrapper.appendChild(range.extractContents());
  range.insertNode(wrapper);
}

/** Turns the current block into a heading, or back into a paragraph. */
export function applyHeading(root: HTMLElement, range: Range | null): void {
  if (!range) return;
  const block = ensureBlock(root, range);
  const next = document.createElement(block.tagName === "H3" ? "p" : "h3");
  next.innerHTML = block.innerHTML;
  block.replaceWith(next);
}

function applyListType(root: HTMLElement, range: Range, listTag: "ul" | "ol"): void {
  const block = ensureBlock(root, range);

  if (block.tagName === "LI") {
    const list = block.parentElement;
    if (!list) return;
    if (list.tagName.toLowerCase() === listTag) {
      // Already this list type on a single item: back to a plain paragraph.
      const p = document.createElement("p");
      p.innerHTML = block.innerHTML;
      list.replaceWith(p);
      return;
    }
    // A list item of the other kind: switch the whole list over.
    const newList = document.createElement(listTag);
    newList.innerHTML = list.innerHTML;
    list.replaceWith(newList);
    return;
  }

  const list = document.createElement(listTag);
  const li = document.createElement("li");
  li.innerHTML = block.innerHTML;
  list.appendChild(li);
  block.replaceWith(list);
}

/** Turns the current block into a bulleted list item, or back into a paragraph. */
export function applyBulletedList(root: HTMLElement, range: Range | null): void {
  if (!range) return;
  applyListType(root, range, "ul");
}

/** Turns the current block into a numbered list item, or back into a paragraph. */
export function applyNumberedList(root: HTMLElement, range: Range | null): void {
  if (!range) return;
  applyListType(root, range, "ol");
}

export interface ActiveFormats {
  bold: boolean;
  heading: boolean;
  bulletedList: boolean;
  numberedList: boolean;
}

/** What formatting is active at the caret or selection, for the toolbar's pressed state. */
export function getActiveFormats(root: HTMLElement, node: Node | null): ActiveFormats {
  if (!node || !root.contains(node)) {
    return { bold: false, heading: false, bulletedList: false, numberedList: false };
  }
  const block = closestBlock(node, root);
  const el = elementAt(node);
  return {
    bold: !!el?.closest("strong"),
    heading: !!(block && block.tagName === "H3"),
    bulletedList: !!(block && block.tagName === "LI" && block.parentElement?.tagName === "UL"),
    numberedList: !!(block && block.tagName === "LI" && block.parentElement?.tagName === "OL"),
  };
}
