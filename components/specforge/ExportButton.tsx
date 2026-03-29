"use client";

import * as React from "react";
import { Download, Copy, FileText, Check, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { downloadFile } from "@/lib/utils";

interface ExportButtonProps {
  content: string;
  title?: string;
}

export function ExportButton({ content, title = "PRD" }: ExportButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filenameBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "specforge-prd";

  const handleExportMd = () => {
    downloadFile(content, `${filenameBase}.md`, "text/markdown");
    setIsOpen(false);
  };

  const handleExportTxt = () => {
    // Simple markdown stripper (removes headings, bold, italics, code blocks)
    // This is intentionally basic, enough for a plain text read.
    const strictTxt = content
      .replace(/#{1,6}\s?/g, "")
      .replace(/\*\*|__|\*|_/g, "")
      .replace(/```[a-z]*\n/g, "")
      .replace(/```/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
      .replace(/<[^>]*>?/gm, ''); // HTML tags

    downloadFile(strictTxt, `${filenameBase}.txt`, "text/plain");
    setIsOpen(false);
  };

  const handleExportCSV = () => {
    // Basic parser for User Stories + Acceptance Criteria
    // Expects "## User Stories" and "## Acceptance Criteria" sections.
    const userStoriesMatch = content.match(/##\s*User Stories\n([\s\S]*?)(?=##|$)/);
    
    let csvData = "Summary,Issue Type\n";
    
    if (userStoriesMatch) {
      const storiesRaw = userStoriesMatch[1];
      // Find lines starting with - As a or * As a
      const regex = /^[-*]\s+(As a .*? so that .*)$/gm;
      let match;
      while ((match = regex.exec(storiesRaw)) !== null) {
        // Simple quoting to avoid CSV breaks
        const summary = match[1].replace(/"/g, '""');
        csvData += `"${summary}",Story\n`;
      }
    } else {
      csvData += `"No user stories parsed correctly",Story\n`;
    }

    downloadFile(csvData, `${filenameBase}-jira.csv`, "text/csv");
    setIsOpen(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="secondary" onClick={() => setIsOpen(!isOpen)} className="gap-2">
        <Download className="w-4 h-4" />
        Export
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border/50 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <button 
            onClick={handleExportMd}
            className="flex items-center w-full gap-2 px-4 py-3 text-sm hover:bg-muted/10 transition-colors text-left"
          >
            <FileText className="w-4 h-4 text-muted" />
            Markdown (.md)
          </button>
          <button 
            onClick={handleExportTxt}
            className="flex items-center w-full gap-2 px-4 py-3 text-sm hover:bg-muted/10 transition-colors text-left border-t border-border/30"
          >
            <FileText className="w-4 h-4 text-muted" />
            Plain Text (.txt)
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center w-full gap-2 px-4 py-3 text-sm hover:bg-muted/10 transition-colors text-left border-t border-border/30"
          >
            <FileSpreadsheet className="w-4 h-4 text-muted" />
            Jira Stories (.csv)
          </button>
          <button 
            onClick={handleCopy}
            className="flex items-center w-full gap-2 px-4 py-3 text-sm hover:bg-muted/10 transition-colors text-left border-t border-border/30"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      )}
    </div>
  );
}
