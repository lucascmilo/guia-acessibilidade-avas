import styles from "./TabelaDados.module.css";

export type Coluna = {
  key: string;
  header: string;
  width?: string;
  align?: "left" | "center";
};

type TabelaDadosProps = {
  caption: string;
  columns: Coluna[];
  rows: Record<string, string>[];
};

export function TabelaDados({ caption, columns, rows }: TabelaDadosProps) {
  return (
    <div className={styles.envoltorio}>
      <table className={styles.tabela}>
        <caption className="visually-hidden">{caption}</caption>
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} style={col.width ? { width: col.width } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className={col.align === "center" ? styles.centro : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[columns[0].key]}>
              {columns.map((col, index) => {
                const className = col.align === "center" ? styles.centro : undefined;
                return index === 0 ? (
                  <th key={col.key} scope="row" className={`${styles.cabecalhoLinha} ${className ?? ""}`}>
                    {row[col.key]}
                  </th>
                ) : (
                  <td key={col.key} className={className}>
                    {row[col.key]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
