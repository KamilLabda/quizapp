"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "success" | "error";

export type ToastInput = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastItem = Required<Pick<ToastInput, "variant" | "durationMs">> &
  ToastInput & {
    id: string;
    createdAt: number;
  };

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function randomId() {
  // short, non-cryptographic id is fine for UI
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = randomId();
      const item: ToastItem = {
        id,
        createdAt: Date.now(),
        variant: input.variant ?? "default",
        durationMs: input.durationMs ?? 4500,
        title: input.title,
        description: input.description,
      };

      setToasts((prev) => [item, ...prev].slice(0, 4));

      if (item.durationMs > 0) {
        window.setTimeout(() => dismiss(id), item.durationMs);
      }
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-9999 w-[min(520px,calc(100vw-2rem))] space-y-2 pointer-events-none">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "border border-border bg-background/95 backdrop-blur px-4 py-3 shadow-lg pointer-events-auto",
                t.variant === "error" && "border-destructive/50 bg-destructive/10",
                t.variant === "success" && "border-emerald-500/50 bg-emerald-500/10"
              )}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  {t.title ? (
                    <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  ) : null}
                  {t.description ? (
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border border-border bg-transparent hover:bg-muted/30 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}