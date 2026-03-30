"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Cpu, 
  Palette, 
  Trash2, 
  ShieldCheck, 
  Cloud, 
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useTheme } from "next-themes";
import { getCookie, setCookie } from "@/lib/utils";
import { useHistory } from "@/hooks/useHistory";
import { useToast } from "@/components/ui/Toast";

import { exportWorkspace, importWorkspace, type PulseWorkspace } from "@/lib/workspace";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);
  const [guestName, setGuestName] = React.useState("");
  const [aiProvider, setAiProvider] = React.useState("groq");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { clear: clearDevLens } = useHistory("devlens");
  const { clear: clearSpecForge } = useHistory("specforge");
  const { clear: clearChartGPT } = useHistory("chartgpt");

  React.useEffect(() => {
    setMounted(true);
    const savedName = getCookie("guest-name") || "Guest User";
    setGuestName(savedName);
    
    const savedProvider = localStorage.getItem("pulsekit-ai-provider") || "groq";
    setAiProvider(savedProvider);
  }, []);

  if (!mounted) return null;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setCookie("guest-name", guestName);
    setIsSaving(false);
    toast("Profile updated successfully", "success");
  };

  const handleProviderChange = (provider: string) => {
    setAiProvider(provider);
    localStorage.setItem("pulsekit-ai-provider", provider);
    toast(`AI Provider switched to ${provider.toUpperCase()}`, "info");
  };

  const handleClearAllHistory = async () => {
    if (confirm("Are you sure you want to permanently delete all session history? This action cannot be undone.")) {
      await clearDevLens();
      await clearSpecForge();
      await clearChartGPT();
      toast("All history cleared", "success");
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    exportWorkspace();
    setTimeout(() => setIsExporting(false), 1000);
    toast("Workspace exported as .pulse", "success");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workspace = JSON.parse(event.target?.result as string) as PulseWorkspace;
        const success = importWorkspace(workspace);
        if (success) {
          toast("Workspace restored. Refreshing...", "success");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast("Failed to restore workspace", "error");
        }
      } catch (err) {
        console.error("Invalid workspace file", err);
        toast("Invalid .pulse workspace file", "error");
      }
    };
    reader.readAsText(file);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mesh-bg">
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 px-4">
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-display font-black tracking-tight text-foreground flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              Platform Settings
            </h1>
            <p className="mt-3 text-muted font-medium max-w-2xl">
              Manage your workspace preferences, AI configurations, and session data. 
              Settings are stored locally in your browser.
            </p>
          </motion.div>
        </header>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6"
        >
          {/* Section: Profile */}
          <motion.div variants={item}>
            <Card className="p-6 border-border/50 hover:border-accent/20 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">User Profile</h2>
              </div>
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">
                    Display Name
                  </label>
                  <div className="flex gap-3">
                    <Input 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-muted/30 border-border/50 focus:border-accent/50 transition-all font-medium"
                    />
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="px-6 rounded-xl shadow-lg shadow-accent/20"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Section: Workspace Management */}
          <motion.div variants={item}>
            <Card className="p-6 border-border/50 hover:border-emerald-500/20 transition-all bg-emerald-500/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Cloud className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Workspace Portability</h2>
                  <p className="text-xs text-muted font-medium mt-0.5">Backup or restore your entire PulseKit history locally.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 border border-border/50 rounded-2xl bg-muted/10 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold">Backup Workspace</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Download your current session history, AI analyses, and preferences into a .pulse file.
                    </p>
                  </div>
                  <Button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10"
                  >
                    {isExporting ? "Exporting..." : "Download .pulse File"}
                  </Button>
                </div>

                <div className="p-6 border border-border/50 rounded-2xl bg-muted/10 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold">Restore Session</h3>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Restore data from a previously exported .pulse file. This will replace your current workspace.
                    </p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pulse" 
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline"
                    onClick={handleImportClick}
                    className="w-full border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/5"
                  >
                    Upload and Restore
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Section: AI Configuration */}
          <motion.div variants={item}>
            <Card className="p-6 border-border/50 hover:border-violet/20 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-5 h-5 text-violet" />
                <h2 className="text-lg font-bold">AI Intelligence</h2>
              </div>
              <p className="text-sm font-medium text-muted mb-6 max-w-xl">
                Choose the backend provider for DevLens, SpecForge, and ChartGPT. 
                Each provider may have different response times and capabilities.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: "groq", name: "Groq", speed: "Fastest", color: "amber" },
                  { id: "mistral", name: "Mistral", speed: "Balanced", color: "violet" },
                  { id: "openrouter", name: "OpenRouter", speed: "Variable", color: "accent" },
                ].map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderChange(provider.id)}
                    className={`
                      p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group
                      ${aiProvider === provider.id 
                        ? `border-${provider.color} bg-${provider.color}/5 shadow-lg shadow-${provider.color}/10` 
                        : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/40"
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold ${aiProvider === provider.id ? `text-${provider.color}` : "text-foreground"}`}>
                        {provider.name}
                      </span>
                      {aiProvider === provider.id && (
                        <CheckCircle2 className={`w-4 h-4 text-${provider.color}`} />
                      )}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                      {provider.speed}
                    </span>
                    
                    {/* Hover Effect */}
                    <div className={`absolute -right-4 -bottom-4 w-12 h-12 bg-${provider.color}/5 rounded-full blur-xl group-hover:scale-150 transition-all`} />
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Section: Appearance */}
          <motion.div variants={item}>
            <Card className="p-6 border-border/50 hover:border-amber/20 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-amber" />
                <h2 className="text-lg font-bold">Aesthetics</h2>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {[
                  { id: "light", label: "Light Mode", icon: "☀️" },
                  { id: "dark", label: "Dark Mode", icon: "🌙" },
                  { id: "system", label: "System Default", icon: "💻" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`
                      px-6 py-3 rounded-xl border-2 flex items-center gap-3 transition-all font-bold text-sm
                      ${theme === t.id 
                        ? "border-amber bg-amber/5 text-amber" 
                        : "border-border/50 bg-muted/20 hover:border-border"
                      }
                    `}
                  >
                    <span>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Section: Privacy */}
          <motion.div variants={item}>
            <Card className="p-6 border-border/50 hover:border-red-500/20 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold">Data Privacy</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                <div>
                  <h3 className="text-sm font-bold text-red-500 flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4" />
                    Danger Zone
                  </h3>
                  <p className="text-xs font-medium text-muted max-w-md">
                    Clearing all history will permanently remove all saved DevLens reports, SpecForge docs, and ChartGPT visualizations from this browser. This cannot be undone.
                  </p>
                </div>
                <Button 
                  variant="ghost"
                  onClick={handleClearAllHistory}
                  className="bg-transparent text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 px-8 rounded-xl font-bold text-xs uppercase tracking-widest"
                >
                  Clear Everything
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
