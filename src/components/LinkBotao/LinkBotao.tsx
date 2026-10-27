import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./LinkBotao.module.css";

type LinkBotaoProps = {
  href: string;
  children: ReactNode;
  variant?: "primario" | "secundario";
};

export function LinkBotao({ href, children, variant = "primario" }: LinkBotaoProps) {
  return (
    <Link href={href} className={`${styles.botao} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
