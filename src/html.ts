import type { Category } from "./types";

function buildCategoryOptions(categories: Category[]): string {
  // Raíces primero, luego hijos indentados
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
  <title>Escriba — TuPeriódico</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
      background: #f5f2ed;
      color: #1a1a1a;
      min-height: 100vh;
      padding: 2rem 1rem;
    }
    .container { max-width: 680px; margin: 0 auto; }
    header {
      border-bottom: 2px solid #1a1a1a;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }
    header h1 { font-size: 1.5rem; letter-spacing: 0.05em; text-transform: uppercase; }
    header p { font-size: 0.85rem; color: #555; margin-top: 0.25rem; font-family: sans-serif; }
    .author-badge {
      display: inline-block;
      background: #1a1a1a;
      color: #f5f2ed;
      font-family: sans-serif;
      font-size: 0.8rem;
      padding: 0.2rem 0.6rem;
      margin-top: 0.5rem;
    }
    .field { margin-bottom: 1.5rem; }
    label {
      display: block;
      font-family: sans-serif;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #555;
      margin-bottom: 0.4rem;
    }
    input[type="text"], textarea, select {
      width: 100%;
      border: 1px solid #ccc;
      background: #fff;
      font-family: Georgia, serif;
      font-size: 1rem;
      padding: 0.6rem 0.8rem;
      color: #1a1a1a;
      appearance: none;
    }
    input[type="text"]:focus, textarea:focus, select:focus {
      outline: 2px solid #1a1a1a;
      outline-offset: -1px;
    }
    textarea { resize: vertical; line-height: 1.6; }
    textarea#cuerpo { min-height: 280px; font-size: 0.95rem; }
    textarea#imagen_sugerida { min-height: 60px; font-size: 0.9rem; }
    select { cursor: pointer; }
    .hint {
      font-family: sans-serif;
      font-size: 0.75rem;
      color: #888;
      margin-top: 0.3rem;
    }
    .error {
      background: #fee;
      border: 1px solid #c00;
      color: #c00;
      font-family: sans-serif;
      font-size: 0.85rem;
      padding: 0.8rem 1rem;
      margin-bottom: 1.5rem;
    }
    button[type="submit"] {
      width: 100%;
      background: #1a1a1a;
      color: #f5f2ed;
      border: none;
      font-family: sans-serif;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 0.9rem;
      cursor: pointer;
      margin-top: 0.5rem;
    }
    button[type="submit"]:hover { background: #333; }
    button[type="submit"]:disabled { background: #999; cursor: not-allowed; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Escriba</h1>
      <p>Envío de artículos — TuPeriódico</p>
      <span class="author-badge">${authorName}</span>
    </header>

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
          placeholder="Describe en lenguaje natural la imagen que imaginas para este artículo. El director decidirá."></textarea>
        <p class="hint">No es obligatorio. No subas imágenes — solo describe lo que tienes en mente.</p>
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
  <style>
    body {
      font-family: Georgia, serif;
      background: #f5f2ed;
      color: #1a1a1a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .box { max-width: 480px; text-align: center; }
    .check { font-size: 3rem; margin-bottom: 1rem; }
    h1 { font-size: 1.4rem; margin-bottom: 0.5rem; }
    p { font-family: sans-serif; font-size: 0.9rem; color: #555; margin-bottom: 1.5rem; }
    a {
      font-family: sans-serif;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1a1a1a;
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
