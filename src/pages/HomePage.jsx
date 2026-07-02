import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';

const featureItems = [
  { title: 'Catálogo premium', description: 'Software e SaaS selecionados para o seu negócio.' },
  { title: 'Pagamentos seguros', description: 'Checkout rápido com segurança e suporte completo.' },
  { title: 'Fornecedores verificados', description: 'Parceiros confiáveis e avaliações reais.' },
  { title: 'Atualizações automáticas', description: 'Produtos com versões sempre atualizadas.' },
];

export default function HomePage() {
  return (
    <section className='home-page'>
      <Seo title='DEVHUB | Marketplace de Software e SaaS' description='Plataforma para descobrir, comparar e comprar software e SaaS com segurança.' path='/' />

      <div className='home-hero card'>
        <div className='hero-copy'>
          <span className='eyebrow'>Marketplace SaaS</span>
          <h1>O marketplace profissional para software e SaaS.</h1>
          <p className='muted'>Descubra ferramentas modernas, avalie fornecedores e faça compras com confiança em uma única experiência.</p>
          <div className='hero-actions'>
            <Link className='btn btn-primary' to='/mercado'>Ver vitrine</Link>
            <Link className='btn btn-secondary' to='/cadastro'>Criar conta</Link>
          </div>
        </div>
        <div className='hero-visual'>
          <div className='hero-card'>
            <h3>Explore ofertas SaaS</h3>
            <p>Cadastre-se e aproveite softwares prontos para escalar seu projeto.</p>
          </div>
        </div>
      </div>

      <div className='home-features-grid'>
        {featureItems.map((item) => (
          <article key={item.title} className='card feature-card'>
            <h3>{item.title}</h3>
            <p className='muted'>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
