"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { IconeCheck } from "@/components/Icones/Icones";
import styles from "./SelecaoFiltro.module.css";

export type OpcaoSelecao = {
  value: string;
  label: string;
  code?: string;
};

type SelecaoFiltroProps = {
  id: string;
  labelId: string;
  value: string;
  options: OpcaoSelecao[];
  onChange: (value: string) => void;
};

export function SelecaoFiltro({ id, labelId, value, options, onChange }: SelecaoFiltroProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [posicao, setPosicao] = useState({ acima: false, alturaMaxima: 352 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = `${id}-lista`;
  const optionId = (index: number) => `${id}-opcao-${index}`;

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];

  function openList(index = selectedIndex) {
    const caixa = buttonRef.current?.getBoundingClientRect();
    if (caixa) {
      const abaixo = window.innerHeight - caixa.bottom - 16;
      const acimaEspaco = caixa.top - 16;
      const acima = abaixo < 240 && acimaEspaco > abaixo;
      setPosicao({ acima, alturaMaxima: Math.max(160, Math.min(352, acima ? acimaEspaco : abaixo)) });
    }
    setActive(index);
    setOpen(true);
  }

  function closeList(returnFocus: boolean) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  function choose(index: number) {
    onChange(options[index].value);
    closeList(true);
  }

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(`${id}-opcao-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [open, active, id]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openList();
    }
  }

  function onListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(index + 1, last));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        event.preventDefault();
        closeList(true);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          const letter = event.key.toLowerCase();
          const start = active + 1;
          const order = [...options.slice(start), ...options.slice(0, start)];
          const match = order.find((option) => (option.code ?? option.label).toLowerCase().startsWith(letter));
          if (match) setActive(options.indexOf(match));
        }
    }
  }

  return (
    <div ref={wrapperRef} className={styles.envoltorio}>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        className={styles.botao}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}`}
        onClick={() => (open ? closeList(true) : openList())}
        onKeyDown={onButtonKeyDown}
      >
        <span className={styles.valor}>
          {selected.code && <span className={styles.codigo}>{selected.code}</span>}
          {selected.label}
        </span>
        <span aria-hidden="true" className={styles.seta} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-activedescendant={optionId(active)}
          className={posicao.acima ? `${styles.lista} ${styles.listaAcima}` : styles.lista}
          style={{ maxHeight: posicao.alturaMaxima }}
          onKeyDown={onListKeyDown}
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            const classes = [styles.opcao];
            if (index === active) classes.push(styles.opcaoAtiva);
            if (isSelected) classes.push(styles.opcaoEscolhida);
            return (
              <li
                key={option.value || "todos"}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                className={classes.join(" ")}
                onPointerMove={() => setActive(index)}
                onClick={() => choose(index)}
              >
                {option.code && <span className={styles.codigo}>{option.code}</span>}
                <span className={styles.nome}>{option.label}</span>
                {isSelected && <IconeCheck size={16} className={styles.marca} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
