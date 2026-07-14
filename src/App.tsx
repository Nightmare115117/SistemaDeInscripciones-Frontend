import { LiquidGlassCard } from "@/components-custom/GlassCard";
// src/components/ui/liquid-glass-filter.tsx
import { LocationMap } from "./components-custom/InteractiveMap";

function App() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div
        className="
          absolute
          -top-32
          -left-32
          h-200
          w-110
          rounded-full
          bg-[#EBBE4D]/50
          blur-3xl
        "
      />
      <div
        className="
          absolute
          -bottom-40
          -right-40
          h-150
          w-200
          rounded-full
          bg-[rgb(0,0,128)]/40
          blur-3xl
        "
      />

      <div className="flex flex-row gap-6">
        <LiquidGlassCard className="w-full max-w-md p-8" interactive>
        
          <h1 className="text-4xl font-bold text-black">Registro Hackathon</h1>
          <p className="mt-3 text-white/60">Sistema de inscripciones</p>

        </LiquidGlassCard>

        <LiquidGlassCard className="w-full max-w-md p-8" >
          <LocationMap/>
        </LiquidGlassCard>
      </div>
    </main>
  );
}

export default App;