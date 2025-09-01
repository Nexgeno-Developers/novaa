import React from "react";

export const metadata = {
  title: "Pages Management | Novaa Admin",
  description: "Manage website pages and sections",
};

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children; // Simple pass-through since AdminLayout handles everything
}