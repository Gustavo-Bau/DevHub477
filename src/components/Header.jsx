import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4a7 7 0 105.48 11.42l4.3 4.3 1.42-1.42-4.3-4.3A7 7 0 0011 4zm0 2a5 5 0 110 10 5 5 0 010-10z" fill="currentColor"/>
  </svg>
);

export default function Header() {
    const { user, logout } = useAuth();
    const { quantity } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="header app-header">
            <div className="container header-inner">
                <div className="header-branding">
                    <Link className="brand" to="/">DEVHUB</Link>
                    <div className="header-search">
                        <span className="search-icon"><SearchIcon /></span>
                        <input className="input header-search-input" placeholder="Buscar software, SaaS ou ferramenta" aria-label="Buscar no marketplace" />
                    </div>
                </div>

                <nav className="nav header-nav" aria-label="Menu principal">
                    {[
                        ['/mercado', 'Mercado'],
                        ['/categorias', 'Categorias'],
                        ['/favoritos', 'Favoritos'],
                        ['/pedidos', 'Pedidos'],
                        ['/sobre', 'Sobre'],
                    ].map(([to, label]) => (
                        <Link key={to} className="nav-link" to={to}>
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">
                    <Link className="icon-badge" to="/carrinho" aria-label="Abrir carrinho">
                        <span className="icon-badge-circle">🛒</span>
                        {quantity > 0 && <span className="badge-count">{quantity}</span>}
                    </Link>
                    {user ? (
                        <>
                            <Link className="btn btn-secondary" to="/perfil">
                                {user.nome?.split(' ')[0] || 'Perfil'}
                            </Link>
                            <button className="btn btn-secondary" onClick={handleLogout} type="button">
                                Sair
                            </button>
                        </>
                    ) : (
                        <Link className="btn btn-primary" to="/login">
                            Entrar
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
