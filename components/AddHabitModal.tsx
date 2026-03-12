"use client";

import { useState, useRef, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Meditate 10 min 🧘",
  "Walk 30 minutes 🚶",
  "Journal 📓",
  "No social media before 9am 📵",
  "Take vitamins 💊",
  "Cold shower 🚿",
  "Practice gratitude 🙏",
  "Stretch 5 min 🤸",
];

interface Props {
  onAdd: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function AddHabitModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || loading) return;
    setLoading(true);
    await onAdd(name.trim());
    setLoading(false);
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      {/* Modal panel */}
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl text-charcoal-800">New habit</h2>
            <p className="text-sage-500 font-body text-xs mt-0.5">
              What do you want to build consistency around?
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sage-400 hover:text-sage-600 hover:bg-sage-50 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-body font-medium text-charcoal-800 mb-1.5">
              Habit name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Drink 8 glasses of water 💧"
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl border border-sage-200 bg-cream-50 font-body text-sm text-charcoal-800 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Suggestions */}
          <div>
            <p className="text-xs font-body text-sage-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Quick suggestions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setName(s)}
                  className="px-2.5 py-1 text-xs font-body text-sage-600 bg-sage-50 hover:bg-sage-100 border border-sage-200 rounded-lg transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-body font-medium text-sage-600 bg-sage-50 hover:bg-sage-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sage-700 hover:bg-sage-800 text-cream-50 font-body font-medium text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
                  Adding…
                </>
              ) : (
                "Add habit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
