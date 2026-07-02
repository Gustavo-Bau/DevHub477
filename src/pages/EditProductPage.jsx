import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Seo from '../seo/Seo';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/LoadingState';

export default function EditProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    plataforma: '',
    tipo_licenca: '',
    urlImagem: '',
  });

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Produto não encontrado');
      const data = await res.json();

      if (data.fornecedor_id !== user.id) {
        throw new Error('Você não tem permissão para editar este produto.');
      }

      setForm({
        nome: data.nome || '',
        descricao: data.descricao || '',
        preco: data.preco || '',
        categoria: data.categoria || '',
        plataforma: data.plataforma || '',
        tipo_licenca: data.tipo_licenca || '',
        urlImagem: data.imagem_principal || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.tipo_conta !== 'freelancer' && user.tipo_conta !== 'empresa fornecedora')) {
    return (
      <section className="page-shell" style={{ maxWidth: 840 }}>
        <Seo title="Acesso Negado | DEVHUB" description="Área restrita" path="/editar-produto" />
        <div className="card card-surface" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Acesso negado</p>
          <h1>Sem permissão para editar</h1>
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Apenas freelancers e fornecedores podem alterar produtos cadastrados.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/mercado')} style={{ marginTop: '1.5rem' }}>
            Voltar ao mercado
          </button>
        </div>
      </section>
    );
  }

  if (loading) return <LoadingState message="Carregando informações do produto..." />;
  if (error)
    return (
      <section className="page-shell" style={{ maxWidth: 840 }}>
        <div className="card card-surface" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--primary-strong)', marginBottom: '0.75rem' }}>Falha ao carregar</h2>
          <p className="muted" style={{ marginBottom: '1.25rem' }}>
            {error}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/meus-produtos')}>
            Voltar aos meus produtos
          </button>
        </div>
      </section>
    );

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          descricao: form.descricao,
          categoria: form.categoria,
          plataforma: form.plataforma,
          tipo_licenca: form.tipo_licenca,
          preco: Number(form.preco),
          preco_original: Number(form.preco),
          imagem_principal: form.urlImagem,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Erro ao salvar produto.');
      }

      alert('Produto atualizado com sucesso!');
      navigate('/meus-produtos');
    } catch (err) {
      alert(err.message || 'Falha ao conectar ao servidor.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-shell" style={{ maxWidth: 1120 }}>
      <Seo title="Editar Produto | DEVHUB" description="Edite seu produto" path={`/editar-produto/${id}`} />

      <div className="card card-surface">
        <div className="section-header" style={{ marginBottom: '1.75rem' }}>
          <div>
            <p className="eyebrow">Editar produto</p>
            <h1 style={{ margin: 0 }}>Atualize os detalhes do produto</h1>
            <p className="muted" style={{ marginTop: '0.75rem' }}>
              Ajuste título, preço, imagem e informações de forma rápida e elegante.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <section className="section-card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-header">
              <div>
                <h2>Dados principais</h2>
                <p className="muted" style={{ margin: 0 }}>Mantenha os principais detalhes do produto atualizados.</p>
              </div>
            </div>

            <div className="field-grid columns-2">
              <div className="field-group">
                <label htmlFor="nome" className="field-label">Nome do produto *</label>
                <input id="nome" name="nome" type="text" className="input" placeholder="Ex: Plataforma de pagamentos" value={form.nome} onChange={handleChange} required />
              </div>
              <div className="field-group">
                <label htmlFor="categoria" className="field-label">Categoria</label>
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
                <label htmlFor="plataforma" className="field-label">Plataforma</label>
                <input id="plataforma" name="plataforma" type="text" className="input" placeholder="Web, Mobile, Desktop" value={form.plataforma} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label htmlFor="tipo_licenca" className="field-label">Tipo de licença</label>
                <input id="tipo_licenca" name="tipo_licenca" type="text" className="input" placeholder="Ex: Comercial, Freemium" value={form.tipo_licenca} onChange={handleChange} />
              </div>
            </div>

            <div className="field-grid columns-2">
              <div className="field-group">
                <label htmlFor="preco" className="field-label">Preço (R$)</label>
                <input id="preco" name="preco" type="number" step="0.01" className="input" value={form.preco} onChange={handleChange} />
              </div>
              <div className="field-group">
                <label htmlFor="urlImagem" className="field-label">URL da imagem de capa</label>
                <input id="urlImagem" name="urlImagem" type="url" className="input" placeholder="https://..." value={form.urlImagem} onChange={handleChange} />
              </div>
            </div>
          </section>

          <section className="section-card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-header">
              <div>
                <h2>Descrição</h2>
                <p className="muted" style={{ margin: 0 }}>Atualize o texto e os destaques do seu produto.</p>
              </div>
            </div>
            <div className="field-group">
              <label htmlFor="descricao" className="field-label">Descrição completa *</label>
              <textarea id="descricao" name="descricao" className="input" rows="5" placeholder="Descreva as funcionalidades e benefícios..." value={form.descricao} onChange={handleChange} required />
            </div>
          </section>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
            <button type="button" className="btn btn-outlined" onClick={() => navigate('/meus-produtos')} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
