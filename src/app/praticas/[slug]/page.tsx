import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { NavegacaoPaginas } from "@/components/NavegacaoPaginas/NavegacaoPaginas";
import { FichaPratica } from "@/components/FichaPratica/FichaPratica";
import { LeitorPratica } from "@/components/LeitorPratica/LeitorPratica";
import { GRUPOS, buscarGrupo } from "@/data/praticas";
import styles from "./page.module.css";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GRUPOS.map((group) => ({ slug: group.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const group = buscarGrupo((await params).slug);
  return { title: group?.title ?? "Prática não encontrada" };
}

export default function PraticaPage({ params }: PageProps) {
  return (
    <div className="container">
      <Suspense>
        <ConteudoPratica params={params} />
      </Suspense>
    </div>
  );
}

async function ConteudoPratica({ params }: PageProps) {
  const { slug } = await params;
  const group = buscarGrupo(slug);
  if (!group) notFound();

  const index = GRUPOS.indexOf(group);
  const previous = GRUPOS[index - 1];
  const next = GRUPOS[index + 1];

  return (
    <LeitorPratica
      breadcrumb={[{ label: "Início", href: "/" }, { label: "Práticas", href: "/praticas" }, { label: group.title }]}
      toc={group.practices.map((practice) => ({ href: `#${practice.id}`, label: practice.title }))}
    >
      <h1 className={styles.titulo}>{group.title}</h1>
      <p className={styles.objetivo}>
        <b>Objetivo desta página:</b> {group.goal}
      </p>

      <section aria-labelledby="resumo" className={styles.resumo}>
        <h2 id="resumo" className={styles.tituloResumo}>
          Em resumo
        </h2>
        <ul className={styles.listaResumo}>
          {group.summary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className={styles.cartoes}>
        {group.practices.map((practice, position) => (
          <FichaPratica key={practice.id} practice={practice} defaultOpen={position === 0} />
        ))}
      </div>

      <NavegacaoPaginas
        previous={previous ? { href: `/praticas/${previous.slug}`, title: previous.title } : { href: "/praticas", title: "Todas as práticas" }}
        next={next ? { href: `/praticas/${next.slug}`, title: next.title } : { href: "/praticas", title: "Todas as práticas" }}
      />
    </LeitorPratica>
  );
}
