import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { GratitudeEntry } from "@/types";

interface Props {
  entry: GratitudeEntry;
}

export default function GratitudeCard({ entry }: Props) {
  const displayDate = format(new Date(entry.date + "T00:00:00"), "M월 d일 EEEE", {
    locale: ko,
  });

  return (
    <div className="gratitude-card">
      <p className="text-xs font-medium text-orange-400 mb-3">{displayDate}</p>
      <ul className="space-y-2">
        {[entry.line1, entry.line2, entry.line3].map((line, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className="text-orange-300 shrink-0">{i + 1}.</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
