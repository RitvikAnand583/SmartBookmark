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


## Problems I Ran Into & How I Solved Them

### 1. Real-time Sync Not Working with postgres_changes

**Problem:** I initially used Supabase's `postgres_changes` to listen for INSERT and DELETE events on the `bookmarks` table. The subscription status showed `SUBSCRIBED` successfully, but no events were ever delivered to other tabs. I tried multiple fixes — removing the filter parameter, setting `REPLICA IDENTITY FULL` on the table, and filtering client-side — but none worked.

```ts
supabase
  .channel("bookmarks")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "bookmarks" },
    (payload) => {
    }
  )
  .subscribe();
```

**Solution:** Switched from `postgres_changes` to Supabase **Broadcast channels**. Instead of relying on the database to push change events, the client that performs the DB operation explicitly broadcasts the event to other tabs. The channel is configured with `self: false` so the sender doesn't receive its own event.

```ts
const channel = supabase.channel("bookmarks-sync", {
  config: { broadcast: { self: false } },
});

channel
  .on("broadcast", { event: "bookmark-added" }, ({ payload }) => {
  })
  .on("broadcast", { event: "bookmark-deleted" }, ({ payload }) => {
  })
  .subscribe();

await channel.send({
  type: "broadcast",
  event: "bookmark-added",
  payload: { bookmark: data },
});
```

I also added a `visibilitychange` listener as a safety net — when a user switches back to a tab, it refetches all bookmarks from the database to ensure consistency.

### 2. Duplicate Bookmarks Appearing

**Problem:** When a user added a bookmark, it appeared twice in the list momentarily — once from the optimistic local state update (added immediately for fast UI), and once from the Broadcast event received on the same client before `self: false` was configured correctly during testing.

**Solution:** Added deduplication logic inside the `setBookmarks` state updater. Before adding a bookmark from any source (local insert or broadcast event), I check if a bookmark with the same `id` already exists in state:

```ts
setBookmarks((prev) => {
  if (prev.some((b) => b.id === data.id)) return prev; 
  return [data, ...prev];
});
```

This check runs both when adding from the local DB insert response and when receiving a broadcast event, so duplicates are prevented regardless of timing.

## License

MIT
