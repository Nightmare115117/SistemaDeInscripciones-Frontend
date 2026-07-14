import { LiquidGlassCard } from "@/components-custom/GlassCard";
// src/components/ui/liquid-glass-filter.tsx
import { LocationMap } from "./components-custom/InteractiveMap";
import { Navbar } from "./components-custom/Navbar";
import "@/css-custom/App.css"

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

      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6">
        <Navbar />
      </header>

      <section className="min-h-screen flex items-center justify-center gap-8 px-6">
        <div className="flex flex-row gap-6">
          <LiquidGlassCard className="w-full max-w-md p-8" interactive>
              <h1 className="text-6xl md:text-8xl font-bold tracking-light text-black">Bienvenido</h1>
          </LiquidGlassCard>

          <LiquidGlassCard className="w-full max-w-md p-8" >
            <LocationMap/>
          </LiquidGlassCard>
        </div>
      </section>
    </main>
  );
}

export default App;