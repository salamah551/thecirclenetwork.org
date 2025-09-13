export const metadata = { title: 'Terms of Service — The Circle Network' };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-3 text-zinc-600 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-zinc mt-8">
        <h2>1. Agreement</h2>
        <p>
          By accessing and using The Circle Network you agree to these Terms. If you do not agree,
          do not use the service.
        </p>

        <h2>2. Membership & Conduct</h2>
        <ul>
          <li>Membership is invite-only and may be suspended for violations.</li>
          <li>No spam, harassment, or distribution of confidential information.</li>
          <li>Use common sense and act in good faith with other members.</li>
        </ul>

        <h2>3. Content</h2>
        <p>
          You retain rights to your content. By posting, you grant us a limited license to display it within the service.
        </p>

        <h2>4. Disclaimers</h2>
        <p>
          We provide introductions and community tools “as-is.” We do not guarantee outcomes, deals, or results.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          To the extent permitted by law, The Circle Network is not liable for indirect or consequential losses.
        </p>

        <h2>6. Changes</h2>
        <p>
          We may update these Terms. Continued use after changes constitutes acceptance.
        </p>
      </div>
    </main>
  );
}
