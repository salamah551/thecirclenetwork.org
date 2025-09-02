import Link from 'next/link'

export const metadata = {
  title: 'The Circle Network — Invite‑Only',
  description: 'A private network for pre‑vetted high‑value operators. One plan. Everything included.'
}

export default function Landing() {
  return (
    <main>
      <section className="hero" style={{padding:'64px 0'}}>
        <div className="container">
          <div className="row">
            <div className="space">
              <h1 style={{fontSize:44, lineHeight:1.1, marginBottom:12}}>A private circle of pre‑vetted operators</h1>
              <p style={{fontSize:18, opacity:.85, maxWidth:680}}>
                The Circle is a quiet place to meet founders, investors, and executives who actually move the needle.
                No noise. No events. Just direct access to the right people, when you need them.
              </p>
              <div className="row" style={{marginTop:20, gap:12, flexWrap:'wrap'}}>
                <Link href="/invite"><button>Accept Invite</button></Link>
                <Link href="/signup"><button className="secondary">Sign Up / Join Waitlist</button></Link>
                <Link href="/refer"><button className="ghost">Refer a Friend</button></Link>
              </div>
              <div style={{marginTop:16}}><span className="badge">$199.99/month — all inclusive</span></div>
            </div>
            <div className="card" style={{maxWidth:420}}>
              <h3>What members get</h3>
              <ul style={{margin:'8px 0 0 18px'}}>
                <li>Curated member directory with deep profiles</li>
                <li>Smart matching and private DMs</li>
                <li>Requests board to ask + get help fast</li>
                <li>Concierge support for warm intros</li>
                <li>No upsells. Everything is included.</li>
              </ul>
              <div className="row" style={{marginTop:12}}>
                <Link href="/members"><button className="secondary">Browse members (preview)</button></Link>
                <span className="space" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{padding:'24px 0 56px'}}>
        <div className="grid grid-3">
          <div className="card">
            <h3>Pre‑vetted</h3>
            <p>Every member is invited. You’re among peers who value time and outcomes.</p>
          </div>
          <div className="card">
            <h3>Direct access</h3>
            <p>Skip the events. Find the person you need and message them directly.</p>
          </div>
          <div className="card">
            <h3>Signal over noise</h3>
            <p>Focused requests board—quality asks get quality replies.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
