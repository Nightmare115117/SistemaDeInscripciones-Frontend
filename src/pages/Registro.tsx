import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

const MIN_INTEGRANTES = 3;
const MAX_INTEGRANTES = 5;

interface ContactoEmergencia {
  nombre: string;
  telefono: string;
  parentesco: string;
}

interface Integrante {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  alergias: string;
  emergencia: ContactoEmergencia;
}

interface Problematica {
  id: string;
  nombre: string;
}

// Estas opciones posteriormente vendrán de tu API.
const problematicas: Problematica[] = [
  { id: "1", nombre: "Problemática 1" },
  { id: "2", nombre: "Problemática 2" },
  { id: "3", nombre: "Problemática 3" },
];

type Status = "idle" | "enviando" | "exito" | "error";

const inputClass =
  "w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-300/60 focus:bg-white/10";

const labelClass =
  "text-xs font-medium text-white/60 uppercase tracking-wide";

function crearIntegranteVacio(): Integrante {
  return {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    nombre: "",
    correo: "",
    telefono: "",
    alergias: "",
    emergencia: {
      nombre: "",
      telefono: "",
      parentesco: "",
    },
  };
}

export function RegistroForm() {
  const [equipo, setEquipo] = useState("");
  const [problematica, setProblematica] = useState("");
  const [correoContacto, setCorreoContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");

  const [integrantes, setIntegrantes] = useState<Integrante[]>([
    crearIntegranteVacio(),
    crearIntegranteVacio(),
    crearIntegranteVacio(),
  ]);

  const [aceptaReglas, setAceptaReglas] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const actualizarIntegrante = (
    id: string,
    campo: keyof Omit<Integrante, "id" | "emergencia">,
    valor: string
  ) => {
    setIntegrantes((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, [campo]: valor } : it
      )
    );
  };

  const actualizarEmergencia = (
    id: string,
    campo: keyof ContactoEmergencia,
    valor: string
  ) => {
    setIntegrantes((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              emergencia: {
                ...it.emergencia,
                [campo]: valor,
              },
            }
          : it
      )
    );
  };

  const agregarIntegrante = () => {
    if (integrantes.length >= MAX_INTEGRANTES) return;

    setIntegrantes((prev) => [...prev, crearIntegranteVacio()]);
  };

  const quitarIntegrante = (id: string) => {
    if (integrantes.length <= MIN_INTEGRANTES) return;

    setIntegrantes((prev) =>
      prev.filter((it) => it.id !== id)
    );
  };

  const validar = (): string | null => {
    if (!equipo.trim()) {
      return "Ponle un nombre a tu equipo.";
    }

    if (!problematica) {
      return "Selecciona una problemática.";
    }

    if (!correoContacto.trim()) {
      return "Ingresa un correo de contacto.";
    }

    if (!telefonoContacto.trim()) {
      return "Ingresa un teléfono de contacto.";
    }

    if (integrantes.length < MIN_INTEGRANTES) {
      return `El equipo necesita al menos ${MIN_INTEGRANTES} integrantes.`;
    }

    for (const integrante of integrantes) {
      if (!integrante.nombre.trim()) {
        return "Todos los integrantes necesitan un nombre.";
      }

      if (!integrante.correo.trim()) {
        return "Todos los integrantes necesitan un correo.";
      }

      if (!integrante.telefono.trim()) {
        return "Todos los integrantes necesitan un teléfono.";
      }

      if (!integrante.emergencia.nombre.trim()) {
        return "Todos los integrantes necesitan un contacto de emergencia.";
      }

      if (!integrante.emergencia.telefono.trim()) {
        return "Todos los contactos de emergencia necesitan un teléfono.";
      }

      if (!integrante.emergencia.parentesco.trim()) {
        return "Indica el parentesco de cada contacto de emergencia.";
      }
    }

    if (!aceptaReglas) {
      return "Debes aceptar las reglas para poder registrar el equipo.";
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

    /*
      Aquí conectarás tu endpoint.

      El objeto que tendrás disponible será:

      {
        equipo,
        problematica,
        contacto: {
          correo: correoContacto,
          telefono: telefonoContacto
        },
        integrantes,
        aceptaReglas
      }
    */

    setStatus("enviando");
    setErrorMsg("");

    // Simulación temporal
    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus("exito");
  };

  if (status === "exito") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
        <div className="text-4xl">🎉</div>

        <h2 className="text-xl font-semibold text-white">
          ¡Registro recibido!
        </h2>

        <p className="max-w-md text-sm text-white/60">
          Te contactaremos al correo{" "}
          <span className="text-white">
            {correoContacto}
          </span>{" "}
          con los siguientes pasos.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      {/* INFORMACIÓN DEL EQUIPO */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <label className={labelClass} htmlFor="problematica">
            Problemática
          </label>

          <select
            id="problematica"
            value={problematica}
            onChange={(e) => setProblematica(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="" className="bg-zinc-900">
              Selecciona una problemática
            </option>

            {problematicas.map((item) => (
              <option
                key={item.id}
                value={item.id}
                className="bg-zinc-900"
              >
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="telefono-contacto">
            Teléfono de contacto
          </label>

          <input
            id="telefono-contacto"
            className={inputClass}
            value={telefonoContacto}
            onChange={(e) =>
              setTelefonoContacto(e.target.value)
            }
            placeholder="844 123 4567"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="correo-contacto">
            Correo de contacto
          </label>

          <input
            id="correo-contacto"
            type="email"
            className={inputClass}
            value={correoContacto}
            onChange={(e) =>
              setCorreoContacto(e.target.value)
            }
            placeholder="equipo@correo.com"
          />
        </div>
      </div>

      {/* INTEGRANTES */}

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={labelClass}>
            Integrantes ({integrantes.length}/{MAX_INTEGRANTES})
          </span>

          <span className="text-[11px] text-white/40">
            Mínimo {MIN_INTEGRANTES}, máximo {MAX_INTEGRANTES}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {integrantes.map((it, i) => (
              <motion.div
                key={it.id}
                layout
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: 24,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                {/* DATOS DEL ALUMNO */}

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300/70">
                    Integrante {i + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => quitarIntegrante(it.id)}
                    disabled={integrantes.length <= MIN_INTEGRANTES}
                    className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    Quitar
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>
                      Nombre
                    </label>

                    <input
                      className={inputClass}
                      value={it.nombre}
                      onChange={(e) =>
                        actualizarIntegrante(
                          it.id,
                          "nombre",
                          e.target.value
                        )
                      }
                      placeholder={`Nombre del integrante ${i + 1}`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>
                      Correo
                    </label>

                    <input
                      type="email"
                      className={inputClass}
                      value={it.correo}
                      onChange={(e) =>
                        actualizarIntegrante(
                          it.id,
                          "correo",
                          e.target.value
                        )
                      }
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className={labelClass}>
                      Teléfono
                    </label>

                    <input
                      className={inputClass}
                      value={it.telefono}
                      onChange={(e) =>
                        actualizarIntegrante(
                          it.id,
                          "telefono",
                          e.target.value
                        )
                      }
                      placeholder="844 123 4567"
                    />
                  </div>
                </div>

                {/* CONTACTO DE EMERGENCIA */}

                <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                  <div>
                    <span className={labelClass}>
                      Contacto de emergencia
                    </span>

                    <p className="mt-1 text-[11px] text-white/40">
                      Persona a contactar en caso de emergencia.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        Nombre
                      </label>

                      <input
                        className={inputClass}
                        value={it.emergencia.nombre}
                        onChange={(e) =>
                          actualizarEmergencia(
                            it.id,
                            "nombre",
                            e.target.value
                          )
                        }
                        placeholder="María Pérez"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        Teléfono
                      </label>

                      <input
                        className={inputClass}
                        value={it.emergencia.telefono}
                        onChange={(e) =>
                          actualizarEmergencia(
                            it.id,
                            "telefono",
                            e.target.value
                          )
                        }
                        placeholder="844 123 4567"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className={labelClass}>
                        Parentesco
                      </label>

                      <input
                        className={inputClass}
                        value={it.emergencia.parentesco}
                        onChange={(e) =>
                          actualizarEmergencia(
                            it.id,
                            "parentesco",
                            e.target.value
                          )
                        }
                        placeholder="Madre"
                      />
                    </div>
                  </div>
                </div>

                {/* ALERGIAS */}

                <div className="flex flex-col gap-1.5 border-t border-white/10 pt-4">
                  <label className={labelClass}>
                    Alergias
                    <span className="ml-2 normal-case tracking-normal text-white/30">
                      (opcional)
                    </span>
                  </label>

                  <input
                    className={inputClass}
                    value={it.alergias}
                    onChange={(e) =>
                      actualizarIntegrante(
                        it.id,
                        "alergias",
                        e.target.value
                      )
                    }
                    placeholder="Escribe las alergias o deja vacío si no tiene"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={agregarIntegrante}
          disabled={integrantes.length >= MAX_INTEGRANTES}
          className="self-start rounded-full border border-dashed border-white/20 px-4 py-2 text-xs font-medium text-white/60 transition-colors hover:border-cyan-300/50 hover:text-cyan-300 disabled:opacity-30"
        >
          + Agregar integrante
        </button>
      </div>

      {/* ACEPTACIÓN DE REGLAS */}

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
        <input
          type="checkbox"
          checked={aceptaReglas}
          onChange={(e) =>
            setAceptaReglas(e.target.checked)
          }
          className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-300"
        />

        <span className="text-sm text-white/60">
          He leído y acepto las{" "}
          <button
            type="button"
            className="text-cyan-300 transition-colors hover:text-cyan-200 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              // Aquí puedes abrir tu modal/página de reglas.
            }}
          >
            reglas
          </button>
          .
        </span>
      </label>

      {/* ERROR */}

      {status === "error" && errorMsg && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-300"
        >
          {errorMsg}
        </motion.p>
      )}

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={status === "enviando"}
        className="rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "enviando"
          ? "Enviando..."
          : "Registrar equipo"}
      </button>
    </form>
  );
}

export default RegistroForm;
