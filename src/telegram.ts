import type { Env, SubmitData } from "./types";

export async function notificar(
  env: Env,
  email: string,
  data: SubmitData
): Promise<void> {
  const mensaje =
    `📝 <b>Nuevo artículo pendiente de revisión</b>\n\n` +
    `✍️ ${email}\n\n` +
    `<b>${data.titulo}</b>\n` +
    `${data.entradilla}\n` +
    (data.imagen_sugerida
      ? `\n🖼 <i>Imagen sugerida:</i> ${data.imagen_sugerida}\n`
      : "") +
    `\nRevisar en EmDash → https://lemma.tuperiodico.soy/_emdash/admin`;

  await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: mensaje,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    }
  );
}
