import Link from 'next/link'
import { Compass, FileText, LifeBuoy, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="bg-black text-white flex flex-col justify-between p-4 sm:p-6 md:p-12 relative overflow-hidden font-sans selection:bg-white selection:text-black">
      
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto flex justify-end z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          404 Resource Missing
        </span>
      </header>

      {/* Main Container */}
      <div className="w-full max-w-2xl mx-auto my-auto z-10 py-8 text-center">
        <div className="bg-zinc-950 rounded-2xl p-6 sm:p-12 shadow-2xl border border-zinc-800">
          
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 text-white flex items-center justify-center border border-zinc-800 shadow-inner">
              <Compass className="w-10 h-10" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Page Not Found
          </h1>

          <p className="text-base text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
            We couldn't locate the requested resource or path. It may have been relocated, deleted, or never existed.
          </p>

          {/* Shortcut Navigation */}
          <div className="flex items-center justify-center mb-8 text-left">

            <Link href="" className="py-4 px-8 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 transition-all group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800 text-white group-hover:scale-105 transition-transform">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Help Desk</h4>
                  <p className="text-xs text-zinc-500">Reach system administrators</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all shadow-lg active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 z-10 pt-4 border-t border-zinc-900">
        <div className="flex items-end gap-4">
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
          <span>•</span>
          <Link href="" className="hover:text-zinc-300 transition-colors">Contact Admin</Link>
        </div>
      </footer>
    </div>
  )
}
