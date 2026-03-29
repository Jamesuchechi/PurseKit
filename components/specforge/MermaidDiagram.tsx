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
      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        // Try parsing first, if it fails it throws. 
        // We run render directly.
        const { svg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvgContent(svg);
          setHasError(false);
        }
      } catch (e) {
        void e;
        // If it throws, it's either incomplete (streaming) or broken syntax.
        if (isMounted) setHasError(true);
      }
    }, isStreaming ? 300 : 0);

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
