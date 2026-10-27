import {
  IconeCheck,
  IconePasta,
  IconeInfo,
  IconeQuadrado,
  IconeTriangulo,
} from "@/components/Icones/Icones";
import { DESAFIOS } from "@/data/desafios";
import { ESTRATEGIAS } from "@/data/estrategias";
import type { TipoOrientacao } from "@/data/tipos";
import styles from "./Selo.module.css";

const CONFIG: Record<TipoOrientacao, { label: string; Icon: typeof IconeCheck }> = {
  normativa: { label: "Exigência normativa", Icon: IconeCheck },
  tecnica: { label: "Recomendação técnica", Icon: IconeInfo },
  dua: { label: "Diretriz do DUA", Icon: IconeTriangulo },
  juridico: { label: "Fundamento jurídico", Icon: IconePasta },
  proposta: { label: "Proposta para AVAs", Icon: IconeQuadrado },
};

export function Selo({ type, size = "medio" }: { type: TipoOrientacao; size?: "pequeno" | "medio" }) {
  const { label, Icon } = CONFIG[type];
  return (
    <span className={`${styles.selo} ${styles[type]} ${styles[size]}`}>
      <Icon size={size === "pequeno" ? 14 : 16} />
      {label}
    </span>
  );
}

export function EtiquetaCodigo({ code, size = "medio" }: { code: string; size?: "pequeno" | "medio" }) {
  const name = [...DESAFIOS, ...ESTRATEGIAS].find((item) => item.code === code)?.label;
  const kind = code.startsWith("E") ? "Estratégia" : "Desafio";
  return (
    <span className={`${styles.codigo} ${styles[size]}`}>
      <span aria-hidden={name ? true : undefined}>{code}</span>
      {name && <span className="visually-hidden">{`${kind} ${code}: ${name}`}</span>}
    </span>
  );
}
