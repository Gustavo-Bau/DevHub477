import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Seo from '../seo/Seo';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { fetchProducts } from '../services/productService';

export default function ManageProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.id) {
            loadProducts();
        }
    }, [user]);

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            // Buscando produtos do backend filtrados pelo id do fornecedor
            const data = await fetchProducts({ fornecedor_id: user.id });
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, nome) => {
        if (!window.confirm(`Tem certeza que deseja excluir o produto "${nome}"? Essa ação não pode ser desfeita.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Erro ao excluir produto');

            alert('Produto excluído com sucesso!');
            // Atualiza a lista removendo o item excluído
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <LoadingState message="Buscando seus produtos..." />;
    if (error) return <ErrorState message={error} retry={loadProducts} />;

    return (
        <section className="page-shell">
            <Seo title="Meus Produtos | DEVHUB" description="Gerencie seus produtos publicados" path="/meus-produtos" />

            <div className="section-header" style={{ marginBottom: '1.75rem' }}>
                <div>
                    <p className="eyebrow">Gestão de catálogo</p>
                    <h1 style={{ margin: 0 }}>Meus produtos</h1>
                    <p className="muted" style={{ marginTop: '0.75rem' }}>
                        Veja e mantenha os produtos que você publicou no marketplace.
                    </p>
                </div>
                <Link to="/publicar-produto" className="btn btn-primary">
                    + Novo produto
                </Link>
            </div>

            {products.length === 0 ? (
                <EmptyState
                    title="Nenhum produto publicado"
                    message="Você ainda não publicou nenhum produto ou serviço no mercado."
                    action={
                        <Link className="btn btn-primary" to="/publicar-produto">
                            Publicar meu primeiro produto
                        </Link>
                    }
                />
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    {products.map((p) => (
                        <div key={p.id} className="card" style={{ padding: '1.25rem', display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                <img
                                    src={p.imagem_principal || 'https://via.placeholder.com/360x220?text=Sem+imagem'}
                                    alt={p.nome}
                                    style={{ width: '100%', minHeight: '180px', objectFit: 'cover', borderRadius: '18px' }}
                                />
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{p.nome}</h3>
                                    <p className="muted" style={{ margin: 0 }}>
                                        {p.categoria || 'Categoria não definida'} · R$ {Number(p.preco || 0).toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                                <Link to={`/editar-produto/${p.id}`} className="btn btn-secondary" style={{ flex: '1 1 auto' }}>
                                    Editar
                                </Link>
                                <button
                                    className="btn btn-outlined"
                                    onClick={() => handleDelete(p.id, p.nome)}
                                    style={{ flex: '1 1 auto', color: 'var(--error)', borderColor: 'rgba(220, 38, 38, 0.18)' }}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
