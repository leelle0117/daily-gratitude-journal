"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getEntry, saveEntry } from "@/lib/firestore";

export default function GratitudeForm() {
  const today = format(new Date(), "yyyy-MM-dd");
  const todayDisplay = format(new Date(), "yyyy년 M월 d일 EEEE", {
    locale: ko,
  });

  const [lines, setLines] = useState(["", "", ""]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    async function fetchToday() {
      try {
        const entry = await getEntry(today);
        if (entry) {
          setLines([entry.line1, entry.line2, entry.line3]);
          setIsEdit(true);
        }
      } catch {
        // 연결 실패 시 조용히 실패
      } finally {
        setLoading(false);
      }
    }
    fetchToday();
  }, [today]);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  const handleChange = (index: number, value: string) => {
    setLines((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleClear = (index: number) => {
    setLines((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (lines.some((line) => line.trim() === "")) {
      showToast("세 줄 모두 작성해주세요", "error");
      return;
    }

    try {
      setSaving(true);
      await saveEntry(today, {
        line1: lines[0].trim(),
        line2: lines[1].trim(),
        line3: lines[2].trim(),
      });
      setLines(["", "", ""]);
      setIsEdit(false);
      showToast("감사일기가 저장되었습니다!", "success");
    } catch {
      showToast("저장에 실패했습니다. 다시 시도해주세요.", "error");
    } finally {
      setSaving(false);
    }
  };

  const placeholders = [
    "오늘 감사한 첫 번째 것은...",
    "두 번째로 감사한 것은...",
    "세 번째로 감사한 것은...",
  ];

  const labels = ["First", "Second", "Third"];

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <div className="w-6 h-6 border-2 border-[#d4cdc4] dark:border-[#3d3833] border-t-[#8b7355] dark:border-t-[#c4b48a] rounded-full animate-spin" />
        <p className="text-xs text-[#b8b0a4] dark:text-[#6b6560]">
          불러오는 중...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-10">
        <p className="text-sm tracking-[0.2em] uppercase text-[#b8b0a4] dark:text-[#6b6560] mb-2">
          {todayDisplay}
        </p>
        <h1 className="text-2xl font-bold text-[#2c2825] dark:text-[#e8e4df] tracking-tight">
          오늘의 3가지 감사
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {lines.map((line, i) => (
          <div key={i}>
            <label className="block text-[11px] font-medium tracking-[0.1em] uppercase text-[#b8b0a4] dark:text-[#6b6560] mb-2 ml-0.5">
              {labels[i]}
            </label>
            <div className="relative">
              <input
                type="text"
                value={line}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder={placeholders[i]}
                className="gratitude-input pr-9"
                maxLength={200}
              />
              {line && (
                <button
                  type="button"
                  onClick={() => handleClear(i)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-[#c4b8a8] dark:text-[#5a5550] hover:text-[#8b7355] dark:hover:text-[#a6956e] hover:bg-[#f0ebe4] dark:hover:bg-[#2e2a26] transition-colors cursor-pointer"
                  aria-label="지우기"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-[#8b7355] hover:bg-[#7a6549] active:bg-[#6b5842] dark:bg-[#a6956e] dark:hover:bg-[#b8a57d] dark:active:bg-[#c4b48a] text-white dark:text-[#1a1816] text-sm font-medium rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8 cursor-pointer tracking-wide"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white z-50 ${
            toast.type === "success"
              ? "bg-[#5a7a5e] dark:bg-[#4a6b4e]"
              : "bg-[#a05252] dark:bg-[#8b4545]"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
