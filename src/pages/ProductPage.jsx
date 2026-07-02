import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { fetchProductBySlug } from '../services/productService';
import { useCart } from '../context/CartContext';

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => { (async () => { setLoading(true); setError(''); try { setProduct(await fetchProductBySlug(slug)); } catch (e) { setError(e.message); } finally { setLoading(false); } })(); }, [slug]);
  const handleAdd = async () => {
    try {
      await addToCart(product, 1);
      setMsg('Item adicionado ao carrinho.');
    } catch (e) {
      setMsg(e.message);
    }
  };

  if (loading) return <LoadingState message='Carregando detalhes do produto...' />;
  if (error)
    return (
      <ErrorState
        message={error}
        retry={<Link className='btn btn-secondary' to='/mercado'>Voltar ao mercado</Link>}
      />
    );
  if (!product)
    return (
      <EmptyState
        title='Produto indisponível'
        message='Este produto não está disponível no momento.'
        action={<Link className='btn btn-primary' to='/mercado'>Ir para o mercado</Link>}
      />
    );

  const price = Number(product.preco || 0).toFixed(2).replace('.', ',');
  const rating = Number(product.rating || 0).toFixed(1);
  const sales = product.quantidade_vendas || product.quantidade_avaliacoes || 0;
  const published = product.data_criacao ? new Date(product.data_criacao).toLocaleDateString('pt-BR') : null;
  const lastUpdated = product.ultima_atualizacao ? new Date(product.ultima_atualizacao).toLocaleDateString('pt-BR') : null;
  const badges = [
    { key: 'verified', label: 'Fornecedor Verificado', type: 'secondary', show: true },
    { key: 'premium', label: 'Premium', type: 'primary', show: product.premium },
    { key: 'novo', label: 'Novo', type: 'success', show: product.novo },
    { key: 'mais-vendido', label: 'Mais Vendido', type: 'primary', show: product.mais_vendido },
    { key: 'open-source', label: 'Open Source', type: 'secondary', show: product.open_source || product.openSource },
    { key: 'promo', label: 'Em promoção', type: 'negative', show: product.em_promocao || product.promocao },
  ].filter((badge) => badge.show);

  const features = product.recursos || product.features || [
    product.api && 'API disponível',
    product.atualizacoes_frequentes && 'Atualizações frequentes',
    product.suporte_tecnico && 'Suporte técnico',
    product.licenca_comercial && 'Licença comercial',
    product.multiusuario && 'Multiusuário',
    product.cloud && 'Cloud',
    product.integracao && 'Integração',
    product.dashboard && 'Dashboard',
  ].filter(Boolean);

  const relatedProducts = product.relacionados || product.produtos_relacionados || [];

  const productInfo = [
    { label: 'Categoria', value: product.categoria || '—' },
    { label: 'Plataforma', value: product.plataforma || '—' },
    { label: 'Versão', value: product.versao || '—' },
    { label: 'Fornecedor', value: product.fornecedor || '—' },
    { label: 'Publicado em', value: published || '—' },
    { label: 'Última atualização', value: lastUpdated || '—' },
    { label: 'Idioma', value: product.idioma || '—' },
    { label: 'Licença', value: product.licenca || '—' },
    { label: 'Suporte', value: product.suporte || '—' },
    { label: 'Compatibilidade', value: product.compatibilidade || product.plataforma || '—' },
  ];

  return (
    <article className='product-detail-page'>
      <Seo
        title={`${product.nome} | DEVHUB`}
        description={product.descricao || 'Detalhes do produto DEVHUB.'}
        path={`/produto/${slug}`}
        ogType='product'
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Product', name: product.nome, description: product.descricao }}
      />

      <nav className='breadcrumb'>
        <Link to='/mercado'>Mercado</Link>
        <span>›</span>
        <span>{product.categoria || 'Categoria'}</span>
        <span>›</span>
        <span>{product.nome}</span>
      </nav>

      <section className='product-hero-card card'>
        <div className='product-hero-grid'>
          <div className='product-hero-media'>
            <div className='product-image-card'>
              <img
                src={product.imagem_principal || 'https://via.placeholder.com/960x540?text=Sem+Imagem'}
                alt={product.nome}
              />
            </div>

            {product.galeria?.length > 0 && (
              <div className='product-gallery'>
                {product.galeria.slice(0, 4).map((src, index) => (
                  <img key={index} src={src} alt={`${product.nome} ${index + 1}`} />
                ))}
              </div>
            )}
          </div>

          <div className='product-hero-summary'>
            <div className='product-topline'>
              <div>
                <span className='eyebrow'>Detalhes do produto</span>
                <h1>{product.nome}</h1>
                <p className='product-hero-description'>{product.descricao}</p>
              </div>

              <div className='product-actions-inline'>
                <button type='button' className='icon-btn heart-btn' aria-label='Favoritar'>❤</button>
                <button type='button' className='icon-btn share-btn' aria-label='Compartilhar'>⤴</button>
              </div>
            </div>

            <div className='badge-list badge-list-hero'>
              {badges.map((badge) => (
                <span key={badge.key} className={`badge badge-${badge.type}`}>
                  {badge.label}
                </span>
              ))}
            </div>

            <div className='product-summary-meta'>
              <span>{product.fornecedor || 'Fornecedor Verificado'}</span>
              <span>{product.categoria || 'Categoria'}</span>
              <span>{product.plataforma || 'Plataforma'}</span>
              <span>{rating} ★ · {sales} vendas</span>
            </div>
          </div>
        </div>
      </section>

      <div className='product-detail-grid'>
        <main className='product-main-column'>
          <section className='card product-section'>
            <h2>Descrição</h2>
            <p>{product.descricao || 'Este produto ainda não possui descrição detalhada.'}</p>
          </section>

          {features.length > 0 && (
            <section className='card product-section'>
              <div className='section-header'>
                <h2>Recursos principais</h2>
              </div>
              <div className='feature-grid'>
                {features.slice(0, 8).map((feature, index) => (
                  <div key={index} className='feature-card'>
                    <span>✔</span>
                    <p>{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className='card product-section'>
            <div className='section-header'>
              <h2>Informações do produto</h2>
            </div>
            <div className='product-info-table'>
              {productInfo.map((info) => (
                <div key={info.label} className='product-info-row'>
                  <span>{info.label}</span>
                  <strong>{info.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className='card product-section'>
            <div className='section-header'>
              <h2>Fornecedor</h2>
            </div>
            <div className='seller-card'>
              <div className='seller-profile'>
                <div className='seller-avatar'>
                  {product.fornecedor?.slice(0, 1) || 'F'}
                </div>
                <div>
                  <strong>{product.fornecedor || 'Fornecedor DEVHUB'}</strong>
                  <p className='muted'>Fornecedor Verificado</p>
                </div>
              </div>
              <div className='seller-meta'>
                <span>{(product.fornecedor_produtos || product.produtos || 0) > 0 ? `${product.fornecedor_produtos || product.produtos} produtos` : 'Sem histórico'}</span>
                <span>{product.fornecedor_rating ? `${Number(product.fornecedor_rating).toFixed(1)} ★` : rating && `${rating} ★`}</span>
              </div>
              <button type='button' className='btn btn-secondary btn-full'>Ver perfil</button>
            </div>
          </section>

          {relatedProducts.length > 0 && (
            <section className='card product-section'>
              <div className='section-header'>
                <h2>Produtos relacionados</h2>
              </div>
              <div className='related-products-scroll'>
                {relatedProducts.map((item) => (
                  <div key={item.id || item.slug} className='related-product-card'>
                    <img src={item.imagem_principal || 'https://via.placeholder.com/320x180?text=Sem+Imagem'} alt={item.nome} />
                    <div>
                      <strong>{item.nome}</strong>
                      <span className='muted'>{item.categoria || item.plataforma}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className='product-sidebar'>
          <section className='card sidebar-panel'>
            <div className='price-pill'>
              <span className='price-value'>R$ {price}</span>
              <span className='price-suffix'>/mês</span>
            </div>
            {product.preco_antigo && (
              <p className='old-price'>De R$ {Number(product.preco_antigo).toFixed(2).replace('.', ',')}</p>
            )}
            <p className='plan-label'>{product.plano || 'Plano padrão'}</p>

            <div className='sidebar-meta'>
              <div>
                <span className='muted'>Fornecedor</span>
                <strong>{product.fornecedor || '—'}</strong>
              </div>
              <div>
                <span className='muted'>Avaliação</span>
                <strong>{rating} ★</strong>
              </div>
              <div>
                <span className='muted'>Categoria</span>
                <strong>{product.categoria || '—'}</strong>
              </div>
              <div>
                <span className='muted'>Plataforma</span>
                <strong>{product.plataforma || '—'}</strong>
              </div>
              <div>
                <span className='muted'>Vendas</span>
                <strong>{sales}</strong>
              </div>
            </div>

            <div className='sidebar-actions'>
              <button type='button' className='btn btn-primary btn-full' onClick={handleAdd}>Comprar Agora</button>
              <button type='button' className='btn btn-secondary btn-full'>Adicionar ao Carrinho</button>
            </div>

            {msg ? <p className='muted sidebar-message'>{msg}</p> : null}
          </section>
        </aside>
      </div>
    </article>
  );
}
