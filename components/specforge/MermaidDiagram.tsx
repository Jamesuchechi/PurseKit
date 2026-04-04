"use client";

import * as React from "react";
import mermaid from "mermaid";
import { Loader2 } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  fontFamily: 'inherit',
  securityLevel: 'loose',
});

interface MermaidDiagramProps {
  chart: string;
  isStreaming: boolean;
}

export function MermaidDiagram({ chart, isStreaming }: MermaidDiagramProps) {
  const [svgContent, setSvgContent] = React.useState<string>("");
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    
    // Minimal debounce for the render loop so it doesn't choke the stream
    const timeoutId = setTimeout(async () => {
      if (!chart.trim()) return;

      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        
        // Auto-repair common AI mistakes and PlantUML leaks
        let repairedChart = chart
          .replace(/@startuml/g, "")
          .replace(/@enduml/g, "")
          .replace(/\|>/g, "|")        
          .replace(/---\|/g, "-->|")
          .replace(/--\|/g, "-->|")
          .trim();

        // 1. Identify Existing Header
        const HEADERS = ["graph ", "flowchart ", "sequenceDiagram", "classDiagram", "stateDiagram", "erDiagram", "gantt", "pie", "gitGraph"];
        const hasHeader = HEADERS.some(h => repairedChart.startsWith(h));

        // 2. Only attempt sequence-conversion fix if NO header exists
        if (!hasHeader) {
          // If it contains sequence arrows (-> or ->>) but NOT flowchart arrows (-->)
          const isSequence = (repairedChart.includes("->>") || repairedChart.includes("->")) && !repairedChart.includes("-->");
          
          if (isSequence) {
            // Clean up PlantUML specific declarations
            repairedChart = repairedChart
              .replace(/actor\s+(\w+)(?:\s+as\s+["'](.+?)["'])?/g, 'participant $1')
              .replace(/boundary\s+(\w+)(?:\s+as\s+["'](.+?)["'])?/g, 'participant $1')
              .replace(/database\s+(\w+)(?:\s+as\s+["'](.+?)["'])?/g, 'participant $1')
              .replace(/component\s+(\w+)(?:\s+as\s+["'](.+?)["'])?/g, 'participant $1')
              .replace(/control\s+(\w+)(?:\s+as\s+["'](.+?)["'])?/g, 'participant $1')
              .replace(/entity\s+(\w+)(?:\s+as\s+["'](.+?)["'])?/g, 'participant $1')
              .replace(/(\w+)\s*->>\s*(\w+)\s*:\s*(.+)/g, '$1->>$2: $3');
            
            repairedChart = `sequenceDiagram\n${repairedChart}`;
          } else {
            // Default to graph TD if no header and no sequence indicators
            repairedChart = `graph TD\n${repairedChart}`;
          }
        }

        // Try parsing first
        try {
          await mermaid.parse(repairedChart, { suppressErrors: true });
        } catch (parseError) {
           console.warn("Mermaid Parse Error:", parseError);
           if (!isStreaming) throw parseError; // Only throw if we are done
        }

        const { svg } = await mermaid.render(id, repairedChart);
        
        if (isMounted) {
          setSvgContent(svg);
          setHasError(false);
        }
      } catch (e) {
        console.error("Mermaid Render Failure:", e);
        // If it throws, it's either incomplete (streaming) or broken syntax.
        if (isMounted && !isStreaming) setHasError(true);
      }
    }, isStreaming ? 400 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [chart, isStreaming]);

  if (hasError && isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center bg-muted/5 border border-dashed border-border/50 rounded-xl my-8 p-12 overflow-x-auto text-muted-foreground gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-accent" />
        <span className="text-sm font-medium">Drawing diagram...</span>
        <pre className="text-[10px] opacity-50 mt-2 max-w-full overflow-hidden truncate">{chart.split('\\n').slice(-1)[0]}</pre>
      </div>
    );
  }

  if (hasError && !isStreaming) {
    return (
      <div className="flex flex-col items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl my-8 p-6 text-red-500 gap-2">
        <span className="text-sm font-bold">Failed to render Mermaid diagram.</span>
        <pre className="text-xs bg-black/20 p-4 rounded-lg overflow-x-auto w-full max-w-3xl">{chart}</pre>
      </div>
    );
  }

  // When successfully parsed
  return (
    <div 
      className="flex justify-center bg-muted/10 border border-border/50 rounded-xl my-8 p-6 overflow-x-auto" 
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
}
