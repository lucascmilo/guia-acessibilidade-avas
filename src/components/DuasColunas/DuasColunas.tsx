import type { ReactNode } from "react";
import styles from "./DuasColunas.module.css";

type DuasColunasProps = {
  sidebar: ReactNode;
  children: ReactNode;
  contentMaxWidth?: string;
  stickySidebar?: boolean;
};

export function DuasColunas({ sidebar, children, contentMaxWidth, stickySidebar = false }: DuasColunasProps) {
  return (
    <div className={styles.linha}>
      <div className={stickySidebar ? `${styles.lateral} ${styles.fixa}` : styles.lateral}>{sidebar}</div>
      <div className={styles.conteudo} style={contentMaxWidth ? { maxWidth: contentMaxWidth } : undefined}>
        {children}
      </div>
    </div>
  );
}
