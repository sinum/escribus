export interface Env {
  DB: D1Database;
  TELEGRAM_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

export interface Category {
  id: string;
  slug: string;
  label: string;
  parent_id: string | null;
}

export interface Byline {
  id: string;
  display_name: string;
}

export interface SubmitData {
  titulo: string;
  entradilla: string;
  cuerpo: string;
  imagen_sugerida: string;
  categoria_id: string;
}
