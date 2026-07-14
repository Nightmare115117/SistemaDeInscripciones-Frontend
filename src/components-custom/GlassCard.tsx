import { motion, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export function LiquidGlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("glass-liquid rounded-[40px] w-[420px] h-[280px]", className)}>
      {children}
    </div>
  );
}

export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const highlight = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, oklch(1 0 0 / 0.15), transparent 70%)`
  );

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "glass relative overflow-hidden rounded-3xl p-6",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: highlight }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}