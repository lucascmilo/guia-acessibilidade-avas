import type { Metadata } from "next";
import { Suspense } from "react";
import { Trilha } from "@/components/Trilha/Trilha";
import { ExploradorPraticas, ExploradorPraticasDaUrl } from "@/components/ExploradorPraticas/ExploradorPraticas";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Práticas" };

export default function PraticasPage() {
  return (
    <div className="container">
      <Trilha items={[{ label: "Início", href: "/" }, { label: "Práticas" }]} />

      <h1 className={styles.titulo}>Práticas</h1>
      <p className={styles.introducao}>
        Filtre por tipo de orientação, desafio ou estratégia. Os filtros só mudam a lista quando você clicar em
        “Aplicar filtros”.
      </p>

      <Suspense fallback={<ExploradorPraticas />}>
        <ExploradorPraticasDaUrl />
      </Suspense>
    </div>
  );
}
