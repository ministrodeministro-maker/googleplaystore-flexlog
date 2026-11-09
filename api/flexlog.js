export default async function handler(req, res) {
  const rawPath = Array.isArray(req.query.path) ? req.query.path.join("/") : String(req.query.path || "app.php");
  const safePath = rawPath.replace(/^\/+/, "").replace(/\.\.+/g, "");
  const query = new URLSearchParams(req.query);
  query.delete("path");
  const target = `http://191.96.79.101/yaarsa/flexlog/playstore/${safePath}${query.toString() ? `?${query}` : ""}`;
  try {
    const upstream = await fetch(target, { method: req.method, headers: { accept: req.headers.accept || "*/*" } });
    res.status(upstream.status);
    const contentType = upstream.headers.get("content-type");
    const contentLength = upstream.headers.get("content-length");
    if (contentType) res.setHeader("Content-Type", contentType);
    if (contentLength) res.setHeader("Content-Length", contentLength);
    res.setHeader("Cache-Control", "no-store");
    res.send(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    res.status(502).json({ error: "FlexLog origin unavailable" });
  }
}
