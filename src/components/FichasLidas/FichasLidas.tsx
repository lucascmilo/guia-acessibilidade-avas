"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ValorFichasLidas = {
  lidas: Set<string>;
  marcarComoLida: (id: string) => void;
};

const ContextoFichasLidas = createContext<ValorFichasLidas>({ lidas: new Set(), marcarComoLida: () => {} });

export function ProvedorFichasLidas({ children }: { children: ReactNode }) {
  const [lidas, setLidas] = useState<Set<string>>(() => new Set());

  useEffect(() => () => setLidas(new Set()), []);

  const marcarComoLida = useCallback(
    (id: string) => setLidas((atual) => (atual.has(id) ? atual : new Set(atual).add(id))),
    [],
  );

  const valor = useMemo(() => ({ lidas, marcarComoLida }), [lidas, marcarComoLida]);

  return <ContextoFichasLidas.Provider value={valor}>{children}</ContextoFichasLidas.Provider>;
}

export function useFichasLidas() {
  return useContext(ContextoFichasLidas);
}
