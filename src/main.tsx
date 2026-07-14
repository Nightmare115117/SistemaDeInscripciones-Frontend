import "./index.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LiquidGlassFilter } from './components-custom/liquid-glass-filter'
import App from "./App";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider>
      <LiquidGlassFilter />
      <App />
      <Toaster />
    </TooltipProvider>
  </StrictMode>,
)