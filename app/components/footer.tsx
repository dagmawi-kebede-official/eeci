import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-mist-900 text-zinc-400">
      {/* Container with max-width restraint & balanced padding */}
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-50 px-6 py-12 text-center md:flex-row md:items-start md:px-12 md:py-16 md:text-left">
        
        {/* Brand & Copyright Section */}
        <div className="flex flex-col -mt-20 items-center gap-4 text-center md:max-w-sm md:items-center md:text-center">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <img 
              src="/eeci-logo-white.svg" 
              alt="eeci logo" 
              width={180} 
              className="h-auto w-60 md:w-64"
            />
          </Link>
          <div className="flex flex-col -mt-18 gap-5">
            <p className="text-sm leading-relaxed text-zinc-400">
              Assess, Manage, and Continuously Improve your Organization's Security. With Integrated AI Features.
            </p>
            <p className="text-xs text-zinc-500">
              Copyright &copy; {new Date().getFullYear()} - All rights reserved by EECI CORP
            </p>
          </div>
          
        </div>

        {/* Links Navigation Grid */}
        <div className="grid w-full max-w-sm grid-cols-2 gap-8 text-left text-white sm:max-w-md md:w-auto md:max-w-none md:gap-60">
          
          {/* Services Column */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Services
            </span>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/compliance" className="transition-colors hover:text-white">
                  Compliance Score
                </Link>
              </li>
              <li>
                <Link href="/security" className="transition-colors hover:text-white">
                  Security Testing
                </Link>
              </li>
              <li>
                <Link href="/dashboard/reports/new" className="transition-colors hover:text-white">
                  Report Incident
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Community
            </span>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a 
                  href="https://github.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <svg aria-label="GitHub" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current shrink-0">
                    <path d="M12 .297a12 12 0 0 0-3.79 23.395c.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.006-.404c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.805 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.216.694.825.576A12 12 0 0 0 12 .297" />
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="https://x.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <svg aria-label="X" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current shrink-0">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.964 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X.com
                </a>
              </li>
              <li>
                <a 
                  href="https://www.linkedin.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <svg aria-label="LinkedIn" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current shrink-0">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.999h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.287zM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123zM3.554 8.999h3.564v11.453H3.554V8.999z" />
                  </svg>
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <svg aria-label="YouTube" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className="fill-current shrink-0">
                    <path d="M23.498 6.186a2.99 2.99 0 0 0-2.104-2.116C19.545 3.5 12 3.5 12 3.5s-7.545 0-9.394.57A2.99 2.99 0 0 0 .502 6.186C0 8.046 0 12 0 12s0 3.954.502 5.814a2.99 2.99 0 0 0 2.104 2.116c1.849.57 9.394.57 9.394.57s7.545 0 9.394-.57a2.99 2.99 0 0 0 2.104-2.116C24 15.954 24 12 24 12s0-3.954-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
