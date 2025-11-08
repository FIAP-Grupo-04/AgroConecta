// src/components/marketplace/ProductFormModal.jsx
import { useEffect, useMemo, useState } from "react";
import { loadCotacoes } from "../../utils/quotes";
import { useToast } from "../ui/Toast";

export default function ProductFormModal({
  open,
  onClose,
  onSubmit,
  initialCategory,
}) {
  const username = "Edson";
  const { toast } = useToast?.() || { toast: () => {} };

  const [mode, setMode] = useState("venda");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(initialCategory || "");
  const [location, setLocation] = useState("");
  const [isUgly, setIsUgly] = useState(false);
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [stock, setStock] = useState("");
  const [phone, setPhone] = useState("");
  const [quotesMap, setQuotesMap] = useState({});
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const q = await loadCotacoes();
      setQuotesMap(q || {});
    })();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setMode("venda");
    setTitle("");
    setCategory(initialCategory || "");
    setLocation("");
    setIsUgly(false);
    setPrice("");
    setUnit("");
    setStock("");
    setPhone("");
    setQuote(null);
  }, [open, initialCategory]);

  useEffect(() => {
    if (!category || mode === "doacao") {
      setQuote(null);
      return;
    }
    setQuote(quotesMap[category] || null);
  }, [category, mode, quotesMap]);

  const isDonation = mode === "doacao";

  const categoryOptions = [
    "Hortifruti",
    "Grãos e Cereais",
    "Laticínios",
    "Carnes e Ovos",
    "Flores e Plantas",
    "Outros",
  ];
  const unitOptions = ["kg", "cx", "un", "lt", "saca", "dz"];

  function applyQuote() {
    if (!quote) return;
    if (quote.precoMedio != null) setPrice(String(quote.precoMedio));
    if (quote.unidade) setUnit(quote.unidade);
    toast("Preço sugerido aplicado", "success");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return toast("Informe um título.", "error");
    if (!category.trim()) return toast("Escolha uma categoria.", "error");
    if (!location.trim()) return toast("Informe a localidade.", "error");
    if (!phone.trim()) return toast("Informe o número de WhatsApp.", "error");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10)
      return toast(
        "WhatsApp inválido. Use DDD + número (ex.: 11988887777).",
        "error"
      );

    let priceNum = null;
    let stockNum = null;
    if (!isDonation) {
      if (!price) return toast("Informe o preço.", "error");
      if (!unit.trim()) return toast("Escolha a unidade.", "error");
      if (!stock) return toast("Informe o estoque.", "error");
      priceNum = Number(String(price).replace(",", "."));
      stockNum = Number(stock);
      if (Number.isNaN(priceNum) || priceNum <= 0)
        return toast("Preço inválido.", "error");
      if (Number.isNaN(stockNum) || stockNum < 1)
        return toast("Estoque inválido.", "error");
    }

    const newProduct = {
      title: title.trim(),
      category: category.trim(),
      unit: isDonation ? null : unit.trim(),
      price: isDonation ? null : priceNum,
      stock: isDonation ? null : stockNum,
      location: location.trim(),
      isUgly: !!isUgly,
      isDonation,
      producer: {
        id: crypto.randomUUID(),
        name: username,
        location: location.trim(),
        contactUrl: `https://wa.me/55${cleanPhone}`,
      },
      createdAt: new Date().toISOString(),
    };

    onSubmit(newProduct, isDonation);
    toast(isDonation ? "Doação publicada!" : "Produto publicado!", "success");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="agc-modal">
      <div className="agc-modal-backdrop" onClick={onClose} />
      <div
        className="agc-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Publicar item"
      >
        <div className="agc-modal-header">
          <strong>Publicar item</strong>
          <button
            className="agc-drawer-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form className="agc-modal-body" onSubmit={handleSubmit}>
          {/* tipo */}
          <div className="agc-row">
            <label className="agc-label">Tipo</label>
            <div className="agc-toggle">
              <button
                type="button"
                className={`agc-toggle-btn ${
                  mode === "venda" ? "is-active" : ""
                }`}
                onClick={() => setMode("venda")}
              >
                Venda
              </button>
              <button
                type="button"
                className={`agc-toggle-btn ${
                  mode === "doacao" ? "is-active" : ""
                }`}
                onClick={() => setMode("doacao")}
              >
                Doação
              </button>
            </div>
          </div>

          {/* título */}
          <div className="agc-row">
            <label className="agc-label">Título</label>
            <input
              className="agc-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Tomate Italiano"
            />
          </div>

          {/* categoria/localidade */}
          <div className="agc-grid-2">
            <div className="agc-row">
              <label className="agc-label">Categoria</label>
              <select
                className="agc-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Selecione...</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="agc-row">
              <label className="agc-label">Localidade</label>
              <input
                className="agc-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cidade/UF"
              />
            </div>
          </div>

          {/* cotação */}
          {!isDonation && quote && (
            <div className="agc-quote">
              <div>
                <b>Sugestão para {category}:</b>{" "}
                {quote.precoMedio != null
                  ? `R$ ${Number(quote.precoMedio).toFixed(2)}`
                  : "—"}
                {quote.unidade ? ` / ${quote.unidade}` : ""}
              </div>
              <div className="agc-quote-actions">
                <button
                  type="button"
                  className="agc-btn agc-btn--ghost"
                  onClick={applyQuote}
                >
                  Usar preço sugerido
                </button>
              </div>
            </div>
          )}

          {!isDonation && (
            <div className="agc-grid-3">
              <div className="agc-row">
                <label className="agc-label">Preço</label>
                <input
                  className="agc-input"
                  inputMode="decimal"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex.: 5.50"
                />
              </div>
              <div className="agc-row">
                <label className="agc-label">Unidade</label>
                <select
                  className="agc-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <div className="agc-row">
                <label className="agc-label">Estoque</label>
                <input
                  className="agc-input"
                  inputMode="numeric"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Ex.: 30"
                />
              </div>
            </div>
          )}

          {/* fora do padrão */}
          <label className="agc-checkbox" style={{ marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={isUgly}
              onChange={(e) => setIsUgly(e.target.checked)}
            />
            <span>Produto “Fora do padrão”</span>
          </label>

          {/* whatsapp */}
          <div className="agc-row">
            <label className="agc-label">
              WhatsApp (somente números com DDD)
            </label>
            <input
              className="agc-input"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="11988887777"
            />
          </div>

          <div className="agc-muted" style={{ fontSize: 13, marginTop: -6 }}>
            Publicando como: <strong>{username}</strong>
          </div>

          <div className="agc-modal-footer">
            <button
              type="button"
              className="agc-btn agc-btn--ghost"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="agc-btn">
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
