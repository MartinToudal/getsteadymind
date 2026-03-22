# SteadyMind

SteadyMind is a minimal MVP for structured daily reflection. It includes Supabase auth, daily pulse check-ins, Foundation 30 guided sessions, progress tracking, and a five-day re-entry flow.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + Postgres
- Vercel-ready deployment

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your Supabase values.

Use these values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY` for local E2E/admin scripts only

`SUPABASE_SERVICE_ROLE_KEY` is still accepted locally as a fallback while older setups are migrated, but `SUPABASE_SECRET_KEY` is the preferred name.

3. Apply the database schema in Supabase SQL editor:

- Run [`supabase/schema.sql`](/Users/martintoudal/Documents/Toudal%20Consulting/Domæner/steadymind/supabase/schema.sql)
- Run [`supabase/seed.sql`](/Users/martintoudal/Documents/Toudal%20Consulting/Domæner/steadymind/supabase/seed.sql)

4. Start the app:

```bash
npm run dev
```

5. Optional local verification:

```bash
npm run verify
```

Notes:

- `npm run typecheck` now generates Next route types before running TypeScript, so local checks are more stable.
- `npm run verify` runs the production build in a temporary working directory, so it is less likely to conflict with a running dev server.
- `npm run build` remains the normal production-style build command used by Vercel.

## Vercel deployment

SteadyMind is now set up so the production runtime only needs the two public Supabase values.

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add these environment variables in Vercel Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. Deploy.
5. In Supabase Auth settings, add your Vercel domain to:

- Site URL
- Redirect URLs

Example:

- `https://your-project.vercel.app`
- `https://your-project.vercel.app/login`

Notes:

- `SUPABASE_SECRET_KEY` is not required by the app runtime on Vercel right now.
- Keep `SUPABASE_SECRET_KEY` only in local development or private CI contexts where you run admin scripts or E2E setup.
- If you later add server-side admin jobs, we can introduce a separate Vercel server-only secret then.

## MVP routes

- `/login`
- `/signup`
- `/home`
- `/today`
- `/today/check-in`
- `/today/session/[sessionOrder]`
- `/program`
- `/progress`
- `/reentry`

## Notes

- Session definitions are duplicated in [`lib/program.ts`](/Users/martintoudal/Documents/Toudal%20Consulting/Domæner/steadymind/lib/program.ts) and the seed file so the app has a stable program structure during early MVP development.
- The protected app layout redirects inactive users to the re-entry flow after five days without recorded activity.
- Progress charts are lightweight inline SVG sparklines to keep the MVP dependency surface small.
