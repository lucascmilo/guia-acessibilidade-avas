export type Tema = "claro" | "suave" | "escuro";
export type TamanhoTexto = 100 | 125 | 150 | 200;
export type Espacamento = "padrao" | "ampliado";
export type LarguraLinha = "padrao" | "estreita";

export type EstadoAjustes = {
  theme: Tema;
  textSize: TamanhoTexto;
  spacing: Espacamento;
  lineWidth: LarguraLinha;
  reduceMotion: boolean;
  focusMode: boolean;
};

export const AJUSTES_PADRAO: EstadoAjustes = {
  theme: "claro",
  textSize: 100,
  spacing: "padrao",
  lineWidth: "padrao",
  reduceMotion: false,
  focusMode: false,
};

export const CHAVE_ARMAZENAMENTO = "guia-ava-ajustes";

export const OPCOES_TEMA: { value: Tema; label: string }[] = [
  { value: "claro", label: "Claro" },
  { value: "suave", label: "Suave" },
  { value: "escuro", label: "Escuro" },
];

export const OPCOES_TAMANHO: { value: TamanhoTexto; label: string }[] = [
  { value: 100, label: "100%" },
  { value: 125, label: "125%" },
  { value: 150, label: "150%" },
  { value: 200, label: "200%" },
];

export const OPCOES_ESPACAMENTO: { value: Espacamento; label: string }[] = [
  { value: "padrao", label: "Padrão" },
  { value: "ampliado", label: "Ampliado" },
];

export const OPCOES_LARGURA: { value: LarguraLinha; label: string }[] = [
  { value: "padrao", label: "Padrão" },
  { value: "estreita", label: "Estreita" },
];

export function aplicarAjustesNoDocumento(settings: EstadoAjustes) {
  const root = document.documentElement;
  root.dataset.theme = settings.theme;
  root.dataset.textSize = String(settings.textSize);
  root.dataset.spacing = settings.spacing;
  root.dataset.lineWidth = settings.lineWidth;
  if (settings.reduceMotion) root.dataset.reduceMotion = "true";
  else delete root.dataset.reduceMotion;
  if (settings.focusMode) root.dataset.focusMode = "true";
  else delete root.dataset.focusMode;
}

export const SCRIPT_SEM_PISCAR = `try{var s=JSON.parse(localStorage.getItem("${CHAVE_ARMAZENAMENTO}")||"null");if(s){var r=document.documentElement;r.dataset.theme=s.theme||"claro";r.dataset.textSize=String(s.textSize||100);r.dataset.spacing=s.spacing||"padrao";r.dataset.lineWidth=s.lineWidth||"padrao";if(s.reduceMotion)r.dataset.reduceMotion="true";}}catch(e){}`;
