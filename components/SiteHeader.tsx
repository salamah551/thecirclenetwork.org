'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/invite', label: 'Invite' },
  { href: '/refer', label: 'Refer a Friend' },
  { href: '/signup', label: 'Sign Up' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-black text-white grid place-items-center font-semibold">
            CN
          </div>
          <span className="text-lg font-semibold">The Circle Network</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map(i => (
            <Link
              key={i.href}
              href={i.href}
              className={`text-sm font-medium transition ${
                pathname === i.href ? 'text-black' : 'text-zinc-600 hover:text-black'
              }`}
            >
              {i.label}
            </Link>
          ))}
          <Link
            href="/signup"
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Join Now
          </Link>
        </nav>

        <button
          className="md:hidden rounded-md border px-3 py-2 text-sm"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-7xl px-6 py-3 grid gap-2">
            {nav.map(i => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm hover:bg-zinc-50"
              >
                {i.label}
              </Link>
            ))}
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white"
            >
              Join Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
