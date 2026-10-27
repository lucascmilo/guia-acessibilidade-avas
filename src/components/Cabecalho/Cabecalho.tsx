"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { IconeEngrenagem, IconeBusca } from "@/components/Icones/Icones";
import { useAjustesLeitura } from "@/components/AjustesLeitura/ProvedorAjustesLeitura";
import styles from "./Cabecalho.module.css";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/praticas", label: "Práticas" },
  { href: "/glossario", label: "Glossário" },
  { href: "/fontes", label: "Fontes" },
  { href: "/sobre", label: "Sobre" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Cabecalho() {
  const pathname = usePathname();
  const { panelOpen, setPanelOpen, openPanelWithFocus } = useAjustesLeitura();
  const [menuOpen, setMenuOpen] = useState(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      document.getElementById("botao-menu")?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  function handleSearch(event: MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);
    if (pathname !== "/praticas") return;
    event.preventDefault();
    const field = document.getElementById("campo-busca");
    field?.scrollIntoView({ block: "center" });
    field?.focus();
  }

  function toggleSettings() {
    setMenuOpen(false);
    if (panelOpen) setPanelOpen(false);
    else openPanelWithFocus();
  }

  return (
    <header className={styles.cabecalho}>
      <div className={styles.interno}>
        <Link href="/" className={styles.marca}>
          Guia de Acessibilidade para AVAs
        </Link>

        <button
          id="botao-menu"
          type="button"
          className={styles.botaoMenu}
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span aria-hidden="true" className={styles.iconeMenu} />
          {menuOpen ? "Fechar menu" : "Menu"}
        </button>

        <div id="menu-principal" className={menuOpen ? `${styles.menu} ${styles.menuAberto}` : styles.menu}>
          <nav aria-label="Principal" className={styles.navegacao}>
            <ul className={styles.listaNavegacao}>
              {NAV_ITEMS.map((item) => {
                const current = isCurrent(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={current ? `${styles.linkNavegacao} ${styles.linkNavegacaoAtual}` : styles.linkNavegacao}
                      aria-current={current ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.acoes}>
            <Link href="/praticas#busca" className={styles.botaoBusca} onClick={handleSearch}>
              <IconeBusca />
              Buscar
            </Link>
            <button
              type="button"
              className={styles.botaoAjustes}
              aria-expanded={panelOpen}
              aria-controls="ajustes-de-leitura"
              onClick={toggleSettings}
            >
              <IconeEngrenagem className={styles.engrenagem} />
              Ajustes de leitura
            </button>
            <Link
              href="/ajuda"
              className={styles.botaoAjuda}
              aria-current={pathname === "/ajuda" ? "page" : undefined}
            >
              Ajuda
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
