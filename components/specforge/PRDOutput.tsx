"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { CopyButton } from "@/components/ui/CopyButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { MermaidDiagram } from "./MermaidDiagram";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

interface PRDOutputProps {
  markdown: string;
  isStreaming: boolean;
  className?: string;
}

export function PRDOutput({ markdown, isStreaming, className }: PRDOutputProps) {
  const [activeHeading, setActiveHeading] = React.useState<string>("");
  const contentRef = React.useRef<HTMLDivElement>(null);
  
  // Extract headings for navigation
  const headings = React.useMemo(() => {
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const items = [];
    let match;
    while ((match = regex.exec(markdown)) !== null) {
      if (match[2]) {
        const title = match[2];
        const level = match[1].length;
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        items.push({ title, level, id });
      }
    }
    return items;
  }, [markdown]);

  // Sidebar active heading highlighting via IntersectionObserver
  React.useEffect(() => {
    if (!contentRef.current) return;
    
    // We only want to track existing elements. When streaming they appear over time.
    const elements = Array.from(contentRef.current.querySelectorAll("h2, h3"));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      // Find the first intersecting heading
      for (const entry of entries) {
        if (entry.isIntersecting && entry.target.id) {
          setActiveHeading(entry.target.id);
          break;
        }
      }
    }, {
      rootMargin: "0px 0px -80% 0px", // Trigger when heading is in the top 20% of the viewport
      threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [headings.length]); // Re-run when headings array length changes (streaming)

  const handleNavClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveHeading(id);
    }
  };

  // Parse Metadata block
  const metadataMatch = markdown.match(/^\[METADATA:\s*size=([^,]+),\s*risk=([^\]]+)\]/i);
  let renderableMarkdown = markdown;
  let size = null;
  let risk = null;
  
  if (metadataMatch) {
    size = metadataMatch[1]?.trim();
    risk = metadataMatch[2]?.trim();
    renderableMarkdown = markdown.replace(metadataMatch[0], "").trim();
  }

  if (!renderableMarkdown && isStreaming) {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-8", className)}>
        <div className="hidden lg:block lg:col-span-1 space-y-4">
          <Skeleton className="h-6 w-32 rounded mb-6" />
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-4 w-full rounded" />
          ))}
        </div>
        <div className="lg:col-span-3 space-y-8">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!markdown) return null;

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-4 gap-12 relative", className)}>
      {/* Sticky Table of Contents Sidebar */}
      <div className="hidden lg:block lg:col-span-1 border-r border-border/50 pr-6">
        <div className="sticky top-8 overflow-y-auto max-h-[calc(100vh-4rem)] styled-scrollbar pb-8">
          <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Contents</h4>
          <nav className="flex flex-col gap-1.5">
            {headings.map((h, i) => (
              <a
                key={`${h.id}-${i}`}
                href={`#${h.id}`}
                onClick={(e) => handleNavClick(h.id, e)}
                className={cn(
                  "text-sm transition-all border-l-2 py-1",
                  h.level === 3 ? "pl-6" : "pl-3",
                  activeHeading === h.id 
                    ? "border-accent text-foreground font-bold" 
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {h.title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main PRD Content */}
      <div 
        className="lg:col-span-3 prose prose-invert max-w-none prose-p:leading-relaxed text-foreground pb-24 prd-prose min-w-0"
        ref={contentRef}
      >
        {size && risk && (
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-border/50">
            <Badge variant="subtle" className="px-3 py-1 text-sm bg-accent/10 text-accent border-accent/20">
              Size: {size}
            </Badge>
            <Badge 
              variant="subtle" 
              className={cn(
                "px-3 py-1 text-sm flex items-center gap-1.5",
                risk.toLowerCase() === "low" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                risk.toLowerCase() === "high" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              )}
            >
              {risk.toLowerCase() === "low" && <CheckCircle2 className="w-4 h-4" />}
              {risk.toLowerCase() === "high" && <ShieldAlert className="w-4 h-4" />}
              {(risk.toLowerCase() === "medium" || risk.toLowerCase() === "med") && <AlertTriangle className="w-4 h-4" />}
              Risk: {risk}
            </Badge>
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            h1: ({ ...props }) => <h1 className="text-4xl font-display font-black tracking-tight mt-12 mb-6" {...props} />,
            h2: ({ children, ...props }) => {
              const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return <h2 id={id} className="text-2xl font-bold mt-12 mb-4 pb-2 border-b border-border/50 scroll-mt-8" {...props}>{children}</h2>;
            },
            h3: ({ children, ...props }) => {
              const id = String(children).toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return <h3 id={id} className="text-xl font-bold mt-8 mb-3 scroll-mt-8" {...props}>{children}</h3>;
            },
            table: ({ ...props }) => (
              <div className="overflow-x-auto w-full my-8 border border-border/50 rounded-xl bg-muted/10">
                <table className="w-full text-sm text-left m-0" {...props} />
              </div>
            ),
            th: ({ ...props }) => <th className="px-4 py-3 font-bold bg-muted/20 border-b border-border/50" {...props} />,
            td: ({ ...props }) => <td className="px-4 py-3 border-b border-border/30 last:border-0" {...props} />,
            blockquote: ({ ...props }) => (
              <blockquote className="border-l-4 border-accent bg-accent/5 px-6 py-4 rounded-r-xl italic my-6 text-muted-foreground" {...props} />
            ),
            code({ inline, className, children, node: _node, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean; node?: unknown }) {
              void _node; // Suppress unused var warning
              const match = /language-(\w+)/.exec(className || "");
              const codeString = String(children).replace(/\n$/, "");
              
              if (!inline && match?.[1] === "mermaid") {
                return <MermaidDiagram chart={codeString} isStreaming={isStreaming} />;
              }

              if (!inline && match) {
                return (
                  <div className="relative group my-6 rounded-xl overflow-hidden border border-border/50">
                    <div className="absolute right-4 top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <CopyButton text={codeString} className="h-8 w-8 bg-background/50 backdrop-blur" />
                    </div>
                    <SyntaxHighlighter
                      {...props}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      className="!m-0 text-sm"
                      customStyle={{ background: "transparent", padding: "1.25rem" }}
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  </div>
                );
              }
              return (
                <code className={cn("bg-muted/50 px-1.5 py-0.5 rounded-md text-sm font-mono text-accent", className)} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {renderableMarkdown}
        </ReactMarkdown>
        
        {isStreaming && (
          <div className="flex items-center gap-2 mt-8 text-accent font-mono text-sm">
            <span className="animate-pulse">_</span> generating...
          </div>
        )}
      </div>
    </div>
  );
}
