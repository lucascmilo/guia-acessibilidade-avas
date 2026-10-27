"use client";

import { useEffect, useId, useRef } from "react";
import {
  OPCOES_TAMANHO,
  OPCOES_ESPACAMENTO,
  OPCOES_TEMA,
  OPCOES_LARGURA,
} from "./opcoesAjustesLeitura";
import { useAjustesLeitura } from "./ProvedorAjustesLeitura";
import styles from "./AjustesLeitura.module.css";

type GrupoOpcoesProps<T extends string | number> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onSelect: (value: T) => void;
};

function GrupoOpcoes<T extends string | number>({ label, options, value, onSelect }: GrupoOpcoesProps<T>) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className={styles.grupo}>
      <p id={id} className={styles.rotuloGrupo}>
        {label}
      </p>
      <div className={styles.opcoes}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={selected}
              className={selected ? `${styles.opcao} ${styles.opcaoSelecionada}` : styles.opcao}
              onClick={() => onSelect(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type AjustesLeituraProps = {
  variant?: "lateral" | "faixa";
};

export function AjustesLeitura({ variant = "lateral" }: AjustesLeituraProps) {
  const { settings, update, reset, statusMessage, setPanelOpen, focusPending, consumeFocus } = useAjustesLeitura();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!focusPending) return;
    panelRef.current?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView({ block: "nearest" });
    consumeFocus();
  }, [focusPending, consumeFocus]);

  function close() {
    setPanelOpen(false);
    document.querySelector<HTMLElement>('[aria-controls="ajustes-de-leitura"]')?.focus();
  }

  return (
    <section
      ref={panelRef}
      id="ajustes-de-leitura"
      aria-labelledby="ajustes-titulo"
      className={`${styles.painel} ${styles[variant]}`}
      tabIndex={-1}
    >
      <div className={styles.cabecalho}>
        <h2 id="ajustes-titulo" className={styles.titulo}>
          Ajustes de Leitura
        </h2>
        <button type="button" className={styles.fechar} onClick={close}>
          Fechar
        </button>
      </div>

      <div className={styles.controles}>
        <GrupoOpcoes label="Tema" options={OPCOES_TEMA} value={settings.theme} onSelect={(theme) => update({ theme })} />
        <GrupoOpcoes
          label="Tamanho do Texto"
          options={OPCOES_TAMANHO}
          value={settings.textSize}
          onSelect={(textSize) => update({ textSize })}
        />
        <GrupoOpcoes
          label="Espaçamento entre letras e palavras"
          options={OPCOES_ESPACAMENTO}
          value={settings.spacing}
          onSelect={(spacing) => update({ spacing })}
        />
        <GrupoOpcoes
          label="Largura da linha"
          options={OPCOES_LARGURA}
          value={settings.lineWidth}
          onSelect={(lineWidth) => update({ lineWidth })}
        />

        <div className={styles.alternadores}>
          <label className={styles.alternar}>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(event) => update({ reduceMotion: event.target.checked })}
            />
            Reduzir Movimento
          </label>
          <label className={styles.alternar}>
            <input
              type="checkbox"
              checked={settings.focusMode}
              onChange={(event) => update({ focusMode: event.target.checked })}
            />
            Modo Foco
          </label>
        </div>

        <button type="button" className={styles.restaurar} onClick={reset}>
          Restaurar Padrão
        </button>
      </div>

      <p role="status" className="visually-hidden">
        {statusMessage}
      </p>
    </section>
  );
}
