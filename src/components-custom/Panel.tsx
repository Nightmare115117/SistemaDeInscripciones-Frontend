import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LiquidGlassCard } from "./GlassCard";

interface AcordeonItem {
  titulo: string;
  contenido: ReactNode;
}

interface AcordeonProps {
  items: AcordeonItem[];
  permitirVariosAbiertos?: boolean;
}

function Acordeon({ items, permitirVariosAbiertos = false }: AcordeonProps) {
  const [abiertos, setAbiertos] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setAbiertos((prev) => {
      const nuevo = new Set(permitirVariosAbiertos ? prev : []);
      if (prev.has(i)) {
        nuevo.delete(i);
      } else {
        nuevo.add(i);
      }
      return nuevo;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => {
        const abierto = abiertos.has(i);
        return (
          <div key={i}>
            {/* Card del título */}
            <LiquidGlassCard
              style={{
                borderRadius: abierto ? "8px 8px 0 0" : "8px",
                marginBottom: abierto ? 2 : 0,
              }}
            >
              <button
                onClick={() => toggle(i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: 13,
                  textAlign: "left",
                }}
              >
                {item.titulo}
                <span
                  style={{
                    transition: "transform 0.5s ease",
                    transform: abierto ? "rotate(180deg)" : "rotate(0deg)",
                    fontSize: 10,
                  }}
                >
                  ▼
                </span>
              </button>
            </LiquidGlassCard>

            {/* Card del contenido, con animación de entrada Y salida */}
            <AnimatePresence>
              {abierto && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <LiquidGlassCard style={{ borderRadius: "0 0 8px 8px" }}>
                    <div style={{ fontSize: 13 }}>{item.contenido}</div>
                  </LiquidGlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default Acordeon;