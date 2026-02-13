import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="text-center p-12 bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full mx-4">
        <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Smart Bookmark
        </h1>
        <p className="text-slate-500 mb-8">
          Save, organize, and sync your links across all your devices
        </p>
        <div className="flex justify-center">
          <LoginButton />
        </div>
        <p className="text-xs text-slate-400 mt-6">
          Your bookmarks are private and secured with Row Level Security
        </p>
      </div>
    </div>
  );
}
