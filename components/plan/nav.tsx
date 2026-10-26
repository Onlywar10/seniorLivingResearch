"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { PAGES } from "@/lib/plan/format";
import { CONTENT as C } from "@/lib/plan/content";

function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" aria-hidden="true">
      <rect x="1" y="1" width="20" height="20" rx="5" fill="#2c6650" />
      <path d="M6 12.5h3.5V16H6zM9.5 9h3.5v7H9.5zM13 6h3v10h-3z" fill="#fff" />
    </svg>
  );
}

function NavLinks() {
  const path = usePathname();
  return PAGES.map(([href, t]) => (
    <li key={href}><Link href={href} aria-current={path === href ? "page" : undefined}>{t}</Link></li>
  ));
}

export function SideNav() {
  return (
    <nav className="sidenav" aria-label="Plan sections">
      <Link href="/" className="brand">
        <div className="brand-mark"><Logo /><span>CMS Plus</span></div>
        <div className="brand-sub">One-year plan · draft</div>
      </Link>
      <ul className="navlist"><NavLinks /></ul>
      <div className="nav-foot">Prepared for Jason Jeffery, Catapult.<br />{C.meta.date} · every figure is a planning estimate.</div>
    </nav>
  );
}

export function TopNav() {
  const path = usePathname();
  const list = useRef<HTMLUListElement>(null);
  // Keep the current page's chip in view on small screens.
  useEffect(() => {
    const ul = list.current;
    const a = ul?.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
    if (ul && a) ul.scrollLeft = a.offsetLeft - ul.clientWidth / 2 + a.clientWidth / 2;
  }, [path]);
  return (
    <header className="topnav" aria-label="Plan sections">
      <div className="topnav-in"><Link href="/" className="brand-mark"><Logo size={20} /><span>CMS Plus · one-year plan</span></Link></div>
      <ul ref={list}><NavLinks /></ul>
    </header>
  );
}

export function Pager() {
  const path = usePathname();
  const i = PAGES.findIndex(([href]) => href === path);
  if (i < 0) return null;
  const prev = PAGES[i - 1], next = PAGES[i + 1];
  return (
    <nav className="pager" aria-label="Previous and next section">
      {prev ? <Link href={prev[0]} className="pager-prev"><span>Previous</span>{prev[1]}</Link> : <span />}
      {next ? <Link href={next[0]} className="pager-next"><span>Next</span>{next[1]}</Link> : <span />}
    </nav>
  );
}
