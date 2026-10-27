import Link from "next/link";
import styles from "./Rodape.module.css";

export function Rodape() {
  return (
    <footer className={styles.rodape} data-hide-in-focus>
      <div className={`container ${styles.interno}`}>
        <nav aria-label="Rodapé">
          <ul className={styles.links}>
            <li>
              <Link href="/fontes">Fontes</Link>
            </li>
            <li>
              <Link href="/sobre">Sobre a pesquisa</Link>
            </li>
            <li>
              <Link href="/ajuda">Ajuda</Link>
            </li>
          </ul>
        </nav>
        <p className={styles.nota}>
          Trabalho de conclusão de curso - Engenharia de Software - UPE Campus Garanhuns
        </p>
      </div>
    </footer>
  );
}
