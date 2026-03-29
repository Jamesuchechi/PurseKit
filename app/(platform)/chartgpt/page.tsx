"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, ArrowLeft, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { FileDropzone } from "@/components/chartgpt/FileDropzone";
import { DataPreview } from "@/components/chartgpt/DataPreview";
import { ChartPromptInput } from "@/components/chartgpt/ChartPromptInput";
import { ChartRenderer, isValidChartConfig } from "@/components/chartgpt/ChartRenderer";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAiJSON } from "@/hooks/useAiJSON";
import { useHistory } from "@/hooks/useHistory";
import { Button } from "@/components/ui/Button";
import { ChartConfigEditor } from "@/components/chartgpt/ChartConfigEditor";
import { ChartInsight } from "@/components/chartgpt/ChartInsight";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { useModuleContext } from "@/context/ModuleContext";
import { useGlobalActions } from "@/hooks/useGlobalActions";
import { useAiStream } from "@/hooks/useAiStream";
import { chartgptPrompt, chartInsightPrompt } from "@/lib/prompts";
import type { ChartConfig } from "@/types";
import { type ParsedData, inferColumnTypes } from "@/lib/csv-parser";
import { Suspense } from "react";
import { useNotifications } from "@/hooks/useNotifications";

function ChartGPTContent() {
  const { file, parsedData, error: uploadError, isLoading: isUploading, upload, reset: resetFile, setParsedData } = useFileUpload();
  const { data: rawChartConfig, isLoading: isAnalyzing, error: aiError, run: runAi, reset: resetAi, setData: setAiData } = useAiJSON<ChartConfig>();
  
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const history = useHistory<{ config: ChartConfig; data: ParsedData; insight?: string }>("chartgpt");
  const { addNotification } = useNotifications();
  const { updateContext } = useModuleContext();

  const { output: insight, isLoading: isInsightLoading, run: runInsight, reset: resetInsight, setOutput: setInsight } = useAiStream();

  const [step, setStep] = React.useState<"upload" | "preview" | "visualize">("upload");
  const [configError, setConfigError] = React.useState<string | null>(null);
  const [editableConfig, setEditableConfig] = React.useState<ChartConfig | null>(null);
  const [prompt, setPrompt] = React.useState("");

  const lastAnalyzedConfigRef = React.useRef<string>("");

  // Load from search params (History)
  React.useEffect(() => {
    const id = searchParams.get("id");
    if (id && history.items.length > 0) {
      const item = history.items.find((i) => i.id === id);
      if (item && item.result) {
        setAiData(item.result.config);
        setEditableConfig(item.result.config);
        setParsedData(item.result.data);
        setInsight(item.result.insight || "");
        setPrompt(item.input);
        setStep("visualize");
      }
    }
  }, [searchParams, history.items, setAiData, setParsedData, setInsight, setPrompt, setStep]);

  React.useEffect(() => {
    if (rawChartConfig && isValidChartConfig(rawChartConfig)) {
      setEditableConfig(rawChartConfig);
      lastAnalyzedConfigRef.current = JSON.stringify({
        type: rawChartConfig.type,
        xAxis: rawChartConfig.xAxis,
        dataKeys: rawChartConfig.dataKeys
      });
    }
  }, [rawChartConfig]);

  // Reactive Insight Updates
  React.useEffect(() => {
    if (step !== "visualize" || !editableConfig || !parsedData || isAnalyzing) return;

    const currentStructuralConfig = JSON.stringify({
      type: editableConfig.type,
      xAxis: editableConfig.xAxis,
      dataKeys: editableConfig.dataKeys
    });

    // Skip if config hasn't structurally changed
    if (currentStructuralConfig === lastAnalyzedConfigRef.current) return;

    const timer = setTimeout(() => {
      const insightPrompt = chartInsightPrompt(
        JSON.stringify(parsedData.data.slice(0, 50)), 
        JSON.stringify(editableConfig), 
        prompt
      );
      
      runInsight(insightPrompt).then((finalInsight) => {
        lastAnalyzedConfigRef.current = currentStructuralConfig;
        
        // Update history with new insight
        history.save({
          title: editableConfig.title || prompt,
          input: prompt,
          result: { config: editableConfig, data: parsedData, insight: finalInsight },
        });
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [editableConfig, step, parsedData, prompt, runInsight, isAnalyzing, history]);

  // Sync step with data state
  React.useEffect(() => {
    if (parsedData && step === "upload") {
      setStep("preview");
    }
  }, [parsedData, step, setStep]);

  const handleFileSelect = (selectedFile: File) => {
    upload(selectedFile);
  };

  const handleAnalyze = async (customPrompt?: string) => {
    const p = customPrompt || prompt;
    if (!p.trim() || !parsedData) return;

    // Set initial context for chat
    updateContext("chartgpt", { prompt: p, columns: parsedData.columns });

    const fullPrompt = chartgptPrompt(JSON.stringify(parsedData.data.slice(0, 5)), parsedData.columns, p);
    runAi(fullPrompt).then((config) => {
      if (config && isValidChartConfig(config)) {
        // Update context with final chart config
        updateContext("chartgpt", { config, columns: parsedData.columns });

        setStep("visualize");

        // Trigger AI Insight Analysis
        const insightPrompt = chartInsightPrompt(JSON.stringify(parsedData.data.slice(0, 50)), JSON.stringify(config), p);
        runInsight(insightPrompt).then((finalInsight) => {
          history.save({
            title: config.title || p,
            input: p,
            result: { config, data: parsedData!, insight: finalInsight },
          }).then((item) => {
            toast("Visualization & Intelligence saved", "success");
            addNotification({
              type: "ai",
              title: "Intelligence Analysis Ready",
              message: `ChartGPT analysis for '${item?.title}' is complete.`,
              module: "chartgpt",
              action: "View Intelligence",
              actionHref: `/chartgpt?id=${item?.id}`
            });
          });
        });
      } else if (config) {
        setConfigError("The AI returned an invalid chart configuration. Please try rephrasing your request.");
      }
    });
  };

  const handleReset = () => {
    resetFile();
    resetAi();
    resetInsight();
    setPrompt("");
    setStep("upload");
  };

  const handleLoadSample = React.useCallback(() => {
    const sampleCSV = `Month,Sales,Expenses,Orders,Region
Jan,4500,3200,120,North
Feb,5200,3400,145,North
Mar,4800,3100,130,South
Apr,6100,4200,180,East
May,5900,3800,165,West
Jun,7200,4500,210,East
Jul,8100,5100,240,North
Aug,7800,4900,225,South`;
    
    // Process sample CSV into ParsedData
    const rows = sampleCSV.split('\n').filter(r => r.trim());
    const headers = rows[0].split(',');
    const data = rows.slice(1).map(row => {
      const vals = row.split(',');
      return headers.reduce((acc, h, i) => ({ ...acc, [h]: isNaN(Number(vals[i])) ? vals[i] : Number(vals[i]) }), {});
    });

    setParsedData({
      data,
      columns: headers,
      types: inferColumnTypes(data, headers)
    });
    setStep("preview");
    toast("Sample dataset loaded: Monthly Sales Performance", "success");
  }, [setParsedData, setStep, toast]);

  React.useEffect(() => {
    const listener = () => handleLoadSample();
    window.addEventListener('pulsekit:load-sample-data', listener);
    return () => window.removeEventListener('pulsekit:load-sample-data', listener);
  }, [handleLoadSample]);

  useGlobalActions({
    onAnalyze: () => handleAnalyze(),
    onClear: handleReset,
    onExport: () => toast("Use the export menu on the chart result", "info"),
  });

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-void transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <PageHeader
          icon={BarChart3}
          label="ChartGPT"
          title="Visual Data Intelligence"
          description="Transform CSV, Excel, or JSON into stunning visualizations in seconds."
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar pt-12">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <AnimatePresence mode="wait">
              {step === "upload" && (
                <motion.div
                  key="upload-step"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="pt-12"
                >
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-display font-black text-foreground mb-4">
                      Upload your raw data
                    </h2>
                    <p className="text-muted max-w-lg mx-auto leading-relaxed">
                      Upload your dataset and let AI help you discover insights through beautiful, interactive charts.
                    </p>
                  </div>
                  <FileDropzone
                    onFileSelect={handleFileSelect}
                    isLoading={isUploading}
                    error={uploadError}
                    selectedFile={file}
                    onReset={handleReset}
                  />
                </motion.div>
              )}

              {step === "preview" && parsedData && (
                <motion.div
                  key="preview-step"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted hover:text-foreground">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <h2 className="text-2xl font-display font-black text-foreground">
                        Data Insight
                      </h2>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-8 min-w-0">
                      <DataPreview data={parsedData} />
                    </div>
                    <div className="lg:col-span-4 space-y-8 min-w-0">
                      <div className="sticky top-8">
                        <ChartPromptInput 
                          onAnalyze={handleAnalyze} 
                          isLoading={isAnalyzing} 
                          prompt={prompt}
                          setPrompt={setPrompt}
                        />
                        {(aiError || configError) && (
                          <p className="mt-4 text-sm text-danger bg-danger/5 border border-danger/10 p-3 rounded-xl flex items-center gap-2">
                            <RotateCcw className="w-4 h-4" />
                            {aiError ?? configError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "visualize" && editableConfig && parsedData && (
                <motion.div
                  key="visualize-step"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={() => setStep("preview")} className="text-muted hover:text-foreground">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Edit Request
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 border-accent/20 text-accent hover:bg-accent/5">
                      <RotateCcw className="w-4 h-4" />
                      New Dataset
                    </Button>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-3 sticky top-8">
                      <ChartConfigEditor 
                        config={editableConfig} 
                        columns={parsedData.columns} 
                        onChange={setEditableConfig} 
                      />
                    </div>
                    <div className="lg:col-span-9 space-y-8 min-w-0">
                      <ChartRenderer
                        config={editableConfig}
                        data={parsedData.data}
                        onReset={() => setStep("preview")}
                      />
                      <ChartInsight insight={insight} isLoading={isInsightLoading} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Background Decorative Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-accent/5 dark:bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-violet/5 dark:bg-violet/10 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}

export default function ChartGPTPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
      </div>
    }>
      <ChartGPTContent />
    </Suspense>
  );
}
