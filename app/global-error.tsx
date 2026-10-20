'use client'

import Link from 'next/link'
import { RotateCcw, Home, Terminal, ShieldAlert } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white min-h-screen flex flex-col antialiased font-sans selection:bg-white selection:text-black">
        <main className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-12 relative overflow-hidden">
          
          {/* Header with Company Logo */}
          <header className="w-full max-w-5xl mx-auto flex items-center justify-between z-10">
            <a href="/">
                <img className="logo"
                src="/eeci-logo-white.svg"
                alt="eeci logo"
                width={80}
                />
            </a>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              System Exception
            </span>
          </header>

          {/* Error Card */}
          <div className="w-full max-w-2xl mx-auto my-auto z-10 py-8">
            <div className="bg-zinc-950 rounded-2xl p-6 sm:p-10 shadow-2xl border border-zinc-800">
              
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 text-white flex items-center justify-center mb-6 ring-8 ring-zinc-900/50 border border-zinc-800">
                <ShieldAlert className="w-7 h-7" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Application Error Detected
              </h1>
              
              <p className="text-sm sm:text-base text-zinc-400 mb-6 leading-relaxed">
                An unexpected client runtime exception occurred. Our telemetry logs have captured this incident automatically.
              </p>

              {/* Diagnostic Box */}
            <div className="mb-8 rounded-xl bg-black border border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                Incident Reference
                </span>
                {error.digest && (
                <span className="text-[11px] font-mono bg-zinc-900 px-2.5 py-1 rounded text-zinc-300 border border-zinc-800">
                    Ref ID: <span className="text-white font-bold">{error.digest}</span>
                </span>
                )}
            </div>
            
            <div className="p-4 font-sans text-xs text-zinc-400 leading-relaxed">
                An internal system exception occurred while processing your request. The incident details have been logged for administrative review.
            </div>
            </div>

              {/* Recovery Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => reset()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all shadow-lg active:scale-[0.98]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </button>
                
                <a
                  href="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-medium text-sm transition-all active:scale-[0.98]"
                >
                  <Home className="w-4 h-4" />
                  Return to Home
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 z-10 pt-4 border-t border-zinc-900">
            <p>Copyright &copy; {new Date().getFullYear()} - All rights reserved by EECI CORP</p>
            <div className="flex items-center gap-4">
              <a href="" className="hover:text-zinc-300 transition-colors">System Status</a>
              <span>•</span>
              <a href="" className="hover:text-zinc-300 transition-colors">Support Desk</a>
            </div>
          </footer>
        </main>
      </body>
    </html>
  )
}
