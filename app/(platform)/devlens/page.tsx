"use client";

import * as React from "react";
import { Download, Play, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { CodeInput } from "@/components/devlens/CodeInput";
import { LanguageSelector } from "@/components/devlens/LanguageSelector";
import { AnalysisOutput } from "@/components/devlens/AnalysisOutput";
import { useAiStream } from "@/hooks/useAiStream";
import { devlensPrompt } from "@/lib/prompts";
import { useHistory } from "@/hooks/useHistory";
import { useDebounce } from "@/hooks/useDebounce";
import { downloadFile, truncate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useSearchParams } from "next/navigation";

const SAMPLE_CODE = `function processData(input) {
  if (input == null) return false;
  let items = Object.values(input);
  
  for(var i=0; i<items.length; i++) {
    var query = "SELECT * FROM users WHERE id = " + items[i].id;
    db.execute(query);
    // slow loop
    while(Date.now() < start + 100) {}
  }
  return true;
}`;

export default function DevLensPage() {
  const [code, setCode] = React.useState("");
  const [language, setLanguage] = React.useState("auto");
  const [errorLines, setErrorLines] = React.useState<number[]>([]);
  
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { output, isLoading, error, run, reset, setOutput } = useAiStream();
  const { items, save } = useHistory("devlens");
  const [saveInitiated, setSaveInitiated] = React.useState(false);
  const debouncedCode = useDebounce(code, 1000);
  const [isReady, setIsReady] = React.useState(false);

  // Load from search params (History)
  React.useEffect(() => {
    const id = searchParams.get("id");
    if (id && isReady) {
      const item = items.find((i) => i.id === id);
      if (item) {
        setCode(item.input);
        setOutput(item.result as string);
        setSaveInitiated(true); // Don't re-save something we just loaded
      }
    }
  }, [searchParams, items, isReady, setOutput]);

  React.useEffect(() => {
    try {
      if (!searchParams.get("id")) {
        const draft = window.localStorage.getItem("devlens_draft");
        if (draft) setCode(draft);
      }
    } catch {}
    setIsReady(true);
  }, [searchParams]);

  React.useEffect(() => {
    if (isReady && debouncedCode !== undefined && !searchParams.get("id")) {
      window.localStorage.setItem("devlens_draft", debouncedCode);
    }
  }, [debouncedCode, isReady, searchParams]);

  React.useEffect(() => {
    if (!isLoading && output.length > 0 && !saveInitiated && !error) {
      setSaveInitiated(true);
      setTimeout(() => {
        save({
          title: truncate(code.split("\n")[0]?.trim() || "Analysis", 60),
          input: code,
          result: output,
        }).then(() => {
          toast("Analysis saved to history", "success");
        });
      }, 500);
    }
  }, [isLoading, output, error, saveInitiated, code, save, toast]);

  const handleAnalyze = () => {
    if (!code.trim()) return;
    setSaveInitiated(false);
    
    // Fall back to auto if language is strictly empty somehow
    const lang = language;
    
    const prompt = code;
    const systemPrompt = devlensPrompt(code, lang);
    
    run(prompt, { systemPrompt });
  };

  const handleClear = () => {
    setCode("");
    reset();
  };

  const handleSample = () => {
    setCode(SAMPLE_CODE);
    setLanguage("javascript");
    reset();
  };

  const handleExport = () => {
    if (!output) return;
    downloadFile(output, "devlens-analysis.md", "text/markdown");
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        icon={Wand2}
        label="DevLens"
        title="DevLens"
        description="Paste your code to get structured AI analysis, bug reports, and refactoring suggestions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0 w-full">
        {/* LEFT COLUMN - INPUT */}
        <div className="space-y-4 flex flex-col h-[500px] lg:h-[calc(100vh-12rem)] lg:min-h-[600px] min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-bold truncate">Source Code</h2>
            <div className="w-[140px] sm:w-[180px] flex-shrink-0">
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            <CodeInput value={code} onChange={setCode} errorLines={errorLines} className="h-full" />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-2 gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClear} disabled={!code && !output} className="flex-1 sm:flex-none">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button variant="secondary" size="sm" onClick={handleSample} className="flex-1 sm:flex-none">
                Sample
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-x-4 gap-y-2">
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>{code.length} chars</span>
                <span>•</span>
                <span>{code.split("\n").length} lines</span>
              </div>

              <Button onClick={handleAnalyze} disabled={!code.trim() || isLoading}>
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              <p className="font-bold">Analysis Failed</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - OUTPUT */}
        <div className="space-y-4 flex flex-col h-[500px] lg:h-[calc(100vh-12rem)] lg:min-h-[600px] min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Analysis Output</h2>
            {output && !isLoading && (
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export .md
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4 styled-scrollbar">
            {(!output && !isLoading) ? (
              <div className="h-full flex flex-col items-center justify-center text-muted border border-dashed border-border/50 rounded-2xl bg-background/30 p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
                <Wand2 className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-bold">Awaiting Code</h3>
                <p className="max-w-xs mt-2 text-sm opacity-80">
                  Paste your active code snippet on the left and click Analyze to generate structural insights.
                </p>
              </div>
            ) : (
              <AnalysisOutput 
                markdown={output} 
                isStreaming={isLoading} 
                onApplyFix={setCode}
                onErrorLinesFound={setErrorLines}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
