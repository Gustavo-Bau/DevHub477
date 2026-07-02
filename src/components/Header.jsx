import { Link, NavLink, useNavigate } from 'react-router-dom';
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

    const navItems = [
        ['/mercado', 'Mercado'],
        ['/categorias', 'Categorias'],
        ['/favoritos', 'Favoritos'],
        ['/pedidos', 'Pedidos'],
        ['/sobre', 'Sobre'],
    ];

    const userInitial = user?.nome?.trim()?.[0]?.toUpperCase() || 'U';

    return (
        <header className="header app-header">
            <div className="container header-inner">
                <div className="header-left">
                    <Link className="brand" to="/">DEVHUB</Link>
                    <nav className="nav header-nav" aria-label="Menu principal">
                        {navItems.map(([to, label]) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="header-actions">
                    <div className="header-search">
                        <span className="search-icon"><SearchIcon /></span>
                        <input
                            className="input header-search-input"
                            placeholder="Buscar software, SaaS ou ferramenta"
                            aria-label="Buscar no marketplace"
                            type="search"
                        />
                    </div>

                    <Link className="icon-badge" to="/carrinho" aria-label="Abrir carrinho">
                        <span className="icon-badge-circle">🛒</span>
                        {quantity > 0 && <span className="badge-count">{quantity}</span>}
                    </Link>

                    {user ? (
                        <div className="user-chip">
                            <div className="user-avatar">{userInitial}</div>
                            <div className="user-meta">
                                <span>{user.nome?.split(' ')[0] || 'Usuário'}</span>
                                <small className="muted">{user.tipo_conta || 'Conta'}</small>
                            </div>
                            <div className="user-actions">
                                <Link className="btn btn-secondary btn-sm" to="/perfil">Perfil</Link>
                                <button className="btn btn-secondary btn-sm" onClick={handleLogout} type="button">Sair</button>
                            </div>
                        </div>
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
