"use client";

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
  <div className="navbar shadow-lg bg-black h-16 px-5 border-b border-mist-800">
    <div className="navbar-start">
      <div className="dropdown mr-2">
        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
          >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M4 6h16M4 12h8m-8 6h16"
              />
          </svg>
        </div>

        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-mist-800 text-mist-400 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
              <Link href="/compliance" className="hover:text-white">Compliance Score</Link>
          </li>
          <li>
              <Link href="/dashboard/reports/new" className="hover:text-white">Report Incident</Link>
          </li>
          <li>
              <Link href="/security" className="hover:text-white">Security Testing</Link>
          </li>
          {isAuthenticated && (
          <li>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          </li>
          )}
        </ul>
      </div>

      <a href="/">
          <img className="logo"
          src="/eeci-logo-white.svg"
          alt="eeci logo"
          width={80}
          />
      </a>
    </div>

    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal gap-5 px-1 text-mist-400">
        <li className="route hover:text-white">
          <Link href="/compliance">Compliance Score</Link>
        </li>
        <li className="route hover:text-white">
          <Link href="/dashboard/reports/new">Report Incident</Link>
        </li>
        <li className="route hover:text-white">
          <Link href="/security">Security Testing</Link>
        </li>
        {isAuthenticated && (
        <li className="route hover:text-white">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        )}
      </ul>
    </div>

    <div className="navbar-end">
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : isAuthenticated ? (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar placeholder"
          >
          <div className="bg-black border-2 border-mist-400 text-primary-content w-12 rounded-full flex items-center justify-center">
            <span className="text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-mist-800 rounded-box z-1 mt-1 w-auto pb-4 shadow"
          >
            <li className="menu-title text-white text-xl">
              {user?.name}
            </li>
            <li className="-mt-4 menu-title text-mist-500 text-80">
              {user?.email}
            </li>
            <div className="divider m-0 mb-4 before:bg-white/30 after:bg-white/30 before:h-px after:h-px"></div>

            <li>
              <Link href="/dashboard">
                <svg 
                  xmlns="http://w3.org" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  width="24" 
                  focusable="false" 
                  aria-hidden="true" 
                  style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}
                  fill="white"
                >
                  <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>

                Dashboard

              </Link>
            </li>
            <li>
              <button onClick={logout}>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  width="24" 
                  focusable="false" 
                  aria-hidden="true" 
                  fill="white"
                  style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}
                >
                  <path d="M19 2a2 2 0 012 2v16a2 2 0 01-2 2H9a1 1 0 010-2h10V4H9a1 1 0 010-2h10ZM9.293 7.293a1 1 0 000 1.414L11.586 11H4a1 1 0 000 2h7.586l-2.293 2.293a1 1 0 101.414 1.414L15.414 12l-4.707-4.707a1 1 0 00-1.414 0Z"></path>
                </svg>

                Logout
                
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-2">
  {/* Login */}
  <Link 
    href="/login" 
    className="flex h-9 items-center justify-center border border-zinc-700 bg-transparent px-3 text-xs font-semibold text-white transition-colors hover:border-white hover:bg-zinc-900 sm:h-10 sm:px-4 sm:text-sm"
  >
    Login
  </Link>

  {/* Protect */}
  <Link 
    href="/register" 
    className="flex h-9 items-center justify-center bg-white px-3 text-xs font-semibold text-black transition-colors hover:bg-zinc-200 sm:h-10 sm:px-5 sm:text-sm"
  >
    <span className="sm:hidden">Get Protected</span>
    <span className="hidden sm:inline">Protect My Company</span>
  </Link>
</div>
      )}
    </div>
  </div>
  );
}
