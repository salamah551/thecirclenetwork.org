// app/layout.tsx
import './globals.css';
import Link from 'next/link';
import NextDynamic from 'next/dynamic';   // <-- renamed
import type { ReactNode } from 'react';

const UserMenu = NextDynamic(() => import('@/components/UserMenu'), { ssr: false });

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export const metadata = {
  title: 'The Circle Network — Invite‑Only',
  description: 'A private network for pre‑vetted high‑value operators. One plan. Everything included.',
  icons: { icon: '/icon.svg' },
  metadataBase: new URL('https://thecirclenetwork.org')
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="nav">
          <Link className="brand" href="/">
            <img src="/logo-icon.svg" alt="The Circle logo" />
            <span>The Circle Network</span>
          </Link>
          <Link href="/members">Members</Link>
          <Link href="/requests">Requests</Link>
          <Link href="/messages">Messages</Link>
          <Link href="/concierge">Concierge</Link>
          <Link href="/billing">Membership</Link>
          <Link href="/settings">Settings</Link>
          <Link href="/admin">Admin</Link>
          <span className="space" />
          <Link href="/signup">Sign Up</Link>
          <Link href="/refer">Refer</Link>
          <Link href="/invite">Accept Invite</Link>
          <span className="space" />
          <UserMenu />
        </div>
        <div className="container">{children}</div>
        <footer className="container">
          <div className="row">
            <div>© {new Date().getFullYear()} The Circle Network</div>
            <span className="space" />
            <a className="link" href="/privacy">Privacy</a>
            <a className="link" href="/terms">Terms</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
