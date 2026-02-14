"use client";

import { useState } from "react";

interface AddBookmarkFormProps {
    onAdd: (title: string, url: string) => Promise<void>;
}

export default function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl;
    }

    setSubmitting(true);
    await onAdd(title.trim(), finalUrl);
    setTitle("");
    setUrl("");
    setSubmitting(false);
};

return (
<form
    onSubmit={handleSubmit}
    className="flex flex-col sm:flex-row gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
>
    <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
    required
    />
    <input
    type="text"
    placeholder="URL (e.g. example.com)"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
    required
    />
    <button
    type="submit"
    disabled={submitting || !title.trim() || !url.trim()}
    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
    {submitting ? "Adding..." : "Add"}
    </button>
</form>
);
}
