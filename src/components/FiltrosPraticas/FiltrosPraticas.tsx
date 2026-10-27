"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const MARGEM_FIXA = 24;
import { DESAFIOS } from "@/data/desafios";
import { ESTRATEGIAS } from "@/data/estrategias";
import { ROTULOS_ORIENTACAO, ROTULOS_TAREFA } from "@/data/praticas";
import type { TarefaAva, TipoOrientacao } from "@/data/tipos";
import { SelecaoFiltro, type OpcaoSelecao } from "@/components/SelecaoFiltro/SelecaoFiltro";
import styles from "./FiltrosPraticas.module.css";

export type EstadoFiltros = {
  query: string;
  types: TipoOrientacao[];
  task: TarefaAva | "";
  challenge: string;
  strategy: string;
};

const OPCOES_TAREFA: OpcaoSelecao[] = [
  { value: "", label: "Todas as tarefas" },
  ...(Object.keys(ROTULOS_TAREFA) as TarefaAva[]).map((task) => ({ value: task, label: `${ROTULOS_TAREFA[task]} um AVA` })),
];
const OPCOES_DESAFIO: OpcaoSelecao[] = [
  { value: "", label: "Todos os desafios" },
  ...DESAFIOS.map((item) => ({ value: item.code, code: item.code, label: item.label })),
];
const OPCOES_ESTRATEGIA: OpcaoSelecao[] = [
  { value: "", label: "Todas as estratégias" },
  ...ESTRATEGIAS.map((item) => ({ value: item.code, code: item.code, label: item.label })),
];

export const TODOS_OS_TIPOS: TipoOrientacao[] = ["normativa", "tecnica", "dua", "juridico", "proposta"];

export const FILTROS_VAZIOS: EstadoFiltros = { query: "", types: [], task: "", challenge: "", strategy: "" };

type FiltrosPraticasProps = {
  draft: EstadoFiltros;
  onDraftChange: (next: EstadoFiltros) => void;
  onApply: () => void;
  onClear: () => void;
};

export function FiltrosPraticas({ draft, onDraftChange, onApply, onClear }: FiltrosPraticasProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const ativos = draft.types.length + [draft.task, draft.challenge, draft.strategy].filter(Boolean).length;
  const [filtrosAbertos, setFiltrosAbertos] = useState(ativos > 0);

  useEffect(() => {
    if (window.location.hash === "#busca") searchRef.current?.focus();
  }, []);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    function posicionar() {
      if (!form) return;
      const topo = Math.min(MARGEM_FIXA, window.innerHeight - form.offsetHeight - MARGEM_FIXA);
      form.style.setProperty("--topo-fixo", `${topo}px`);
    }
    posicionar();
    const observador = new ResizeObserver(posicionar);
    observador.observe(form);
    window.addEventListener("resize", posicionar);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", posicionar);
    };
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onApply();
  }

  function toggleType(type: TipoOrientacao, checked: boolean) {
    const types = checked ? [...draft.types, type] : draft.types.filter((item) => item !== type);
    onDraftChange({ ...draft, types });
  }

  return (
    <form ref={formRef} aria-label="Filtros das práticas" className={styles.formulario} onSubmit={handleSubmit}>
      <div id="busca" className={styles.campo}>
        <label htmlFor="campo-busca" className={styles.rotulo}>
          Buscar no guia
        </label>
        <span id="dica-busca" className={styles.dica}>
          Ex.: animação, menu, linguagem
        </span>
        <input
          ref={searchRef}
          id="campo-busca"
          type="search"
          aria-describedby="dica-busca"
          className={styles.entrada}
          value={draft.query}
          onChange={(event) => onDraftChange({ ...draft, query: event.target.value })}
        />
      </div>

      <button
        type="button"
        className={styles.alternarFiltros}
        aria-expanded={filtrosAbertos}
        aria-controls="filtros-detalhados"
        onClick={() => setFiltrosAbertos((valor) => !valor)}
      >
        <span aria-hidden="true" className={styles.seta}>
          &gt;
        </span>
        {filtrosAbertos ? "Ocultar filtros" : "Mostrar filtros"}
        {ativos > 0 && <span className={styles.ativos}>{ativos === 1 ? "1 ativo" : `${ativos} ativos`}</span>}
      </button>

      <div
        id="filtros-detalhados"
        className={filtrosAbertos ? `${styles.detalhes} ${styles.detalhesAbertos}` : styles.detalhes}
      >
        <fieldset className={styles.grupoCampos}>
          <legend className={styles.rotulo}>Tipos de orientação</legend>
          {TODOS_OS_TIPOS.map((type) => (
            <label key={type} className={styles.opcaoMarcavel}>
              <input
                type="checkbox"
                checked={draft.types.includes(type)}
                onChange={(event) => toggleType(type, event.target.checked)}
              />
              {ROTULOS_ORIENTACAO[type]}
            </label>
          ))}
        </fieldset>

        <div className={styles.campo}>
          <label id="rotulo-tarefa" htmlFor="filtro-tarefa" className={styles.rotulo}>
            O que você vai fazer
          </label>
          <SelecaoFiltro
            id="filtro-tarefa"
            labelId="rotulo-tarefa"
            value={draft.task}
            options={OPCOES_TAREFA}
            onChange={(task) => onDraftChange({ ...draft, task: task as TarefaAva | "" })}
          />
        </div>

        <div className={styles.campo}>
          <label id="rotulo-desafio" htmlFor="filtro-desafio" className={styles.rotulo}>
            Desafio
          </label>
          <SelecaoFiltro
            id="filtro-desafio"
            labelId="rotulo-desafio"
            value={draft.challenge}
            options={OPCOES_DESAFIO}
            onChange={(challenge) => onDraftChange({ ...draft, challenge })}
          />
        </div>

        <div className={styles.campo}>
          <label id="rotulo-estrategia" htmlFor="filtro-estrategia" className={styles.rotulo}>
            Estratégia
          </label>
          <SelecaoFiltro
            id="filtro-estrategia"
            labelId="rotulo-estrategia"
            value={draft.strategy}
            options={OPCOES_ESTRATEGIA}
            onChange={(strategy) => onDraftChange({ ...draft, strategy })}
          />
        </div>

        </div>

      <div className={styles.acoes}>
        <button type="submit" className={styles.aplicar}>
          Aplicar filtros
        </button>
        <button type="button" className={styles.limpar} onClick={onClear}>
          Limpar
        </button>
      </div>
    </form>
  );
}
