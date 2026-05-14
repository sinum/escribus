export interface Env {
  DB: D1Database;
  TELEGRAM_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}


export interface SubmitData {
  titulo: string;
  entradilla: string;
  cuerpo: string;
  imagen_sugerida: string;
}
