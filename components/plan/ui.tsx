export function Tag({ k }: { k?: string }) {
  if (!k) return null;
  return <span className="tag" data-k={k}>{k}</span>;
}

// Each section is its own page now, so its title is the page's h1.
export function SectionHead({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="section-head">
      <h1 id={`${id}-h`}>{title}</h1>
      {intro ? <p className="lede">{intro}</p> : null}
    </div>
  );
}
