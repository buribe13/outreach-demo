/**
 * OUTREACH WINDOW PLANNER - Root Layout
 *
 * This application is an organization-only planning tool
 * for homelessness service providers.
 *
 * ETHICAL COMMITMENTS:
 * - No real-time data
 * - No enforcement tracking
 * - No individual surveillance
 * - Harm reduction through timing, not prediction
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Outreach Window Planner",
  description:
    "Temporal planning tool for outreach organizations. Identify low-disruption windows for safe, effective outreach.",
  robots: "noindex, nofollow", // Org-only tool, not for public indexing
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
