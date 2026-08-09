import { LiquidGlassCard } from "@/components-custom/GlassCard";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Countdown } from "../components-custom/Countdown";
import { memo, useEffect, useState } from "react";
import { LocationMap } from "../components-custom/InteractiveMap";
import { Navbar } from "../components-custom/Navbar";
import "@/css-custom/App.css"
import { SegmentedControl } from "../components-custom/SegmentOption";
import Acordeon from "../components-custom/Panel";
import { Routes, Route } from "react-router-dom";
import { RegistroForm } from "./Registro";

// Acento de marca: cian eléctrico, usado con moderación en eyebrows,
// bordes activos y detalles — coherente con el tema "tech" del evento.
const ACCENT = "text-cyan-300";

// Secciones reales de la página, en orden — usadas por el riel lateral
// para saber qué punto resaltar y a dónde saltar.
const SECTIONS = [
  { id: "inicio", label: "Inicio" },
  { id: "que-es", label: "Qué es" },
  { id: "por-que-participar", label: "Por qué" },
  { id: "retos", label: "Retos" },
  { id: "itinerario", label: "Itinerario" },
  { id: "ubicacion", label: "Ubicación" },
  { id: "requisitos", label: "Requisitos" },
  { id: "faq", label: "FAQ" },
  { id: "Patrocinadores", label: "Sponsors" },
];

// Preguntas frecuentes: constante fuera del componente para que no se
// vuelva a crear (ni el arreglo ni cada objeto) en cada render de App.
// Antes vivía como un literal inline dentro del JSX del FAQ, así que
// cualquier render de App (por ejemplo por el scroll) le pasaba una
// referencia nueva al Acordeon en cada ocasión.
const FAQ_ITEMS = [
  { titulo: "¿Qué es el Hackathon?", contenido: "Un hackatón es un evento de innovación donde equipos de personas con distintas habilidades crean soluciones y prototipos para resolver retos específicos en un tiempo limitado, demostrando creatividad, colaboración y capacidad técnica." },
  { titulo: "¿Cómo me registro?", contenido: "Dando click en el boton de registro, y llena el formulario que aparece" },
  { titulo: "¿Necesito saber programar para participar?", contenido: "No necesariamente. Los equipos pueden incluir personas con habilidades de diseño, administración, investigación, comunicación, negocios u otras áreas." },
  { titulo: "¿Puedo participar de manera individual?", contenido: "No, necesitas un equipo" },
  { titulo: "¿Cuántas personas pueden formar un equipo?", contenido: "Minimo de 3 integrantes, maximo de 5" },
  { titulo: "¿Cuánto tiempo dura el hackatón?", contenido: "" },
  { titulo: "¿Puedo quedarme a dormir durante el evento?", contenido: "" },
  { titulo: "¿Habrá alimentos?", contenido: "Sí. Durante el Hackathon se ofrecerán alimentos en los horarios establecidos por el comité organizador." },
  { titulo: "¿Se entregará constancia?", contenido: "Sí. Todos los participantes que cumplan con las actividades del evento recibirán una constancia de participación." },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={`font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] ${ACCENT}`}
    >
      {children}
    </span>
  );
}


function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Manchas de luz ambiental detrás de las cards: dan profundidad y hacen
// que el efecto "liquid glass" tenga algo de color que refractar.
function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[5%] left-[10%] h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute top-[55%] right-[8%] h-[380px] w-[380px] rounded-full bg-violet-500/15 blur-[120px]" />
      <div className="absolute top-[110%] left-[20%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[130px]" />
      <div className="absolute top-[170%] right-[15%] h-[380px] w-[380px] rounded-full bg-violet-400/15 blur-[130px]" />
      <div className="absolute top-[230%] left-[15%] h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[130px]" />
    </div>
  );
}

// Textura tipo "blueprint" solo detrás del hero — una cuadrícula muy tenue
// que refuerza el carácter técnico del evento sin competir con el contenido.
function BlueprintGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(circle at 50% 40%, black, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(circle at 50% 40%, black, transparent 70%)",
      }}
    />
  );
}

// Barra fina que muestra el avance del scroll dentro de la página.
// useScroll/useSpring animan por fuera de React (motion values), así que
// esto nunca provoca un re-render de App.
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-cyan-300 to-violet-400"
    />
  );
}

