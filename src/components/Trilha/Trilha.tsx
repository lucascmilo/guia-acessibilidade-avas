import Link from "next/link";
import styles from "./Trilha.module.css";

export type ItemTrilha = { label: string; href?: string };

export function Trilha({ items }: { items: ItemTrilha[] }) {
  const voltar = [...items.slice(0, -1)].reverse().find((item) => item.href);
  return (
    <nav aria-label="Você está em" className={styles.trilha} data-hide-in-focus>
      {voltar?.href && (
        <Link href={voltar.href} className={styles.voltar}>
          <span aria-hidden="true">‹</span>
          <span>Voltar para {voltar.label}</span>
        </Link>
      )}
      <ol className={styles.lista}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className={styles.item}>
              {item.href && !isLast ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={styles.atual}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className={styles.separador}>
                  &gt;
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
