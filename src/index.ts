import { getEmailFromJwt } from "./auth";
import { getBylineByEmail, getCategories, insertArticle } from "./db";
import { notificar } from "./telegram";
import { renderForm, renderConfirmacion } from "./html";
import type { Env, SubmitData } from "./types";

const html = (body: string) =>
  new Response(body, { headers: { "Content-Type": "text/html; charset=UTF-8" } });

const err = (msg: string, status = 403) =>
  new Response(msg, { status, headers: { "Content-Type": "text/plain; charset=UTF-8" } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // --- PROTECCIÓN CLOUDFLARE ACCESS (reactivar tras pruebas) ---
    // const email = getEmailFromJwt(request);
    // if (!email) {
    //   return err("Acceso no autorizado. Identidad no detectada.", 401);
    // }
    // const byline = await getBylineByEmail(env, email);
    // if (!byline) {
    //   return err("Tu perfil editorial no está configurado. Contacta con la redacción.", 403);
    // }
    // --- FIN PROTECCIÓN ---

    // Bypass temporal para pruebas: email fijo hasta configurar Zero Trust
    const email = "gorka@sinum.info";
    const byline = await getBylineByEmail(env, email);
    if (!byline) {
      return err(
        "Tu perfil editorial no está configurado. Contacta con la redacción.",
        403
      );
    }

    if (request.method === "GET") {
      const categories = await getCategories(env);
      return html(renderForm(byline.display_name, categories));
    }

    if (request.method === "POST") {
      const formData = await request.formData();

      const data: SubmitData = {
        titulo: (formData.get("titulo") as string ?? "").trim(),
        entradilla: (formData.get("entradilla") as string ?? "").trim(),
        cuerpo: (formData.get("cuerpo") as string ?? "").trim(),
        imagen_sugerida: (formData.get("imagen_sugerida") as string ?? "").trim(),
        categoria_id: (formData.get("categoria_id") as string ?? "").trim(),
      };

      if (!data.titulo || !data.entradilla || !data.cuerpo || !data.categoria_id) {
        const categories = await getCategories(env);
        return html(renderForm(byline.display_name, categories, "Faltan campos obligatorios."));
      }

      await insertArticle(env, byline, data);

      // Obtener label de categoría para la notificación
      const categories = await getCategories(env);
      const categoria = categories.find((c) => c.id === data.categoria_id);

      await notificar(env, byline, data, categoria?.label ?? data.categoria_id);

      return html(renderConfirmacion(byline.display_name, data.titulo));
    }

    return err("Método no permitido.", 405);
  },
};
