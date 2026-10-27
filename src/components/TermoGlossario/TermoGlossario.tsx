"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { idDoTermo } from "@/data/termosNoTexto";
import type { TermoGlossario as Termo } from "@/data/tipos";
import styles from "./TermoGlossario.module.css";

const MARGEM = 16;

export function TermoGlossario({ termo, children }: { termo: Termo; children: string }) {
  const [aberto, setAberto] = useState(false);
  const balaoId = useId();
  const envoltorioRef = useRef<HTMLSpanElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const balaoRef = useRef<HTMLSpanElement>(null);

  function fechar(devolverFoco: boolean) {
    setAberto(false);
    if (devolverFoco) botaoRef.current?.focus();
  }

  useLayoutEffect(() => {
    const balao = balaoRef.current;
    if (!aberto || !balao) return;
    balao.style.left = "0px";
    const caixa = balao.getBoundingClientRect();
    const limite = document.documentElement.clientWidth - MARGEM;
    if (caixa.right > limite) balao.style.left = `${Math.max(limite - caixa.right, MARGEM - caixa.left)}px`;
    balao.focus({ preventScroll: true });
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    function aoTocarFora(evento: PointerEvent) {
      if (!envoltorioRef.current?.contains(evento.target as Node)) setAberto(false);
    }
    document.addEventListener("pointerdown", aoTocarFora);
    return () => document.removeEventListener("pointerdown", aoTocarFora);
  }, [aberto]);

  function aoTeclar(evento: KeyboardEvent<HTMLSpanElement>) {
    if (evento.key !== "Escape") return;
    evento.preventDefault();
    fechar(true);
  }

  return (
    <span ref={envoltorioRef} className={styles.envoltorio}>
      <button
        ref={botaoRef}
        type="button"
        className={styles.termo}
        aria-expanded={aberto}
        aria-controls={balaoId}
        onClick={() => (aberto ? fechar(true) : setAberto(true))}
      >
        {children}
        <span className="visually-hidden"> (ver definição)</span>
      </button>
      {aberto && (
        <span
          ref={balaoRef}
          id={balaoId}
          role="dialog"
          aria-label={`Definição: ${termo.term}`}
          tabIndex={-1}
          className={styles.balao}
          onKeyDown={aoTeclar}
        >
          <span className={styles.titulo}>{termo.term}</span>
          <span className={styles.definicao}>{termo.definition}</span>
          <span className={styles.acoes}>
            <Link href={`/glossario#${idDoTermo(termo.term)}`} className={styles.link}>
              Ver no glossário
            </Link>
            <button type="button" className={styles.fechar} onClick={() => fechar(true)}>
              Fechar
            </button>
          </span>
        </span>
      )}
    </span>
  );
}
