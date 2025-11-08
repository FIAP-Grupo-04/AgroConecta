// src/utils/quotes.js
/**
 * Tenta buscar dados de cotação a partir de possíveis caminhos do projeto.
 * Aceita formatos como:
 * [{ categoria: "Hortifruti", precoMedio: 5.4, unidade: "kg" }, ...]
 * ou
 * { "Hortifruti": { precoMedio: 5.4, unidade: "kg" }, ... }
 */
export async function loadCotacoes() {
  const candidates = [
    "/data/cotacoes.json",
    "/data/market-prices.json",
    "/cotacoes.json",
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      return normalize(data);
    } catch (e) {
      // tenta próximo
    }
  }
  return {}; // sem cotações
}

function normalize(raw) {
  // caso já esteja no formato objeto {categoria: {precoMedio, unidade}}
  if (raw && !Array.isArray(raw) && typeof raw === "object") return raw;

  // caso seja array
  if (Array.isArray(raw)) {
    const out = {};
    raw.forEach((item) => {
      const cat =
        item.categoria || item.category || item.setor || item.nome || "Outros";
      const preco =
        item.precoMedio ?? item.preco ?? item.media ?? item.valor ?? null;
      const unidade = item.unidade || item.unit || item.medida || null;
      if (cat) out[cat] = { precoMedio: toNumber(preco), unidade };
    });
    return out;
  }

  return {};
}

function toNumber(x) {
  if (x == null) return null;
  const n = Number(String(x).replace(",", "."));
  return Number.isNaN(n) ? null : n;
}
