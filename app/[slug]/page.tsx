"use client";

import { useParams, notFound } from "next/navigation";
import { PrivacyContent } from "@/components/static/PrivacyContent";
import { TermsContent } from "@/components/static/TermsContent";
import { AboutContent } from "@/components/static/AboutContent";
import { ContactContent } from "@/components/static/ContactContent";
import { AdaptiveShell } from "@/components/shared/AdaptiveShell";
import { ShieldAlert, Globe, BookOpen, HelpCircle, Code, Users, Briefcase, LucideIcon } from "lucide-react";

function PlaceholderContent({ title, icon: Icon, description }: { title: string, icon: LucideIcon, description: string }) {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 text-center space-y-8">
       <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto shadow-xl shadow-accent/5">
          <Icon className="w-10 h-10 text-accent" />
       </div>
       <div className="space-y-4">
          <h1 className="text-5xl font-display font-black tracking-tight text-foreground">{title}</h1>
          <p className="text-xl text-muted font-medium max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
       </div>
       <div className="pt-12 grid sm:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 rounded-[2.5rem] border border-border bg-muted/20 animate-pulse" />
          ))}
       </div>
       <div className="pt-12">
          <p className="text-sm text-muted-foreground font-mono">
             PulseKit Engineering is currently finalizing this robust page.<br/>
             Expected availability: Q2 2026.
          </p>
       </div>
    </div>
  );
}

const CONTENT_MAP: Record<string, React.ReactNode> = {
  privacy: <PrivacyContent />,
  terms: <TermsContent />,
  about: <AboutContent />,
  contact: <ContactContent />,
  security: <PlaceholderContent 
    title="Security & Compliance" 
    icon={ShieldAlert}
    description="Explore our industry-standard security practices, SOC 2 Type II controls, and bug bounty program."
  />,
  cookies: <PlaceholderContent 
    title="Cookie Policy" 
    icon={Globe}
    description="How we use cookies and similar technologies to enhance your workspace experience."
  />,
  blog: <PlaceholderContent 
    title="PulseKit Blog" 
    icon={BookOpen}
    description="Latest insights on AI-native engineering, data science workflows, and engineering culture."
  />,
  careers: <PlaceholderContent 
    title="Work with Us" 
    icon={Briefcase}
    description="Join a global team of builders obsessed with quality and radical transparency."
  />,
  docs: <PlaceholderContent 
    title="Documentation" 
    icon={BookOpen}
    description="Detailed guides, tutorials, and reference materials for mastering PulseKit."
  />,
  help: <PlaceholderContent 
    title="Help Center" 
    icon={HelpCircle}
    description="Troubleshooting guides, FAQ, and direct support for all your engineering needs."
  />,
  'api-docs': <PlaceholderContent 
    title="API Reference" 
    icon={Code}
    description="Robust endpoints and SDKs for integrating PulseKit into your existing data pipelines."
  />,
  community: <PlaceholderContent 
    title="PulseKit Community" 
    icon={Users}
    description="Collaborate with engineers and data scientists from around the world."
  />,
};

export default function StaticPage() {
  const params = useParams();
  const slug = params.slug as string;

  const content = CONTENT_MAP[slug];

  if (!content) {
    notFound();
  }

  return (
    <AdaptiveShell>
      {content}
    </AdaptiveShell>
  );
}
