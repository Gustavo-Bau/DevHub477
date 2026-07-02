export default function MarketplaceFilters({ filters, setFilters, categories, platforms }) {
  const update = (key, value) => setFilters((state) => ({ ...state, [key]: value }));

  return (
    <section className='filters-shell card'>
      <form className='filters-grid' onSubmit={(e) => e.preventDefault()}>
        <label className='filter-field'>
          <span>Buscar</span>
          <div className='filter-input-icon'>
            <input
              className='input'
              placeholder='Buscar por nome, fornecedor ou descrição'
              value={filters.q}
              onChange={(e) => update('q', e.target.value)}
            />
          </div>
        </label>

        <label className='filter-field'>
          <span>Categoria</span>
          <select value={filters.category} onChange={(e) => update('category', e.target.value)}>
            <option value=''>Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className='filter-field'>
          <span>Plataforma</span>
          <select value={filters.platform} onChange={(e) => update('platform', e.target.value)}>
            <option value=''>Todas as plataformas</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </label>

        <label className='filter-field wide-field'>
          <span>Ordenar por</span>
          <select value={filters.sort} onChange={(e) => update('sort', e.target.value)}>
            <option value='recentes'>Mais recentes</option>
            <option value='populares'>Mais populares</option>
            <option value='avaliados'>Melhores avaliados</option>
          </select>
        </label>

        <button type='submit' className='btn btn-primary filter-submit'>Buscar</button>
      </form>
    </section>
  );
}
