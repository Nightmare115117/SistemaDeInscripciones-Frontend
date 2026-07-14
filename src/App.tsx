import { LiquidGlassCard } from "@/components-custom/GlassCard";
import { Countdown } from "./components-custom/Countdown";
// src/components/ui/liquid-glass-filter.tsx
import { LocationMap } from "./components-custom/InteractiveMap";
import { Navbar } from "./components-custom/Navbar";
import "@/css-custom/App.css"

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden">
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

      <Navbar />

      <section
        id="inicio"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-6
          pt-32
        "
      >
        <LiquidGlassCard className="p-8">
          <h1 className="text-6xl font-bold">
            Bienvenido
          </h1>
          <Countdown targetDate={new Date("2026-10-12T12:30:00")} />
        </LiquidGlassCard>
      </section>


      <section
        id="itinerario"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-6
        "
      >
        <LiquidGlassCard className="p-8">
          <h2 className="text-4xl font-bold">
            Registro
          </h2>
        </LiquidGlassCard>
      </section>


      <section
        id="ubicacion"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-6
        "
      >
        <LiquidGlassCard className="p-8">
          <h2 className="text-4xl font-bold">
            <LocationMap />
          </h2>
        </LiquidGlassCard>
      </section>


      <section
        id="faq"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-6
        "
      >
        <LiquidGlassCard className="p-8">
          <h2 className="text-4xl font-bold">
            Preguntas frecuentes
          </h2>
        </LiquidGlassCard>
      </section>
    </main>
  );
}

export default App;