"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "./AuthProvider";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f7]/80 dark:bg-[#141210]/80 backdrop-blur-md border-b-[1.5px] border-[#d4cdc4] dark:border-[#2e2a26]">
      <nav className="px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-[#2c2825] dark:text-[#e8e4df]"
        >
          감사일기
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-[13px] font-medium transition-colors ${
              pathname === "/"
                ? "text-[#8b7355] dark:text-[#c4b48a]"
                : "text-[#9e9790] dark:text-[#6b6560] hover:text-[#6b5842] dark:hover:text-[#9e9790]"
            }`}
          >
            오늘의 감사
          </Link>
          <Link
            href="/history"
            className={`text-[13px] font-medium transition-colors ${
              pathname === "/history"
                ? "text-[#8b7355] dark:text-[#c4b48a]"
                : "text-[#9e9790] dark:text-[#6b6560] hover:text-[#6b5842] dark:hover:text-[#9e9790]"
            }`}
          >
            기록 보기
          </Link>
          <button
            onClick={toggle}
            className="ml-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[#9e9790] dark:text-[#6b6560] hover:bg-[#eae6e0] dark:hover:bg-[#2e2a26] transition-colors cursor-pointer"
            aria-label="테마 전환"
          >
            {theme === "light" ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5d76e" stroke="#e6b422" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span className="text-[11px] font-medium tracking-wide">Dark Mode</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffd966" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span className="text-[11px] font-medium tracking-wide">Light Mode</span>
              </>
            )}
          </button>
          {user && (
            <button
              onClick={signOut}
              className="ml-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-[#9e9790] dark:text-[#6b6560] hover:bg-[#eae6e0] dark:hover:bg-[#2e2a26] transition-colors cursor-pointer"
            >
              로그아웃
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
