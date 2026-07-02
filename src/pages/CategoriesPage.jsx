import Seo from '../seo/Seo';
import EmptyState from '../components/EmptyState';

export default function CategoriesPage() {
  return (
    <section className="page-shell" style={{ maxWidth: 1040 }}>
      <Seo title="Categorias | DEVHUB" description="Explore categorias de produtos e serviços." path="/categories" />

      <div className="card card-surface" style={{ padding: '2rem' }}>
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <div>
            <p className="eyebrow">Categorias</p>
            <h1 style={{ margin: 0 }}>Organize o mercado por tema</h1>
            <p className="muted" style={{ marginTop: '0.75rem' }}>
              Esta área será preenchida automaticamente com categorias reais assim que a integração de backend estiver disponível.
            </p>
          </div>
        </div>

        <EmptyState
          title="Conteúdo disponível via API"
          message="As categorias serão exibidas aqui assim que os dados forem carregados do servidor."
        />
      </div>
    </section>
  );
}
