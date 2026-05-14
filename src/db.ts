import { ulid } from "ulidx";
import type { Env, SubmitData } from "./types";

export async function insertArticle(
  env: Env,
  data: SubmitData
): Promise<string> {
  const postId = ulid();
  const revisionId = ulid();
  const now = new Date().toISOString();

  const slug = data.titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

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
      VALUES (?, 'posts', ?, ?, NULL, ?)
    `).bind(revisionId, postId, revisionData, now),

    env.DB.prepare(`
      INSERT INTO ec_posts (
        id, slug, status, title, excerpt, content,
        draft_revision_id, primary_byline_id, locale,
        created_at, updated_at
      ) VALUES (?, ?, 'draft', ?, ?, ?, ?, NULL, 'es', ?, ?)
    `).bind(
      postId, slug, data.titulo, data.entradilla,
      JSON.stringify(content), revisionId, now, now
    ),
  ]);

  return postId;
}
