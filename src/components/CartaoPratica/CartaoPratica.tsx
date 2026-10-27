import Link from "next/link";
import { Selo, EtiquetaCodigo } from "@/components/Selo/Selo";
import type { ResumoPratica } from "@/data/tipos";
import styles from "./CartaoPratica.module.css";

export function CartaoPratica({ practice }: { practice: ResumoPratica }) {
  return (
    <article className={styles.cartao} aria-labelledby={`titulo-${practice.id}`}>
      <div className={styles.etiquetas}>
        <Selo type={practice.type} />
        {[...practice.challenges, ...practice.strategies].map((code) => (
          <EtiquetaCodigo key={code} code={code} />
        ))}
      </div>
      <h3 id={`titulo-${practice.id}`} className={styles.titulo}>
        <Link href={practice.href} className={styles.link}>
          {practice.title}
        </Link>
      </h3>
      <p className={styles.resumo}>{practice.what}</p>
      <p className={styles.grupo}>Em: {practice.groupTitle}</p>
    </article>
  );
}
