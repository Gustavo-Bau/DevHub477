import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Seo from '../seo/Seo';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';

const featureOptions = [
  'API',
  'Cloud',
  'Dashboard',
  'Multiusuário',
  'Integrações',
  'Atualizações',
  'Código-fonte',
  'Suporte',
];

export default function CreateProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    plataforma: '',
    tipo_licenca: '',
    recursos: [],
    imagens: [],
  });

  if (!user || (user.tipo_conta !== 'freelancer' && user.tipo_conta !== 'empresa fornecedora')) {
    return (
      <section className="page-shell" style={{ maxWidth: 640 }}>
        <Seo title="Acesso Negado | DEVHUB" description="Área restrita" path="/publicar-produto" />
        <div className="card card-surface" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Acesso restrito</p>
          <h1>Você não tem permissão para publicar</h1>
          <p className="muted" style={{ margin: '1rem 0 0' }}>
            Apenas freelancers e empresas fornecedoras podem publicar produtos ou serviços no DevHub.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/mercado')} style={{ marginTop: '1.5rem' }}>
            Voltar ao Mercado
          </button>
        </div>
      </section>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleFeature = (feature) => {
    setForm((prev) => {
      const nextResources = prev.recursos.includes(feature)
        ? prev.recursos.filter((item) => item !== feature)
        : [...prev.recursos, feature];
      return { ...prev, recursos: nextResources };
    });
  };

  const handleImagesChange = (images) => {
    setForm((prev) => ({ ...prev, imagens: images }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const imagemPrincipal = form.imagens?.[0]?.previewUrl || '';
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          descricao: form.descricao,
          categoria: form.categoria,
          plataforma: form.plataforma,
          tipo_licenca: form.tipo_licenca,
          preco: Number(form.preco),
          preco_original: Number(form.preco),
          estoque: 9999,
          imagem_principal: imagemPrincipal,
          recursos: form.recursos,
          fornecedor_id: user.id,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Erro ao publicar produto.');
      }

      navigate('/mercado');
    } catch (err) {
      setError(err.message || 'Falha ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell" style={{ maxWidth: 1120 }}>
      <Seo title="Publicar Produto | DEVHUB" description="Publique seu software ou serviço" path="/publicar-produto" />

      <div className="card card-surface">
        <div className="section-header">
          <div>
            <p className="eyebrow">Cadastro de produto</p>
            <h1 style={{ margin: 0 }}>Publicar um novo produto</h1>
            <p className="muted" style={{ marginTop: '0.75rem' }}>
              Organize o produto em seções claras, adicione recursos e envie imagens para criar uma vitrine profissional.
            </p>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <section className="section-card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-header">
              <div>
                <h2>Informações básicas</h2>
                <p className="muted" style={{ margin: 0 }}>Nome, categoria, plataforma, preço e tipo de licença.</p>
              </div>
            </div>

            <div className="field-grid columns-2">
              <div className="field-group">
                <label className="field-label" htmlFor="nome">Nome do Produto *</label>
                <input id="nome" name="nome" type="text" className="input" placeholder="Ex: Sistema ERP em Nuvem" value={form.nome} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="categoria">Categoria</label>
                <select id="categoria" name="categoria" className="input" value={form.categoria} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  <option value="SaaS">SaaS</option>
                  <option value="ERP">ERP</option>
                  <option value="Ferramenta Dev">Ferramenta Dev</option>
                  <option value="Serviço Freelancer">Serviço Freelancer</option>
                </select>
              </div>
            </div>

            <div className="field-grid columns-2">
              <div className="field-group">
                <label className="field-label" htmlFor="plataforma">Plataforma</label>
                <input id="plataforma" name="plataforma" type="text" className="input" placeholder="Ex: Web, Mobile, Desktop" value={form.plataforma} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="tipo_licenca">Tipo de licença</label>
                <input id="tipo_licenca" name="tipo_licenca" type="text" className="input" placeholder="Ex: Comercial, Freemium" value={form.tipo_licenca} onChange={handleChange} />
              </div>
            </div>

            <div className="field-grid columns-2">
              <div className="field-group">
                <label className="field-label" htmlFor="preco">Preço (R$)</label>
                <input id="preco" name="preco" type="number" step="0.01" className="input" placeholder="199.90" value={form.preco} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="categoria">URL do produto</label>
                <input id="url_produto" name="url_produto" type="url" className="input" placeholder="https://seusite.com" value={form.url_produto || ''} onChange={handleChange} />
              </div>
            </div>
          </section>

          <section className="section-card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-header">
              <div>
                <h2>Descrição</h2>
                <p className="muted" style={{ margin: 0 }}>Explique o valor do seu produto com clareza.</p>
              </div>
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="descricao">Descrição Completa *</label>
              <textarea id="descricao" name="descricao" className="input" placeholder="Descreva as funcionalidades e diferenciais do seu produto..." value={form.descricao} onChange={handleChange} required />
            </div>
          </section>

          <section className="section-card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-header">
              <div>
                <h2>Recursos</h2>
                <p className="muted" style={{ margin: 0 }}>Selecione recursos que tornam seu produto único.</p>
              </div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
              {featureOptions.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  className={`feature-chip ${form.recursos.includes(feature) ? 'active' : ''}`}
                  onClick={() => handleToggleFeature(feature)}
                >
                  {feature}
                </button>
              ))}
            </div>
          </section>

          <section className="section-card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-header">
              <div>
                <h2>Imagens</h2>
                <p className="muted" style={{ margin: 0 }}>Arraste imagens ou selecione para pré-visualizar imediatamente.</p>
              </div>
            </div>
            <ImageUpload images={form.imagens} onChange={handleImagesChange} />
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
            <button type="button" className="btn btn-outlined" onClick={() => navigate('/mercado')} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Produto'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
