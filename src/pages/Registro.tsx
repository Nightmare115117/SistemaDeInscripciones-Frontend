import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

// TODO: confirmar con el backend (Crow/PostgreSQL) el endpoint real y el
// shape exacto del body que espera. Se asume, por analogía con
// GET /api/registro/count que ya usa App.tsx, que existe un
// POST /api/registro. Ajusta API_URL y el payload de handleSubmit si el
// backend espera otros nombres de campo.
const API_URL = "https://mi-api-latest-4szb.onrender.com/api/registro";

const MIN_INTEGRANTES = 3;
const MAX_INTEGRANTES = 5;

interface Integrante {
  id: string;
  nombre: string;
  correo: string;
}

type Status = "idle" | "enviando" | "exito" | "error";

const inputClass =
  "w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-300/60 focus:bg-white/10";

const labelClass =
  "text-xs font-medium text-white/60 uppercase tracking-wide";

// Cada integrante necesita un id propio (no basta el índice del arreglo):
// al quitar uno de en medio, todos los índices posteriores se recorren,
// y AnimatePresence usa la key para saber qué elemento entra/sale. Con
// índice como key, la animación de salida se le "pega" a la fila
// equivocada cuando el array se reacomoda.
function crearIntegranteVacio(): Integrante {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    nombre: "",
    correo: "",
  };
}

export function RegistroForm() {
  const [equipo, setEquipo] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [integrantes, setIntegrantes] = useState<Integrante[]>([
    crearIntegranteVacio(),
    crearIntegranteVacio(),
    crearIntegranteVacio(),
  ]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const actualizarIntegrante = (
    id: string,
    campo: keyof Omit<Integrante, "id">,
    valor: string
  ) => {
    setIntegrantes((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [campo]: valor } : it))
    );
  };

  const agregarIntegrante = () => {
    if (integrantes.length >= MAX_INTEGRANTES) return;
    setIntegrantes((prev) => [...prev, crearIntegranteVacio()]);
  };

  const quitarIntegrante = (id: string) => {
    if (integrantes.length <= MIN_INTEGRANTES) return;
    setIntegrantes((prev) => prev.filter((it) => it.id !== id));
  };

  const validar = (): string | null => {
    if (!equipo.trim()) return "Ponle un nombre a tu equipo.";
    if (!/^\S+@\S+\.\S+$/.test(correoContacto))
      return "El correo de contacto no es válido.";
    if (integrantes.length < MIN_INTEGRANTES)
      return `El equipo necesita al menos ${MIN_INTEGRANTES} integrantes.`;
    for (const it of integrantes) {
      if (!it.nombre.trim() || !/^\S+@\S+\.\S+$/.test(it.correo)) {
        return "Revisa que todos los integrantes tengan nombre y correo válido.";
      }
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const error = validar();
    if (error) {
      setStatus("error");
      setErrorMsg(error);
      return;
    }

    setStatus("enviando");
    setErrorMsg("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipo,
          contacto: { correo: correoContacto, telefono },
          // el id es solo para manejo local (animaciones/keys); no forma
          // parte del contrato con el backend
          integrantes: integrantes.map(({ nombre, correo }) => ({
            nombre,
            correo,
          })),
        }),
      });

      if (!res.ok) throw new Error(`Respuesta ${res.status}`);

      setStatus("exito");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(
        "No se pudo enviar el registro. Intenta de nuevo en unos minutos."
      );
    }
  };

  if (status === "exito") {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <span className="text-3xl">🎉</span>
        <h3 className="text-lg font-semibold text-white">
          ¡Registro recibido!
        </h3>
        <p className="text-sm text-white/60">
          Te contactaremos al correo {correoContacto} con los siguientes pasos.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="equipo">
            Nombre del equipo
          </label>
          <input
            id="equipo"
            className={inputClass}
            value={equipo}
            onChange={(e) => setEquipo(e.target.value)}
            placeholder="Los Debuggers"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="telefono">
            Teléfono de contacto
          </label>
          <input
            id="telefono"
            className={inputClass}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="844 123 4567"
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className={labelClass} htmlFor="correo-contacto">
            Correo de contacto
          </label>
          <input
            id="correo-contacto"
            type="email"
            className={inputClass}
            value={correoContacto}
            onChange={(e) => setCorreoContacto(e.target.value)}
            placeholder="equipo@correo.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={labelClass}>
            Integrantes ({integrantes.length}/{MAX_INTEGRANTES})
          </span>
          <span className="text-[11px] text-white/40">
            Mínimo {MIN_INTEGRANTES}, máximo {MAX_INTEGRANTES}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {integrantes.map((it, i) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white/5 border border-white/10 p-3"
              >
                <input
                  className={inputClass}
                  value={it.nombre}
                  onChange={(e) =>
                    actualizarIntegrante(it.id, "nombre", e.target.value)
                  }
                  placeholder={`Nombre integrante ${i + 1}`}
                />
                <input
                  type="email"
                  className={inputClass}
                  value={it.correo}
                  onChange={(e) =>
                    actualizarIntegrante(it.id, "correo", e.target.value)
                  }
                  placeholder="correo@ejemplo.com"
                />
                <button
                  type="button"
                  onClick={() => quitarIntegrante(it.id)}
                  disabled={integrantes.length <= MIN_INTEGRANTES}
                  className="shrink-0 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  Quitar
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={agregarIntegrante}
          disabled={integrantes.length >= MAX_INTEGRANTES}
          className="self-start rounded-full border border-dashed border-white/20 px-4 py-2 text-xs font-medium text-white/60 transition-colors hover:border-cyan-300/50 hover:text-cyan-300 disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white/60"
        >
          + Agregar integrante
        </button>
      </div>

      {status === "error" && errorMsg && (
        <p className="text-sm text-red-300">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "enviando"}
        className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "enviando" ? "Enviando..." : "Registrar equipo"}
      </button>
    </form>
  );
}

export default RegistroForm;