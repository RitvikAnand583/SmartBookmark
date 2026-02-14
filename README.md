# Smart Bookmark App

A real-time bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS. Users sign in with Google, save bookmarks, and see changes sync instantly across tabs.

## Features

- Google OAuth sign-in via Supabase Auth
- Add and delete bookmarks with a clean UI
- Private bookmarks per user enforced by Row Level Security
- Real-time sync across browser tabs using Supabase Broadcast channels
- Responsive design for desktop and mobile

## Tech Stack

| Layer    | Technology                         |
| -------- | ---------------------------------- |
| Frontend | Next.js 15 (App Router), React 19 |
| Styling  | Tailwind CSS 4                     |
| Auth     | Supabase Auth (Google OAuth)       |
| Database | Supabase PostgreSQL                |
| Realtime | Supabase Broadcast Channels        |
| Deploy   | Vercel                             |

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts        # OAuth code exchange
│   │   └── auth-code-error/page.tsx  # Auth error page
│   ├── dashboard/page.tsx            # Bookmark dashboard (protected)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                      # Landing page with Google sign-in
├── components/
│   ├── AddBookmarkForm.tsx           # Form to add bookmarks
│   ├── BookmarkCard.tsx              # Single bookmark display
│   ├── BookmarkManager.tsx           # Main logic + real-time sync
│   ├── LoginButton.tsx               # Google OAuth button
│   └── LogoutButton.tsx              # Sign out button
├── lib/supabase/
│   ├── client.ts                     # Browser Supabase client
│   └── server.ts                     # Server Supabase client
└── middleware.ts                     # Session refresh
```

## Setup

### 1. Install dependencies

```bash
git clone https://github.com/YOUR_USERNAME/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a project, and copy the **Project URL** and **Anon Key** from Settings > API.

### 3. Set up the database

Run the SQL in `supabase-setup.sql` in the Supabase SQL Editor. This creates the `bookmarks` table, enables RLS, and sets up Realtime.

### 4. Configure Google OAuth

1. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Credentials
2. Set authorized redirect URI to: `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback`
3. In Supabase Dashboard > Authentication > Providers > Google: enable and paste Client ID + Secret

### 5. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
5. After deployment, add the Vercel URL to:
   - Google Cloud Console > OAuth > Authorized redirect URIs
   - Supabase Dashboard > Authentication > URL Configuration > Redirect URLs: `https://your-app.vercel.app/auth/callback`

## License

MIT
