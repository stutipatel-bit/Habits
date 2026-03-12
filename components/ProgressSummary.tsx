"use client";

import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface Props {
  total: number;
  completed: number;
}

export default function ProgressSummary({ total, completed }: Props) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allDone = completed === total && total > 0;

  return (
    <div
      className={cn(
        "rounded-2xl p-5 border transition-all",
        allDone
          ? "bg-sage-700 border-sage-600 text-cream-50"
          : "bg-white border-sage-100 shadow-card"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p
            className={cn(
              "font-body text-xs font-medium uppercase tracking-wider mb-0.5",
              allDone ? "text-sage-300" : "text-sage-400"
            )}
          >
            Today's progress
          </p>
          <p
            className={cn(
              "font-display text-2xl",
              allDone ? "text-cream-50" : "text-charcoal-800"
            )}
          >
            {completed}{" "}
            <span className={cn("text-lg", allDone ? "text-sage-300" : "text-sage-400")}>
              / {total} habits
            </span>
          </p>
        </div>

        {allDone && (
          <div className="w-10 h-10 bg-cream-100 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-sage-700" />
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div
        className={cn(
          "h-2 rounded-full overflow-hidden",
          allDone ? "bg-sage-600" : "bg-sage-100"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            allDone ? "bg-cream-200" : "bg-sage-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {allDone && (
        <p className="text-sage-300 font-body text-xs mt-2">
          🎉 You've completed all habits today — incredible!
        </p>
      )}
    </div>
  );
}
