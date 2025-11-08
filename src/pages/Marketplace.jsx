// src/pages/Marketplace.jsx
import { useMemo, useState } from "react";
import Header from "../components/Header";
import { useMarketplace } from "../context/MarketplaceContext";
import FilterBar from "../components/marketplace/FilterBar";
import ProductGrid from "../components/marketplace/ProductGrid";
import CartDrawer from "../components/marketplace/CartDrawer";
import ProductFormModal from "../components/marketplace/ProductFormModal";
import { ToastProvider, useToast } from "../components/ui/Toast";
import "../styles/marketplace.css";

function MarketplaceInner() {
  const {
    products,
    activeTab,
    setActiveTab,
    addToCartPurchase,
    addToCartDonation,
    cartPurchase,
    cartDonation,
    addProduct,
  } = useMarketplace();

  const { toast } = useToast();

  const [filters, setFilters] = useState({
    search: "",
    category: "Todas",
    location: "",
    uglyOnly: false,
    sort: "recent",
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.slice();
    list = list.filter((p) =>
      activeTab === "comprar" ? !p.isDonation : p.isDonation
    );

    if (filters.search.trim()) {
      const s = filters.search.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(s));
    }
    if (filters.category !== "Todas")
      list = list.filter((p) => p.category === filters.category);

    if (filters.location.trim()) {
      const l = filters.location.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.location?.toLowerCase().includes(l) ||
          p.producer?.location?.toLowerCase().includes(l)
      );
    }
    if (filters.uglyOnly) list = list.filter((p) => p.isUgly);

    if (filters.sort === "recent")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (filters.sort === "priceAsc")
      list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    else if (filters.sort === "priceDesc")
      list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));

    return list;
  }, [products, activeTab, filters]);

  const cartCount =
    activeTab === "comprar" ? cartPurchase.length : cartDonation.length;

  function handleAddPurchase(productId, qty) {
    addToCartPurchase(productId, qty);
    setDrawerOpen(true);
    toast("Item adicionado ao carrinho", "success");
  }
  function handleAddDonation(productId) {
    addToCartDonation(productId);
    setDrawerOpen(true);
    toast("Solicitação adicionada", "success");
  }
  function handleSubmitNewProduct(newProduct, isDonation) {
    addProduct(newProduct);
    setActiveTab(isDonation ? "doar" : "comprar");
    toast(isDonation ? "Doação publicada!" : "Produto publicado!", "success");
  }

  return (
    <>
      {/* Header padrão do AgroConecta */}
      <Header />

      {/* Main no mesmo padrão de largura/fundo do app */}
      <main className="marketplace-main">
        <div className="marketplace-container">
          {/* Título + ações */}
          <div className="marketplace-header-row">
            <h1 className="marketplace-title">Marketplace de Alimentos</h1>

            <div className="marketplace-actions">
              <button
                className="agc-btn agc-btn--ghost"
                onClick={() => setDrawerOpen(true)}
              >
                {activeTab === "comprar"
                  ? `Carrinho (${cartCount})`
                  : `Solicitações (${cartCount})`}
              </button>
              <button className="agc-btn" onClick={() => setModalOpen(true)}>
                Publicar item
              </button>
            </div>
          </div>

          {/* Abas */}
          <div className="agc-tabs" style={{ marginTop: 8 }}>
            <button
              className={`agc-tab ${
                activeTab === "comprar" ? "is-active" : ""
              }`}
              onClick={() => setActiveTab("comprar")}
            >
              Comprar
            </button>
            <button
              className={`agc-tab ${activeTab === "doar" ? "is-active" : ""}`}
              onClick={() => setActiveTab("doar")}
            >
              Doar
            </button>
          </div>

          {/* Filtros */}
          <FilterBar
            products={products}
            filters={filters}
            onChange={setFilters}
          />

          {/* Contagem */}
          <div className="agc-muted" style={{ marginBottom: 8 }}>
            {activeTab === "comprar" ? "Itens à venda" : "Itens para doação"}:{" "}
            <strong>{filtered.length}</strong> encontrado(s)
          </div>

          {/* Grid */}
          <ProductGrid
            products={filtered}
            mode={activeTab}
            onAddPurchase={handleAddPurchase}
            onAddDonation={handleAddDonation}
          />
        </div>
      </main>

      {/* Drawer + Modal */}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitNewProduct}
      />
    </>
  );
}

// Provider local para os toasts desta página
export default function Marketplace() {
  return (
    <ToastProvider>
      <MarketplaceInner />
    </ToastProvider>
  );
}
