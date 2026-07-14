import { LiquidGlassCard } from "./components-custom/GlassCard";
// src/components/ui/liquid-glass-filter.tsx

function App() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div
        className="
          absolute
          -top-32
          -left-32
          h-96
          w-96
          rounded-full
          bg-yellow-500/50
          blur-3xl
        "
      />
      <div
        className="
          absolute
          -bottom-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-blue-500/40
          blur-3xl
        "
      />

      <LiquidGlassCard className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-black">Registro Hackathon</h1>
        <p className="mt-3 text-white/60">Sistema de inscripciones</p>
      </LiquidGlassCard>
    </main>
  );
}

export default App;