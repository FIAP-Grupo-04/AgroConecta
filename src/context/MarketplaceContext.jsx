import { createContext, useContext, useEffect, useState } from "react";
import { loadData, saveData } from "../utils/storage";

const MarketplaceContext = createContext();
export function useMarketplace() {
  return useContext(MarketplaceContext);
}

export function MarketplaceProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("comprar"); // "comprar" | "doar"
  const [cartPurchase, setCartPurchase] = useState([]);
  const [cartDonation, setCartDonation] = useState([]);
  const [orders, setOrders] = useState([]);
  const [donationRequests, setDonationRequests] = useState([]);

  // 🔹 Inicialização
  useEffect(() => {
    const storedProducts = loadData("marketplace_products");
    if (storedProducts && storedProducts.length > 0) {
      setProducts(storedProducts);
    } else {
      // Carrega o JSON público
      fetch("/data/marketplace.json")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          saveData("marketplace_products", data);
        })
        .catch((err) =>
          console.error("Erro ao carregar marketplace.json:", err)
        );
    }

    setCartPurchase(loadData("marketplace_cart_purchase", []));
    setCartDonation(loadData("marketplace_cart_donation", []));
    setOrders(loadData("marketplace_orders", []));
    setDonationRequests(loadData("marketplace_donationRequests", []));
  }, []);

  // 🔹 Persistência automática
  useEffect(() => saveData("marketplace_products", products), [products]);
  useEffect(
    () => saveData("marketplace_cart_purchase", cartPurchase),
    [cartPurchase]
  );
  useEffect(
    () => saveData("marketplace_cart_donation", cartDonation),
    [cartDonation]
  );
  useEffect(() => saveData("marketplace_orders", orders), [orders]);
  useEffect(
    () => saveData("marketplace_donationRequests", donationRequests),
    [donationRequests]
  );

  // 🔹 Manipulação de produtos
  function addProduct(newProduct) {
    const product = {
      ...newProduct,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [...prev, product]);
  }

  function updateProduct(id, updatedData) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  }

  // 🔹 Carrinho (compras)
  function addToCartPurchase(productId, quantity = 1) {
    setCartPurchase((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  }

  function removeFromCartPurchase(productId) {
    setCartPurchase((prev) => prev.filter((i) => i.productId !== productId));
  }

  // 🔹 Solicitações (doações)
  function addToCartDonation(productId) {
    setCartDonation((prev) => {
      if (prev.some((i) => i.productId === productId)) return prev;
      return [...prev, { productId }];
    });
  }

  function removeFromCartDonation(productId) {
    setCartDonation((prev) => prev.filter((i) => i.productId !== productId));
  }

  function clearCart(type) {
    if (type === "comprar") setCartPurchase([]);
    if (type === "doar") setCartDonation([]);
  }

  // 🔹 Finalizações
  function createOrder(items, total, contactMode) {
    const order = {
      id: crypto.randomUUID(),
      items,
      total,
      contactMode,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, order]);
    clearCart("comprar");
    return order;
  }

  function createDonationRequest(items) {
    const req = {
      id: crypto.randomUUID(),
      items,
      createdAt: new Date().toISOString(),
    };
    setDonationRequests((prev) => [...prev, req]);
    clearCart("doar");
    return req;
  }

  function addToCartPurchase(productId, quantity = 1) {
    setCartPurchase((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  }

  function updatePurchaseQty(productId, quantity) {
    setCartPurchase((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }

  function removeFromCartPurchase(productId) {
    setCartPurchase((prev) => prev.filter((i) => i.productId !== productId));
  }

  const value = {
    products,
    activeTab,
    setActiveTab,
    cartPurchase,
    cartDonation,
    orders,
    donationRequests,
    addProduct,
    updateProduct,
    addToCartPurchase,
    updatePurchaseQty,
    removeFromCartPurchase,
    addToCartDonation,
    removeFromCartDonation,
    clearCart,
    createOrder,
    createDonationRequest,
  };

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}
