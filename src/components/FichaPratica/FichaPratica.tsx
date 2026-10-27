"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useFichasLidas } from "@/components/FichasLidas/FichasLidas";
import { IconeInfo } from "@/components/Icones/Icones";
import { Selo, EtiquetaCodigo } from "@/components/Selo/Selo";
import { TermoGlossario } from "@/components/TermoGlossario/TermoGlossario";
import { EXEMPLOS } from "@/data/exemplos";
import { separarTermos } from "@/data/termosNoTexto";
import type { Pratica } from "@/data/tipos";
import styles from "./FichaPratica.module.css";

const DURACAO_ABERTURA = 400;

function Recolhivel({ id, open, children }: { id: string; open: boolean; children: ReactNode }) {
  const [assentado, setAssentado] = useState(open);
  const [abertoAntes, setAbertoAntes] = useState(open);
  if (abertoAntes !== open) {
    setAbertoAntes(open);
    if (!open) setAssentado(false);
  }

  useEffect(() => {
    if (!open) return;
    const espera = window.setTimeout(() => setAssentado(true), DURACAO_ABERTURA);
    return () => window.clearTimeout(espera);
  }, [open]);

  const classes = [styles.recolhivel];
  if (open) classes.push(styles.recolhivelAberto);
  if (open && assentado) classes.push(styles.recolhivelAssentado);

  return (
    <div id={id} className={classes.join(" ")} inert={!open}>
      <div className={styles.recolhivelInterno}>{children}</div>
    </div>
  );
}

export function FichaPratica({ practice, defaultOpen = false }: { practice: Pratica; defaultOpen?: boolean }) {
  const { id, title, type, challenges, strategies, what, why, verify, sources } = practice;
  const [open, setOpen] = useState(defaultOpen);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const bodyId = useId();
  const sourcesId = useId();
  const fimRef = useRef<HTMLDivElement>(null);
  const { marcarComoLida } = useFichasLidas();
  const usados = new Set<string>();
  const comTermos = (texto: string) =>
    separarTermos(texto, usados).map((trecho, indice) =>
      trecho.termo ? (
        <TermoGlossario key={indice} termo={trecho.termo}>
          {trecho.texto}
        </TermoGlossario>
      ) : (
        trecho.texto
      ),
    );

  useEffect(() => {
    const fim = fimRef.current;
    if (!open || !fim) return;
    let quadro = 0;
    function conferir() {
      quadro = 0;
      if (!fim || fim.getBoundingClientRect().top > window.innerHeight) return;
      marcarComoLida(id);
      window.removeEventListener("scroll", aoRolar);
    }
    function aoRolar() {
      if (!quadro) quadro = window.requestAnimationFrame(conferir);
    }
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => {
      window.removeEventListener("scroll", aoRolar);
      if (quadro) window.cancelAnimationFrame(quadro);
    };
  }, [open, id, marcarComoLida]);

  useEffect(() => {
    function openIfTarget() {
      if (window.location.hash === `#${id}`) setOpen(true);
    }
    openIfTarget();
    window.addEventListener("hashchange", openIfTarget);
    return () => window.removeEventListener("hashchange", openIfTarget);
  }, [id]);

  return (
    <article id={id} className={open ? `${styles.cartao} ${styles.cartaoAberto}` : styles.cartao} aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className={styles.tituloFicha}>
        <button
          type="button"
          className={styles.alternar}
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((value) => !value)}
        >
          <span aria-hidden="true" className={styles.seta}>
            &gt;
          </span>
          {title}
        </button>
      </h2>

      <Recolhivel id={bodyId} open={open}>
        <div className={styles.corpo}>
          <div className={styles.etiquetas}>
            <Selo type={type} />
            {[...challenges, ...strategies].map((code) => (
              <EtiquetaCodigo key={code} code={code} />
            ))}
          </div>

          <SecaoFicha title="O que fazer">
            <p>{comTermos(what)}</p>
          </SecaoFicha>
          <SecaoFicha title="Por quê">
            <p>{comTermos(why)}</p>
          </SecaoFicha>
          <SecaoFicha title="Como verificar">
            <ol>
              {verify.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </SecaoFicha>

          {EXEMPLOS[id] && (
            <aside aria-labelledby={`${id}-exemplo`} className={styles.exemplo}>
              <h3 id={`${id}-exemplo`} className={styles.tituloExemplo}>
                <IconeInfo size={20} className={styles.iconeExemplo} />
                Exemplo no AVA
              </h3>
              <p>{EXEMPLOS[id]}</p>
            </aside>
          )}

          <div ref={fimRef} className={styles.fontes}>
            <button
              type="button"
              className={styles.alternarFontes}
              aria-expanded={sourcesOpen}
              aria-controls={sourcesId}
              onClick={() => setSourcesOpen((value) => !value)}
            >
              <span aria-hidden="true" className={styles.seta}>
                &gt;
              </span>{" "}
              {sourcesOpen ? "Ocultar" : "Mostrar"} fundamentação
            </button>
            <Recolhivel id={sourcesId} open={sourcesOpen}>
              <div className={styles.envoltorioTabela}>
                <table className={styles.tabela}>
                  <caption className="visually-hidden">Fontes desta orientação</caption>
                  <thead>
                    <tr>
                      <th scope="col">Documento</th>
                      <th scope="col">Localizador</th>
                      <th scope="col">Força</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources.map((source) => (
                      <tr key={`${source.document}-${source.locator}`}>
                        <th scope="row">{source.document}</th>
                        <td>{source.locator}</td>
                        <td>{source.strength}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Recolhivel>
          </div>
        </div>
      </Recolhivel>
    </article>
  );
}

function SecaoFicha({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.secao}>
      <h3 className={styles.tituloSecao}>{title}</h3>
      {children}
    </div>
  );
}
