const BG = "oklch(0.88 0.085 241)";   // base-950 al 50% de intensidad
const TEXT = "#1a1a1a";
const BORDER_FOCUS = "#1a1a1a";

export function renderForm(authorName: string, error?: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Escribus — TuPeriódico</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Domine:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Domine', Georgia, serif;
      background: ${BG};
      color: ${TEXT};
      min-height: 100vh;
      padding: 2.5rem 1rem;
    }
    .container { max-width: 680px; margin: 0 auto; }

    header {
      border-bottom: 2px solid ${TEXT};
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }
    header h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 1.6rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    header p {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      color: #444;
      margin-top: 0.25rem;
    }
    .header-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.6rem;
    }
    .author-badge {
      display: inline-block;
      background: ${TEXT};
      color: ${BG};
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.2rem 0.7rem;
      letter-spacing: 0.04em;
      border-radius: 999px;
    }
    .logout-btn {
      display: inline-block;
      background: #c0392b;
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.2rem 0.7rem;
      letter-spacing: 0.04em;
      border-radius: 999px;
      text-decoration: none;
    }
    .logout-btn:hover { background: #a93226; }

    .intro {
      background: rgba(255,255,255,0.5);
      border-left: 3px solid ${TEXT};
      padding: 1rem 1.2rem;
      margin-bottom: 2rem;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.9rem;
      line-height: 1.6;
      color: ${TEXT};
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
      color: ${TEXT};
      margin-bottom: 0.4rem;
    }
    input[type="text"], textarea {
      width: 100%;
      border: none;
      border-radius: 8px;
      background: rgba(255,255,255,0.75);
      font-family: 'Domine', Georgia, serif;
      font-size: 1rem;
      padding: 0.65rem 0.9rem;
      color: ${TEXT};
    }
    input[type="text"]:focus, textarea:focus {
      outline: 2px solid ${BORDER_FOCUS};
      outline-offset: 0;
      background: rgba(255,255,255,0.95);
    }
    input[type="text"]::placeholder, textarea::placeholder {
      font-size: 13px;
      color: #777;
    }
    textarea { resize: vertical; line-height: 1.6; }
    textarea#cuerpo { min-height: 280px; }
    textarea#imagen_sugerida { min-height: 60px; }
    .hint {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      color: #555;
      margin-top: 0.35rem;
    }
    .error {
      background: rgba(200,0,0,0.08);
      border: 1px solid rgba(180,0,0,0.3);
      color: #900;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.85rem;
      padding: 0.8rem 1rem;
      margin-bottom: 1.5rem;
    }
    button[type="submit"] {
      width: 100%;
      background: ${TEXT};
      color: #fff;
      border: none;
      border-radius: 8px;
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      padding: 0.95rem;
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
      <h1>Escribus</h1>
      <p>Envío de artículos — TuPeriódico</p>
      <div class="header-meta">
        <span class="author-badge">${authorName}</span>
        <a href="/cdn-cgi/access/logout" class="logout-btn">Cerrar sesión</a>
      </div>
    </header>

    <div class="intro">
      <strong>Solo para articulistas de TuPeriódico.</strong> Lo que escribas aquí llega directamente a redacción como borrador. Nada se publica sin que el director lo haya revisado y aprobado. Escribe con tranquilidad — puedes enviar el artículo aunque no esté del todo pulido, la redacción lo acabará de ajustar.
    </div>

    ${error ? `<div class="error">${error}</div>` : ""}

    <form method="POST" id="form">
      <div class="field">
        <label for="titulo">Título *</label>
        <input type="text" id="titulo" name="titulo" required maxlength="200"
          placeholder="El título del artículo" />
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
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Domine:wght@400;700&family=Space+Grotesk:wght@700&display=swap" />
  <style>
    body {
      font-family: 'Space Grotesk', sans-serif;
      background: oklch(0.88 0.085 241);
      color: #1a1a1a;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .box { max-width: 480px; text-align: center; }
    .check { font-size: 3rem; margin-bottom: 1rem; }
    h1 { font-weight: 700; font-size: 1.4rem; margin-bottom: 0.5rem; }
    p { font-family: 'Domine', serif; font-size: 0.9rem; color: #444; margin-bottom: 1.5rem; line-height: 1.6; }
    a { font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #1a1a1a; }
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
