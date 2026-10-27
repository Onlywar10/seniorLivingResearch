import { Fragment } from "react";
import { CONTENT as C } from "@/lib/plan/content";
import { SectionHead, Tag } from "./ui";
import { RolloutCalendar } from "./rollout";
import { AgreementButton } from "./agreement";

// The landing page: core facts, headline numbers and the month-by-month view (a client component, passed as children).
export function Summary({ children }: { children: React.ReactNode }) {
  const S = C.summary;
  return (
    <section className="section summary" id="summary" aria-labelledby="summary-h">
      <div className="inner">
        <h1 id="summary-h">{S.pitch}</h1>
        <blockquote className="elevator" aria-label="Elevator pitch">
          <span className="elevator-tag">Elevator pitch</span>
          {S.elevator.map((para) => <p key={para}>{para}</p>)}
        </blockquote>
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
        <p className="tag-note muted small">{S.tagNote}</p>
        <div className="quick-timeline" aria-labelledby="qt-h">
          <h2 id="qt-h">{S.timelineTitle}</h2>
          <ol>
            {S.timeline.map((t) => (
              <li key={t.when}><span className="qt-when">{t.when}</span><b>{t.label}</b><span className="qt-detail">{t.detail}</span></li>
            ))}
          </ol>
        </div>
        <details className="fold glossary" open>
          <summary>{S.glossaryTitle}</summary>
          <dl className="fold-body">{S.glossary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </details>
        <div className="projection">
          <div className="projection-head">
            <h2>{C.monthly.summaryTitle}</h2>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

// Product, plans and rollout on one page. The rollout calendar is a client component.
export function Product() {
  const P = C.product;
  return (
    <section className="section" id="product" aria-labelledby="product-h">
      <div className="inner">
        <SectionHead id="product" title="Product" intro={P.intro} />
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

        <h2 className="page-h2">Three plans</h2>
        <p className="lede" style={{ maxWidth: "var(--measure)", marginBottom: "var(--s5)" }}>{C.tiers.intro}</p>
        <Plans />

        <h2 className="page-h2">Rollout calendar</h2>
        <p className="lede" style={{ maxWidth: "var(--measure)", marginBottom: "var(--s5)" }}>{P.alphaIntro} Scroll through the months and select any phase to see what it delivers. {P.stagesNote}</p>
        <RolloutCalendar />
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
        <p className="pricing-note">{M.pricingNote}</p>
        <div className="pricing-more">
          {M.pricingMore.map((g) => (
            <div key={g.plan}>
              <h4>Against {g.plan}</h4>
              <ul>{g.items.map((i) => <li key={i.text}><span className="ev">{i.ev}</span>{i.text}</li>)}</ul>
            </div>
          ))}
        </div>
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

function Plans() {
  const T = C.tiers;
  return (
    <>
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
    </>
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
              {f.name === "Alpha Founding Partner" ? <div className="offer-doc"><AgreementButton /></div> : null}
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

// Sales-call objections, grouped by theme; each opens to our answer and what backs it up.
export function Objections() {
  const O = C.objections;
  return (
    <section className="section" id="objections" aria-labelledby="objections-h">
      <div className="inner">
        <SectionHead id="objections" title="Objections" intro={O.intro} />
        {O.groups.map((g) => (
          <div className="obj-group" key={g.theme}>
            <h2 className="obj-theme">{g.theme}</h2>
            <div className="risks">
              {g.items.map((o) => (
                <details className="risk obj" key={o.q}>
                  <summary><b>“{o.q}”</b><span>{o.who}</span></summary>
                  <div className="do">
                    <b>How we answer</b><p>{o.answer}</p>
                    <b>What backs it up</b><p>{o.proof}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Asks() {
  return (
    <section className="section asks-sec" id="asks" aria-labelledby="asks-h">
      <div className="inner">
        <SectionHead id="asks" title="Asks of Jason" intro="Eight things only you can answer. Most change a number or a date in this plan." />
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
