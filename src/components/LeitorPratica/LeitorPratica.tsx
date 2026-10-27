"use client";

import { useEffect, type ReactNode } from "react";
import { Trilha, type ItemTrilha } from "@/components/Trilha/Trilha";
import { IconeEngrenagem } from "@/components/Icones/Icones";
import { SumarioPagina, type ItemSumario } from "@/components/SumarioPagina/SumarioPagina";
import { AjustesLeitura } from "@/components/AjustesLeitura/AjustesLeitura";
import { useAjustesLeitura } from "@/components/AjustesLeitura/ProvedorAjustesLeitura";
import { DuasColunas } from "@/components/DuasColunas/DuasColunas";
import { ProvedorFichasLidas } from "@/components/FichasLidas/FichasLidas";
import styles from "./LeitorPratica.module.css";

type LeitorPraticaProps = {
  breadcrumb: ItemTrilha[];
  toc: ItemSumario[];
  children: ReactNode;
};

export function LeitorPratica({ breadcrumb, toc, children }: LeitorPraticaProps) {
  const { panelOpen, setPanelOpen, openPanelWithFocus, setInlineHost, settings } = useAjustesLeitura();

  useEffect(() => {
    setInlineHost(true);
    return () => {
      setInlineHost(false);
      setPanelOpen(false);
    };
  }, [setInlineHost, setPanelOpen]);

  const sidebar = panelOpen ? (
    <>
      <SumarioPagina items={toc} showProgress />
      <AjustesLeitura variant="lateral" />
    </>
  ) : (
    <div className={styles.grupoFixo}>
      <SumarioPagina items={toc} showProgress />
      <button type="button" className={styles.abrirPainel} onClick={openPanelWithFocus}>
        <IconeEngrenagem />
        Abrir ajustes de leitura
      </button>
    </div>
  );

  const reader = <div className={styles.leitor}>{children}</div>;

  if (settings.focusMode && !panelOpen) {
    return (
      <ProvedorFichasLidas>
        <div className={styles.colunaFoco}>{reader}</div>
      </ProvedorFichasLidas>
    );
  }

  return (
    <ProvedorFichasLidas>
      <Trilha items={breadcrumb} />
      <div className={styles.espacador} data-hide-in-focus />
      <DuasColunas sidebar={sidebar} contentMaxWidth="var(--reading-width)" stickySidebar={!panelOpen}>
        {reader}
      </DuasColunas>
    </ProvedorFichasLidas>
  );
}
