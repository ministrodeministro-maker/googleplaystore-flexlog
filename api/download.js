export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  try {
    const response = await fetch("https://api.github.com/repos/ministrodeministro-maker/googleplaystore-flexlog/contents/Apk16?ref=main", { headers: { Accept: "application/vnd.github+json", "User-Agent": "FlexLog-Download" } });
    if (!response.ok) return res.status(502).send("Nao foi possivel consultar Apk16.");
    const files = await response.json();
    if (!Array.isArray(files)) return res.status(502).send("Resposta invalida.");
    const apks = files.filter(f => f.type === "file" && f.name.toLowerCase().endsWith(".apk") && f.download_url);
    if (!apks.length) return res.status(404).send("Nenhum APK disponivel na pasta Apk16.");
    const selected = apks.find(f => f.name === "FlexLog Transportes.apk") || apks.sort((a,b) => a.name.localeCompare(b.name))[0];
    return res.redirect(302, selected.download_url);
  } catch (error) { return res.status(502).send("Nao foi possivel localizar o APK."); }
}