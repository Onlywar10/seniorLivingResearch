"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/lib/plan/format";
import { CONTENT as C } from "@/lib/plan/content";

function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true">
      <rect x="1" y="1" width="20" height="20" rx="5" fill="#2c6650" />
      <path d="M6 12.5h3.5V16H6zM9.5 9h3.5v7H9.5zM13 6h3v10h-3z" fill="#fff" />
    </svg>
  );
}

function useActiveSection() {
  const [active, setActive] = useState("summary");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); }),
      { rootMargin: "-35% 0px -60% 0px" },
    );
    SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return active;
}

export function SideNav() {
  const active = useActiveSection();
  return (
    <nav className="sidenav" aria-label="Sections">
      <div className="brand">
        <div className="brand-mark"><Logo /><span>CMS Plus</span></div>
        <div className="brand-sub">One-year plan · draft</div>
      </div>
      <ul className="navlist">
        {SECTIONS.map(([id, t]) => <li key={id}><a href={`#${id}`} aria-current={active === id ? "true" : undefined}>{t}</a></li>)}
      </ul>
      <div className="nav-foot">Prepared for Jason Jeffery, Catapult.<br />{C.meta.date} · every figure is a planning estimate.</div>
    </nav>
  );
}

export function TopNav() {
  const active = useActiveSection();
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const ul = list.current;
    if (!ul || getComputedStyle(ul.parentElement!).display === "none") return;
    const a = ul.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (a) ul.scrollTo({ left: a.offsetLeft - ul.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
  }, [active]);
  return (
    <header className="topnav" aria-label="Sections">
      <div className="topnav-in"><div className="brand-mark"><Logo size={20} /><span>CMS Plus · one-year plan</span></div></div>
      <ul ref={list}>
        {SECTIONS.map(([id, t]) => <li key={id}><a href={`#${id}`} aria-current={active === id ? "true" : undefined}>{t}</a></li>)}
      </ul>
    </header>
  );
}
