let app, auth, db;

function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK não carregado');
    return false;
  }

  try {
    app = firebase.initializeApp(window.firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    
    auth.onAuthStateChanged((user) => {
      if (user) {
        atualizarInterfaceUsuario(user);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
    return false;
  }
}

function atualizarInterfaceUsuario(user) {
  db.collection('usuarios').doc(user.uid).get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        localStorage.setItem("summitCurrentUser", JSON.stringify({
          id: user.uid,
          email: user.email,
          ...userData
        }));
        
        const authLinks = document.querySelectorAll("a[href=\"auth.html\"]");
        authLinks.forEach(link => {
          if (link.textContent.includes('Entrar')) {
            link.textContent = `Olá, ${userData.nome}`;
            link.href = `perfil-${userData.tipo}.html`;
          }
        });
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados do usuário:', error);
    });
}

const products = [
  { id: 1, title: 'Logo e Identidade Visual', type:'Serviço', cat:'Design', price: 450, rating: 4.9 },
  { id: 2, title: 'Landing Page Profissional', type:'Serviço', cat:'Programação', price: 1200, rating: 4.8 },
  { id: 3, title: 'Gestão de Tráfego 30 dias', type:'Serviço', cat:'Marketing', price: 850, rating: 4.7 },
  { id: 4, title: 'Kit embalagens personalizadas', type:'Produto', cat:'Comércio', price: 199, rating: 4.6 },
  { id: 5, title: 'E-commerce completo', type:'Serviço', cat:'Programação', price: 3500, rating: 5.0 },
  { id: 6, title: 'Fotos para catálogo (20)', type:'Serviço', cat:'Design', price: 590, rating: 4.8 },
];

const Summit = {
  renderCards: (list = products) => {
    const el = document.getElementById('cards');
    if (!el) return;
    el.innerHTML = list.map(p => `
      <article class="item-card">
        <div class="cover"></div>
        <div class="body">
          <strong>${p.title}</strong>
          <div class="meta">
            <span class="badge">${p.cat} · ${p.type}</span>
            <span class="rating">★ ${p.rating.toFixed(1)}</span>
          </div>
          <div class="meta">
            <span class="price">R$ ${p.price.toLocaleString('pt-BR')}</span>
            <button class="btn btn-primary" onclick="alert('Contato enviado ao anunciante!')">Contatar</button>
          </div>
        </div>
      </article>
    `).join('');
  },
  search: () => {
    const q = (document.getElementById('search')?.value || '').toLowerCase();
    const filtered = products.filter(p => p.title.toLowerCase().includes(q));
    Summit.renderCards(filtered);
  },
  applyFilters: () => {
    const cat = document.getElementById('f-cat')?.value || '';
    const typ = document.getElementById('f-type')?.value || '';
    const ord = document.getElementById('f-order')?.value || '';

    let list = products.filter(p => (!cat || p.cat === cat) && (!typ || p.type === typ));

    if (ord === 'Mais recentes') list = list.reverse();
    if (ord === 'Menor preço') list = list.sort((a,b)=>a.price-b.price);
    if (ord === 'Maior preço') list = list.sort((a,b)=>b.price-a.price);
    if (ord === 'Melhor avaliados') list = list.sort((a,b)=>b.rating-a.rating);

    Summit.renderCards(list);
  }
};

const ApiUtils = {
  showMessage(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      max-width: 300px;
      word-wrap: break-word;
    `;

    switch (type) {
      case 'success':
        notification.style.backgroundColor = '#28a745';
        break;
      case 'error':
        notification.style.backgroundColor = '#dc3545';
        break;
      case 'warning':
        notification.style.backgroundColor = '#ffc107';
        notification.style.color = '#212529';
        break;
      default:
        notification.style.backgroundColor = '#17a2b8';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
};

const SummitAuth = {
  register: async (e) => {
    e.preventDefault();
    
    try {
      const nome = document.getElementById('cad-nome').value.trim();
      const tipo = document.getElementById('cad-tipo').value;
      const email = document.getElementById('cad-email').value.toLowerCase().trim();
      const senha = document.getElementById('cad-senha').value;

      if (!nome || !tipo || !email || !senha) {
        ApiUtils.showMessage('Todos os campos são obrigatórios', 'error');
        return false;
      }

      if (senha.length < 6) {
        ApiUtils.showMessage('A senha deve ter pelo menos 6 caracteres', 'error');
        return false;
      }

      const response = await fetch("/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, tipo, email, senha }),
      });

      const data = await response.json();

      if (data.status === "error") {
        ApiUtils.showMessage(data.message, "error");
        return false;
      }

      ApiUtils.showMessage("Cadastro realizado com sucesso!", "success");

      setTimeout(() => {
        window.location.href = "/auth.html";
      }, 2000);

      setTimeout(() => {
        if (tipo === 'cliente') window.location.href = 'perfil-cliente.html';
        else if (tipo === 'empresa') window.location.href = 'perfil-empresa.html';
        else if (tipo === 'freelancer') window.location.href = 'perfil-freelancer.html';
      }, 1500);

    } catch (error) {
      let mensagem = 'Erro ao cadastrar usuário';
      
      if (error.code === 'auth/email-already-in-use') {
        mensagem = 'Email já cadastrado';
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'Email inválido';
      } else if (error.code === 'auth/weak-password') {
        mensagem = 'Senha muito fraca';
      }
      
      ApiUtils.showMessage(mensagem, 'error');
    }

    return false;
  },

  login: async (e) => {
    e.preventDefault();
    
    try {
      const email = document.getElementById('login-email').value.toLowerCase().trim();
      const senha = document.getElementById('login-senha').value;

      if (!email || !senha) {
        ApiUtils.showMessage('Email e senha são obrigatórios', 'error');
        return false;
      }

      const userCredential = await auth.signInWithEmailAndPassword(email, senha);
      const user = userCredential.user;

      const docRef = await db.collection('usuarios').doc(user.uid).get();
      
      if (!docRef.exists) {
        ApiUtils.showMessage('Dados do usuário não encontrados', 'error');
        return false;
      }

      const userData = docRef.data();

      ApiUtils.showMessage('Login realizado com sucesso!', 'success');

      setTimeout(() => {
        const tipo = userData.tipo;
        if (tipo === 'cliente') window.location.href = 'perfil-cliente.html';
        else if (tipo === 'empresa') window.location.href = 'perfil-empresa.html';
        else if (tipo === 'freelancer') window.location.href = 'perfil-freelancer.html';
        else window.location.href = 'marketplace.html';
      }, 1500);

    } catch (error) {
      let mensagem = 'Erro ao fazer login';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        mensagem = 'Email ou senha incorretos';
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'Email inválido';
      } else if (error.code === 'auth/user-disabled') {
        mensagem = 'Usuário desativado';
      }
      
      ApiUtils.showMessage(mensagem, 'error');
    }

    return false;
  },

  logout: async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("summitCurrentUser");
      ApiUtils.showMessage("Logout realizado com sucesso!", "success");
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } catch (error) {
      ApiUtils.showMessage('Erro ao fazer logout', 'error');
    }
  },

  isLoggedIn: () => {
    return auth.currentUser !== null;
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem("summitCurrentUser");
    return userData ? JSON.parse(userData) : null;
  }
};

const SummitAdmin = {
  async listarUsuarios() {
    try {
      const snapshot = await db.collection('usuarios')
        .orderBy('data_cadastro', 'desc')
        .limit(50)
        .get();
      
      const usuarios = [];
      snapshot.forEach((doc) => {
        usuarios.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return usuarios;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  },

  async buscarUsuarioPorId(id) {
    try {
      const doc = await db.collection('usuarios').doc(id).get();
      if (doc.exists) {
        return {
          id: doc.id,
          ...doc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  Summit.renderCards();
  
  const currentUser = SummitAuth.getCurrentUser();
  if (currentUser) {
    console.log("Usuário logado:", currentUser.nome);
  }
});

window.Summit = Summit;
window.SummitAuth = SummitAuth;
window.SummitAdmin = SummitAdmin;
window.initFirebase = initFirebase;

