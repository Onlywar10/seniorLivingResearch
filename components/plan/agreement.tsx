"use client";

import { useRef } from "react";

const PDF = "/alpha-agreement.pdf";

// A highlighted button that pops the alpha agreement PDF out in a viewer.
export function AgreementButton({ label = "Alpha agreement" }: { label?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="agreement-btn" onClick={() => dialog.current?.showModal()}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.5h5.5L13 5v9.5H4z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><path d="M9.5 1.5V5H13M6 8.5h5M6 11h5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
        {label} <span>PDF</span>
      </button>
      <dialog ref={dialog} className="pdf-dialog" aria-label="Alpha agreement" onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <div className="pdf-head">
          <b>Alpha Founding Partner Agreement</b>
          <div className="pdf-actions">
            <a className="btn" href={PDF} target="_blank" rel="noreferrer">Open in a new tab</a>
            <a className="btn" href={PDF} download>Download</a>
            <button type="button" className="btn" onClick={() => dialog.current?.close()} autoFocus>Close</button>
          </div>
        </div>
        <iframe src={PDF} title="Alpha agreement PDF" className="pdf-frame" />
      </dialog>
    </>
  );
}
