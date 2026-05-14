import type { Category } from "./types";

function buildCategoryOptions(categories: Category[]): string {
  const roots = categories.filter((c) => !c.parent_id);
  const children = categories.filter((c) => c.parent_id);

  let html = "";
  for (const root of roots) {
    html += `<option value="${root.id}">${root.label}</option>`;
    for (const child of children.filter((c) => c.parent_id === root.id)) {
      html += `<option value="${child.id}">&nbsp;&nbsp;↳ ${child.label}</option>`;
    }
  }
  return html;
}

const CYAN = "oklch(0.7 0.17 241)";
const DARK = "#0d1f2d";
const WHITE = "#ffffff";
const INPUT_BG = "rgba(255,255,255,0.92)";

export function renderForm(
  authorName: string,
  categories: Category[],
  error?: string
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Escribus — TuPeriódico</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      background: ${CYAN};
      color: ${WHITE};
      min-height: 100vh;
      padding: 2.5rem 1rem;
    }
    .container { max-width: 680px; margin: 0 auto; }

    header {
      border-bottom: 2px solid ${WHITE};
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }
    header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 1.6rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: ${WHITE};
    }
    header p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.75);
      margin-top: 0.25rem;
    }
    .author-badge {
      display: inline-block;
      background: ${WHITE};
      color: ${CYAN};
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.2rem 0.7rem;
      margin-top: 0.6rem;
      letter-spacing: 0.04em;
    }

    .intro {
      background: rgba(255,255,255,0.12);
      border-left: 3px solid ${WHITE};
      padding: 1rem 1.2rem;
      margin-bottom: 2rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: ${WHITE};
    }
    .intro strong { font-weight: 700; }

    .field { margin-bottom: 1.5rem; }
    label {
      display: block;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: ${WHITE};
      margin-bottom: 0.4rem;
    }
    input[type="text"], textarea, select {
      width: 100%;
      border: none;
      background: ${INPUT_BG};
      font-family: Georgia, serif;
      font-size: 1rem;
      padding: 0.65rem 0.9rem;
      color: ${DARK};
      appearance: none;
    }
    input[type="text"]:focus, textarea:focus, select:focus {
      outline: 3px solid ${WHITE};
      outline-offset: 0;
    }
    textarea { resize: vertical; line-height: 1.6; }
    textarea#cuerpo { min-height: 280px; font-size: 0.95rem; }
    textarea#imagen_sugerida { min-height: 60px; font-size: 0.9rem; }
    select { cursor: pointer; }
    .hint {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.7);
      margin-top: 0.35rem;
    }
    .error {
      background: rgba(200,0,0,0.15);
      border: 1px solid rgba(255,100,100,0.6);
      color: #ffd0d0;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      padding: 0.8rem 1rem;
      margin-bottom: 1.5rem;
    }
    button[type="submit"] {
      width: 100%;
      background: ${DARK};
      color: ${WHITE};
      border: none;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.95rem;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    button[type="submit"]:hover { background: #1a3a50; }
    button[type="submit"]:disabled { background: rgba(255,255,255,0.2); cursor: not-allowed; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Escribus</h1>
      <p>Envío de artículos — TuPeriódico</p>
      <span class="author-badge">${authorName}</span>
    </header>

    <div class="intro">
      <strong>Solo para articulistas de TuPeriódico.</strong> Lo que escribas aquí llega directamente a redacción como borrador. Nada se publica sin que el director lo haya revisado y aprobado. Escribe con tranquilidad — puedes enviar el artículo aunque no esté del todo pulido, la redacción lo acabará de ajustar.
    </div>

    ${error ? `<div class="error">${error}</div>` : ""}

    <form method="POST" id="form">
      <div class="field">
        <label for="titulo">Titular *</label>
        <input type="text" id="titulo" name="titulo" required maxlength="200" />
      </div>

      <div class="field">
        <label for="entradilla">Entradilla *</label>
        <textarea id="entradilla" name="entradilla" required rows="3"
          placeholder="2–3 líneas que resuman el artículo"></textarea>
      </div>

      <div class="field">
        <label for="cuerpo">Cuerpo del artículo *</label>
        <textarea id="cuerpo" name="cuerpo" required
          placeholder="Escribe el artículo aquí. Separa los párrafos con una línea en blanco."></textarea>
      </div>

      <div class="field">
        <label for="categoria_id">Sección *</label>
        <select id="categoria_id" name="categoria_id" required>
          <option value="">— Elige una sección —</option>
          ${buildCategoryOptions(categories)}
        </select>
      </div>

      <div class="field">
        <label for="imagen_sugerida">Imagen sugerida</label>
        <textarea id="imagen_sugerida" name="imagen_sugerida"
          placeholder="Describe la imagen que imaginas para este artículo. El director decidirá la imagen final."></textarea>
        <p class="hint">Opcional. No subas imágenes, solo describe lo que tienes en mente.</p>
      </div>

      <button type="submit" id="btn">Enviar artículo</button>
    </form>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', function() {
      document.getElementById('btn').disabled = true;
      document.getElementById('btn').textContent = 'Enviando…';
    });
  </script>
</body>
</html>`;
}

export function renderConfirmacion(authorName: string, titulo: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Enviado — TuPeriódico</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" />
  <style>
    body {
      font-family: 'Space Grotesk', sans-serif;
      background: oklch(0.7 0.17 241);
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .box { max-width: 480px; text-align: center; }
    .check { font-size: 3rem; margin-bottom: 1rem; }
    h1 { font-weight: 700; font-size: 1.4rem; margin-bottom: 0.5rem; }
    p { font-size: 0.9rem; color: rgba(255,255,255,0.8); margin-bottom: 1.5rem; line-height: 1.6; }
    a {
      font-weight: 700;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="box">
    <div class="check">✓</div>
    <h1>Artículo enviado</h1>
    <p>«${titulo}» ha llegado a redacción, ${authorName}.<br>El director lo revisará en breve.</p>
    <a href="/">Enviar otro artículo</a>
  </div>
</body>
</html>`;
}
