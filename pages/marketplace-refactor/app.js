/**
 * Estado central da aplicação.
 * Mantém filtros ativos, produtos e carrinho.
 */
const state = {
  products: window.MARKETPLACE_PRODUCTS ?? [],
  filters: {
    query: '',
    category: 'all',
    maxPrice: 500,
  },
  cart: {},
};

/**
 * Cache de elementos do DOM para evitar buscas repetidas e melhorar legibilidade.
 */
const elements = {
  searchInput: document.querySelector('#searchInput'),
  categorySelect: document.querySelector('#categorySelect'),
  priceInput: document.querySelector('#priceInput'),
  priceLabel: document.querySelector('#priceLabel'),
  clearFiltersBtn: document.querySelector('#clearFiltersBtn'),
  productGrid: document.querySelector('#productGrid'),
  resultCount: document.querySelector('#resultCount'),
  emptyState: document.querySelector('#emptyState'),
  cartList: document.querySelector('#cartList'),
  cartCount: document.querySelector('#cartCount'),
  cartTotal: document.querySelector('#cartTotal'),
  themeToggle: document.querySelector('#themeToggle'),
};

/**
 * Funções utilitárias reutilizáveis.
 */
const formatCurrency = (value) => `$${Number(value).toFixed(2)}`;

const getFilteredProducts = () => {
  const query = state.filters.query.trim().toLowerCase();

  return state.products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory =
      state.filters.category === 'all' || product.category === state.filters.category;

    const matchesPrice = product.price <= state.filters.maxPrice;

    return matchesQuery && matchesCategory && matchesPrice;
  });
};

const getCartItems = () => Object.values(state.cart);

/**
 * Renderiza cards de produto de forma centralizada.
 */
function renderProducts() {
  const products = getFilteredProducts();

  elements.productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="card">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Categoria:</strong> ${product.category}</p>
        <div class="card__footer">
          <strong>${formatCurrency(product.price)}</strong>
          <button class="btn btn--secondary" data-action="add" data-id="${product.id}" type="button">
            Adicionar
          </button>
        </div>
      </article>
    `,
    )
    .join('');

  elements.resultCount.textContent = `${products.length} resultado(s)`;
  elements.emptyState.hidden = products.length > 0;
}

/**
 * Renderiza o carrinho e resumo.
 */
function renderCart() {
  const items = getCartItems();

  elements.cartList.innerHTML = items
    .map(
      (item) => `
      <li class="cart-item">
        <div class="cart-item__top">
          <strong>${item.name}</strong>
          <button class="btn btn--danger" data-action="remove" data-id="${item.id}" type="button">Remover</button>
        </div>
        <small>${formatCurrency(item.price)} cada</small>
        <div class="cart-item__qty">
          <button class="btn btn--ghost" data-action="decrease" data-id="${item.id}" type="button">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn--ghost" data-action="increase" data-id="${item.id}" type="button">+</button>
        </div>
      </li>
    `,
    )
    .join('');

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  elements.cartCount.textContent = String(count);
  elements.cartTotal.textContent = formatCurrency(total);
}

/**
 * Preenche o select de categoria dinamicamente a partir dos dados.
 */
function populateCategoryOptions() {
  const categories = [...new Set(state.products.map((product) => product.category))];

  const optionsHtml = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join('');

  elements.categorySelect.insertAdjacentHTML('beforeend', optionsHtml);
}

/**
 * Atualiza estado do carrinho sem duplicar lógica de add/increase/decrease.
 */
function updateCart(productId, operation) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const currentItem = state.cart[productId] ?? { ...product, quantity: 0 };

  if (operation === 'add' || operation === 'increase') {
    currentItem.quantity += 1;
    state.cart[productId] = currentItem;
  }

  if (operation === 'decrease') {
    currentItem.quantity = Math.max(0, currentItem.quantity - 1);
    if (currentItem.quantity === 0) {
      delete state.cart[productId];
    } else {
      state.cart[productId] = currentItem;
    }
  }

  if (operation === 'remove') {
    delete state.cart[productId];
  }

  renderCart();
}

/**
 * Registra eventos de UI (filtros, clique em botões e tema).
 */
function bindEvents() {
  elements.searchInput.addEventListener('input', (event) => {
    state.filters.query = event.target.value;
    renderProducts();
  });

  elements.categorySelect.addEventListener('change', (event) => {
    state.filters.category = event.target.value;
    renderProducts();
  });

  elements.priceInput.addEventListener('input', (event) => {
    state.filters.maxPrice = Number(event.target.value);
    elements.priceLabel.textContent = `Até ${formatCurrency(state.filters.maxPrice)}`;
    renderProducts();
  });

  elements.clearFiltersBtn.addEventListener('click', () => {
    state.filters = { query: '', category: 'all', maxPrice: 500 };
    elements.searchInput.value = '';
    elements.categorySelect.value = 'all';
    elements.priceInput.value = '500';
    elements.priceLabel.textContent = 'Até $500';
    renderProducts();
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const { action, id } = target.dataset;
    updateCart(id, action);
  });

  elements.themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });
}

/**
 * Inicialização da aplicação.
 */
function init() {
  populateCategoryOptions();
  bindEvents();
  renderProducts();
  renderCart();
}

init();
