import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Seo from '../seo/Seo';

const accountOptions = [
  { value: 'usuario', label: 'Cliente', icon: '👤' },
  { value: 'empresa consumidora', label: 'Empresa', icon: '🏢' },
  { value: 'freelancer', label: 'Desenvolvedor', icon: '💻' },
  { value: 'admin', label: 'Admin', icon: '🛡️' },
];

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    tipo_conta: 'usuario',
    senha: '',
    confirmar_senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAccountChange = (value) => {
    setForm((prev) => ({ ...prev, tipo_conta: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nome || !form.email || !form.cpf || !form.senha) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (form.senha !== form.confirmar_senha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          cpf: form.cpf,
          telefone: form.telefone,
          tipo_conta: form.tipo_conta,
          senha: form.senha,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erro ao criar conta.');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message || 'Falha ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-shell" style={{ maxWidth: 560 }}>
      <Seo title="Cadastro | DEVHUB" description="Crie sua conta DEVHUB." path="/cadastro" />

      <div className="card card-surface">
        <div style={{ marginBottom: '1.25rem' }}>
          <p className="eyebrow">Criar conta</p>
          <h1 style={{ margin: 0, fontSize: '2rem' }}>Bem-vindo ao DevHub</h1>
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Selecione o tipo de conta e preencha os dados para começar a usar o marketplace.
          </p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1.25rem' }}>
            <p className="field-label" style={{ marginBottom: '0.75rem' }}>
              Tipo de Conta *
            </p>
            <div className="account-type-grid">
              {accountOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`account-type-button ${form.tipo_conta === option.value ? 'active' : ''}`}
                  onClick={() => handleAccountChange(option.value)}
                >
                  <span className="account-type-icon">{option.icon}</span>
                  <div>
                    <strong style={{ display: 'block' }}>{option.label}</strong>
                    <span className="muted" style={{ fontSize: '0.86rem' }}>
                      {option.value === 'usuario' ? 'Acesso padrão' : option.value === 'empresa consumidora' ? 'Compras corporativas' : option.value === 'freelancer' ? 'Venda de serviços' : 'Controle total'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="field-grid columns-2" style={{ marginBottom: '1rem' }}>
            <div className="field-group">
              <label htmlFor="nome" className="field-label">Nome completo / Nome da Empresa *</label>
              <input
                id="nome"
                name="nome"
                type="text"
                className="input"
                placeholder="Seu nome ou Razão Social"
                value={form.nome}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            <div className="field-group">
              <label htmlFor="email" className="field-label">E-mail *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field-grid columns-2" style={{ marginBottom: '1rem' }}>
            <div className="field-group">
              <label htmlFor="cpf" className="field-label">CPF / CNPJ *</label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                className="input"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                value={form.cpf}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div className="field-group">
              <label htmlFor="telefone" className="field-label">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                className="input"
                placeholder="(11) 90000-0000"
                value={form.telefone}
                onChange={handleChange}
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="field-grid columns-2" style={{ marginBottom: '1rem' }}>
            <div className="field-group">
              <label htmlFor="senha" className="field-label">Senha *</label>
              <input
                id="senha"
                name="senha"
                type="password"
                className="input"
                placeholder="Mínimo 8 caracteres"
                value={form.senha}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
            <div className="field-group">
              <label htmlFor="confirmar_senha" className="field-label">Confirmar senha *</label>
              <input
                id="confirmar_senha"
                name="confirmar_senha"
                type="password"
                className="input"
                placeholder="Repita a senha"
                value={form.confirmar_senha}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="form-footnote" style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          Já tem uma conta?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Entrar
          </Link>
        </p>
      </div>
    </section>
  );
}
