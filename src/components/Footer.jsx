import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='container footer-grid'>
        <div className='footer-brand'>
          <h2>DEVHUB</h2>
          <p className='muted'>Marketplace profissional de software e SaaS.</p>
        </div>

        <div className='footer-column'>
          <h3>Plataforma</h3>
          <Link to='/mercado'>Mercado</Link>
          <Link to='/categorias'>Categorias</Link>
          <Link to='/pedidos'>Pedidos</Link>
        </div>

        <div className='footer-column'>
          <h3>Ajuda</h3>
          <Link to='/sobre'>Sobre</Link>
          <Link to='/contato'>Contato</Link>
          <Link to='/termos'>Termos</Link>
        </div>

        <div className='footer-column'>
          <h3>Social</h3>
          <a href='#' className='footer-link'>Twitter</a>
          <a href='#' className='footer-link'>LinkedIn</a>
          <a href='#' className='footer-link'>Instagram</a>
        </div>
      </div>
    </footer>
  );
}
