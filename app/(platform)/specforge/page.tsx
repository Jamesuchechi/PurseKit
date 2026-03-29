"use client";

import * as React from "react";
import { ArrowLeft, BookOpen, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { FeatureInput } from "@/components/specforge/FeatureInput";
import { PRDOutput } from "@/components/specforge/PRDOutput";
import { ExportButton } from "@/components/specforge/ExportButton";
import { useAiStream } from "@/hooks/useAiStream";
import { specforgePrompt } from "@/lib/prompts";
import { useHistory } from "@/hooks/useHistory";
import { useDebounce } from "@/hooks/useDebounce";
import { truncate } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useModuleContext } from "@/context/ModuleContext";
import { useGlobalActions } from "@/hooks/useGlobalActions";
import { downloadFile } from "@/lib/utils";
import { Suspense } from "react";
import { useNotifications } from "@/hooks/useNotifications";

type Step = "input" | "generating" | "result";

function SpecForgeContent() {
  const [step, setStep] = React.useState<Step>("input");
  
  // Form State
  const [description, setDescription] = React.useState("");
  const [audience, setAudience] = React.useState("Technical Engineer");
  const [scope, setScope] = React.useState("Medium feature");
  const [context, setContext] = React.useState("");
  
  // Refinement State
  const [refinementQuery, setRefinementQuery] = React.useState("");
  
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { updateContext } = useModuleContext();
  const { output, isLoading, error, run, reset, setOutput } = useAiStream();
  const { items, save } = useHistory("specforge");
  const { addNotification } = useNotifications();
  const debouncedDesc = useDebounce(description, 1000);
  const debouncedContext = useDebounce(context, 1000);
  const [isReady, setIsReady] = React.useState(false);
  const [saveInitiated, setSaveInitiated] = React.useState(false);

  // Load from search params (History)
  React.useEffect(() => {
    const id = searchParams.get("id");
    if (id && isReady) {
      const item = items.find((i) => i.id === id);
      if (item) {
        try {
          const input = JSON.parse(item.input);
          setDescription(input.description || "");
          setAudience(input.audience || "Technical Engineer");
          setScope(input.scope || "Medium feature");
          setContext(input.context || "");
        } catch {
          setDescription(item.input);
        }
        setOutput(item.result as string);
        setStep("result");
        setSaveInitiated(true);
      }
    }
  }, [searchParams, items, isReady, setOutput]);

  // Hydrate from localStorage draft
  React.useEffect(() => {
    try {
      const draftDesc = window.localStorage.getItem("specforge_draft_desc");
      const draftContext = window.localStorage.getItem("specforge_draft_context");
      if (draftDesc) setDescription(draftDesc);
      if (draftContext) setContext(draftContext);
    } catch {}
    setIsReady(true);
  }, []);

  // Save drafts to localStorage
  React.useEffect(() => {
    if (isReady && debouncedDesc !== undefined) {
      window.localStorage.setItem("specforge_draft_desc", debouncedDesc);
    }
    if (isReady && debouncedContext !== undefined) {
      window.localStorage.setItem("specforge_draft_context", debouncedContext);
    }
  }, [debouncedDesc, debouncedContext, isReady]);

  // Handle stream state transitions
  React.useEffect(() => {
    if (isLoading && step === "input") {
      setStep("generating");
    } else if (!isLoading && step === "generating" && output) {
      setStep("result");
    }
  }, [isLoading, step, output]);

  // Save to history on completion
  React.useEffect(() => {
    if (!isLoading && output.length > 0 && !saveInitiated && !error && step === "result") {
      setSaveInitiated(true);
      
      // Update context with final PRD for Chat
      updateContext("specforge", { description, audience, scope, context, output });

      setTimeout(() => {
        save({
          title: truncate(description.split("\n")[0]?.trim() || "PRD", 60),
          input: JSON.stringify({ description, audience, scope, context }),
          result: output,
        }).then((item) => {
          toast("PRD saved to history", "success");
          addNotification({
            type: "ai",
            title: "PRD Generated",
            message: `SpecForge document for '${item?.title}' is ready.`,
            module: "specforge",
            action: "View Document",
            actionHref: `/specforge?id=${item?.id}`
          });
        });
      }, 500);
    }
  }, [isLoading, output, error, saveInitiated, description, audience, scope, context, save, step, toast, updateContext, addNotification]);

  const handleGenerate = () => {
    if (!description.trim()) return;
    setSaveInitiated(false);
    
    const promptConfig = specforgePrompt(description, audience, scope, context);

    // Update context for Chat
    updateContext("specforge", { description, audience, scope, context });
    
    // We send a minimal "prompt" to trigger the system since the `systemPrompt` actually contains everything.
    run("Generate the PRD as instructed.", { systemPrompt: promptConfig });
  };

  const handleRefine = () => {
    if (!refinementQuery.trim()) return;
    setSaveInitiated(false);
    const instruction = refinementQuery;
    setRefinementQuery("");
    
    const promptConfig = `You are SpecForge, refining a previously generated PRD.
    
    Current PRD:
    ${output}

    User instructions to modify the PRD: "${instruction}"
    
    Rewrite the entire PRD to incorporate these instructions. You MUST keep the [METADATA] header on the FIRST line, and keep the \`\`\`mermaid diagram. Keep exactly the same structural headings (##). Make sure you apply the refinement correctly.`;
    
    run("Rewrite the PRD with the requested refinements.", { systemPrompt: promptConfig });
  };

  const handleBackToEdit = () => {
    setStep("input");
    reset();
  };

  const handleNewRequest = () => {
    setDescription("");
    setContext("");
    setStep("input");
    reset();
  };

  const handleExport = () => {
    if (!output) return;
    const title = truncate(description.split("\n")[0]?.trim() || "PRD", 30);
    downloadFile(output, `${title.toLowerCase().replace(/\s+/g, "-")}.md`, "text/markdown");
  };

  useGlobalActions({
    onAnalyze: handleGenerate,
    onExport: handleExport,
    onClear: handleNewRequest,
  });

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {step === "input" ? (
        <>
          <PageHeader 
            icon={BookOpen}
            label="SpecForge"
            title="SpecForge"
            description="Transform an idea into a fully-structured, export-ready Product Requirements Document."
          />
          <FeatureInput
            description={description}
            setDescription={setDescription}
            audience={audience}
            setAudience={setAudience}
            scope={scope}
            setScope={setScope}
            context={context}
            setContext={setContext}
            onGenerate={handleGenerate}
            isGenerating={isLoading}
          />
          {error && (
            <div className="mt-8 max-w-4xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              <p className="font-bold">Generation Failed</p>
              <p>{error}</p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-xl z-50 py-4 border-b border-border/50">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBackToEdit} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Edit Request
              </Button>
              <span className="hidden sm:inline-block w-px h-6 bg-border/50" />
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="bg-muted/30 px-2 py-0.5 rounded border border-border/50">{audience}</span>
                <span className="bg-muted/30 px-2 py-0.5 rounded border border-border/50">{scope}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {output && !isLoading && (
                <>
                  <ExportButton content={output} title={truncate(description.split("\\n")[0]?.trim() || "PRD", 30)} />
                  <Button variant="outline" size="sm" onClick={handleNewRequest} className="gap-2 shrink-0">
                    <RotateCcw className="w-4 h-4" />
                    New 
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="pt-2">
            <PRDOutput 
              markdown={output} 
              isStreaming={isLoading} 
            />
          </div>

          {/* Refinement Floating Bar */}
          {!isLoading && output && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl p-2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={refinementQuery}
                  onChange={e => setRefinementQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRefine()}
                  placeholder="E.g., Add more edge cases for the rate limiting..."
                  className="flex-1 bg-transparent border-0 outline-none px-4 text-sm text-foreground placeholder:text-muted-foreground"
                />
                <Button size="sm" className="rounded-full px-4" onClick={handleRefine} disabled={!refinementQuery.trim()}>
                  <Sparkles className="w-4 h-4 mr-2" /> Refine
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SpecForgePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
      </div>
    }>
      <SpecForgeContent />
    </Suspense>
  );
}
