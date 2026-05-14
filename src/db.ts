import { ulid } from "ulidx";
import type { Env, Byline, Category, SubmitData } from "./types";

export async function getBylineByEmail(env: Env, email: string): Promise<Byline | null> {
  const row = await env.DB
    .prepare(`
      SELECT b.id, b.display_name
      FROM _emdash_bylines b
      JOIN users u ON u.id = b.user_id
      WHERE u.email = ?
    `)
    .bind(email)
    .first<{ id: string; display_name: string }>();

  return row ? { id: row.id, display_name: row.display_name } : null;
}

export async function getCategories(env: Env): Promise<Category[]> {
  const { results } = await env.DB
    .prepare(`
      SELECT id, slug, label, parent_id
      FROM taxonomies
      WHERE name = 'category'
      ORDER BY parent_id NULLS FIRST, label ASC
    `)
    .all<Category>();

  return results;
}

export async function insertArticle(
  env: Env,
  byline: Byline,
  data: SubmitData
): Promise<string> {
  const postId = ulid();
  const revisionId = ulid();
  const now = new Date().toISOString();

  // Generar slug desde el titular
  const slug = data.titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  // Convertir cuerpo de texto plano a PortableText mínimo
  const content = data.cuerpo
    .split(/\n\n+/)
    .filter(Boolean)
    .map((text, i) => ({
      _type: "block",
      _key: `key-${i}`,
      style: "normal",
      children: [{ _type: "span", _key: `span-${i}`, text: text.trim() }],
    }));

  const revisionData = JSON.stringify({
    title: data.titulo,
    excerpt: data.entradilla,
    content,
    featured_image: null,
  });

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO revisions (id, collection, entry_id, data, author_id, created_at)
      VALUES (?, 'posts', ?, ?, ?, ?)
    `).bind(revisionId, postId, revisionData, byline.id, now),

    env.DB.prepare(`
      INSERT INTO ec_posts (
        id, slug, status, title, excerpt, content,
        draft_revision_id, primary_byline_id, locale,
        created_at, updated_at
      ) VALUES (?, ?, 'draft', ?, ?, ?, ?, ?, 'es', ?, ?)
    `).bind(
      postId, slug, data.titulo, data.entradilla,
      JSON.stringify(content), revisionId, byline.id, now, now
    ),

    env.DB.prepare(`
      INSERT INTO content_taxonomies (collection, entry_id, taxonomy_id)
      VALUES ('posts', ?, ?)
    `).bind(postId, data.categoria_id),
  ]);

  return postId;
}
