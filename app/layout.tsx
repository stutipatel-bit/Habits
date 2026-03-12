import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitFlow — Build Better Habits",
  description: "Track your daily habits and build lasting streaks with HabitFlow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream-50 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
