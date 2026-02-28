"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { GratitudeEntry, GratitudeFormData } from "@/types";

interface Props {
  entry: GratitudeEntry;
  keyword?: string;
  onDelete?: (id: number) => void;
  onEdit?: (id: number, formData: GratitudeFormData) => Promise<void>;
}

function HighlightText({ text, keyword }: { text: string; keyword?: string }) {
  if (!keyword || !keyword.trim()) return <>{text}</>;

  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-[#e8d9c0] dark:bg-[#5a4e3a] text-inherit rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function GratitudeCard({ entry, keyword, onDelete, onEdit }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editLines, setEditLines] = useState([entry.line1, entry.line2, entry.line3]);
  const [saving, setSaving] = useState(false);

  const displayDate = format(
    new Date(entry.date + "T00:00:00"),
    "M월 d일 EEEE",
    { locale: ko }
  );

  const handleEditChange = (index: number, value: string) => {
    setEditLines((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleEditSave = async () => {
    if (editLines.some((line) => line.trim() === "")) return;
    try {
      setSaving(true);
      await onEdit?.(entry.id!, {
        line1: editLines[0].trim(),
        line2: editLines[1].trim(),
        line3: editLines[2].trim(),
      });
      setEditing(false);
    } catch {
      // 수정 실패
    } finally {
      setSaving(false);
    }
  };

  const handleEditCancel = () => {
    setEditLines([entry.line1, entry.line2, entry.line3]);
    setEditing(false);
  };

  return (
    <div className="gratitude-card group relative">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#b8b0a4] dark:text-[#6b6560]">
          {displayDate}
        </p>
        {!confirming && !editing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => setEditing(true)}
                className="w-6 h-6 flex items-center justify-center rounded-md text-[#c4b8a8] dark:text-[#5a5550] hover:text-[#8b7355] dark:hover:text-[#a6956e] hover:bg-[#f0ebe4] dark:hover:bg-[#252220] cursor-pointer"
                aria-label="수정"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => setConfirming(true)}
                className="w-6 h-6 flex items-center justify-center rounded-md text-[#c4b8a8] dark:text-[#5a5550] hover:text-[#a05252] dark:hover:text-[#c47070] hover:bg-[#f5eeee] dark:hover:bg-[#2e2424] cursor-pointer"
                aria-label="삭제"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {confirming ? (
        <div className="flex items-center justify-between py-2">
          <p className="text-[13px] text-[#a05252] dark:text-[#c47070]">
            삭제하시겠습니까?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              className="px-3 py-1.5 text-[12px] font-medium rounded-lg text-[#9e9790] dark:text-[#6b6560] hover:bg-[#f0ebe4] dark:hover:bg-[#252220] transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={() => onDelete?.(entry.id!)}
              className="px-3 py-1.5 text-[12px] font-medium rounded-lg text-white bg-[#a05252] dark:bg-[#8b4545] hover:bg-[#8b4545] dark:hover:bg-[#a05252] transition-colors cursor-pointer"
            >
              삭제
            </button>
          </div>
        </div>
      ) : editing ? (
        <div className="space-y-2.5">
          {editLines.map((line, i) => (
            <div key={i} className="flex gap-3 items-center">
              <span className="text-[#c4b8a8] dark:text-[#5a5550] shrink-0 text-[13px]">
                {i + 1}.
              </span>
              <input
                type="text"
                value={line}
                onChange={(e) => handleEditChange(i, e.target.value)}
                className="gratitude-input !py-2 text-[14px]"
                maxLength={200}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleEditCancel}
              disabled={saving}
              className="px-3 py-1.5 text-[12px] font-medium rounded-lg text-[#9e9790] dark:text-[#6b6560] hover:bg-[#f0ebe4] dark:hover:bg-[#252220] transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={handleEditSave}
              disabled={saving || editLines.some((l) => l.trim() === "")}
              className="px-3 py-1.5 text-[12px] font-medium rounded-lg text-white bg-[#8b7355] dark:bg-[#a6956e] hover:bg-[#7a6549] dark:hover:bg-[#b8a57d] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {[entry.line1, entry.line2, entry.line3].map((line, i) => (
            <li
              key={i}
              className="flex gap-3 text-[14px] leading-relaxed text-[#4a4540] dark:text-[#c8c2ba]"
            >
              <span className="text-[#c4b8a8] dark:text-[#5a5550] shrink-0 text-[13px]">
                {i + 1}.
              </span>
              <span>
                <HighlightText text={line} keyword={keyword} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
