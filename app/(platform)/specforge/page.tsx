"use client";

import * as React from "react";
import { ArrowLeft, BookOpen, RotateCcw, Sparkles, Zap, Skull, Code, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { FeatureInput } from "@/components/specforge/FeatureInput";
import { PRDOutput } from "@/components/specforge/PRDOutput";
import { ExportButton } from "@/components/specforge/ExportButton";
import { CrucibleArena } from "@/components/specforge/CrucibleArena";
import { BlueprintViewer } from "@/components/specforge/BlueprintViewer";
import { useAiStream } from "@/hooks/useAiStream";
import { 
  specforgePrompt, 
  specforgeRefinementPrompt,
  specforgeBlueprintPrompt
} from "@/lib/prompts";
import { useHistory } from "@/hooks/useHistory";
import { useDebounce } from "@/hooks/useDebounce";
import { truncate } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useModuleContext } from "@/context/ModuleContext";
import { useGlobalActions } from "@/hooks/useGlobalActions";
import { downloadFile } from "@/lib/utils";
import { Suspense } from "react";
import { useNotifications } from "@/hooks/useNotifications";

type Step = "input" | "generating" | "result" | "crucible" | "blueprint";

function SpecForgeContent() {
  const [step, setStep] = React.useState<Step>("input");
  const [blueprintOutput, setBlueprintOutput] = React.useState("");
  
  // Form State
  const [description, setDescription] = React.useState("");
  const [audience, setAudience] = React.useState("Technical Engineer");
  const [scope, setScope] = React.useState("Medium feature");
  const [context, setContext] = React.useState("");
  
  // Refinement State
  const [refinementQuery, setRefinementQuery] = React.useState("");
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { updateContext } = useModuleContext();
  const { output, isLoading, error, run, reset, setOutput } = useAiStream();
  const { items, save } = useHistory("specforge");
  const { addNotification } = useNotifications();
  const debouncedDesc = useDebounce(description, 1000);
  const debouncedContext = useDebounce(context, 1000);
  const [isReady, setIsReady] = React.useState(false);
  const [saveInitiated, setSaveInitiated] = React.useState(false);

  // Load from search params (History or Import)
  React.useEffect(() => {
    const id = searchParams.get("id");
    const isImport = searchParams.get("import") === "devlens";

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
    } else if (isImport && isReady) {
      const transfer = localStorage.getItem("pulsekit_context_transfer");
      if (transfer) {
        try {
          const { source, data } = JSON.parse(transfer);
          if (source === "devlens") {
            const desc = `Feature: ${data.title}\n\nBased on code analysis: ${data.analysis}`;
            const ctx = `Original context from code analysis:\n${data.originalCode}`;
            
            setDescription(desc);
            setContext(ctx);
            setAudience("Technical Engineer");
            setScope("Medium feature");
            
            // Auto-trigger generation
            const promptConfig = specforgePrompt(desc, "Technical Engineer", "Medium feature", ctx);
            updateContext("specforge", { description: desc, audience: "Technical Engineer", scope: "Medium feature", context: ctx });
            run("Generate the PRD as instructed.", { systemPrompt: promptConfig });
            
            toast("Transferred context from DevLens", "success");
            localStorage.removeItem("pulsekit_context_transfer");
          }
        } catch (e) {
          console.error("Failed to parse transfer context", e);
        }
      }
    }
  }, [searchParams, items, isReady, setOutput, toast, run, updateContext]);

  // Hydrate from localStorage draft
  React.useEffect(() => {
    try {
      if (!searchParams.get("id") && searchParams.get("import") !== "devlens") {
        const draftDesc = window.localStorage.getItem("specforge_draft_desc");
        const draftContext = window.localStorage.getItem("specforge_draft_context");
        if (draftDesc) setDescription(draftDesc);
        if (draftContext) setContext(draftContext);
      }
    } catch {}
    setIsReady(true);
  }, [searchParams]);

  // Save drafts to localStorage
  React.useEffect(() => {
    if (isReady && debouncedDesc !== undefined && !searchParams.get("id")) {
      window.localStorage.setItem("specforge_draft_desc", debouncedDesc);
    }
    if (isReady && debouncedContext !== undefined && !searchParams.get("id")) {
      window.localStorage.setItem("specforge_draft_context", debouncedContext);
    }
  }, [debouncedDesc, debouncedContext, isReady, searchParams]);

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
    updateContext("specforge", { description, audience, scope, context });
    run("Generate the PRD as instructed.", { systemPrompt: promptConfig });
  };

  const handleRefine = () => {
    if (!refinementQuery.trim()) return;
    setSaveInitiated(false);
    const instruction = refinementQuery;
    setRefinementQuery("");
    const promptConfig = specforgeRefinementPrompt(output, instruction);
    run("Rewrite the PRD with the requested refinements.", { systemPrompt: promptConfig });
  };

  const handleScaffoldProject = () => {
    if (!output) return;
    const transfer = {
      source: "specforge",
      data: {
        title: truncate(description.split("\n")[0]?.trim() || "Scaffolded Project", 40),
        requirements: output
      }
    };
    localStorage.setItem("pulsekit_context_transfer", JSON.stringify(transfer));
    router.push("/devlens?import=specforge");
  };

  const handleDocumentArchitecture = () => {
    if (!output) return;
    const transfer = {
      source: "specforge",
      data: {
        title: truncate(description.split("\n")[0]?.trim() || "PRD Specs", 40),
        analysis: output
      }
    };
    localStorage.setItem("pulsekit_context_transfer", JSON.stringify(transfer));
    router.push("/docs?import=specforge");
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

  const handleEnterCrucible = () => {
    setStep("crucible");
  };

  const handleGenerateBlueprint = async () => {
    if (!output) return;
    setBlueprintOutput("");
    const prompt = specforgeBlueprintPrompt(output);
    setStep("blueprint");
    
    // Clear previous stream state to reuse useAiStream for blueprint
    reset();
    run("Generate the 5 files for my project blueprint suite.", { systemPrompt: prompt });
  };

  // Sync blueprint output from stream
  React.useEffect(() => {
    if (step === "blueprint") {
      setBlueprintOutput(output);
    }
  }, [output, step]);

  useGlobalActions({
    onAnalyze: handleGenerate,
    onExport: handleExport,
    onClear: handleNewRequest,
  });

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 min-h-[calc(100vh-8rem)]">
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
      ) : (step === "result" || step === "generating") ? (
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

            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {output && !isLoading && (
                <>
                  <Button onClick={handleScaffoldProject} variant="outline" size="sm" className="gap-2 shrink-0 border-accent/20 text-accent hover:bg-accent/5">
                    <Code className="w-4 h-4" />
                    Scaffold Project
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                  <Button onClick={handleGenerateBlueprint} variant="outline" size="sm" className="gap-2 shrink-0 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5">
                    <Zap className="w-4 h-4" />
                    Blueprint Suite
                  </Button>
                  <Button onClick={handleDocumentArchitecture} variant="outline" size="sm" className="gap-2 shrink-0 border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/5">
                    <BookOpen className="w-4 h-4" />
                    Archive Wiki
                  </Button>
                  <ExportButton content={output} title={truncate(description.split("\n")[0]?.trim() || "PRD", 30)} />
                  <Button variant="outline" size="sm" onClick={handleNewRequest} className="gap-2 shrink-0 border-border/50">
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

          {!isLoading && output && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
               <Button onClick={handleEnterCrucible} className="rounded-full px-6 bg-void text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/10 shadow-xl group">
                  <Zap className="w-4 h-4 mr-2" /> Enter the Crucible
               </Button>

               <div className="w-px h-6 bg-border/50" />

               <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-2xl p-2 flex items-center gap-2 max-w-2xl">
                <input 
                  type="text" 
                  value={refinementQuery}
                  onChange={e => setRefinementQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRefine()}
                  placeholder="Ask for refinement..."
                  className="flex-1 bg-transparent border-0 outline-none px-4 text-sm text-foreground placeholder:text-muted-foreground w-48 sm:w-64"
                />
                <Button size="sm" className="rounded-full px-4" onClick={handleRefine} disabled={!refinementQuery.trim()}>
                  <Sparkles className="w-4 h-4 mr-2" /> Refine
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : step === "crucible" ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <PageHeader 
              icon={Skull}
              label="The Pitch Arena"
              title="Founder's Crucible"
              description="A panel of 3 simulated Venture Capitalists will now pressure-test your idea. Be precise. Be bold."
            />
            
            <CrucibleArena 
              prdText={output}
              onRestart={handleNewRequest}
            />
        </div>
      ) : step === "blueprint" ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
            <PageHeader 
              icon={Package}
              label="Engineering Suite"
              title="Project Scaffolding"
              description="Generating your core project assets: Readme, Documentation, Architecture, Todo, and Setup."
            />
            
            <BlueprintViewer 
              rawBlueprint={blueprintOutput}
              onBack={() => setStep("result")}
            />
        </div>
      ) : null}
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
