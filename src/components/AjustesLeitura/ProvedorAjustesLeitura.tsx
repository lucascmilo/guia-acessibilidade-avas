"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  AJUSTES_PADRAO,
  CHAVE_ARMAZENAMENTO,
  aplicarAjustesNoDocumento,
  type EstadoAjustes,
} from "./opcoesAjustesLeitura";

type ValorContextoAjustes = {
  settings: EstadoAjustes;
  update: (next: Partial<EstadoAjustes>) => void;
  reset: () => void;
  statusMessage: string;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  openPanelWithFocus: () => void;
  focusPending: boolean;
  consumeFocus: () => void;
  inlineHost: boolean;
  setInlineHost: (value: boolean) => void;
};

const ContextoAjustes = createContext<ValorContextoAjustes | null>(null);

const LABELS: Record<string, string> = {
  claro: "tema Claro",
  suave: "tema Suave",
  escuro: "tema Escuro",
  padrao: "padrão",
  ampliado: "espaçamento ampliado",
  estreita: "linha estreita",
};

function semAssinatura() {
  return () => {};
}

function readSaved(): EstadoAjustes {
  try {
    const saved = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO) ?? "null");
    return saved ? { ...AJUSTES_PADRAO, ...saved, focusMode: false } : AJUSTES_PADRAO;
  } catch {
    return AJUSTES_PADRAO;
  }
}

function enterFullscreen() {
  const root = document.documentElement;
  if (document.fullscreenElement || !root.requestFullscreen) return;
  root.requestFullscreen().catch(() => {});
}

function exitFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

export function ProvedorAjustesLeitura({ children }: { children: ReactNode }) {
  const noNavegador = useSyncExternalStore(semAssinatura, () => true, () => false);
  const salvos = useMemo(() => (noNavegador ? readSaved() : AJUSTES_PADRAO), [noNavegador]);
  const [editados, setEditados] = useState<EstadoAjustes | null>(null);
  const settings = editados ?? salvos;
  const [statusMessage, setStatusMessage] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [inlineHost, setInlineHost] = useState(false);
  const [focusPending, setFocusPending] = useState(false);

  const alterar = useCallback(
    (mudanca: (atual: EstadoAjustes) => EstadoAjustes) => setEditados((atual) => mudanca(atual ?? salvos)),
    [salvos],
  );

  const openPanelWithFocus = useCallback(() => {
    setPanelOpen(true);
    setFocusPending(true);
  }, []);

  const consumeFocus = useCallback(() => setFocusPending(false), []);

  useEffect(() => {
    if (!noNavegador) return;
    aplicarAjustesNoDocumento(settings);
    try {
      localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(settings));
    } catch {}
  }, [settings, noNavegador]);

  useEffect(() => {
    function onFullscreenChange() {
      if (document.fullscreenElement) return;
      alterar((atual) => (atual.focusMode ? { ...atual, focusMode: false } : atual));
      setStatusMessage((message) => (message === "Modo foco ligado." ? "Modo foco desligado." : message));
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [alterar]);

  useEffect(() => {
    if (!settings.focusMode) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || document.fullscreenElement) return;
      alterar((atual) => ({ ...atual, focusMode: false }));
      setStatusMessage("Modo foco desligado.");
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [settings.focusMode, alterar]);

  const update = useCallback(
    (next: Partial<EstadoAjustes>) => {
      if (next.focusMode === true) enterFullscreen();
      if (next.focusMode === false) exitFullscreen();
      alterar((atual) => ({ ...atual, ...next }));
      const [key, value] = Object.entries(next)[0] ?? [];
      if (key === "focusMode") setStatusMessage(value ? "Modo foco ligado." : "Modo foco desligado.");
      else if (key === "reduceMotion") setStatusMessage(value ? "Movimento reduzido." : "Movimento normal.");
      else if (key === "textSize") setStatusMessage(`Texto a ${value}%.`);
      else if (key) setStatusMessage(`Ajuste aplicado: ${LABELS[String(value)] ?? value}.`);
    },
    [alterar],
  );

  const reset = useCallback(() => {
    exitFullscreen();
    setEditados(AJUSTES_PADRAO);
    setStatusMessage("Ajustes restaurados.");
  }, []);

  const value = useMemo(
    () => ({
      settings,
      update,
      reset,
      statusMessage,
      panelOpen,
      setPanelOpen,
      openPanelWithFocus,
      focusPending,
      consumeFocus,
      inlineHost,
      setInlineHost,
    }),
    [settings, update, reset, statusMessage, panelOpen, openPanelWithFocus, focusPending, consumeFocus, inlineHost],
  );

  return <ContextoAjustes.Provider value={value}>{children}</ContextoAjustes.Provider>;
}

export function useAjustesLeitura() {
  const context = useContext(ContextoAjustes);
  if (!context) throw new Error("useAjustesLeitura precisa estar dentro de ProvedorAjustesLeitura");
  return context;
}
