"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { useNotifications } from "@/hooks/useNotifications";
import { formatTimeAgo } from "@/lib/utils";

export default function NotificationsPage() {
  const { toast } = useToast();
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    clearAll,
    removeNotification 
  } = useNotifications();
  const [filter, setFilter] = React.useState<string>("all");

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "ai") return n.type === "ai";
    return true;
  });

  const handleClearAll = () => {
    clearAll();
    toast("Notification inbox cleared", "info");
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast("All notifications marked as read", "success");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "warning": return <AlertCircle className="w-5 h-5 text-amber" />;
      case "error": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "ai": return <Cpu className="w-5 h-5 text-violet" />;
      default: return <Info className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mesh-bg">
      <div className="absolute inset-0 grid-bg opacity-[0.03] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-display font-black tracking-tight text-foreground flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <Bell className="w-8 h-8 text-indigo-500" />
              </div>
              Inbox
            </h1>
            <p className="mt-3 text-muted font-medium">
              Daily updates, AI analysis reports, and system alerts.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Button 
              variant="ghost" 
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold uppercase tracking-widest hover:bg-muted/50"
            >
              Mark all as read
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleClearAll}
              className="text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 text-red-500"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              Clear All
            </Button>
          </motion.div>
        </header>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8">
          <Badge 
            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${filter === "all" ? "bg-accent text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
            onClick={() => setFilter("all")}
          >
            All Notifications
          </Badge>
          <Badge 
            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${filter === "unread" ? "bg-accent text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </Badge>
          <Badge 
            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all ${filter === "ai" ? "bg-violet text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
            onClick={() => setFilter("ai")}
          >
            AI Updates
          </Badge>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="py-20 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <Card 
                    className={`
                      p-6 relative border-border/50 group transition-all
                      ${n.read ? "bg-muted/10 opacity-70" : "bg-accent/5 ring-1 ring-accent/20 cursor-pointer hover:bg-accent/[0.07]"}
                    `}
                    onClick={() => !n.read && markAsRead(n.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-background shadow-md group-hover:scale-110 transition-transform`}>
                        {getTypeIcon(n.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-base font-bold ${n.read ? "text-muted-foreground" : "text-foreground"}`}>
                            {n.title}
                          </h3>
                          <span className="text-[10px] font-black uppercase text-muted tracking-widest">
                            {formatTimeAgo(n.time)}
                          </span>
                        </div>
                        <p className={`text-sm font-medium leading-relaxed mb-4 ${n.read ? "text-muted/60" : "text-muted"}`}>
                          {n.message}
                        </p>
                        
                        {n.action && (
                          <Button 
                            variant="ghost" 
                            className="bg-accent/10 text-accent hover:bg-accent hover:text-white px-4 h-8 text-[10px] font-black uppercase tracking-widest rounded-lg"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = n.actionHref || "#";
                            }}
                          >
                            {n.action} <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {!n.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(n.id);
                          }}
                          className="p-1 rounded-md hover:bg-red-500/10 group/item transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-muted group-hover/item:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="p-6 rounded-3xl bg-muted/20 border border-border/50">
                  <ShieldCheck className="w-12 h-12 text-muted" />
                </div>
                <h3 className="text-xl font-bold">You&apos;re all caught up!</h3>
                <p className="text-muted font-medium text-sm max-w-xs">
                  {filter === "all" 
                    ? "No new notifications at the moment." 
                    : `No ${filter} notifications found.`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
