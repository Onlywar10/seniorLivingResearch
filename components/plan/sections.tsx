import { Fragment } from "react";
import { CONTENT as C } from "@/lib/plan/content";
import { SectionHead, Tag } from "./ui";

// The landing page: core facts, headline numbers and the month-by-month view (a client component, passed as children).
export function Summary({ children }: { children: React.ReactNode }) {
  const S = C.summary;
  return (
    <section className="section summary" id="summary" aria-labelledby="summary-h">
      <div className="inner">
        <h1 id="summary-h">{S.pitch}</h1>
        <p className="elevator">{S.elevator}</p>
        <div className="meta-line"><span>{C.meta.title}</span><span>{C.meta.subtitle}</span><span>{C.meta.date}</span></div>
        <dl className="facts">
          {S.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
        </dl>
        <div className="stats" role="list">
          {S.cards.map((c) => (
            <div className="stat" role="listitem" key={c.label}>
              <div className="stat-value">{c.value}</div>
              <div className="stat-label">{c.label} <Tag k={c.tag} /></div>
            </div>
          ))}
        </div>
        <div className="projection">
          <div className="projection-head">
            <h2>{C.monthly.summaryTitle}</h2>
            <p className="muted small">{C.monthly.summaryIntro}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function Product() {
  const P = C.product;
  return (
    <section className="section" id="product" aria-labelledby="product-h">
      <div className="inner">
        <SectionHead id="product" title="The product" intro={P.intro} />
        <div className="halves">
          {P.halves.map((h) => <div className="half" key={h.title}><h3>{h.title}</h3><p>{h.body}</p></div>)}
        </div>
        <div className="versus">
          {P.positioning.map((v) => (
            <div className="vs" key={v.against}>
              <h3 className="small">{v.against}</h3><div className="who">{v.who}</div>
              <div className="line">{v.line}</div><p>{v.body}</p>
            </div>
          ))}
        </div>
        <h3 className="sub-h">Alpha: the MVP</h3>
        <p className="lede" style={{ maxWidth: "var(--measure)", marginBottom: "var(--s5)" }}>{P.alphaIntro}</p>
        <div className="phases">
          {[P.phase1, P.phase2].map((ph) => (
            <div className="phase" key={ph.title}>
              <h3>{ph.title}</h3><p className="note">{ph.note}</p>
              <ul className="ticks">{ph.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <h3 className="sub-h">From alpha to the end of beta</h3>
        <div className="stages" role="list">
          {P.stages.map((s, i) => (
            <div className={`stage ${i < 2 ? "alpha" : ""}`} role="listitem" key={s.name}>
              <div className="s-name">{s.name}</div><div className="s-when">{s.when}</div><div className="s-what">{s.what}</div>
            </div>
          ))}
        </div>
        <div className="stage-legend"><span><i />Alpha (MVP): prove it works</span><span><i className="b" />Beta (Year 1): make money</span></div>
        <p className="small muted" style={{ marginTop: "var(--s4)", maxWidth: "var(--measure)" }}>{P.stagesNote}</p>
        <details className="fold">
          <summary>The app, phase by phase</summary>
          <div className="fold-body"><div className="app-grid">
            {P.app.map((a) => <div key={a.name}><h4>{a.name}</h4><span className="when">{a.when}</span><p>{a.body}</p></div>)}
          </div></div>
        </details>
        <div className="alpha-terms">
          <div>
            <h3>{P.alphaTerms.title}</h3>
            <ol className="steps">{P.alphaTerms.steps.map((s) => <li key={s.name}><b>{s.name}</b><p>{s.body}</p></li>)}</ol>
          </div>
          <ul className="terms">{P.alphaTerms.terms.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}

export function Market() {
  const M = C.market;
  return (
    <section className="section" id="market" aria-labelledby="market-h">
      <div className="inner">
        <SectionHead id="market" title="Market and competitors" intro={M.intro} />
        <div className="sizes">
          {M.sizes.map((s) => <div className="size" key={s.value}><div className="stat-value">{s.value}</div><p>{s.label} <Tag k={s.tag} /></p></div>)}
        </div>
        <div className="table-wrap"><table>
          <caption>{M.evidenceKey}</caption>
          <thead><tr><th scope="col">Competitor</th><th scope="col">Type</th><th scope="col">Size</th><th scope="col">What they charge</th><th scope="col" className="c">Evidence</th><th scope="col">What they lack</th></tr></thead>
          <tbody>{M.competitors.map((c) => (
            <tr key={c.name}><th scope="row">{c.name}</th><td>{c.type}</td><td>{c.size}</td><td>{c.price}</td><td className="c"><span className="ev">{c.ev}</span></td><td>{c.lacks}</td></tr>
          ))}</tbody>
        </table></div>
        <h3 className="sub-h">Where we sit</h3>
        <div className="where" style={{ marginTop: 0 }}>{M.where.map((w) => <p key={w}>{w}</p>)}</div>
      </div>
    </section>
  );
}

function Mark({ v }: { v: string }) {
  if (v === "y") return <><span className="yes" aria-hidden="true" /><span className="sr">Included</span></>;
  if (v === "beta") return <span className="beta">beta</span>;
  return <><span className="no" aria-hidden="true" /><span className="sr">Not included</span></>;
}

export function Pricing() {
  const T = C.tiers;
  return (
    <section className="section" id="pricing" aria-labelledby="pricing-h">
      <div className="inner">
        <SectionHead id="pricing" title="Tiers and pricing" intro={T.intro} />
        <div className="tiers">
          {T.cards.map((t) => (
            <article className={`tier ${"featured" in t && t.featured ? "featured" : ""}`} key={t.name}>
              <div className="t-top"><h3>{t.name}</h3>{"featured" in t && t.featured ? <span className="t-flag">Goal: 80%+</span> : null}</div>
              <div className="price"><b className="num">${t.price.toLocaleString("en-US")}</b><span>per community<br />per month <Tag k="draft" /></span></div>
              <p className="solves">{t.solves}</p>
              {"note" in t && t.note ? <p className="t-note">{t.note}</p> : null}
              <dl><div><dt>Replaces</dt><dd>{t.replaces}</dd></div><div><dt>Ready</dt><dd>{t.ready}</dd></div></dl>
            </article>
          ))}
        </div>
        <div className="callouts">
          <p className="callout"><b>{T.noDiscounts}</b></p>
          <p className="callout">{T.average} <Tag k="derived" /></p>
        </div>
        <details className="fold">
          <summary>Features by tier ({T.features.length} rows)</summary>
          <div className="fold-body"><div className="table-wrap"><table>
            <thead><tr><th scope="col">Feature</th><th scope="col" className="c">Website</th><th scope="col" className="c">Community Life</th><th scope="col" className="c">Complete</th></tr></thead>
            <tbody>{T.features.map((f) => (
              <tr key={f[0]}><td>{f[0]}</td><td className="c"><Mark v={f[1]} /></td><td className="c"><Mark v={f[2]} /></td><td className="c"><Mark v={f[3]} /></td></tr>
            ))}</tbody>
            <caption>“beta” = arrives during beta (Year 1).</caption>
          </table></div></div>
        </details>
        <h3 className="sub-h">Setup fees</h3>
        <div className="table-wrap"><table>
          <thead><tr><th scope="col">One-time fee</th><th scope="col">Amount</th><th scope="col">Applies to</th><th scope="col">What it covers</th></tr></thead>
          <tbody>{T.setup.map((s) => <tr key={s.fee}><th scope="row">{s.fee}</th><td>{s.amount}</td><td>{s.applies}</td><td>{s.covers}</td></tr>)}</tbody>
          <caption>{T.setupNote}</caption>
        </table></div>
      </div>
    </section>
  );
}

export function Offers() {
  const O = C.offers;
  return (
    <section className="section" id="offers" aria-labelledby="offers-h">
      <div className="inner">
        <SectionHead id="offers" title="Offers we’re exploring" />
        <p className="banner">
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="none" stroke="#6b7471" strokeWidth="1.5" /><path d="M10 9v5M10 6.2v.1" stroke="#6b7471" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <span>{O.banner}</span>
        </p>
        <h3 style={{ marginBottom: "var(--s4)" }}>Founding offer ideas</h3>
        <div className="founding">
          {O.founding.map((f) => (
            <article className="offer" key={f.name}>
              <h3>{f.name}</h3>
              <dl>{f.rows.map((r) => <Fragment key={r[0]}><dt>{r[0]}</dt><dd>{r[1]}</dd></Fragment>)}</dl>
            </article>
          ))}
        </div>
        <h3 className="sub-h">Prices over time</h3>
        <div className="table-wrap"><table>
          <thead><tr><th scope="col">Period</th><th scope="col">New customers</th><th scope="col">Existing customers</th></tr></thead>
          <tbody>{O.overTime.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
          <caption>Raising prices for new customers, not existing ones, rewards early signers and gives sales a real “before the price goes up” date.</caption>
        </table></div>
        <h3 className="sub-h">The playbook, condensed</h3>
        <div className="playbook">
          {O.playbook.map((g) => (
            <div className="play" key={g.group}>
              <h4>{g.group}</h4>
              <ul>{g.items.map((i) => <li key={i[0]}><b>{i[0]}</b><span>{i[1]}</span></li>)}</ul>
            </div>
          ))}
        </div>
        <h3 className="sub-h">Guarantees</h3>
        <div className="guarantees">{O.guarantees.map((g) => <div className="guarantee" key={g[0]}><b>{g[0]}</b><p>{g[1]}</p></div>)}</div>
      </div>
    </section>
  );
}

export function Timeline() {
  const TL = C.timeline;
  const monthLabel = (i: number) => {
    const d = new Date(TL.start.year, TL.start.month + i, 1);
    return { m: d.toLocaleString("en-US", { month: "short" }), y: d.getFullYear() };
  };
  const when = (it: { from: number; to: number }) => {
    const a = monthLabel(it.from), b = monthLabel(it.to);
    return it.from === it.to ? `${a.m} ${a.y}` : `${a.m} ${a.y === b.y ? "" : a.y + " "}– ${b.m} ${b.y}`;
  };
  const cells: React.ReactNode[] = [<div className="tl-corner" key="corner" />];
  for (let i = 0; i < TL.months; i++) {
    const ml = monthLabel(i);
    if (i === 0 || ml.m === "Jan") {
      const span = Math.min(TL.months - i, i === 0 ? 2 : 12);
      cells.push(<div className="tl-y" key={`y${i}`} style={{ gridColumn: `${i + 2} / span ${span}` }}>{ml.y}</div>);
    }
    cells.push(<div className={`tl-m ${i >= 8 && i <= 19 ? "y1" : ""}`} key={`m${i}`} style={{ gridColumn: i + 2 }}>{ml.m}</div>);
  }
  let rowCursor = 3;
  TL.lanes.forEach((lane, li) => {
    const items = TL.items.filter((it) => it.lane === li);
    const rows = Math.max(...items.map((it) => it.row)) + 1;
    cells.push(<div className="tl-lane" key={`lane${li}`} style={{ gridRow: `${rowCursor} / span ${rows}` }}>{lane}</div>);
    for (let r = 0; r < rows; r++)
      for (let i = 0; i < TL.months; i++)
        cells.push(<div className="tl-cell" key={`c${li}-${r}-${i}`} style={{ gridRow: rowCursor + r, gridColumn: i + 2, borderBottomColor: r < rows - 1 ? "transparent" : undefined }} />);
    items.forEach((it, k) => {
      const ms = "milestone" in it && it.milestone;
      const strong = "strong" in it && it.strong;
      const atEnd = ms && it.from >= TL.months - 3;
      const span = ms ? 4 : it.to - it.from + 1;
      const y1 = (li === 0 && it.from >= 8) || (li === 1 && it.from === 8);
      const cls = ms ? `ms ${strong ? "strong" : ""} ${atEnd ? "end" : ""}` : `bar ${y1 ? "y1" : ""}`;
      const col = atEnd ? `${it.from + 2 - 3} / span 4` : `${it.from + 2} / span ${Math.min(span, TL.months - it.from)}`;
      cells.push(<div className={`tl-item ${cls}`} key={`i${li}-${k}`} style={{ gridRow: rowCursor + it.row, gridColumn: col }} title={`${it.label} · ${when(it)}`}>{it.label}</div>);
    });
    rowCursor += rows;
  });
  return (
    <section className="section" id="timeline" aria-labelledby="timeline-h">
      <div className="inner">
        <SectionHead id="timeline" title="Timeline: development to month 12" intro={TL.intro} />
        <div className="tl" role="img" aria-label="Timeline from November 2026 to July 2028 in three lanes: product, customers and sales, team and money. The same items are listed in text below.">
          <div className="tl-grid" style={{ gridTemplateRows: `auto auto repeat(${rowCursor - 3}, 34px)` }}>{cells}</div>
        </div>
        <div className="tl-list">
          {TL.lanes.map((lane, li) => (
            <div key={lane}>
              <h4>{lane}</h4>
              <ol>{[...TL.items].filter((it) => it.lane === li).sort((a, b) => a.from - b.from).map((it) => (
                <li key={it.label} className={"strong" in it && it.strong ? "strong" : ""}>{it.label}<span>{when(it)}</span></li>
              ))}</ol>
            </div>
          ))}
        </div>
        <p className="tl-note">{TL.note} Highlighted months are Year 1.</p>
      </div>
    </section>
  );
}

export function Team() {
  const TM = C.team;
  return (
    <section className="section" id="team" aria-labelledby="team-h">
      <div className="inner">
        <SectionHead id="team" title="Team and roles" intro={TM.intro} />
        <div className="table-wrap"><table>
          <thead><tr>{TM.columns.map((c) => <th scope="col" key={c}>{c}</th>)}</tr></thead>
          <tbody>{TM.rows.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th>{r.slice(1).map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
        </table></div>
        <h3 className="sub-h">Capacity <Tag k="estimate" /></h3>
        <ul className="ticks" style={{ maxWidth: "var(--measure)" }}>{TM.capacity.map((c) => <li key={c}>{c}</li>)}</ul>
      </div>
    </section>
  );
}

export function Risks() {
  return (
    <section className="section" id="risks" aria-labelledby="risks-h">
      <div className="inner">
        <SectionHead id="risks" title="Risks and what we’re unsure of" intro="Open any risk to see what we do about it." />
        <div className="risks">
          {C.risks.map((r) => (
            <details className="risk" key={r[0]}>
              <summary><b>{r[0]}</b><span>{r[1]}</span></summary>
              <div className="do"><b>What we do about it</b><p>{r[2]}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Asks() {
  return (
    <section className="section asks-sec" id="asks" aria-labelledby="asks-h">
      <div className="inner">
        <SectionHead id="asks" title="Asks of Jason" intro="Seven things only you can answer. Each one changes a number or a date in this plan." />
        <aside className="need" aria-labelledby="need-h">
          <h2 id="need-h">{C.summary.needTitle}</h2>
          <ul>{C.summary.need.map((n) => <li key={n}>{n}</li>)}</ul>
          <p className="need-note">{C.summary.needNote}</p>
        </aside>
        <ol className="asks">{C.asks.map((a) => <li key={a.title}><b>{a.title}</b><p>{a.body}</p></li>)}</ol>
      </div>
    </section>
  );
}
