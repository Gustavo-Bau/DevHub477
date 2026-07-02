import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, updatePassword } from '../services/userService';
import Seo from '../seo/Seo';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [editForm, setEditForm] = useState({ nome: '', telefone: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editMsg, setEditMsg] = useState({ type: '', text: '' });

  const [pwForm, setPwForm] = useState({ senha_atual: '', nova_senha: '', confirmar_senha: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setEditForm({ nome: data.nome || '', telefone: data.telefone || '' });
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, []);

  const handleEditChange = (e) => setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditMsg({ type: '', text: '' });
    setEditLoading(true);
    try {
      const updated = await updateProfile(editForm);
      setProfile(updated);
      updateUser(updated);
      setEditMsg({ type: 'ok', text: 'Perfil atualizado com sucesso.' });
    } catch (err) {
      setEditMsg({ type: 'err', text: err.message || 'Erro ao atualizar perfil.' });
    } finally {
      setEditLoading(false);
    }
  };

  const handlePwChange = (e) => setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg({ type: '', text: '' });

    if (pwForm.nova_senha !== pwForm.confirmar_senha) {
      setPwMsg({ type: 'err', text: 'As senhas não coincidem.' });
      return;
    }

    setPwLoading(true);
    try {
      await updatePassword(pwForm.senha_atual, pwForm.nova_senha);
      setPwForm({ senha_atual: '', nova_senha: '', confirmar_senha: '' });
      setPwMsg({ type: 'ok', text: 'Senha atualizada com sucesso.' });
    } catch (err) {
      setPwMsg({ type: 'err', text: err.message || 'Erro ao atualizar senha.' });
    } finally {
      setPwLoading(false);
    }
  };

  if (loadingProfile) {
    return <p className="muted" style={{ padding: '2rem 0' }}>Carregando perfil...</p>;
  }

  return (
    <section className="page-shell" style={{ maxWidth: 960 }}>
      <Seo title="Perfil | DEVHUB" description="Gerencie seu perfil." path="/perfil" />

      <div className="section-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <p className="eyebrow">Minha conta</p>
          <h1 style={{ margin: 0 }}>Perfil de usuário</h1>
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Atualize seus dados pessoais e mantenga sua conta segura.
          </p>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="card card-surface">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0 }}>Dados pessoais</h2>
            </div>
          </div>

          {editMsg.text && (
            <div className={editMsg.type === 'ok' ? 'alert-success' : 'alert-error'}>{editMsg.text}</div>
          )}

          <form onSubmit={handleEditSubmit}>
            <div className="field-grid columns-2">
              <div className="field-group">
                <label htmlFor="nome" className="field-label">Nome</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  className="input"
                  value={editForm.nome}
                  onChange={handleEditChange}
                />
              </div>
              <div className="field-group">
                <label htmlFor="telefone" className="field-label">Telefone</label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  className="input"
                  value={editForm.telefone}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="field-group" style={{ marginTop: '1rem' }}>
              <label className="field-label">E-mail</label>
              <input
                type="email"
                className="input"
                value={profile?.email || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={editLoading} style={{ marginTop: '1.25rem' }}>
              {editLoading ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </form>
        </div>

        <div className="card card-surface">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0 }}>Alterar senha</h2>
            </div>
          </div>

          {pwMsg.text && (
            <div className={pwMsg.type === 'ok' ? 'alert-success' : 'alert-error'}>{pwMsg.text}</div>
          )}

          <form onSubmit={handlePwSubmit}>
            {[
              { id: 'senha_atual', label: 'Senha atual', autoComplete: 'current-password' },
              { id: 'nova_senha', label: 'Nova senha', autoComplete: 'new-password' },
              { id: 'confirmar_senha', label: 'Confirmar nova senha', autoComplete: 'new-password' },
            ].map(({ id, label, autoComplete }) => (
              <div key={id} className="field-group">
                <label htmlFor={id} className="field-label">{label}</label>
                <input
                  id={id}
                  name={id}
                  type="password"
                  className="input"
                  value={pwForm[id]}
                  onChange={handlePwChange}
                  autoComplete={autoComplete}
                />
              </div>
            ))}

            <button type="submit" className="btn btn-primary btn-full" disabled={pwLoading}>
              {pwLoading ? 'Atualizando...' : 'Atualizar senha'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
