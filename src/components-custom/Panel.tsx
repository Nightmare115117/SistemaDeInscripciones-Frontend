import { useState, useEffect, useCallback, memo, type ReactNode } from "react";
import { LiquidGlassCard } from "./GlassCard";

interface AcordeonItem {
  titulo: string;
  contenido: ReactNode;
}

interface AcordeonProps {
  items: AcordeonItem[];
  permitirVariosAbiertos?: boolean;
}

interface ItemProps {
  item: AcordeonItem;
  index: number;
  abierto: boolean;
  onToggle: (i: number) => void;
}

// Se evalúa una sola vez al cargar el módulo, no en cada render
const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DURATION_MS = REDUCED_MOTION ? 0 : 120;

// Constantes de estilo — se crean UNA vez al cargar el módulo.
// Todo lo animado usa solo opacity + transform: son las únicas propiedades
// que el navegador puede animar en el compositor (GPU), sin recalcular
// layout ni repintar. Nada de height / grid-template-rows, que son caras
// sobre todo si la card tiene backdrop-filter (blur).
const CONTAINER_STYLE = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
} as const;

const ITEM_STYLE = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
} as const;

const BUTTON_STYLE = {
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
  padding: 0,
  margin: 0,
} as const;

const CHEVRON_STYLE = {
  display: "inline-block",
  flexShrink: 0,
  transition: `transform ${DURATION_MS}ms ease-out`,
} as const;

const TITLE_CARD_STYLE = {
  borderRadius: "9999px",
  transition: `box-shadow ${DURATION_MS}ms ease-out`,
} as const;

const CONTENT_CARD_STYLE = { borderRadius: "9999px" } as const;

const OPEN_SHADOW = "0 8px 16px rgba(0,0,0,0.1)";
const CLOSED_SHADOW = "0 2px 4px rgba(0,0,0,0.05)";

// Mantiene el contenido montado mientras dura la animación de salida,
// para que el fade-out se vea antes de desmontarlo del DOM.
function useDelayedUnmount(abierto: boolean, duration: number) {
  const [montado, setMontado] = useState(abierto);

  useEffect(() => {
    if (abierto) {
      setMontado(true);
      return;
    }
    if (duration === 0) {
      setMontado(false);
      return;
    }
    const id = setTimeout(() => setMontado(false), duration);
    return () => clearTimeout(id);
  }, [abierto, duration]);

  return montado;
}

const AcordeonItem = memo(({ item, index, abierto, onToggle }: ItemProps) => {
  const handleClick = useCallback(() => onToggle(index), [index, onToggle]);
  const montado = useDelayedUnmount(abierto, DURATION_MS);

  return (
    <div style={ITEM_STYLE}>
      <LiquidGlassCard
        style={{
          ...TITLE_CARD_STYLE,
          boxShadow: abierto ? OPEN_SHADOW : CLOSED_SHADOW,
        }}
      >
        <button
          type="button"
          onClick={handleClick}
          style={BUTTON_STYLE}
          aria-expanded={abierto}
          aria-controls={`acordeon-content-${index}`}
        >
          {item.titulo}
          <span
            style={{
              ...CHEVRON_STYLE,
              transform: abierto ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            ▼
          </span>
        </button>
      </LiquidGlassCard>

      {montado && (
        <div
          style={{
            opacity: abierto ? 1 : 0,
            transform: abierto
              ? "translateY(0) scaleY(1)"
              : "translateY(-4px) scaleY(0.97)",
            transformOrigin: "top",
            transition: `opacity ${DURATION_MS}ms ease-out, transform ${DURATION_MS}ms ease-out`,
          }}
        >
          <LiquidGlassCard style={CONTENT_CARD_STYLE}>
            <div id={`acordeon-content-${index}`} style={{ fontSize: 13 }}>
              {item.contenido}
            </div>
          </LiquidGlassCard>
        </div>
      )}
    </div>
  );
}, (prev, next) =>
  prev.abierto === next.abierto && prev.item.titulo === next.item.titulo
);

AcordeonItem.displayName = "AcordeonItem";

function Acordeon({ items, permitirVariosAbiertos = false }: AcordeonProps) {
  const [abiertos, setAbiertos] = useState<Set<number>>(new Set());

  const toggle = useCallback((i: number) => {
    setAbiertos((prev) => {
      if (!permitirVariosAbiertos) {
        return prev.has(i) ? new Set() : new Set([i]);
      }
      const nuevo = new Set(prev);
      if (nuevo.has(i)) {
        nuevo.delete(i);
      } else {
        nuevo.add(i);
      }
      return nuevo;
    });
  }, [permitirVariosAbiertos]);

  return (
    <div style={CONTAINER_STYLE}>
      {items.map((item, i) => (
        <AcordeonItem
          key={`${i}-${item.titulo}`}
          item={item}
          index={i}
          abierto={abiertos.has(i)}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}

export default Acordeon;