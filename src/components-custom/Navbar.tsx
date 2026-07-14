import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { LiquidGlassCard } from "@/components-custom/GlassCard";

export function Navbar() {
  const navLink =
    "relative z-10 rounded-full px-4 py-2 flex items-center justify-center text-white/80 transition-colors duration-300 hover:text-white";

  const [active, setActive] = useState("inicio");
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const links = [
    { id: "inicio", label: "Inicio" },
    { id: "itinerario", label: "Itinerario" },
    { id: "ubicacion", label: "Ubicación" },
    { id: "faq", label: "FAQ" },
  ];

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // De todas las secciones que están al menos parcialmente visibles,
        // elegimos la que tiene mayor porcentaje visible en el viewport.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      {
        // El margen negativo arriba/abajo hace que solo cuente la franja central
        // de la pantalla como "activa", evitando que la píldora cambie apenas
        // se asoma un pixel de la siguiente sección por abajo.
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = linkRefs.current[active];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, [active]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6"
    >
      <LiquidGlassCard variant="nav" className="px-6 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/blanco_sin_fondo.png"
              className="h-10 w-10 scale-150 object-contain"
              alt="Logo"
            />
            <h1 className="text-xl font-bold text-white">Hackathon</h1>
          </div>

          <div
            ref={containerRef}
            className="relative flex items-center gap-1 rounded-full bg-white/5 p-1"
          >
            <motion.div
              className="absolute top-1 bottom-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl shadow-lg shadow-white/10"
              animate={{ left: pillStyle.left, width: pillStyle.width }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            {links.map((link) => (
              <a
                key={link.id}
                ref={(el) => {
                  linkRefs.current[link.id] = el;
                }}
                href={`#${link.id}`}
                onClick={() => setActive(link.id)}
                className={navLink}
              >
                <span
                  className={`transition-colors ${
                    active === link.id ? "text-white" : "text-white/80"
                  }`}
                >
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </nav>
      </LiquidGlassCard>
    </motion.header>
  );
}