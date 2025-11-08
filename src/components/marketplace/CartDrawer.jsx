// src/components/marketplace/CartDrawer.jsx
import { useMemo } from "react";
import { useMarketplace } from "../../context/MarketplaceContext";

export default function CartDrawer({ open, onClose }) {
  const {
    activeTab,
    products,
    cartPurchase,
    cartDonation,
    removeFromCartPurchase,
    removeFromCartDonation,
    clearCart,
    updatePurchaseQty, // adicionado na Etapa 4 (ver alteração no Context)
    createOrder,
    createDonationRequest,
  } = useMarketplace();

  // Mapeia itens do carrinho para dados completos
  const purchaseItems = useMemo(() => {
    return cartPurchase.map((ci) => {
      const p = products.find((x) => x.id === ci.productId);
      const max = p?.stock ?? ci.quantity ?? 1;
      const qty = Math.min(ci.quantity, max);
      const price = p?.price ?? 0;
      return {
        product: p,
        productId: ci.productId,
        quantity: qty,
        price,
        subtotal: price * qty,
      };
    });
  }, [cartPurchase, products]);

  const donationItems = useMemo(() => {
    return cartDonation.map((ci) => {
      const p = products.find((x) => x.id === ci.productId);
      return { product: p, productId: ci.productId };
    });
  }, [cartDonation, products]);

  const total = useMemo(() => {
    return purchaseItems.reduce((acc, it) => acc + it.subtotal, 0);
  }, [purchaseItems]);

  function decQty(productId, current, stock) {
    const next = Math.max(1, current - 1);
    updatePurchaseQty(productId, next);
  }
  function incQty(productId, current, stock) {
    const next = Math.min(stock ?? Infinity, current + 1);
    updatePurchaseQty(productId, next);
  }

  // Finalizações
  function finalizePurchase() {
    if (!purchaseItems.length) return;
    const contactMode = window.prompt(
      'Como quer combinar? Digite "Retirada" ou "Entrega combinada"',
      "Retirada"
    );
    if (!contactMode) return;

    const items = purchaseItems.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
      price: it.price,
    }));
    const order = createOrder(
      items,
      total,
      contactMode === "Entrega combinada" ? "Entrega combinada" : "Retirada"
    );

    // Mostra contatos dos produtores envolvidos
    const involved = new Map();
    purchaseItems.forEach(({ product }) => {
      if (product?.producer?.name)
        involved.set(product.producer.name, product.producer.contactUrl || "");
    });

    alert(
      `Compra gerada!\n\nPedido: ${order.id}\nItens: ${
        items.length
      }\nTotal: R$ ${total.toFixed(2)}\n` +
        `Contato(s) do(s) produtor(es):\n` +
        Array.from(involved.entries())
          .map(([name, url]) => `- ${name}: ${url || "sem link"}`)
          .join("\n")
    );
  }

  function finalizeDonation() {
    if (!donationItems.length) return;

    const items = donationItems.map((it) => ({ productId: it.productId }));
    const req = createDonationRequest(items);

    const involved = new Map();
    donationItems.forEach(({ product }) => {
      if (product?.producer?.name)
        involved.set(product.producer.name, product.producer.contactUrl || "");
    });

    alert(
      `Solicitação de doação criada!\n\nProtocolo: ${req.id}\nItens: ${items.length}\n` +
        `Combine diretamente com o(s) produtor(es):\n` +
        Array.from(involved.entries())
          .map(([name, url]) => `- ${name}: ${url || "sem link"}`)
          .join("\n")
    );
  }

  return (
    <div className={`agc-drawer ${open ? "is-open" : ""}`}>
      <div className="agc-drawer-header">
        <strong>
          {activeTab === "comprar" ? "Seu carrinho" : "Suas solicitações"}
        </strong>
        <button
          className="agc-drawer-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
      </div>

      <div className="agc-drawer-body">
        {activeTab === "comprar" ? (
          purchaseItems.length ? (
            <ul className="agc-drawer-list">
              {purchaseItems.map(
                ({ product, productId, quantity, price, subtotal }) => (
                  <li key={productId} className="agc-drawer-item">
                    <div className="agc-drawer-title">
                      {product?.title || "Produto"}
                    </div>
                    <div className="agc-drawer-meta">
                      {product?.producer?.name
                        ? `${product.producer.name} • `
                        : ""}
                      {product?.location}
                    </div>

                    <div className="agc-drawer-row">
                      <div className="agc-qty">
                        <button
                          className="agc-qty-btn"
                          onClick={() =>
                            decQty(productId, quantity, product?.stock)
                          }
                        >
                          −
                        </button>
                        <input
                          className="agc-qty-input"
                          type="number"
                          min={1}
                          max={product?.stock ?? undefined}
                          value={quantity}
                          onChange={(e) => {
                            const v = Math.max(
                              1,
                              Math.min(
                                Number(e.target.value) || 1,
                                product?.stock ?? Infinity
                              )
                            );
                            updatePurchaseQty(productId, v);
                          }}
                        />
                        <button
                          className="agc-qty-btn"
                          onClick={() =>
                            incQty(productId, quantity, product?.stock)
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="agc-drawer-price">
                        R$ {price.toFixed(2)}{" "}
                        {product?.unit ? `/${product.unit}` : ""}
                      </div>
                      <div className="agc-drawer-subtotal">
                        Subtotal: <strong>R$ {subtotal.toFixed(2)}</strong>
                      </div>

                      <button
                        className="agc-btn agc-btn--ghost"
                        onClick={() => removeFromCartPurchase(productId)}
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          ) : (
            <div className="agc-muted">Seu carrinho está vazio.</div>
          )
        ) : donationItems.length ? (
          <ul className="agc-drawer-list">
            {donationItems.map(({ product, productId }) => (
              <li key={productId} className="agc-drawer-item">
                <div className="agc-drawer-title">
                  {product?.title || "Item"}
                </div>
                <div className="agc-drawer-meta">
                  {product?.producer?.name ? `${product.producer.name} • ` : ""}
                  {product?.location}
                </div>
                <div className="agc-muted">
                  Sem quantidade — combine diretamente com o produtor.
                </div>
                <button
                  className="agc-btn agc-btn--ghost"
                  onClick={() => removeFromCartDonation(productId)}
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="agc-muted">Nenhuma solicitação adicionada.</div>
        )}
      </div>

      <div className="agc-drawer-footer">
        {activeTab === "comprar" ? (
          <>
            <div className="agc-drawer-total">
              Total: <strong>R$ {total.toFixed(2)}</strong>
            </div>
            <div className="agc-drawer-actions">
              <button
                className="agc-btn agc-btn--ghost"
                onClick={() => clearCart("comprar")}
              >
                Limpar
              </button>
              <button
                className="agc-btn"
                onClick={finalizePurchase}
                disabled={!purchaseItems.length}
              >
                Gerar compra
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="agc-muted">
              Confirme para criar sua solicitação e visualizar contatos.
            </div>
            <div className="agc-drawer-actions">
              <button
                className="agc-btn agc-btn--ghost"
                onClick={() => clearCart("doar")}
              >
                Limpar
              </button>
              <button
                className="agc-btn"
                onClick={finalizeDonation}
                disabled={!donationItems.length}
              >
                Gerar solicitação
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
