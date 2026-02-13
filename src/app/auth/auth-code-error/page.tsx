import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-xl shadow-md border border-slate-200 max-w-md">
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          Authentication Failed
        </h1>
        <p className="text-slate-500 mb-6">
          Something went wrong during sign in. Please try again.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
