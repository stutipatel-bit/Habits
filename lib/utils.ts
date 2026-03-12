import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind classes safely (avoids conflicts)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get today's date as YYYY-MM-DD string
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

// Get the last 7 days as YYYY-MM-DD strings (Mon → Sun)
export function getWeekDates(): string[] {
  const today = new Date();
  const days: string[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  return days;
}

// Day label abbreviations for weekly view
export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Get initials from email for avatar
export function getInitials(email: string): string {
  return email.charAt(0).toUpperCase();
}
