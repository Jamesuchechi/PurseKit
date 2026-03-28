"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle2, AlertCircle, FileSpreadsheet, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
  selectedFile?: File | null;
  onReset?: () => void;
}

export function FileDropzone({
  onFileSelect,
  isLoading,
  error,
  selectedFile,
  onReset,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith(".csv") || filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
      return <FileSpreadsheet className="w-10 h-10 text-emerald-500" />;
    }
    return <FileText className="w-10 h-10 text-blue-500" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300",
              "flex flex-col items-center justify-center text-center space-y-4",
              isDragging
                ? "border-accent bg-accent/5 scale-[1.02]"
                : "border-border hover:border-accent/50 hover:bg-accent/5"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleChange}
              className="hidden"
            />
            
            <div className={cn(
              "p-4 rounded-full bg-background border border-border shadow-sm transition-transform duration-300 group-hover:scale-110",
              isDragging && "scale-110 border-accent/50"
            )}>
              <Upload className={cn(
                "w-8 h-8 text-muted transition-colors duration-300",
                "group-hover:text-accent",
                isDragging && "text-accent"
              )} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                Drop your data file here
              </h3>
              <p className="text-muted text-sm max-w-xs mx-auto">
                Support for <span className="text-foreground font-medium">CSV</span>,{" "}
                <span className="text-foreground font-medium">Excel</span>, and{" "}
                <span className="text-foreground font-medium">JSON</span> files. Max 10MB.
              </p>
            </div>

            <Button variant="outline" size="sm" className="mt-4 pointer-events-none group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all">
              Browse Files
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative p-8 rounded-2xl border border-border bg-background/50 backdrop-blur-sm overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-6">
              <div className="p-4 rounded-xl bg-background border border-border shadow-sm">
                {getFileIcon(selectedFile.name)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-bold text-foreground truncate max-w-[200px]">
                    {selectedFile.name}
                  </h4>
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full"
                    />
                  ) : error ? (
                    <AlertCircle className="w-4 h-4 text-danger" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <p className="text-muted text-sm capitalize">
                  {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.split('.').pop()?.toUpperCase()}
                </p>
              </div>

              {!isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReset?.();
                  }}
                  className="text-muted hover:text-danger hover:bg-danger/10 p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 rounded-xl bg-danger/5 border border-danger/20 flex gap-3 items-start"
              >
                <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold text-danger block mb-1">Upload Failed</span>
                  <span className="text-muted">{error}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
