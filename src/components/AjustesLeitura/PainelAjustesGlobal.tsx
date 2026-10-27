"use client";

import { AjustesLeitura } from "./AjustesLeitura";
import { useAjustesLeitura } from "./ProvedorAjustesLeitura";
import styles from "./PainelAjustesGlobal.module.css";

export function PainelAjustesGlobal() {
  const { panelOpen, inlineHost } = useAjustesLeitura();
  if (!panelOpen || inlineHost) return null;

  return (
    <div className={`container ${styles.envoltorio}`}>
      <AjustesLeitura variant="faixa" />
    </div>
  );
}
