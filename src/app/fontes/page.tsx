import type { Metadata } from "next";
import { Trilha } from "@/components/Trilha/Trilha";
import { CaixaDestaque } from "@/components/CaixaDestaque/CaixaDestaque";
import { TabelaDados, type Coluna } from "@/components/TabelaDados/TabelaDados";
import {
  DOCUMENTOS_LEGAIS,
  DOCUMENTOS_PEDAGOGICOS,
  DOCUMENTOS_TECNICOS,
  REFERENCIAS,
} from "@/data/fontes";
import { DESAFIOS } from "@/data/desafios";
import { ESTRATEGIAS } from "@/data/estrategias";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Fontes" };

const RSL_COLUMNS: Coluna[] = [
  { key: "code", header: "Código", width: "90px", align: "center" },
  { key: "label", header: "Categoria", width: "30%" },
  { key: "description", header: "Descrição" },
];

const COLUMNS: Coluna[] = [
  { key: "code", header: "Código", width: "90px", align: "center" },
  { key: "name", header: "Documento" },
  { key: "year", header: "Ano", width: "100px", align: "center" },
];

export default function FontesPage() {
  return (
    <div className="container">
      <Trilha items={[{ label: "Início", href: "/" }, { label: "Fontes" }]} />

      <h1 className={styles.titulo}>Fontes</h1>
      <p className={styles.introducao}>
        As orientações do guia vêm de 17 documentos (DOC-01 a DOC-17) e de uma revisão sistemática. Cada ficha cita o
        código do documento e o ponto exato de onde a orientação foi extraída.
      </p>

      <section aria-labelledby="leis" className={styles.secao}>
        <h2 id="leis" className={styles.tituloSecao}>
          Instrumentos legais e de política pública
        </h2>
        <div className={styles.envoltorioCaixa}>
          <CaixaDestaque>
            Estes documentos sustentam o direito à educação inclusiva e à acessibilidade. Eles não definem requisitos de
            interface; no guia, aparecem com o selo <b>Fundamento jurídico</b>.
          </CaixaDestaque>
        </div>
        <TabelaDados
          caption="Instrumentos legais e de política pública da base documental"
          columns={COLUMNS}
          rows={DOCUMENTOS_LEGAIS}
        />
      </section>

      <section aria-labelledby="tecnicos" className={styles.secao}>
        <h2 id="tecnicos" className={styles.tituloSecao}>
          Referenciais técnicos
        </h2>
        <p className={styles.introducaoSecao}>
          Origem das <b>exigências normativas</b> (requisitos) e das <b>recomendações técnicas</b> do guia.
        </p>
        <TabelaDados caption="Referenciais técnicos da base documental" columns={COLUMNS} rows={DOCUMENTOS_TECNICOS} />
      </section>

      <section aria-labelledby="pedagogicos" className={styles.secao}>
        <h2 id="pedagogicos" className={styles.tituloSecao}>
          Referenciais pedagógicos
        </h2>
        <p className={styles.introducaoSecao}>
          Origem das <b>diretrizes do DUA</b> e de práticas educacionais para estudantes neurodivergentes.
        </p>
        <TabelaDados
          caption="Referenciais pedagógicos da base documental"
          columns={COLUMNS}
          rows={DOCUMENTOS_PEDAGOGICOS}
        />
      </section>

      <section aria-labelledby="rsl" className={styles.secao}>
        <h2 id="rsl" className={styles.tituloSecao}>
          Revisão sistemática
        </h2>
        <p className={styles.texto}>
          Os desafios (D1 a D10), as estratégias (E1 a E10) e as práticas identificadas nos 38 estudos vêm da revisão
          sistemática de Teixeira <i>et al.</i> (2026a), conduzida segundo Kitchenham e Charters (2007) e relatada
          conforme o PRISMA 2020.
        </p>
        <div id="desafios" className={styles.tabelaRsl}>
          <TabelaDados caption="Desafios D1 a D10 de Teixeira et al. (2026a)" columns={RSL_COLUMNS} rows={DESAFIOS} />
        </div>
        <div id="estrategias" className={styles.tabelaRsl}>
          <TabelaDados caption="Estratégias E1 a E10 de Teixeira et al. (2026a)" columns={RSL_COLUMNS} rows={ESTRATEGIAS} />
        </div>
      </section>

      <section aria-labelledby="referencias" className={`${styles.secao} ${styles.ultima}`}>
        <h2 id="referencias" className={styles.tituloSecao}>
          Referências
        </h2>
        <ul className={styles.referencias}>
          {REFERENCIAS.map((ref) => (
            <li key={ref}>{ref}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
