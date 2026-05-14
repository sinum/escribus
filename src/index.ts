import { getEmailFromJwt } from "./auth";
import { insertArticle } from "./db";
import { notificar } from "./telegram";
import { renderForm, renderConfirmacion } from "./html";
import type { Env, SubmitData } from "./types";

const html = (body: string) =>
  new Response(body, { headers: { "Content-Type": "text/html; charset=UTF-8" } });

const err = (msg: string, status = 403) =>
  new Response(msg, { status, headers: { "Content-Type": "text/plain; charset=UTF-8" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const email = getEmailFromJwt(request);
    if (!email) {
      return err("Acceso no autorizado. Identidad no detectada.", 401);
    }

    if (request.method === "GET") {
      return html(renderForm(email));
    }

    if (request.method === "POST") {
      const formData = await request.formData();

      const data: SubmitData = {
        titulo: (formData.get("titulo") as string ?? "").trim(),
        entradilla: (formData.get("entradilla") as string ?? "").trim(),
        cuerpo: (formData.get("cuerpo") as string ?? "").trim(),
        imagen_sugerida: (formData.get("imagen_sugerida") as string ?? "").trim(),
      };

      if (!data.titulo || !data.entradilla || !data.cuerpo) {
        return html(renderForm(email, "Faltan campos obligatorios."));
      }

      await insertArticle(env, data);
      await notificar(env, email, data);

      return html(renderConfirmacion(email, data.titulo));
    }

    return err("Método no permitido.", 405);
  },
};
