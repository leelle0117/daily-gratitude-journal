"use client";

import { useState, useEffect, useCallback } from "react";
import { format, subDays, startOfWeek, startOfMonth } from "date-fns";
import { getEntries, searchEntries, deleteEntry, updateEntry } from "@/lib/firestore";
import { GratitudeEntry, GratitudeFormData } from "@/types";
import GratitudeCard from "@/components/GratitudeCard";

type FilterMode = "all" | "today" | "week" | "month";

export default function HistoryPage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchInitial();
  }, []);

  async function fetchInitial() {
    try {
      setLoading(true);
      const result = await getEntries(PAGE_SIZE, 0);
      setEntries(result.entries);
      setHasMore(result.hasMore);
    } catch {
      // 연결 실패
    } finally {
      setLoading(false);
    }
  }

  const loadMore = async () => {
    if (loadingMore || !hasMore || isSearching) return;
    try {
      setLoadingMore(true);
      const result = await getEntries(PAGE_SIZE, entries.length);
      setEntries((prev) => [...prev, ...result.entries]);
      setHasMore(result.hasMore);
    } catch {
      // 에러 처리
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearch = useCallback(
    async (mode: FilterMode, kw: string) => {
      setFilterMode(mode);
      setIsSearching(mode !== "all" || kw.trim() !== "");

      if (mode === "all" && kw.trim() === "") {
        fetchInitial();
        return;
      }

      try {
        setLoading(true);
        const today = new Date();
        let dateFrom: string | undefined;
        const dateTo = format(today, "yyyy-MM-dd");

        switch (mode) {
          case "today":
            dateFrom = dateTo;
            break;
          case "week":
            dateFrom = format(
              startOfWeek(today, { weekStartsOn: 1 }),
              "yyyy-MM-dd"
            );
            break;
          case "month":
            dateFrom = format(startOfMonth(today), "yyyy-MM-dd");
            break;
        }

        const results = await searchEntries({
          keyword: kw.trim() || undefined,
          dateFrom,
          dateTo,
        });
        setEntries(results);
        setHasMore(false);
      } catch {
        // 에러 처리
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleFilterChange = (mode: FilterMode) => {
    handleSearch(mode, keyword);
  };

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(filterMode, keyword);
  };

  const handleReset = () => {
    setKeyword("");
    setFilterMode("all");
    setIsSearching(false);
    fetchInitial();
  };

  const filters: { label: string; value: FilterMode }[] = [
    { label: "전체", value: "all" },
    { label: "오늘", value: "today" },
    { label: "이번 주", value: "week" },
    { label: "이번 달", value: "month" },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#2c2825] dark:text-[#e8e4df] tracking-tight">
          나의 감사 기록
        </h1>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleKeywordSearch} className="mb-4">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c4b8a8] dark:text-[#5a5550]"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="키워드로 검색..."
            className="gratitude-input pl-10 pr-9 !py-2.5 text-[13px]"
          />
          {keyword && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-[#c4b8a8] dark:text-[#5a5550] hover:text-[#8b7355] dark:hover:text-[#a6956e] cursor-pointer"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`flex-1 py-2 text-[12px] font-medium rounded-lg transition-colors cursor-pointer ${
              filterMode === f.value
                ? "bg-[#8b7355] dark:bg-[#a6956e] text-white dark:text-[#1a1816]"
                : "text-[#9e9790] dark:text-[#6b6560] hover:bg-[#f0ebe4] dark:hover:bg-[#252220]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-6 h-6 border-2 border-[#d4cdc4] dark:border-[#3d3833] border-t-[#8b7355] dark:border-t-[#c4b48a] rounded-full animate-spin" />
          <p className="text-xs text-[#b8b0a4] dark:text-[#6b6560]">
            불러오는 중...
          </p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#c4b8a8] dark:text-[#5a5550] text-sm">
            {isSearching
              ? "검색 결과가 없습니다"
              : "첫 번째 감사일기를 작성해보세요"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.1em] uppercase text-[#b8b0a4] dark:text-[#6b6560] ml-0.5">
            {entries.length}개의 기록
          </p>

          {entries.map((entry) => (
            <GratitudeCard
              key={entry.id}
              entry={entry}
              keyword={keyword}
              onEdit={async (id, formData) => {
                await updateEntry(id, formData);
                setEntries((prev) =>
                  prev.map((e) =>
                    e.id === id ? { ...e, ...formData } : e
                  )
                );
              }}
              onDelete={async (id) => {
                try {
                  await deleteEntry(id);
                  setEntries((prev) => prev.filter((e) => e.id !== id));
                } catch {
                  // 삭제 실패
                }
              }}
            />
          ))}

          {hasMore && !isSearching && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full py-3 text-[13px] font-medium text-[#8b7355] dark:text-[#a6956e] hover:text-[#6b5842] dark:hover:text-[#c4b48a] bg-transparent rounded-[10px] border border-[#eae6e0] dark:border-[#2e2a26] hover:border-[#d4cdc4] dark:hover:border-[#3d3833] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loadingMore ? "불러오는 중..." : "더 보기"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
