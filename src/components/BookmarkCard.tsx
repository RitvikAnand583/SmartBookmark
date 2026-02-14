"use client";

import Image from "next/image";

interface BookmarkCardProps {
    bookmark: {
        id: string;
        title: string;
        url: string;
        created_at: string;
    };
    onDelete: (id: string) => void;
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
    const domain = (() => {
        try {
        return new URL(bookmark.url).hostname.replace("www.", "");
        } catch {
        return bookmark.url;
        }
    })();

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

    const formattedDate = new Date(bookmark.created_at).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
);

return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
        <div className="flex items-center gap-3 min-w-0 flex-1">
        <Image
            src={faviconUrl}
            alt=""
            width={20}
            height={20}
            className="rounded shrink-0"
            unoptimized
        />
        <div className="min-w-0 flex-1">
            <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors block truncate"
            >
            {bookmark.title}
            </a>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="truncate">{domain}</span>
            <span>-</span>
            <span className="shrink-0">{formattedDate}</span>
            </div>
        </div>
        </div>

        <button
        onClick={() => onDelete(bookmark.id)}
        className="ml-3 px-3 py-1.5 text-xs font-medium text-slate-500 border border-slate-300 rounded-full hover:text-red-600 ransition-colors cursor-pointer shrink-0"
        >
        Delete
        </button>
    </div>
);
}
