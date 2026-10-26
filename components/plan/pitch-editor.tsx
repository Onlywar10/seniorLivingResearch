"use client";

import { useEffect, useRef, useState } from "react";

// Temporary: the elevator pitch is editable in place while it's being refined. Edits are kept
// in this browser only; copy the text out when it's final so it can go into content.ts.
const KEY = "kinward:elevator-draft";

const paragraphsOf = (el: HTMLElement) =>
  Array.from(el.querySelectorAll("p")).map((p) => p.innerText.trim()).filter(Boolean);

export function EditablePitch({ initial }: { initial: string[] }) {
  // shown is what the editable box was last filled with; paras tracks the live text. Keeping
  // them apart stops React re-rendering the box while someone types in it.
  const [shown, setShown] = useState(initial);
  const [paras, setParas] = useState(initial);
  const [version, setVersion] = useState(0);
  const [copied, setCopied] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (Array.isArray(saved) && saved.length) { setShown(saved); setParas(saved); setVersion((v) => v + 1); }
    } catch {}
  }, []);

  const save = () => {
    if (!box.current) return;
    const next = paragraphsOf(box.current);
    setParas(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  const reset = () => {
    try { localStorage.removeItem(KEY); } catch {}
    setShown(initial); setParas(initial); setVersion((v) => v + 1);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(paras.join("\n\n")); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  const words = paras.join(" ").split(/\s+/).filter(Boolean).length;
  const edited = paras.join("\n") !== initial.join("\n");

  return (
    <blockquote className="elevator editable" aria-label="Elevator pitch (editable draft)">
      <span className="elevator-tag">Elevator pitch · draft, click the text to edit</span>
      <div
        key={version}
        ref={box}
        className="elevator-text"
        contentEditable
        suppressContentEditableWarning
        spellCheck
        onInput={save}
      >
        {shown.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <div className="elevator-tools">
        <span>{words} words · about {Math.round((words / 150) * 60)} seconds spoken{edited ? " · edited, saved in this browser" : ""}</span>
        <button type="button" onClick={copy}>{copied ? "Copied" : "Copy text"}</button>
        {edited ? <button type="button" onClick={reset}>Reset to original</button> : null}
      </div>
    </blockquote>
  );
}
