# The Circle Network (.org) — v2

Invite‑only network for pre‑vetted members — directory, DMs, requests board, concierge, profiles, and an admin panel.
Everything is included in one membership ($199.99/mo).

## New in v2
- **Profile Settings** (`/settings`): edit full name, headline, company, role, location, bio, avatar.
- **Concierge** (`/concierge`): members submit white‑glove requests (with urgency).
- **Admin** (`/admin`): list waitlist, send invites, remove waitlist entries.
- **Auth page** (`/auth`): simple email/password sign‑in & sign‑out in navbar.

## One‑time setup
1. Create a Vercel project and connect this repo.
2. Create a Supabase project.
3. In Supabase → SQL, run: `supabase/schema.sql`.
4. In Vercel → Settings → Environment Variables, add (Production + Preview):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_MEMBERSHIP_PRICE_ID=price_xxx
APP_URL=https://thecirclenetwork.org
INVITER_FROM_EMAIL=invites@thecirclenetwork.org
INVITE_CODE_SALT=change-me
SENDGRID_API_KEY=    # optional; enables invite emails
```
5. Stripe webhook → `https://thecirclenetwork.org/api/stripe/webhook`  
   Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### Make yourself an admin
In Supabase → SQL:
```sql
insert into public.admins (user_id) values ('YOUR_AUTH_USER_UUID');
```
You can find your auth user id in `auth.users` table or via the Supabase dashboard.

## Notes
- Pages that read Supabase are client‑rendered (no SSR errors about missing env).
- Invite emails use SendGrid **HTTP API** via `fetch`; no extra SDK needed. Without the API key, invites are still stored.
- The **Admin** API verifies admin status by checking `public.admins` table using the bearer token.
- Update `APP_URL` if you use another domain.
