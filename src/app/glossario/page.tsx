import type { Metadata } from "next";
import { Trilha } from "@/components/Trilha/Trilha";
import { GLOSSARIO } from "@/data/glossario";
import { idDoTermo } from "@/data/termosNoTexto";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Glossário" };

export default function GlossarioPage() {
  return (
    <div className="container">
      <Trilha items={[{ label: "Início", href: "/" }, { label: "Glossário" }]} />

      <h1 className={styles.titulo}>Glossário</h1>
      <p className={styles.introducao}>Os termos técnicos do guia, em ordem alfabética. Cada definição indica de onde foi tirada.</p>

      <nav aria-label="Letras do glossário">
        <ul className={styles.letras}>
          {GLOSSARIO.map((group) => (
            <li key={group.letter}>
              <a href={`#letra-${group.letter.toLowerCase()}`} className={styles.letra}>
                <span className="visually-hidden">Ir para a letra </span>
                {group.letter}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.grupos}>
        {GLOSSARIO.map((group) => (
          <section
            key={group.letter}
            aria-labelledby={`letra-${group.letter.toLowerCase()}`}
            className={styles.grupo}
          >
            <h2 id={`letra-${group.letter.toLowerCase()}`} className={styles.letraGrupo}>
              {group.letter}
            </h2>
            <dl className={styles.termos}>
              {group.terms.map((item) => (
                <div key={item.term} id={idDoTermo(item.term)} className={styles.termo}>
                  <dt className={styles.nomeTermo}>{item.term}</dt>
                  <dd className={styles.definicao}>{item.definition}</dd>
                  <dd className={styles.fonte}>{item.source}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
