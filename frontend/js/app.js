import { renderProductList } from './components/productList.js';
import { cadastrarUsuario, loginUsuario, obterSessao } from './services/authService.js';
import { filtrarProdutos, listarProdutos } from './services/produtosService.js';

const CART_KEY = 'devhub:cart';
let produtosCache = [];

function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(produtoId) {
  const cart = getCart();
  const found = cart.find((item) => item.id === produtoId);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id: produtoId, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.querySelector('[data-cart-badge]');
  if (!badge) return;
  const totalItems = getCart().reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = String(totalItems);
}

function setupSearch() {
  const searchInput = document.querySelector('#searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const filtered = filtrarProdutos(produtosCache, searchInput.value);
    renderProductList(document.querySelector('#productsContainer'), filtered);
  });
}

function setupAuthForms() {
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = loginForm.querySelector('[name=email]').value;
      const senha = loginForm.querySelector('[name=senha]').value;
      const out = document.querySelector('#authFeedback');

      try {
        const session = await loginUsuario(email, senha);
        out.textContent = `Bem-vindo, ${session.usuario.nome}!`;
      } catch (error) {
        out.textContent = error.message;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nome = registerForm.querySelector('[name=nome]').value;
      const email = registerForm.querySelector('[name=email]').value;
      const senha = registerForm.querySelector('[name=senha]').value;
      const out = document.querySelector('#authFeedback');

      try {
        await cadastrarUsuario({ nome, email, senha });
        out.textContent = 'Cadastro realizado com sucesso!';
      } catch (error) {
        out.textContent = error.message;
      }
    });
  }
}

async function carregarHome() {
  const container = document.querySelector('#productsContainer');
  if (!container) return;

  container.innerHTML = '<p class="message info">Carregando produtos...</p>';

  try {
    produtosCache = await listarProdutos();
    renderProductList(container, produtosCache);
  } catch (error) {
    container.innerHTML = `<p class="message error">${error.message}</p>`;
  }
}

function setupProductCardEvents() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-cart]');
    if (!button) return;

    const produtoId = Number(button.getAttribute('data-add-cart'));
    addToCart(produtoId);
  });
}

function renderSession() {
  const sessionBox = document.querySelector('#sessionBox');
  if (!sessionBox) return;

  const session = obterSessao();
  sessionBox.textContent = session ? `Logado como: ${session.usuario.email}` : 'Não autenticado';
}

async function init() {
  setupSearch();
  setupAuthForms();
  setupProductCardEvents();
  updateCartBadge();
  renderSession();
  await carregarHome();
}

init();
