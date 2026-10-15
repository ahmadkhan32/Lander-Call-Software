import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-5 animate-in">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto shadow-sm">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
            404 NOT FOUND
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            The page or workspace resource you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-sm active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Return to Workspace Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
