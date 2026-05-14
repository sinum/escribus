// Decodifica el JWT de Cloudflare Access sin verificar firma —
// la validación ya la hizo Access antes de llegar al Worker.
export function getEmailFromJwt(request: Request): string | null {
  const jwt = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!jwt) return null;

  const parts = jwt.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.email ?? null;
  } catch {
    return null;
  }
}
