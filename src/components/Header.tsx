"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <nav className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-orange-500">
          감사일기
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-orange-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            오늘의 감사
          </Link>
          <Link
            href="/history"
            className={`text-sm font-medium transition-colors ${
              pathname === "/history"
                ? "text-orange-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            기록 보기
          </Link>
        </div>
      </nav>
    </header>
  );
}
