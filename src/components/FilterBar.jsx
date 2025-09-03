export default function FilterBar({
  topics = [],
  topic,
  onChangeTopic,
  query,
  onChangeQuery,
  onClear,
}) {
  return (
    <div className="filter-container">
      <div className="filter-dropdown">
        <select
          id="filter-category-select"
          className="filter-button"
          value={topic}
          onChange={(e) => onChangeTopic(e.target.value)}
        >
          <option value="">Filtrar por categoria</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          id="clear-filter-button"
          className="clear-filter-button"
          onClick={onClear}
        >
          <i className="fas fa-times" />
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
        />
        <button
          className="search-button"
          onClick={() => {
            /* busca já é reativa */
          }}
        >
          <i className="fas fa-search" />
        </button>
      </div>
    </div>
  );
}
