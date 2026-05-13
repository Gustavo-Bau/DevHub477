import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { fetchProductBySlug } from '../services/productService';

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try { setProduct(await fetchProductBySlug(slug)); } catch (e) { setError(e.message); setProduct(null); } finally { setLoading(false); }
    };
    load();
  }, [slug]);

  if (loading) return <LoadingState message='Carregando detalhes do produto...' />;
  if (error) return <ErrorState message={error} retry={<Link className='btn btn-secondary' to='/mercado'>Voltar ao mercado</Link>} />;
  if (!product) return <EmptyState title='Produto indisponível' message='Este produto não está disponível no momento.' action={<Link className='btn btn-primary' to='/mercado'>Ir para o mercado</Link>} />;

  const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, brand: { '@type': 'Brand', name: product.vendor || 'DEVHUB' } };
  return <article className='card'>
    <Seo title={`${product.name} | DEVHUB`} description={product.description || 'Detalhes do produto DEVHUB.'} path={`/produto/${slug}`} ogType='product' jsonLd={jsonLd} />
    <h1>{product.name}</h1>
    <p className='muted'>{product.description}</p>
    <p><strong>Fornecedor:</strong> {product.vendor || 'Não informado'}</p>
    <p><strong>Categoria:</strong> {product.category || 'Não informada'} · <strong>Plataforma:</strong> {product.platform || 'Não informada'}</p>
    <p><strong>Avaliação:</strong> {product.rating ? `${product.rating}★` : 'Sem avaliação'}</p>
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Link className='btn btn-primary' to='/carrinho'>Adicionar ao carrinho</Link>
      <Link className='btn btn-secondary' to='/checkout'>Comprar</Link>
    </div>
  </article>;
}
