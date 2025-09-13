export const metadata = { title: 'Privacy Policy — The Circle Network' };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-3 text-zinc-600 text-sm">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-zinc mt-8">
        <p>
          We respect your privacy. This Privacy Policy explains what information we collect, how we use it,
          and your choices. By using our services you agree to this policy.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>Account information (name, email, organization, role)</li>
          <li>Membership activity (posts, referrals, intros)</li>
          <li>Technical data (IP address, device, cookies)</li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>Provide and improve the service</li>
          <li>Facilitate member introductions and networking</li>
          <li>Detect abuse, enforce policies, and comply with law</li>
        </ul>

        <h2>Sharing</h2>
        <p>
          We share information with service providers and trusted members as necessary to operate the network
          and deliver value (for example: warm introductions with your explicit consent).
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>Update your profile and communication preferences</li>
          <li>Request access or deletion of your data where applicable</li>
        </ul>

        <h2>Contact</h2>
        <p>Questions? Email <a href="mailto:invite@thecirclenetwork.org">invite@thecirclenetwork.org</a>.</p>
      </div>
    </main>
  );
}
