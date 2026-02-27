"use client";

import { useState, useEffect } from "react";
import { getEntries } from "@/lib/firestore";
import { GratitudeEntry } from "@/types";
import GratitudeCard from "@/components/GratitudeCard";

export default function HistoryPage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 10;

  useEffect(() => {
    async function fetchInitial() {
      try {
        const result = await getEntries(PAGE_SIZE, 0);
        setEntries(result.entries);
        setHasMore(result.hasMore);
      } catch {
        // 연결 실패
      } finally {
        setLoading(false);
      }
    }
    fetchInitial();
  }, []);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
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

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="w-8 h-8 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <p className="text-3xl mb-3">&#x1F4D6;</p>
        <h1 className="text-xl font-bold text-gray-800 mb-1">나의 감사 기록</h1>
        <p className="text-sm text-gray-400">
          {entries.length > 0
            ? `총 ${entries.length}개의 기록`
            : "아직 기록이 없습니다"}
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-5xl mb-4">&#x270F;&#xFE0F;</p>
          <p className="text-gray-400 text-sm">
            첫 번째 감사일기를 작성해보세요!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <GratitudeCard key={entry.date} entry={entry} />
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="w-full py-3 text-sm font-medium text-orange-500 hover:text-orange-600 bg-white/60 rounded-xl border border-orange-100 hover:border-orange-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loadingMore ? "불러오는 중..." : "더 보기"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
