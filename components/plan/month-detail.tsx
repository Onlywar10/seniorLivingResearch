"use client";

import { Fragment, useEffect, useRef } from "react";
import type { CashRow } from "@/lib/plan/model";
import { fmt$, fmtN } from "@/lib/plan/format";

// Pop-up with one month's revenue and costs, line by line. Previous / Next step through the
// months currently shown in the financial model.
export function MonthDetail({ rows, index, onIndex, onClose }: {
  rows: CashRow[]; index: number | null; onIndex: (i: number) => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const row = index !== null ? rows[index] : null;
  const money = (v: number, plus = false) => <span className={v < 0 ? "neg" : ""}>{fmt$(v, { plus })}</span>;
  const revLines = row ? row.detail.revenue.filter((l) => Math.abs(l.amount) >= 0.5) : [];
  const costLines = row ? row.detail.costs.filter((l) => Math.abs(l.amount) >= 0.5 || l.label === "Adam" || l.label === "Sales associate") : [];
  const revTotal = revLines.reduce((a, l) => a + l.amount, 0), costTotal = costLines.reduce((a, l) => a + l.amount, 0);

  return (
    <dialog ref={dialog} className="month-dialog" aria-labelledby="month-dialog-h" onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      {row ? (
        <div className="md-body">
          <div className="md-head">
            <div>
              <h2 id="month-dialog-h">{row.label}</h2>
              <span className="muted small">{row.phase} · {row.paying ? `${fmtN(row.paying)} paying communities` : "no paying communities yet"}</span>
            </div>
            <div className="md-nav">
              <button type="button" className="btn" disabled={index! <= 0} onClick={() => onIndex(index! - 1)}>← {index! > 0 ? rows[index! - 1].label : "Previous"}</button>
              <button type="button" className="btn" disabled={index! >= rows.length - 1} onClick={() => onIndex(index! + 1)}>{index! < rows.length - 1 ? rows[index! + 1].label : "Next"} →</button>
              <button type="button" className="btn" onClick={() => dialog.current?.close()} autoFocus>Close</button>
            </div>
          </div>

          <div className="md-tables">
            <table className="md-table">
              <caption>Revenue</caption>
              <thead><tr><th scope="col">Line</th><th scope="col" className="r">Communities</th><th scope="col" className="r md-price">Price</th><th scope="col" className="r">Amount</th></tr></thead>
              <tbody>
                {revLines.length ? revLines.map((l) => (
                  <tr key={l.label}><th scope="row">{l.label}</th><td className="r num">{l.count !== undefined ? fmtN(l.count) : "—"}</td><td className="r num md-price">{l.price !== undefined ? fmt$(l.price) : "—"}</td><td className="r num rev">{money(l.amount)}</td></tr>
                )) : <tr><td colSpan={4} className="muted">No revenue this month.</td></tr>}
              </tbody>
              <tfoot><tr><th scope="row" colSpan={2}>Total revenue</th><td className="md-price" /><td className="r num">{money(revTotal)}</td></tr></tfoot>
            </table>

            <table className="md-table">
              <caption>Costs</caption>
              <thead><tr><th scope="col">Line</th><th scope="col">Detail</th><th scope="col" className="r">Amount</th></tr></thead>
              <tbody>
                {costLines.map((l) => (
                  <Fragment key={l.label}>
                    <tr><th scope="row">{l.label}</th><td className="muted">{l.note ?? ""}</td><td className="r num">{fmt$(l.amount)}</td></tr>
                  </Fragment>
                ))}
              </tbody>
              <tfoot><tr><th scope="row" colSpan={2}>Total costs</th><td className="r num">{fmt$(costTotal)}</td></tr></tfoot>
            </table>
          </div>

          <dl className="md-result">
            <div><dt>Result this month</dt><dd>{money(row.result, true)}</dd></div>
            <div><dt>Running total</dt><dd>{money(row.cum, true)}</dd></div>
          </dl>
        </div>
      ) : null}
    </dialog>
  );
}
