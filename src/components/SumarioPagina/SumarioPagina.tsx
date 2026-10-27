"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFichasLidas } from "@/components/FichasLidas/FichasLidas";
import { IconeCheck } from "@/components/Icones/Icones";
import styles from "./SumarioPagina.module.css";

export type ItemSumario = { href: string; label: string };

type SumarioPaginaProps = {
  items: ItemSumario[];
  showProgress?: boolean;
};

const ACTIVE_LINE = 0.3;

export function SumarioPagina({ items, showProgress = false }: SumarioPaginaProps) {
  const [active, setActive] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bar, setBar] = useState({ top: 0, height: 0 });
  const [layoutTick, setLayoutTick] = useState(0);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const escolhido = useRef<number | null>(null);
  const rolandoAteEscolhido = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { lidas } = useFichasLidas();

  useEffect(() => {
    const element = listRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setLayoutTick((value) => value + 1));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      if (escolhido.current !== null) {
        const alvo = document.getElementById(items[escolhido.current]?.href.slice(1) ?? "");
        const topo = alvo?.getBoundingClientRect().top ?? -Infinity;
        if (rolandoAteEscolhido.current || (topo >= -8 && topo <= window.innerHeight * 0.6)) {
          setActive(escolhido.current);
          return;
        }
        escolhido.current = null;
      }
      const altura = window.innerHeight;
      const restante = document.documentElement.scrollHeight - altura - window.scrollY;
      const faixaFinal = altura * (1 - ACTIVE_LINE);
      const avanco = restante < faixaFinal ? 1 - Math.max(restante, 0) / faixaFinal : 0;
      const line = altura * (ACTIVE_LINE + (1 - ACTIVE_LINE) * avanco) - 1;
      let current = 0;
      items.forEach((item, index) => {
        const target = document.getElementById(item.href.slice(1));
        if (target && target.getBoundingClientRect().top <= line) current = index;
      });
      setActive(current);
    }
    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    function onScrollEnd() {
      if (!rolandoAteEscolhido.current) return;
      rolandoAteEscolhido.current = false;
      onScroll();
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("scrollend", onScrollEnd);
    return () => {
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  useLayoutEffect(() => {
    const link = linkRefs.current[active];
    if (link) setBar({ top: link.offsetTop, height: link.offsetHeight });
  }, [active, items, layoutTick]);

  function escolher(index: number) {
    setMobileOpen(false);
    setActive(index);
    escolhido.current = index;
    rolandoAteEscolhido.current = true;
    window.setTimeout(() => {
      rolandoAteEscolhido.current = false;
    }, 1200);
  }

  const total = items.length;

  return (
    <nav aria-labelledby="toc-titulo" className={styles.sumario} data-hide-in-focus>
      <h2 id="toc-titulo" className={styles.titulo}>
        Nessa página
      </h2>
      <button
        type="button"
        className={styles.alternarCelular}
        aria-expanded={mobileOpen}
        aria-controls="toc-corpo"
        onClick={() => setMobileOpen((value) => !value)}
      >
        <span aria-hidden="true" className={styles.seta}>
          &gt;
        </span>
        Nessa página
        {showProgress && <span className={styles.contadorCelular}>Ficha {active + 1} de {items.length}</span>}
      </button>
      <div id="toc-corpo" className={mobileOpen ? `${styles.corpo} ${styles.corpoAberto}` : styles.corpo}>
      <div ref={listRef} className={styles.envoltorioLista}>
        <span
          aria-hidden="true"
          className={styles.indicador}
          style={{ transform: `translateY(${bar.top}px)`, height: bar.height }}
        />
        <ol className={styles.lista}>
        {items.map((item, index) => {
          const current = index === active;
          const lida = showProgress && lidas.has(item.href.slice(1));
          return (
            <li key={item.href}>
              <a
                ref={(element) => {
                  linkRefs.current[index] = element;
                }}
                href={item.href}
                className={current ? `${styles.link} ${styles.linkAtual}` : styles.link}
                aria-current={current ? "location" : undefined}
                onClick={() => escolher(index)}
              >
                <span className={styles.rotuloLink}>{item.label}</span>
                {lida && (
                  <span className={styles.lida}>
                    <IconeCheck size={14} />
                    lida
                  </span>
                )}
              </a>
            </li>
          );
        })}
        </ol>
      </div>

      {showProgress && (
        <div className={styles.progresso}>
          <p id="toc-progresso" className={styles.rotuloProgresso}>
            Seu progresso
          </p>
          <div
            role="progressbar"
            aria-labelledby="toc-progresso"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={active + 1}
            aria-valuetext={`Ficha ${active + 1} de ${total}`}
            className={styles.barra}
          >
            <div className={styles.preenchimentoBarra} style={{ width: `${((active + 1) / total) * 100}%` }} />
          </div>
          <p className={styles.textoProgresso}>
            Ficha {active + 1} de {total}
          </p>
        </div>
      )}
      </div>
    </nav>
  );
}
