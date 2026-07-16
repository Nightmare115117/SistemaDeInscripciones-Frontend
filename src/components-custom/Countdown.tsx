import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const diff = Math.max(0, targetDate.getTime() - Date.now());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Cada número anima su propio cambio: cuando el valor cambia, el dígito
 * anterior sale deslizándose hacia arriba y el nuevo entra desde abajo,
 * como un marcador mecánico (efecto "odometer").
 */
function DigitBlock({ value, label }: { value: number; label: string }) {
  const display = value.toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-10 w-10 overflow-hidden sm:h-14 sm:w-16 md:h-20 md:w-24">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white sm:text-3xl md:text-5xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-white/60 sm:text-xs md:text-sm">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = getTimeLeft(targetDate);
      setTimeLeft(next);
      if (
        next.days === 0 &&
        next.hours === 0 &&
        next.minutes === 0 &&
        next.seconds === 0
      ) {
        setIsOver(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (isOver) {
    return (
      <p className="text-2xl font-bold text-white">¡El evento ya comenzó!</p>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-3 md:gap-6">
      <DigitBlock value={timeLeft.days} label="Días" />
      <span className="pb-3 text-lg font-bold text-white/40 sm:pb-5 sm:text-2xl md:text-4xl">:</span>
      <DigitBlock value={timeLeft.hours} label="Horas" />
      <span className="pb-3 text-lg font-bold text-white/40 sm:pb-5 sm:text-2xl md:text-4xl">:</span>
      <DigitBlock value={timeLeft.minutes} label="Min" />
      <span className="pb-3 text-lg font-bold text-white/40 sm:pb-5 sm:text-2xl md:text-4xl">:</span>
      <DigitBlock value={timeLeft.seconds} label="Seg" />
    </div>
  );
}