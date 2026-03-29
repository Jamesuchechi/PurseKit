import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SpecForge | PulseKit",
  description: "AI-powered Product Requirements Document generator.",
};

export default function SpecForgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
