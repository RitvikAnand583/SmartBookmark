"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import AddBookmarkForm from "./AddBookmarkForm";
import BookmarkCard from "./BookmarkCard";

interface Bookmark {
    id: string;
    user_id: string;
    title: string;
    url: string;
    created_at: string;
}

export default function BookmarkManager() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const supabaseRef = useRef(createClient());
    const supabase = supabaseRef.current;

const fetchBookmarks = useCallback(async () => {
const { data } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

if (data) {
    setBookmarks(data);
}
setLoading(false);
}, [supabase]);

useEffect(() => {
    fetchBookmarks();

    const channel = supabase.channel("bookmarks-sync", {
        config: { broadcast: { self: false } },
    });

    channel
        .on("broadcast", { event: "bookmark-added" }, ({ payload }) => {
        if (payload?.bookmark) {
            setBookmarks((prev) => {
            if (prev.some((b) => b.id === payload.bookmark.id)) return prev;
            return [payload.bookmark, ...prev];
            });
        }
        })
        .on("broadcast", { event: "bookmark-deleted" }, ({ payload }) => {
        if (payload?.id) {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.id));
        }
        })
        .subscribe();

    const handleVisibility = () => {
        if (document.visibilityState === "visible") {
        fetchBookmarks();
        }
    };
    document.addEventListener("visibilitychange", handleVisibility);

return () => {
    supabase.removeChannel(channel);
    document.removeEventListener("visibilitychange", handleVisibility);
};
}, [fetchBookmarks, supabase]);

const handleAdd = async (title: string, url: string) => {
const {
    data: { user },
} = await supabase.auth.getUser();
if (!user) return;

const { data, error } = await supabase
    .from("bookmarks")
    .insert({ title, url, user_id: user.id })
    .select()
    .single();

if (!error && data) {
    setBookmarks((prev) => {
    if (prev.some((b) => b.id === data.id)) return prev;
    return [data, ...prev];
    });

    const channel = supabase.channel("bookmarks-sync", {
    config: { broadcast: { self: false } },
    });
    await channel.subscribe();
    await channel.send({
    type: "broadcast",
    event: "bookmark-added",
    payload: { bookmark: data },
    });
}
};

const handleDelete = async (id: string) => {
setBookmarks((prev) => prev.filter((b) => b.id !== id));

const { error } = await supabase.from("bookmarks").delete().eq("id", id);

if (!error) {
    const channel = supabase.channel("bookmarks-sync", {
    config: { broadcast: { self: false } },
    });
    await channel.subscribe();
    await channel.send({
    type: "broadcast",
    event: "bookmark-deleted",
    payload: { id },
    });
} else {
    fetchBookmarks();
}
};

if (loading) {
return (
    <div className="text-center py-12 text-slate-400">
    Loading bookmarks...
    </div>
);
}

return (
<div>
    <AddBookmarkForm onAdd={handleAdd} />

    {bookmarks.length === 0 ? (
    <div className="text-center py-16">
        <p className="text-slate-400 text-lg">No bookmarks yet</p>
        <p className="text-slate-400 text-sm mt-1">
        Add your first bookmark above
        </p>
    </div>
    ) : (
    <div className="grid gap-3 mt-6">
        {bookmarks.map((bookmark) => (
        <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={handleDelete}
        />
        ))}
    </div>
    )}
</div>
);
}
