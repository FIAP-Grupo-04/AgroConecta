// src/components/marketplace/ProductCard.jsx
import { useState } from "react";

export default function ProductCard({
  product,
  mode, // "comprar" | "doar"
  onAddPurchase,
  onAddDonation,
}) {
  const [qty, setQty] = useState(1);

  function inc() {
    if (product.stock == null) return;
    setQty((n) => Math.min(n + 1, product.stock));
  }
  function dec() {
    setQty((n) => Math.max(1, n - 1));
  }
  function addPurchase() {
    const validQty = Math.max(1, Math.min(qty, product.stock ?? 1));
    onAddPurchase(product.id, validQty);
    setQty(1);
  }
  function addDonation() {
    onAddDonation(product.id);
  }

  return (
    <li className="agc-card">
      {/* meta e título */}
      <div className="agc-meta">
        {product.category} • {product.location}
      </div>
      <h3 className="agc-name">{product.title}</h3>

      {/* badges */}
      <div className="agc-badges">
        {product.isUgly && (
          <span className="agc-badge agc-badge--ugly">Fora do padrão</span>
        )}
        {product.isDonation && (
          <span className="agc-badge agc-badge--donation">Doação</span>
        )}
      </div>

      {/* conteúdo por modo */}
      {mode === "comprar" ? (
        <>
          <div className="agc-muted" style={{ marginBottom: 8 }}>
            Preço:{" "}
            <span className="agc-price">R$ {product.price?.toFixed(2)}</span>
            {product.unit ? ` / ${product.unit}` : ""}
          </div>
          <div className="agc-muted" style={{ marginBottom: 12 }}>
            Estoque: {product.stock}
          </div>

          <div className="agc-qty">
            <button className="agc-qty-btn" onClick={dec}>
              −
            </button>
            <input
              className="agc-qty-input"
              type="number"
              min={1}
              max={product.stock ?? undefined}
              value={qty}
              onChange={(e) =>
                setQty(
                  Math.max(
                    1,
                    Math.min(Number(e.target.value) || 1, product.stock ?? 1)
                  )
                )
              }
            />
            <button className="agc-qty-btn" onClick={inc}>
              +
            </button>
          </div>

          <button
            className="agc-btn"
            style={{ width: "100%" }}
            onClick={addPurchase}
          >
            Adicionar
          </button>
        </>
      ) : (
        <>
          <div className="agc-muted" style={{ marginBottom: 12 }}>
            Combine a retirada diretamente com o produtor.
          </div>
          <button
            className="agc-btn"
            style={{ width: "100%" }}
            onClick={addDonation}
          >
            Solicitar
          </button>
        </>
      )}
    </li>
  );
}
