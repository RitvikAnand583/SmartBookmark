import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import BookmarkManager from "@/components/BookmarkManager";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {data.user.user_metadata?.avatar_url && (
                <Image
                    src={data.user.user_metadata.avatar_url}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full"
                />
                )}
                <div>
                <h1 className="text-lg font-bold text-slate-900">
                    Smart Bookmark
                </h1>
                <p className="text-sm text-slate-500">
                    {data.user.user_metadata?.full_name || data.user.email}
                </p>
                </div>
            </div>
            <LogoutButton />
            </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-10">
            <BookmarkManager />
        </main>
        </div>
    );
    }
