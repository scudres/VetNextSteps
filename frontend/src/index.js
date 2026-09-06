import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

// react-snap prerenders by serialising the live DOM, and HTML has no way to
// represent a boundary between two adjacent text nodes — they merge into one.
// React builds a separate text node per JSX child, so `{" "}` or `text {value}`
// produces several in a row. Real SSR marks each boundary with an empty comment
// so hydration can find it again; a DOM snapshot carries no such marker, so
// React finds one text node where it expects three, declares the whole tree a
// mismatch, throws the prerendered HTML away and re-renders from scratch. On the
// data-backed pages that showed as a flash of the loading state.
//
// Inserting the markers ourselves, just before the snapshot is taken, makes the
// prerendered HTML hydrate cleanly. It runs only under react-snap — never in a
// real browser — and is idempotent, because once a comment sits between two text
// nodes they are no longer adjacent.
const markTextNodeBoundaries = (root) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  for (const node of textNodes) {
    const next = node.nextSibling;
    if (next && next.nodeType === Node.TEXT_NODE && node.parentNode) {
      node.parentNode.insertBefore(document.createComment(""), next);
    }
  }
};

if (typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap") {
  // Content still arrives after first paint, and react-snap decides for itself
  // when to snapshot, so mark on every mutation rather than on a timer — a timer
  // can let the snapshot land between ticks, leaving boundaries unmarked.
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      observer.disconnect();
      markTextNodeBoundaries(rootElement);
      observer.observe(rootElement, { childList: true, subtree: true, characterData: true });
    });
  });
  observer.observe(rootElement, { childList: true, subtree: true, characterData: true });
  markTextNodeBoundaries(rootElement);
}

// If react-snap pre-rendered HTML is already in the DOM, hydrate it.
// Otherwise, do a normal client-side render.
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
