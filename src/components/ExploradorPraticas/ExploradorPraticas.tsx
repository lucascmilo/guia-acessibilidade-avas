"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FILTROS_VAZIOS, FiltrosPraticas, type EstadoFiltros } from "@/components/FiltrosPraticas/FiltrosPraticas";
import { CartaoPratica } from "@/components/CartaoPratica/CartaoPratica";
import { DuasColunas } from "@/components/DuasColunas/DuasColunas";
import { DESAFIOS } from "@/data/desafios";
import { GLOSSARIO } from "@/data/glossario";
import { ROTULOS_ORIENTACAO, PRATICAS, ROTULOS_TAREFA } from "@/data/praticas";
import type { TarefaAva } from "@/data/tipos";
import styles from "./ExploradorPraticas.module.css";

const SUGESTOES = ["animação", "menu", "linguagem", "tema"];

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function stem(word: string) {
  return word.length > 4 ? word.replace(/(oes|aes|ao|es|s)$/, "") : word;
}

function matchesQuery(text: string, query: string) {
  const haystack = normalize(text);
  return normalize(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(stem(word)));
}

export function ExploradorPraticasDaUrl() {
  const params = useSearchParams();
  const challengeParam = params.get("desafio")?.toUpperCase() ?? "";
  const taskParam = params.get("tarefa") ?? "";
  const challenge = DESAFIOS.some((item) => item.code === challengeParam) ? challengeParam : "";
  const task = taskParam in ROTULOS_TAREFA ? (taskParam as TarefaAva) : "";
  return <ExploradorPraticas key={`${challenge}-${task}`} initial={{ challenge, task }} />;
}

export function ExploradorPraticas({ initial = {} }: { initial?: Partial<EstadoFiltros> }) {
  const [draft, setDraft] = useState<EstadoFiltros>({ ...FILTROS_VAZIOS, ...initial });
  const [applied, setApplied] = useState<EstadoFiltros>({ ...FILTROS_VAZIOS, ...initial });

  const results = useMemo(
    () =>
      PRATICAS.filter((practice) => {
        if (applied.types.length > 0 && !applied.types.includes(practice.type)) return false;
        if (applied.task && !practice.tasks.includes(applied.task)) return false;
        if (applied.challenge && !practice.challenges.includes(applied.challenge)) return false;
        if (applied.strategy && !practice.strategies.includes(applied.strategy)) return false;
        return matchesQuery(
          `${practice.title} ${practice.what} ${practice.why} ${practice.groupTitle} ${ROTULOS_ORIENTACAO[practice.type]}`,
          applied.query,
        );
      }),
    [applied],
  );

  const glossaryMatches = useMemo(() => {
    if (!normalize(applied.query)) return [];
    return GLOSSARIO.flatMap((group) =>
      group.terms
        .filter((item) => matchesQuery(`${item.term} ${item.definition}`, applied.query))
        .map((item) => ({ ...item, letter: group.letter })),
    );
  }, [applied.query]);

  function clear() {
    setDraft(FILTROS_VAZIOS);
    setApplied(FILTROS_VAZIOS);
  }

  function searchFor(term: string) {
    const next = { ...FILTROS_VAZIOS, query: term };
    setDraft(next);
    setApplied(next);
  }

  const countText =
    results.length === 1 ? "1 resultado encontrado" : `${results.length} resultados encontrados`;

  return (
    <DuasColunas
      sidebar={<FiltrosPraticas draft={draft} onDraftChange={setDraft} onApply={() => setApplied(draft)} onClear={clear} />}
      contentMaxWidth="var(--reading-width)"
      stickySidebar
    >
      <section aria-labelledby="resultados" className={styles.resultados}>
        <div className={styles.cabecalho}>
          <h2 id="resultados" className={styles.titulo}>
            Resultados
          </h2>
          <p role="status" className={styles.contador}>
            <span key={countText} className={styles.textoContador}>
              {countText}
            </span>
          </p>
        </div>

        {results.length > 0 ? (
          <ul key={JSON.stringify(applied)} className={styles.lista}>
            {results.map((practice, index) => (
              <li key={practice.id} className={styles.item} style={{ animationDelay: `${index * 40}ms` }}>
                <CartaoPratica practice={practice} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.vazio}>
            <p className={styles.tituloVazio}>
              {applied.query
                ? `Nenhuma prática encontrada para “${applied.query}” com esses filtros.`
                : "Nenhuma prática encontrada com esses filtros."}
            </p>
            <p className={styles.textoVazio}>
              Confira a grafia, use menos filtros ou tente um destes termos:
            </p>
            <ul className={styles.sugestoes}>
              {SUGESTOES.map((term) => (
                <li key={term}>
                  <button type="button" className={styles.sugestao} onClick={() => searchFor(term)}>
                    Buscar “{term}”
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className={styles.botaoVazio} onClick={clear}>
              Limpar filtros
            </button>
          </div>
        )}

        {glossaryMatches.length > 0 && (
          <div className={styles.glossario}>
            <h3 className={styles.tituloGlossario}>Também no glossário</h3>
            <ul className={styles.listaGlossario}>
              {glossaryMatches.map((item) => (
                <li key={item.term}>
                  <Link href={`/glossario#letra-${item.letter.toLowerCase()}`}>{item.term}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </DuasColunas>
  );
}
