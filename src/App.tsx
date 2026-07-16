import { LiquidGlassCard } from "@/components-custom/GlassCard";
import { AnimatePresence, motion } from "motion/react";
import { Countdown } from "./components-custom/Countdown";
// src/components/ui/liquid-glass-filter.tsx
import { useEffect, useState } from "react";
import { LocationMap } from "./components-custom/InteractiveMap";
import { Navbar } from "./components-custom/Navbar";
import "@/css-custom/App.css"
import { SegmentedControl } from "./components-custom/SegmentOption";

function App() {
  const [selectedDay, setSelectedDay] = useState("dia1");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('https://sistemadeinscripciones.onrender.com/api/registro/count', {})
    .then((res) => res.json())
    .then((data) => setTotal(data.total))
    .catch((err) => console.error(err));
  }, []);

  const schedule: Record<string, { time: string; activity: string }[]> = {
    dia1: [
      { time: "12:30", activity: "Registro" },
      { time: "14:30", activity: "Inauguración" },
      { time: "15:00", activity: "Competencia" },
      { time: "19:00", activity: "Cena" },
    ],
    dia2: [
      { time: "8:00", activity: "Desayuno" },
      { time: "9:00", activity: "Competencia" },
      { time: "13:00", activity: "Comida" },
      { time: "14:00", activity: "Ultima hora de Competencia" },
      { time: "15:00", activity: "Presentacion y Evaluación"},
      { time: "18:00", activity: "Deliveración del Jurado"},
      { time: "18:30", activity: "Premiación y clausura"},
    ],
  };

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
          <h2>{47 - total}</h2>
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
        <LiquidGlassCard className="p-8 w-full max-w-lg flex flex-col items-center" interactive>
          <h2 className="text-4xl font-bold">
            Itinerario
          </h2>
 
          <SegmentedControl
            options={[
              { id: "dia1", label: "Día 1" },
              { id: "dia2", label: "Día 2" },
            ]}
            value={selectedDay}
            onChange={setSelectedDay}
            className="mt-8"
          />
 
          <div className="w-full min-h-[220px] mt-6">
            <AnimatePresence mode="wait">
              <motion.ul
                key={selectedDay}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={
                  selectedDay === "dia2"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
                    : "flex flex-col gap-3"
                }
              >
                {schedule[selectedDay].map((item) => (
                  <li
                    key={item.time}
                    className="flex items-center gap-4 rounded-2xl bg-white/5 px-4 py-3"
                  >
                    <span className="text-sm font-semibold text-white/70 w-14 shrink-0">
                      {item.time}
                    </span>
                    <span className="text-white">{item.activity}</span>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
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
          <div className="flex gap-8">
            <LocationMap />

            <div>
              <h3>Instituto Tecnológico de Saltillo</h3>
              <p>Blvd. Venustiano Carranza...</p>
            </div>
          </div>
        </LiquidGlassCard>
      </section>

      <section
        id="requisitos"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-6
          "
          >
        <LiquidGlassCard className="p-8">
          <h2 className="text-4x1 font-bold">
            Requisitos
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