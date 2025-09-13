import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata = {
  title: 'The Circle Network — Private, Invite-Only Membership',
  description:
    'A private network for vetted operators. Curated deal flow, warm intros, expert rooms, and a trusted circle to accelerate outcomes.',
  openGraph: {
    title: 'The Circle Network',
    description:
      'Private, invite-only membership for vetted operators. Curated deal flow, warm intros, and expert rooms.',
    url: 'https://thecirclenetwork.org',
    type: 'website',
  },
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-sm text-zinc-600">{label}</div>
    </div>
  );
}

function Benefit({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{body}</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <SiteHeader />

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 inline-block rounded-full border px-3 py-1 text-xs font-medium">
                Invite-Only • Vetted Members
              </span>
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                A private network for operators who deliver.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-600">
                The Circle Network gives you curated deal flow, warm intros to decision-makers,
                expert rooms for fast answers, and a trusted circle that moves real opportunities forward.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="rounded-xl bg-black px-6 py-3 text-center font-semibold text-white shadow-sm hover:bg-zinc-800"
                >
                  Join the Waitlist
                </Link>
                <Link
                  href="/refer"
                  className="rounded-xl border px-6 py-3 text-center font-semibold hover:bg-zinc-50"
                >
                  Refer a Friend
                </Link>
              </div>

              <div className="mt-8 grid max-w-lg grid-cols-3 gap-4">
                <Stat label="Avg. response time" value="< 24h" />
                <Stat label="Member intros made" value="1,200+" />
                <Stat label="Active markets" value="12" />
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-lg">
              <div className="aspect-[16/10] w-full rounded-2xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-white to-zinc-100" />
              <p className="mt-3 text-center text-xs text-zinc-500">
                Private dashboards, expert rooms, and tracked intros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE / BENEFITS */}
      <section id="benefits" className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why members stay</h2>
          <p className="mt-3 text-zinc-600">
            Clear value, delivered weekly. We keep the circle small and outcomes high.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Benefit
            title="Curated deal flow"
            body="See real opportunities first. We filter noise and surface high-quality deals from members and vetted partners."
          />
          <Benefit
            title="Warm introductions"
            body="Skip cold outreach. Get direct introductions to founders, operators, and decision-makers across markets."
          />
          <Benefit
            title="Expert rooms"
            body="Drop into topic-specific rooms for fast answers and pattern-matching from people who’ve done it before."
          />
          <Benefit
            title="Operator-first culture"
            body="No vanity metrics, no spam. Just operators who deliver and share what actually works."
          />
          <Benefit
            title="Private updates"
            body="Weekly digests summarizing the best asks, offers, and wins across the network keep you in the loop."
          />
          <Benefit
            title="Member perks"
            body="Exclusive credits, partner discounts, and private events you won’t find publicly."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white/60">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-3 text-zinc-600">Simple, fast, and built for momentum.</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Apply / Accept Invite',
                body: 'We vet for operators who create leverage and bring value to the circle.',
              },
              {
                step: '2',
                title: 'Onboard & Connect',
                body: 'Post your “Asks & Offers”, explore rooms, and set your communication prefs.',
              },
              {
                step: '3',
                title: 'Compound Value',
                body: 'Tap warm intros, expert rooms, and weekly digests to move deals forward.',
              },
            ].map(s => (
              <div key={s.step} className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-black text-white grid place-items-center font-semibold">{s.step}</div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border bg-white p-10 shadow-sm">
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                quote:
                  'Within 48 hours I had 3 warm intros and a clean path into a partner I’d been chasing for months.',
                name: 'Aisha K.',
                role: 'Founder, Healthtech',
              },
              {
                quote:
                  'Expert room saved us a 6-week rabbit hole. Two members dropped the exact playbook we needed.',
                name: 'Marcus D.',
                role: 'COO, Logistics',
              },
              {
                quote:
                  'Real signal. No noise. We closed a pilot with a Fortune 500 through a member intro.',
                name: 'Sofia R.',
                role: 'Head of BizDev, SaaS',
              },
            ].map(t => (
              <div key={t.name}>
                <p className="text-base leading-7">“{t.quote}”</p>
                <p className="mt-3 text-sm text-zinc-600">— {t.name}, {t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Membership is limited. Keep the circle tight, the value high.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-300">
            Join the waitlist or accept an invite to get access to rooms, digests, and warm intros.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200"
            >
              Join the Waitlist
            </Link>
            <Link
              href="/invite"
              className="rounded-xl border border-white px-6 py-3 font-semibold hover:bg-white/10"
            >
              Accept an Invite
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-400">
            By joining you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      {/* FAQ (optional quick value) */}
      <section id="faq" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">FAQ</h2>
        </div>
        <div className="mx-auto mt-8 max-w-3xl divide-y">
          {[
            {
              q: 'Who is a fit?',
              a: 'Operators and founders who can create leverage for others and act quickly on opportunities.',
            },
            {
              q: 'Is it invite-only?',
              a: 'Yes. You can apply to the waitlist or join via a member referral or direct invite.',
            },
            {
              q: 'How soon do I see value?',
              a: 'Most new members receive relevant intros or insights in the first 1–2 weeks.',
            },
          ].map(item => (
            <div key={item.q} className="py-5">
              <div className="font-medium">{item.q}</div>
              <div className="mt-1 text-sm text-zinc-600">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
