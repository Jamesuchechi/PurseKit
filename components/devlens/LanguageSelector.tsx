"use client";

import { Dropdown } from "@/components/ui/Dropdown";

const LANGUAGE_OPTIONS = [
  { id: "auto", label: "Auto Detect" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "sql", label: "SQL" },
  { id: "bash", label: "Bash" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "other", label: "Other" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
  return (
    <Dropdown
      options={LANGUAGE_OPTIONS}
      value={value}
      onChange={onChange}
      placeholder="Select Language"
      withSearch
      className={className}
    />
  );
}
