import { Link } from 'react-router-dom';

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.1 20.55L10.55 19.17C5.4 14.4 2 11.28 2 7.5C2 4.42 4.42 2 7.5 2C9.24 2 10.91 2.81 12 4.09C13.09 2.81 14.76 2 16.5 2C19.58 2 22 4.42 22 7.5C22 11.28 18.6 14.4 13.45 19.17L12.1 20.55Z" fill="currentColor"/>
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.23999L14.81 8.62999L12 2L9.19 8.62999L2 9.23999L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
  </svg>
);

export default function ProductCard({ p }) {
  const price = Number(p.preco || 0).toFixed(2).replace('.', ',');
  const rating = Number(p.rating || 0).toFixed(1);
  const sales = p.quantidade_vendas || p.quantidade_avaliacoes || 0;
  const published = p.data_criacao ? new Date(p.data_criacao).toLocaleDateString('pt-BR') : null;
  const badges = [
    { key: 'verified', label: 'Fornecedor Verificado', type: 'secondary', show: true },
    { key: 'premium', label: 'Premium', type: 'primary', show: p.premium },
    { key: 'novo', label: 'Novo', type: 'success', show: p.novo },
    { key: 'mais-vendido', label: 'Mais Vendido', type: 'primary', show: p.mais_vendido },
    { key: 'promo', label: 'Em promoção', type: 'negative', show: p.em_promocao || p.promocao },
  ].filter((badge) => badge.show);

  return (
    <article className='card product-card'>
      <figure className='product-cover'>
        <img
          src={p.imagem_principal || 'https://via.placeholder.com/640x360?text=Sem+Imagem'}
          alt={p.nome}
        />
        <button type='button' className='card-favorite-btn' aria-label='Favoritar produto'>
          <HeartIcon />
        </button>
      </figure>

      <div className='product-card-body'>
        <div className='badge-list'>
          {badges.map((badge) => (
            <span key={badge.key} className={`badge badge-${badge.type}`}>
              {badge.label}
            </span>
          ))}
        </div>

        <div className='product-header'>
          <h3 className='product-title'>{p.nome}</h3>
          <p className='product-description'>{p.descricao || 'Descrição breve do produto.'}</p>
        </div>

        <div className='product-meta'>
          <span>{p.categoria || 'Categoria indisponível'}</span>
          <span>{p.plataforma || 'Plataforma única'}</span>
          <span>{p.fornecedor || 'Fornecedor Verificado'}</span>
          <span>{published ? `Publicado em ${published}` : 'Data não informada'}</span>
        </div>

        <div className='product-stats'>
          <div className='label-row'>
            <span className='product-price'>R$ {price}/mês</span>
            <span className='rating-chip'>
              <StarIcon /> {rating} ({sales})
            </span>
          </div>

          <Link className='btn btn-primary btn-full' to={`/produto/${p.id || p.slug}`}>
            Ver produto
          </Link>
        </div>
      </div>
    </article>
  );
}
