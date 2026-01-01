import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legacy Letter",
  description: "Capture your reflections and pass them forward with calm intention."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-transparent text-slate-900 antialiased">{children}</body>
    </html>
  );
}
