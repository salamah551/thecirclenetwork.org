import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-black text-white grid place-items-center font-semibold">CN</div>
              <span className="font-semibold">The Circle Network</span>
            </div>
            <p className="mt-3 text-sm text-zinc-600">
              A private network for vetted, high-value operators. Curated access, real deal flow, and a trusted circle.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><Link href="/#benefits" className="hover:text-black">Benefits</Link></li>
              <li><Link href="/#how" className="hover:text-black">How it works</Link></li>
              <li><Link href="/#faq" className="hover:text-black">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Members</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><Link href="/signup" className="hover:text-black">Join Now</Link></li>
              <li><Link href="/invite" className="hover:text-black">Accept an Invite</Link></li>
              <li><Link href="/refer" className="hover:text-black">Refer a Friend</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li><Link href="/privacy" className="hover:text-black">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-black">Terms of Service</Link></li>
              <li><Link href="/legal" className="hover:text-black">Legal & Disclaimers</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} The Circle Network. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
