# Contact inquiries

The Contact page sends JSON to `POST /api/contact`. The server validates it and calls a Supabase Postgres function. The success state appears only after the database confirms the saved submission ID.

## Connect the supplied project

Project: `https://pwpffpwtqkfiibwyltsl.supabase.co`

1. Run `supabase/migrations/202609280001_contact_inquiries.sql` once in this project's SQL Editor, or apply it through your Supabase migration workflow. It creates the private table and the server-only function.
2. Copy `.env.example` to `.env.local` if that file does not already exist. Add the project's secret key from Settings → API Keys as `SUPABASE_SECRET_KEY`. Keep this file untracked. A legacy `SUPABASE_SERVICE_ROLE_KEY` is also supported.
3. Restart the dev server. Add `SUPABASE_URL` and `SUPABASE_SECRET_KEY` to the Vercel project's environment variables and redeploy when publishing.
4. Submit a test message, then check **Table Editor → contact_inquiries**, newest `created_at` first. Mark entries `read`, `replied`, or `archived` as you handle them. Delete your test entry after checking it.

This stores inquiries in Supabase. It does not send email notifications. The public email link uses the address in the CV, `lhthenuwara@gmail.com`.

## Privacy and abuse protection

- RLS is enabled, with no public policies. `anon` and `authenticated` have no table or function access. Only the server uses the privileged key.
- Server validation, 32 KB body limit, same-origin browser requests and a hidden honeypot reject invalid submissions.
- Database-backed limits: five saved inquiries per email per hour, and ten per client per hour on Vercel. Transaction locks enforce limits across concurrent/serverless requests.
- Raw IP addresses are never stored. On Vercel, the trusted client IP is HMAC hashed with `CONTACT_RATE_LIMIT_SECRET` (or the Supabase key). Outside Vercel, only the email limit applies; wire in the host's trusted IP source before deploying elsewhere. This is basic abuse protection, not a CAPTCHA.
- Retrying the same unedited submission uses the same UUID and cannot create another row. Failed requests retain the form contents. An unavailable/unconfigured database returns a real error, never simulated success.
- Messages and backend credentials are not logged. Keep inquiry access limited to the project team and remove records you no longer need.

References: [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [Vercel request headers](https://vercel.com/docs/headers/request-headers).