// Riel de navegación lateral (solo desktop): un punto por sección, con una
// línea que se va llenando según el scroll.
//
// El tracking de "sección activa" vive AQUÍ, aislado, en vez de en App.
// Antes ese estado (con su IntersectionObserver) estaba en App, así que
// cada vez que cambiabas de sección React volvía a renderizar TODO el
// árbol de App — incluyendo el Acordeon del FAQ — aunque nada de eso
// dependiera de qué sección estuvieras viendo. Moviendo el estado a este
// componente, solo el riel se re-renderiza al hacer scroll; el resto de
// la página (FAQ incluido) queda intacto.
function SectionRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:flex">
      <div className="relative flex flex-col items-center gap-6 py-2">
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/10" />
        <motion.div
          style={{ scaleY }}
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-cyan-300 to-violet-400"
        />
        {SECTIONS.map((s) => {
          const isActive = s.id === active;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group relative z-10 flex h-3 w-3 items-center justify-center"
              aria-label={s.label}
            >
              <span
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "scale-125 bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]"
                    : "bg-white/30 group-hover:bg-white/60"
                }`}
              />
              <span className="pointer-events-none absolute right-5 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {s.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// Sección de FAQ aislada en su propio componente memoizado. No recibe
// props que cambien, así que memo() la deja fuera del ciclo de render de
// App por completo: ni el conteo de registros, ni el día seleccionado del
// itinerario, ni el scroll vuelven a montar/recalcular el Acordeon.
const FaqSection = memo(function FaqSection() {
  return (
    <section
      id="faq"
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4 sm:px-6
      "
    >
      <Reveal className="w-full max-w-2xl">
        <LiquidGlassCard className="p-6 sm:p-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <Eyebrow>¿Dudas?</Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Preguntas frecuentes
              </h2>
            </div>

            <Acordeon items={FAQ_ITEMS} permitirVariosAbiertos={false} />
          </div>
        </LiquidGlassCard>
      </Reveal>
    </section>
  );
});

function HomePage() {
  const [selectedDay, setSelectedDay] = useState("dia1");
  const [total, setTotal] = useState(0);

  //https://mi-api-latest-4szb.onrender.com/

  useEffect(() => {
    fetch('https://mi-api-latest-4szb.onrender.com/api/registro/count', {})
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
      <ScrollProgress />
      <AmbientGlow />
      <SectionRail />

        <Navbar />

      <section
        id="inicio"
        className="
          relative
          min-h-screen
          flex
          items-center
          justify-center
          px-4 sm:px-6
          pt-24 md:pt-32
        "
      >
        <BlueprintGrid />
        <LiquidGlassCard className="p-6 sm:p-10 flex flex-col items-center gap-4 sm:gap-5 text-center max-w-xl">
          <motion.img
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src="ROAD.svg"
            className="w-28 sm:w-32 h-auto mx-auto invert"
          />
          <Eyebrow>Hackathon TecNM 2026 · Primera edición</Eyebrow>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            Bienvenido
          </h1>
          <h4 className="w-full max-w-sm mx-auto text-center text-sm text-white/70 sm:text-base">
            24 horas de innovación, tecnología y trabajo en equipo.
          </h4>

          <div className="mt-2 flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              Cuenta regresiva
            </span>
            <Countdown targetDate={new Date("2026-10-12T12:30:00")} />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 font-mono text-xs sm:text-sm">
            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-white/70">
              9–10 oct 2026
            </span>
            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-white/70">
              Equipos de 3 a 5
            </span>
            <span className={`rounded-full bg-white/5 border border-white/10 px-3 py-1.5 font-medium ${ACCENT}`}>
              {47 - total} lugares disponibles
            </span>
          </div>
        </LiquidGlassCard>
      </section>

      <section
        id="que-es"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4 sm:px-6
        "
      >
        <Reveal className="w-full max-w-3xl">
          <LiquidGlassCard className="p-6 sm:p-10 flex flex-col gap-4">
            <Eyebrow>Sobre el evento</Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              ¿Qué es el Hackathon?
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-white/70">
              El Hackathon Road To Tech 2026 es una competencia tecnológica de
              24 horas en la que equipos de estudiantes colaboran para
              diseñar, desarrollar y presentar una solución innovadora a
              partir de un reto propuesto por empresas e instituciones
              invitadas.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-white/70">
              Durante el evento, los participantes contarán con mentorías,
              espacios de colaboración y la oportunidad de fortalecer
              habilidades técnicas y profesionales mientras trabajan bajo un
              ambiente de innovación.
            </p>
            <p className="text-sm sm:text-base leading-relaxed font-medium text-white border-l-2 border-cyan-300/60 pl-4">
              No se trata únicamente de programar, sino de crear soluciones
              con impacto.
            </p>
          </LiquidGlassCard>
        </Reveal>
      </section>

      <section
        id="por-que-participar"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4 sm:px-6
        "
      >
        <Reveal className="w-full max-w-3xl">
          <LiquidGlassCard className="p-6 sm:p-10 flex flex-col gap-6">
            <div className="flex flex-col items-center text-center gap-2">
              <Eyebrow>Beneficios</Eyebrow>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                ¿Por qué participar?
              </h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { emoji: "💻", texto: "Aplicar tus conocimientos en un proyecto real." },
                { emoji: "🤝", texto: "Trabajar con estudiantes apasionados por la tecnología." },
                { emoji: "🧠", texto: "Desarrollar habilidades de innovación, liderazgo y trabajo en equipo." },
                { emoji: "🎤", texto: "Presentar tu proyecto ante un jurado especializado." },
                { emoji: "🌐", texto: "Ampliar tu red de contactos con empresas y profesionales." },
                { emoji: "📜", texto: "Obtener constancia de participación." },
              ].map((b) => (
                <li
                  key={b.texto}
                  className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 px-4 py-3.5 text-sm sm:text-base text-white/85 transition-colors hover:bg-white/10 hover:border-white/20"
                >
                  <span className="text-xl leading-none">{b.emoji}</span>
                  <span>{b.texto}</span>
                </li>
              ))}
            </ul>
          </LiquidGlassCard>
        </Reveal>
      </section>

      <section
        id="retos"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4 sm:px-6
        "
      >
        <Reveal className="w-full max-w-3xl">
          <LiquidGlassCard className="p-6 sm:p-10 flex flex-col gap-3 text-center items-center">
            <Eyebrow>El desafío</Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Retos
            </h2>
            <p className="text-sm sm:text-base text-white/50">
              Contenido próximamente.
            </p>
            {/* TODO: contenido pendiente */}
          </LiquidGlassCard>
        </Reveal>
      </section>


      <section
        id="itinerario"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4 sm:px-6
        "
      >
        <Reveal className="w-full max-w-lg">
          <LiquidGlassCard className="p-6 sm:p-10 w-full flex flex-col items-center" interactive>
            <Eyebrow>Agenda</Eyebrow>
            <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Itinerario
            </h2>

            <SegmentedControl
              options={[
                { id: "dia1", label: "Día 1" },
                { id: "dia2", label: "Día 2" },
              ]}
              value={selectedDay}
              onChange={setSelectedDay}
              className="mt-6 sm:mt-8"
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
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
                      : "flex flex-col gap-2 sm:gap-3"
                  }
                >
                  {schedule[selectedDay].map((item) => (
                    <li
                      key={item.time}
                      className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2.5 sm:py-3 transition-colors hover:bg-white/10"
                    >
                      <span className={`font-mono text-xs sm:text-sm font-semibold w-12 sm:w-14 shrink-0 ${ACCENT}`}>
                        {item.time}
                      </span>
                      <span className="text-sm sm:text-base text-white">{item.activity}</span>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </LiquidGlassCard>
        </Reveal>
      </section>


      <section
        id="ubicacion"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4 sm:px-6
        "
      >
        <Reveal className="w-full max-w-5xl">
          <LiquidGlassCard className="p-6 sm:p-10 w-full">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-1 min-w-0 min-h-[560px] rounded-2xl overflow-hidden">
                <LocationMap />
              </div>

              <div className="md:w-[360px] flex flex-col items-center justify-center text-center gap-2">
                <Eyebrow>Sede</Eyebrow>
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  Instituto Tecnológico de Saltillo
                </h3>
                <p className="text-sm sm:text-base text-white">
                  Gimnasio "Alejandro S. Guillot"
                </p>
                <p className="text-sm sm:text-base text-white/70">
                  Blvd. Venustiano Carranza...
                </p>
              </div>
            </div>
          </LiquidGlassCard>
        </Reveal>
      </section>

      <section
        id="requisitos"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4 sm:px-6
          "
          >
        <Reveal className="w-full max-w-3xl">
          <LiquidGlassCard className="p-6 sm:p-10 flex flex-col gap-3 text-center items-center">
            <Eyebrow>Antes de inscribirte</Eyebrow>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Requisitos
            </h2>
            <p className="text-sm sm:text-base text-white/50">
              Contenido próximamente.
            </p>
          </LiquidGlassCard>
        </Reveal>
      </section>

      <FaqSection />

      <section
        id="Patrocinadores"
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4 sm:px-6
        "
      >
        <Reveal className="w-full max-w-5xl">
          <div
            className="
              w-full
              min-h-[70vh]
              rounded-3xl
              bg-gray-200/20
              backdrop-blur-xl
              border border-white/20
              shadow-2xl
              p-8 sm:p-12
              flex
              flex-col
              items-center
              justify-center
              gap-10
            "
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <Eyebrow>Con el apoyo de</Eyebrow>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Nuestros Patrocinadores
              </h2>
            </div>

            <div
              className="
                w-full
                grid
                grid-cols-2
                sm:grid-cols-3
                gap-10
                items-center
                justify-items-center
              "
            >

              <div className="flex justify-center">
                <img
                  src="./patrocinadores/Edit2.svg"
                  alt="Instituto Municipal de la Juventud"
                  className="
                    w-40
                    sm:w-48
                    h-auto
                    object-contain
                    brightness-0
                    invert
                    opacity-80
                    hover:opacity-100
                    hover:scale-105
                    transition
                    duration-300
                  "
                />
              </div>


              <div className="flex justify-center">
                <img
                  src="./patrocinadores/logo2.png"
                  alt="Patrocinador"
                  className="
                    w-40
                    sm:w-48
                    h-auto
                    object-contain
                    brightness-0
                    invert
                    opacity-80
                    hover:opacity-100
                    hover:scale-105
                    transition
                    duration-300
                  "
                />
              </div>


              <div className="flex justify-center">
                <img
                  src="./patrocinadores/logo3.png"
                  alt="Patrocinador"
                  className="
                    w-40
                    sm:w-48
                    h-auto
                    object-contain
                    brightness-0
                    invert
                    opacity-80
                    hover:opacity-100
                    hover:scale-105
                    transition
                    duration-300
                  "
                />
              </div>

            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/registro" element={<RegistroForm />} />
    </Routes>
  );
}

export default App;