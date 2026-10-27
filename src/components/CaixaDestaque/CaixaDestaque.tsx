import type { ReactNode } from "react";
import { IconeInfo, IconeAtencao } from "@/components/Icones/Icones";
import styles from "./CaixaDestaque.module.css";

type CaixaDestaqueProps = {
  variant?: "info" | "atencao";
  children: ReactNode;
};

export function CaixaDestaque({ variant = "info", children }: CaixaDestaqueProps) {
  const Icon = variant === "atencao" ? IconeAtencao : IconeInfo;
  const label = variant === "atencao" ? "Atenção:" : "Informação:";
  return (
    <div className={`${styles.caixa} ${styles[variant]}`}>
      <Icon size={20} className={styles.icone} />
      <p className={styles.texto}>
        <span className="visually-hidden">{label} </span>
        {children}
      </p>
    </div>
  );
}
