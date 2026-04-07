/**
 * Camada de API mockada.
 * Troque os retornos por fetch('/api/...') quando o backend real estiver disponível.
 */

const MOCK_PRODUTOS = [
  { id: 1, nome: 'CloudScale Pro', descricao: 'Escalabilidade cloud com observabilidade.', preco: 49, imagem: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900' },
  { id: 2, nome: 'InsightX Analytics', descricao: 'Métricas em tempo real para times de produto.', preco: 12, imagem: 'https://images.unsplash.com/photo-1551281044-8b7a4cee4c9c?w=900' },
  { id: 3, nome: 'Sentinel Guard', descricao: 'Segurança e monitoramento de ameaças.', preco: 29, imagem: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=900' },
  { id: 4, nome: 'DevConsole Plus', descricao: 'Ferramentas de produtividade para dev teams.', preco: 0, imagem: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=900' },
];

const MOCK_USERS = [
  { id: 1, nome: 'Admin DevHub', email: 'admin@devhub.com', senha: '123456' },
];

function randomDelay() {
  return Math.floor(Math.random() * 400) + 100;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProdutos() {
  try {
    await wait(randomDelay());
    return [...MOCK_PRODUTOS];
  } catch (error) {
    throw new Error('Falha ao carregar produtos (mock).');
  }
}

export async function getProdutoById(id) {
  try {
    await wait(randomDelay());
    const produto = MOCK_PRODUTOS.find((item) => item.id === Number(id));
    if (!produto) throw new Error('Produto não encontrado.');
    return { ...produto };
  } catch (error) {
    throw new Error(error.message || 'Falha ao buscar produto (mock).');
  }
}

export async function login(email, senha) {
  try {
    await wait(randomDelay());
    const user = MOCK_USERS.find((u) => u.email === email && u.senha === senha);
    if (!user) throw new Error('Credenciais inválidas.');

    // Futuro backend: POST /auth/login com token JWT.
    return { token: 'mock-token', usuario: { id: user.id, nome: user.nome, email: user.email } };
  } catch (error) {
    throw new Error(error.message || 'Falha no login (mock).');
  }
}

export async function register(usuario) {
  try {
    await wait(randomDelay());
    const exists = MOCK_USERS.some((u) => u.email === usuario.email);
    if (exists) throw new Error('E-mail já cadastrado.');

    const novo = { id: Date.now(), ...usuario };
    MOCK_USERS.push(novo);

    // Futuro backend: POST /auth/register persistindo no MySQL.
    return { id: novo.id, nome: novo.nome, email: novo.email };
  } catch (error) {
    throw new Error(error.message || 'Falha no cadastro (mock).');
  }
}
