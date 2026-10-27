import Link from "next/link";
import styles from "./NavegacaoPaginas.module.css";

type LinkPagina = { href: string; title: string };

export function NavegacaoPaginas({ previous, next }: { previous: LinkPagina; next: LinkPagina }) {
  return (
    <nav aria-label="Páginas do guia" className={styles.paginacao}>
      <Link href={previous.href} className={styles.link}>
        <span className={styles.direcao}>
          <span aria-hidden="true">&lt; </span>Anterior
        </span>
        <span className={styles.titulo}>{previous.title}</span>
      </Link>
      <Link href={next.href} className={`${styles.link} ${styles.proxima}`}>
        <span className={styles.direcao}>
          Próxima<span aria-hidden="true"> &gt;</span>
        </span>
        <span className={styles.titulo}>{next.title}</span>
      </Link>
    </nav>
  );
}
