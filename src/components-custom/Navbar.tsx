    import { useState } from "react";
    import { LayoutGroup } from "motion/react";
    import { motion } from "motion/react";
    import { LiquidGlassCard } from "@/components-custom/GlassCard";

    export function Navbar() {
        const navLink =
            "relative overflow-hidden rounded-full px-4 py-2 flex items-center justify-center text-white/80 transition-colors duration-300 hover:text-white";

        const [active, setActive] = useState("inicio");
        const links = [
                        { id: "inicio", label: "Inicio" },
                        { id: "itinerario", label: "Itinerario" },
                        { id: "ubicacion", label: "Ubicación" },
                        { id: "faq", label: "FAQ" },];

    return (
        <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="
            fixed
            top-6
            left-1/2
            -translate-x-1/2
            z-50
            w-full
            max-w-5xl
            px-6
        "
        >
        <LiquidGlassCard className="px-6 py-3">
            <LayoutGroup>
            <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <img 
                    src="/blanco_sin_fondo.png" 
                    className="h-10 w-10 scale-150 object-contain"
                    alt="Logo"
                    />
                <h1 className="text-xl font-bold text-white">
                    Hackathon
                </h1>
            </div>
            {/* Enlaces */}
                <div className="flex items-center gap-1 rounded-full bg-white/5 p-1">
                    {links.map((link) => (
                    <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setActive(link.id)}
                    className={navLink}
                    >
                    {active === link.id && (
                        <motion.div
                        layoutId="active-pill"
                        className="
                            absolute
                            inset-0
                            rounded-full
                            border
                            border-white/20
                            bg-white/10
                            backdrop-blur-xl
                            shadow-lg
                            shadow-white/10
                            "
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                        }}
                        />
                    )}
                        <span className={`relative z-10 transition-colors ${
                                active === link.id ? "text-white" : "text-white/80"}`}>
                            {link.label}
                        </span>
                    </a>
                    ))}
                </div>
            </nav>
            </LayoutGroup>
        </LiquidGlassCard>
        </motion.header>
    );
    }