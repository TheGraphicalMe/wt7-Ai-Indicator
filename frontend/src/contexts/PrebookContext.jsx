// ─── SMART AI — PREBOOK MODAL CONTEXT ────────────────────────────────────
import { createContext, useContext, useState } from 'react'

const PrebookContext = createContext()

export function PrebookProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <PrebookContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </PrebookContext.Provider>
  )
}

export function usePrebook() {
  return useContext(PrebookContext)
}
