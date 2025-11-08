import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  mode, // "comprar" | "doar"
  onAddPurchase,
  onAddDonation,
}) {
  if (!products?.length) {
    return <div className="agc-muted">Nenhum item encontrado.</div>;
  }

  return (
    <ul className="agc-list">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          mode={mode}
          onAddPurchase={onAddPurchase}
          onAddDonation={onAddDonation}
        />
      ))}
    </ul>
  );
}
