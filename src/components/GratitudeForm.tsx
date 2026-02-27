"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getEntry, saveEntry } from "@/lib/firestore";
import { GratitudeEntry } from "@/types";

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
        // Firebase 연결 실패 시 조용히 실패
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
      setIsEdit(true);
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
        <p className="text-3xl mb-3">&#x1F331;</p>
        <h1 className="text-xl font-bold text-gray-800 mb-1">오늘의 감사</h1>
        <p className="text-sm text-gray-400">{todayDisplay}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {lines.map((line, i) => (
          <div key={i}>
            <label className="block text-xs font-medium text-orange-400 mb-1.5 ml-1">
              {i + 1}번째 감사
            </label>
            <input
              type="text"
              value={line}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={placeholders[i]}
              className="gratitude-input"
              maxLength={200}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 cursor-pointer"
        >
          {saving ? "저장 중..." : isEdit ? "수정하기" : "감사 저장하기"}
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
