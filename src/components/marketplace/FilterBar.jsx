// src/components/marketplace/FilterBar.jsx
import { useMemo } from "react";

export default function FilterBar({ products, filters, onChange }) {
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.category && set.add(p.category));
    return ["Todas", ...Array.from(set)];
  }, [products]);

  function handleChange(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <>
      <div className="agc-filterbar">
        {/* Busca */}
        <input
          type="text"
          className="agc-input"
          placeholder="Buscar por título..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />

        {/* Categoria */}
        <select
          className="agc-select"
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Localidade */}
        <input
          type="text"
          className="agc-input"
          placeholder="Filtrar por localidade (ex.: Campinas/SP)"
          value={filters.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />

        {/* Ordenação */}
        <select
          className="agc-select"
          value={filters.sort}
          onChange={(e) => handleChange("sort", e.target.value)}
        >
          <option value="recent">Mais recentes</option>
          <option value="priceAsc">Preço: menor → maior</option>
          <option value="priceDesc">Preço: maior → menor</option>
        </select>
      </div>

      {/* Checkbox abaixo, ocupando a linha toda */}
      <label className="agc-checkbox" style={{ marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={filters.uglyOnly}
          onChange={(e) => handleChange("uglyOnly", e.target.checked)}
        />
        <span>Mostrar apenas “Fora do padrão”</span>
      </label>
    </>
  );
}
