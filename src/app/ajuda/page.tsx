import type { Metadata } from "next";
import Link from "next/link";
import { Selo } from "@/components/Selo/Selo";
import { Trilha } from "@/components/Trilha/Trilha";
import { TabelaDados, type Coluna } from "@/components/TabelaDados/TabelaDados";
import { SumarioPagina } from "@/components/SumarioPagina/SumarioPagina";
import { DuasColunas } from "@/components/DuasColunas/DuasColunas";
import type { TipoOrientacao } from "@/data/tipos";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Ajuda" };

const AJUSTES_COLUMNS: Coluna[] = [
  { key: "ajuste", header: "Ajuste", width: "190px", align: "center" },
  { key: "efeito", header: "O que faz" },
];

const AJUSTES = [
  { ajuste: "Tema", efeito: "Claro, Suave (fundo mais quente e menos brilhante) ou Escuro." },
  { ajuste: "Tamanho do texto", efeito: "100%, 125%, 150% ou 200%." },
  { ajuste: "Espaçamento", efeito: "Amplia o espaço entre letras e entre palavras." },
  { ajuste: "Largura da linha", efeito: "Deixa as linhas mais curtas." },
  { ajuste: "Reduzir movimento", efeito: "Desliga transições e animações." },
  { ajuste: "Modo foco", efeito: "Abre a tela cheia e esconde o menu lateral, a linha “Você está em” e o rodapé, deixando só o texto. Esc sai do modo." },
  { ajuste: "Restaurar padrão", efeito: "Volta todos os ajustes ao início." },
];

const SELOS: { type: TipoOrientacao; text: string }[] = [
  {
    type: "normativa",
    text: "Requisito de norma técnica (níveis A e AA). Precisa ser cumprido para a conformidade com a ABNT NBR 17225.",
  },
  {
    type: "tecnica",
    text: "Recomendação de norma ou referencial técnico. É esperada, mas não exigida em todos os contextos.",
  },
  { type: "dua", text: "Orientação pedagógica do Desenho Universal para a Aprendizagem (CAST, 2024)." },
  {
    type: "juridico",
    text: "Direito previsto em lei que sustenta a prática. A lei não define como a interface deve ser.",
  },
  {
    type: "proposta",
    text: "Aplicação formulada neste guia a partir das fontes. Não é uma exigência de nenhum documento.",
  },
];

export default function AjudaPage() {
  return (
    <div className="container">
      <Trilha items={[{ label: "Início", href: "/" }, { label: "Ajuda" }]} />
      <div className={styles.espacador} />

      <DuasColunas
        stickySidebar
        sidebar={
          <SumarioPagina
            items={[
              { href: "#navegar", label: "Como navegar" },
              { href: "#ajustes", label: "Ajustes de leitura" },
              { href: "#selos", label: "O que significam os selos" },
              { href: "#teclado", label: "Usar pelo teclado" },
            ]}
          />
        }
      >
        <h1 className={styles.titulo}>Ajuda</h1>
        <p className={styles.introducao}>Como encontrar uma prática, ajustar a leitura e entender cada parte de uma ficha.</p>

        <section id="navegar" aria-labelledby="navegar-titulo" className={styles.secao}>
          <h2 id="navegar-titulo" className={styles.tituloSecao}>
            Como navegar
          </h2>
          <ul className={styles.lista}>
            <li>
              <b>Menu no topo:</b> igual em todas as páginas, na mesma ordem.
            </li>
            <li>
              <b>Três caminhos até uma prática:</b> o menu Práticas, os filtros (por tipo, desafio ou estratégia) e a busca.
            </li>
            <li>
              <b>Linha “Você está em”:</b> mostra onde você está e leva de volta às páginas anteriores.
            </li>
            <li>
              <b>“Nesta página”:</b> lista as fichas da página, marca com “lida” as que você leu até o fim nesta visita e mostra seu progresso.
            </li>
            <li>
              <b>Anterior e Próxima:</b> no fim de cada página, com o título da página de destino.
            </li>
            <li>
              <b>Termos sublinhados com pontos:</b> abrem a definição do glossário por clique; o balão fica aberto até
              você escolher “Fechar” ou apertar Esc.
            </li>
          </ul>
        </section>

        <section id="ajustes" aria-labelledby="ajustes-titulo" className={styles.secao}>
          <h2 id="ajustes-titulo" className={styles.tituloSecao}>
            Ajustes de leitura
          </h2>
          <p className={styles.texto}>
            O botão <b>Ajustes de leitura</b> fica sempre no mesmo lugar, no topo. Ele abre um painel ao lado do texto,
            sem cobrir a página.
          </p>
          <TabelaDados caption="Opções do painel de ajustes de leitura" columns={AJUSTES_COLUMNS} rows={AJUSTES} />
        </section>

        <section id="selos" aria-labelledby="selos-titulo" className={styles.secao}>
          <h2 id="selos-titulo" className={styles.tituloSecao}>
            O que significam os selos
          </h2>
          <p className={styles.texto}>Cada ficha tem um selo que mostra a força da orientação.</p>
          <dl className={styles.selos}>
            {SELOS.map((selo) => (
              <div key={selo.type} className={styles.linhaSelo}>
                <dt className={styles.termoSelo}>
                  <Selo type={selo.type} />
                </dt>
                <dd className={styles.textoSelo}>{selo.text}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.texto}>
            Os códigos <b>D1</b> a <b>D10</b> e <b>E1</b> a <b>E10</b> indicam o desafio e a estratégia da revisão
            sistemática a que a prática se liga. Veja o <Link href="/glossario">Glossário</Link>.
          </p>
        </section>

        <section id="teclado" aria-labelledby="teclado-titulo" className={`${styles.secao} ${styles.ultima}`}>
          <h2 id="teclado-titulo" className={styles.tituloSecao}>
            Usar pelo teclado
          </h2>
          <ul className={styles.lista}>
            <li>
              <b>Tab</b> avança para o próximo link ou botão; <b>Shift + Tab</b> volta.
            </li>
            <li>
              <b>Enter</b> abre links; <b>Enter</b> ou <b>Espaço</b> acionam botões.
            </li>
            <li>
              O primeiro Tab de cada página mostra o link <b>Ir para o conteúdo</b>, que pula o menu.
            </li>
            <li>O elemento em foco ganha uma moldura colorida bem visível.</li>
          </ul>
        </section>
      </DuasColunas>
    </div>
  );
}
