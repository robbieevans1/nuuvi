"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = { href: string; label: string };
type NavItem = NavLink | { label: string; children: NavLink[] };

const links: NavItem[] = [
  { href: "/", label: "Home" },
  {
    label: "Tools",
    children: [{ href: "/checker", label: "Domain Availability" }],
  },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-neutral-800 bg-black">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Nuuvi
        </Link>

        <nav className="flex items-center gap-6">
          {links.map((l) => {
            // Normal link
            if ("href" in l) {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "text-sm leading-none",
                    active ? "text-white" : "text-neutral-400 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              );
            }

            // Dropdown
            const anyChildActive = l.children.some((c) => c.href === pathname);

            return (
              <div key={l.label} className="relative">
                {/* Trigger */}
                <button
                  type="button"
                  className={[
                    "group inline-flex items-center gap-1 text-sm leading-none",
                    anyChildActive
                      ? "text-white"
                      : "text-neutral-400 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                  <span className="text-xs opacity-80">▾</span>
                </button>

                {/* Menu wrapper (no hover gap) */}
                <div className="absolute left-0 top-full z-50 hidden pt-2 group-hover:block hover:block">
                  <div className="min-w-[180px] rounded-md border border-neutral-800 bg-neutral-950 p-1 shadow-lg">
                    {l.children.map((child) => {
                      const active = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={[
                            "block rounded px-3 py-2 text-sm",
                            active
                              ? "bg-neutral-800 text-white"
                              : "text-neutral-300 hover:bg-neutral-800 hover:text-white",
                          ].join(" ")}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* This is the trick: make the whole thing a hover group */}
                <style jsx>{`
                  div.relative:hover > div.absolute {
                    display: block;
                  }
                `}</style>
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}