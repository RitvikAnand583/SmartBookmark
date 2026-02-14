"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:text-red-600 transition-colors cursor-pointer"
    >
      Sign Out
    </button>
  );
}
