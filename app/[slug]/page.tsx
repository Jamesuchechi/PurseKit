"use client";

import { Suspense } from "react";
import { useParams, notFound } from "next/navigation";
import { PrivacyContent } from "@/components/static/PrivacyContent";
import { TermsContent } from "@/components/static/TermsContent";
import { AboutContent } from "@/components/static/AboutContent";
import { ContactContent } from "@/components/static/ContactContent";
import { SecurityContent } from "@/components/static/SecurityContent";
import { CareersContent } from "@/components/static/CareersContent";
import { DocsContent } from "@/components/static/DocsContent";
import { HelpContent } from "@/components/static/HelpContent";
import { ApiDocsContent } from "@/components/static/ApiDocsContent";
import { BlogContent } from "@/components/static/BlogContent";
import { CommunityContent } from "@/components/static/CommunityContent";
import { CookiesContent } from "@/components/static/CookiesContent";
import { PricingContent } from "@/components/static/PricingContent";
import { AdaptiveShell } from "@/components/shared/AdaptiveShell";

const CONTENT_MAP: Record<string, React.ReactNode> = {
  privacy: <PrivacyContent />,
  terms: <TermsContent />,
  about: <AboutContent />,
  contact: <ContactContent />,
  security: <SecurityContent />,
  cookies: <CookiesContent />,
  blog: <BlogContent />,
  careers: <CareersContent />,
  docs: <DocsContent />,
  help: <HelpContent />,
  'api-docs': <ApiDocsContent />,
  pricing: <PricingContent />,
  community: <CommunityContent />,
};

export default function StaticPage() {
  const params = useParams();
  const slug = params.slug as string;

  const content = CONTENT_MAP[slug];

  if (!content) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <AdaptiveShell>
        {content}
      </AdaptiveShell>
    </Suspense>
  );
}
