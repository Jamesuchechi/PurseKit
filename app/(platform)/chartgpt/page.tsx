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
import { chartgptPrompt } from "@/lib/prompts";
import type { ChartConfig } from "@/types";

export default function ChartGPTPage() {
  const { file, parsedData, error: uploadError, isLoading: isUploading, upload, reset: resetFile } = useFileUpload();
  const { data: rawChartConfig, isLoading: isAnalyzing, error: aiError, run: runAi, reset: resetAi } = useAiJSON<ChartConfig>();
  const history = useHistory<ChartConfig>("chartgpt");

  const [step, setStep] = React.useState<"upload" | "preview" | "visualize">("upload");
  const [configError, setConfigError] = React.useState<string | null>(null);

  // Sync step with data state
  React.useEffect(() => {
    if (parsedData && step === "upload") {
      setStep("preview");
    }
  }, [parsedData, step]);

  const handleFileSelect = (selectedFile: File) => {
    upload(selectedFile);
  };

  const handleAnalyze = async (prompt: string) => {
    if (!parsedData) return;
    setConfigError(null);

    // Take a small sample of the data to avoid token limits
    const sample = parsedData.data.slice(0, 5);
    const dataString = JSON.stringify(sample);
    const fullPrompt = chartgptPrompt(dataString, parsedData.columns, prompt);
    
    const config = await runAi(fullPrompt, {
      provider: "groq",
      model: "llama-3.3-70b-versatile",
    });

    if (!config) return; // error is already in aiError state

    // Runtime validation guard
    if (!isValidChartConfig(config)) {
      setConfigError("The AI returned an invalid chart configuration. Please try rephrasing your request.");
      return;
    }

    setStep("visualize");
    history.save({
      title: config.title || prompt,
      input: prompt,
      result: config,
    });
  };

  const handleReset = () => {
    resetFile();
    resetAi();
    setStep("upload");
  };

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
                        <ChartPromptInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />
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

              {step === "visualize" && rawChartConfig && parsedData && (
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

                  <ChartRenderer
                    config={rawChartConfig}
                    data={parsedData.data}
                    onReset={() => setStep("preview")}
                  />
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
