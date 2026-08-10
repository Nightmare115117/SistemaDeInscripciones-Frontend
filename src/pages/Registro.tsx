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

type Status = "idle" | "enviando" | "exito" | "error";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-300/60 focus:bg-white/10";

const labelClass =
  "text-xs font-medium uppercase tracking-wide text-white/60";

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
  const [correoContacto, setCorreoContacto] = useState("");
  const [telefonoContacto, setTelefonoContacto] = useState("");
  const [problematica, setProblematica] = useState("");

  const [aceptaReglas, setAceptaReglas] = useState(false);

  const [integrantes, setIntegrantes] = useState<Integrante[]>([
    crearIntegranteVacio(),
    crearIntegranteVacio(),
    crearIntegranteVacio(),
  ]);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const actualizarIntegrante = (
    id: string,
    campo: keyof Omit<Integrante, "id" | "emergencia">,
    valor: string
  ) => {
    setIntegrantes((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              [campo]: valor,
            }
          : it
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

    setIntegrantes((prev) => [
      ...prev,
      crearIntegranteVacio(),
    ]);
  };

  const quitarIntegrante = (id: string) => {
    if (integrantes.length <= MIN_INTEGRANTES) return;

    setIntegrantes((prev) =>
      prev.filter((it) => it.id !== id)
    );
  };

  const validar = (): string | null => {
    if (!equipo.trim())
      return "Ponle un nombre a tu equipo.";

    if (!problematica.trim())
      return "Selecciona una problemática.";

    if (!correoContacto.trim())
      return "Ingresa un correo de contacto.";

    if (!/^\S+@\S+\.\S+$/.test(correoContacto))
      return "El correo de contacto no es válido.";

    if (!telefonoContacto.trim())
      return "Ingresa un teléfono de contacto.";

    for (let i = 0; i < integrantes.length; i++) {
      const it = integrantes[i];

      if (!it.nombre.trim())
        return `Falta el nombre del integrante ${i + 1}.`;

      if (
        !it.correo.trim() ||
        !/^\S+@\S+\.\S+$/.test(it.correo)
      )
        return `El correo del integrante ${i + 1} no es válido.`;

      if (!it.telefono.trim())
        return `Falta el teléfono del integrante ${i + 1}.`;

      if (!it.emergencia.nombre.trim())
        return `Falta el contacto de emergencia del integrante ${
          i + 1
        }.`;

      if (!it.emergencia.telefono.trim())
        return `Falta el teléfono de emergencia del integrante ${
          i + 1
        }.`;

      if (!it.emergencia.parentesco.trim())
        return `Falta el parentesco del contacto de emergencia del integrante ${
          i + 1
        }.`;
    }

    if (!aceptaReglas)
      return "Debes leer y aceptar las reglas para poder registrarte.";

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

    /*
     * Aquí conectas tu endpoint.
     *
     * const payload = {
     *   equipo,
     *   problematica,
     *   contacto: {
     *     correo: correoContacto,
     *     telefono: telefonoContacto,
     *   },
     *   integrantes,
     *   aceptaReglas,
     * };
     */

    try {
      // await fetch(...);

      setStatus("exito");
    } catch (error) {
      console.error(error);

      setStatus("error");
      setErrorMsg(
        "No se pudo enviar el registro. Intenta nuevamente."
      );
    }
  };

  const abrirReglamento = () => {
    window.open(
      "/Documents/REGLAMENTO.pdf",
      "_blank"
    );
  };

  /* ============================================================
     ÉXITO
     ============================================================ */

  if (status === "exito") {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <span className="text-4xl">🎉</span>

        <h2 className="text-xl font-semibold text-white">
          ¡Registro recibido!
        </h2>

        <p className="text-sm leading-6 text-white/60">
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
    <>
      {/* ==========================================================
          ==========================================================
          DESKTOP
          ==========================================================
          ========================================================== */}

      <div className="hidden lg:block">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-5xl flex-col gap-6"
        >
          {/* DATOS DEL EQUIPO */}

          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Datos del equipo
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Información general del equipo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Nombre del equipo
                </label>

                <input
                  className={inputClass}
                  value={equipo}
                  onChange={(e) =>
                    setEquipo(e.target.value)
                  }
                  placeholder="Los Debuggers"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Problemática
                </label>

                <select
                  value={problematica}
                  onChange={(e) =>
                    setProblematica(e.target.value)
                  }
                  className={`${inputClass} cursor-pointer`}
                >
                  <option
                    value=""
                    className="bg-zinc-900"
                  >
                    Selecciona una problemática
                  </option>

                  <option
                    value="agua"
                    className="bg-zinc-900"
                  >
                    Agua
                  </option>

                  <option
                    value="medio-ambiente"
                    className="bg-zinc-900"
                  >
                    Medio ambiente
                  </option>

                  <option
                    value="educacion"
                    className="bg-zinc-900"
                  >
                    Educación
                  </option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Teléfono de contacto
                </label>

                <input
                  type="tel"
                  className={inputClass}
                  value={telefonoContacto}
                  onChange={(e) =>
                    setTelefonoContacto(e.target.value)
                  }
                  placeholder="844 123 4567"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Correo de contacto
                </label>

                <input
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
          </section>

          {/* INTEGRANTES */}

          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Integrantes
                </h2>

                <p className="mt-1 text-sm text-white/40">
                  Cada integrante debe proporcionar sus datos.
                </p>
              </div>

              <span className="text-xs text-white/40">
                {integrantes.length}/{MAX_INTEGRANTES}
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
                    className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-white">
                          Integrante {i + 1}
                        </span>

                        <p className="mt-0.5 text-xs text-white/30">
                          Información personal
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          quitarIntegrante(it.id)
                        }
                        disabled={
                          integrantes.length <=
                          MIN_INTEGRANTES
                        }
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Quitar
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                          Nombre completo
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
                          placeholder="Juan Pérez"
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
                          placeholder="juan@correo.com"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                          Teléfono
                        </label>

                        <input
                          type="tel"
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

                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                          Alergias{" "}
                          <span className="text-white/30">
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
                          placeholder="Ninguna"
                        />
                      </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                          Contacto de emergencia
                        </p>

                        <p className="mt-1 text-xs text-white/30">
                          Persona a contactar en caso de emergencia.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className={labelClass}>
                            Nombre
                          </label>

                          <input
                            className={inputClass}
                            value={
                              it.emergencia.nombre
                            }
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
                            type="tel"
                            className={inputClass}
                            value={
                              it.emergencia.telefono
                            }
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
                            value={
                              it.emergencia.parentesco
                            }
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={agregarIntegrante}
              disabled={
                integrantes.length >= MAX_INTEGRANTES
              }
              className="self-start rounded-full border border-dashed border-white/20 px-4 py-2.5 text-xs font-medium text-white/60 transition-colors hover:border-cyan-300/50 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              + Agregar integrante
            </button>
          </section>

          {/* REGLAMENTO */}

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
            <input
              type="checkbox"
              checked={aceptaReglas}
              onChange={(e) =>
                setAceptaReglas(e.target.checked)
              }
              className="h-4 w-4 accent-cyan-300"
            />

            <span className="text-sm text-white/70">
              He leído y acepto las{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  abrirReglamento();
                }}
                className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200"
              >
                reglas y reglamento
              </button>{" "}
              del evento.
            </span>
          </label>

          {status === "error" && errorMsg && (
            <p className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-300">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "enviando"}
            className="self-end rounded-full bg-cyan-300 px-8 py-3 text-sm font-semibold text-zinc-950 transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "enviando"
              ? "Enviando..."
              : "Registrar equipo"}
          </button>
        </form>
      </div>

      {/* ==========================================================
          ==========================================================
          MOBILE
          ==========================================================
          ========================================================== */}

      <div className="block lg:hidden">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4"
        >
          {/* DATOS DEL EQUIPO */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white">
                Datos del equipo
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/40">
                Información general del equipo.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Nombre del equipo
                </label>

                <input
                  className={inputClass}
                  value={equipo}
                  onChange={(e) =>
                    setEquipo(e.target.value)
                  }
                  placeholder="Los Debuggers"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Problemática
                </label>

                <select
                  value={problematica}
                  onChange={(e) =>
                    setProblematica(e.target.value)
                  }
                  className={`${inputClass} cursor-pointer`}
                >
                  <option
                    value=""
                    className="bg-zinc-900"
                  >
                    Selecciona una problemática
                  </option>

                  <option
                    value="agua"
                    className="bg-zinc-900"
                  >
                    Agua
                  </option>

                  <option
                    value="medio-ambiente"
                    className="bg-zinc-900"
                  >
                    Medio ambiente
                  </option>

                  <option
                    value="educacion"
                    className="bg-zinc-900"
                  >
                    Educación
                  </option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Teléfono de contacto
                </label>

                <input
                  type="tel"
                  className={inputClass}
                  value={telefonoContacto}
                  onChange={(e) =>
                    setTelefonoContacto(e.target.value)
                  }
                  placeholder="844 123 4567"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Correo de contacto
                </label>

                <input
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
          </section>

          {/* INTEGRANTES */}

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Integrantes
                </h2>

                <p className="mt-0.5 text-xs text-white/40">
                  {integrantes.length} de {MAX_INTEGRANTES}
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/40">
                Mínimo {MIN_INTEGRANTES}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {integrantes.map((it, i) => (
                  <motion.div
                    key={it.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 20,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    {/* HEADER */}

                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-white">
                          Integrante {i + 1}
                        </span>

                        <p className="mt-0.5 text-[11px] text-white/30">
                          Datos del alumno
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          quitarIntegrante(it.id)
                        }
                        disabled={
                          integrantes.length <=
                          MIN_INTEGRANTES
                        }
                        className="rounded-xl border border-white/10 px-3 py-2 text-[11px] text-white/50 transition-colors active:bg-white/10 disabled:opacity-30"
                      >
                        Quitar
                      </button>
                    </div>

                    {/* DATOS */}

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                          Nombre completo
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
                          placeholder="Juan Pérez"
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
                          placeholder="juan@correo.com"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                          Teléfono
                        </label>

                        <input
                          type="tel"
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

                      <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                          Alergias{" "}
                          <span className="text-white/30">
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
                          placeholder="Ninguna"
                        />
                      </div>
                    </div>

                    {/* SEPARADOR */}

                    <div className="my-5 h-px bg-white/5" />

                    {/* EMERGENCIA */}

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
                        Contacto de emergencia
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-white/30">
                        Persona a contactar en caso de
                        emergencia.
                      </p>

                      <div className="mt-3 flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className={labelClass}>
                            Nombre
                          </label>

                          <input
                            className={inputClass}
                            value={
                              it.emergencia.nombre
                            }
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
                            type="tel"
                            className={inputClass}
                            value={
                              it.emergencia.telefono
                            }
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
                            value={
                              it.emergencia.parentesco
                            }
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={agregarIntegrante}
              disabled={
                integrantes.length >= MAX_INTEGRANTES
              }
              className="w-full rounded-full border border-dashed border-white/20 px-4 py-3 text-xs font-medium text-white/60 transition-colors active:bg-white/5 disabled:opacity-30"
            >
              + Agregar integrante
            </button>
          </section>

          {/* REGLAMENTO */}

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <input
              type="checkbox"
              checked={aceptaReglas}
              onChange={(e) =>
                setAceptaReglas(e.target.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-300"
            />

            <span className="text-xs leading-5 text-white/70">
              He leído y acepto las{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  abrirReglamento();
                }}
                className="text-cyan-300 underline underline-offset-2"
              >
                reglas y reglamento
              </button>{" "}
              del evento.
            </span>
          </label>

          {/* ERROR */}

          {status === "error" && errorMsg && (
            <motion.p
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs leading-5 text-red-300"
            >
              {errorMsg}
            </motion.p>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={status === "enviando"}
            className="w-full rounded-full bg-cyan-300 px-6 py-3.5 text-sm font-semibold text-zinc-950 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "enviando"
              ? "Enviando..."
              : "Registrar equipo"}
          </button>
        </form>
      </div>
    </>
  );
}

export default RegistroForm;