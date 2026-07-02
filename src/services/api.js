const json = async (res) => {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error(body.error || 'Sua sessão expirou. Faça login novamente.');
    if (res.status === 403) throw new Error(body.error || 'Acesso negado. Faça login novamente.');
    if (res.status === 404) throw new Error(body.error || 'Recurso não encontrado.');
    throw new Error(body.error || `Erro ${res.status}: Não foi possível processar a solicitação.`);
  }
  return res.json();
};

export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (error) {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
  }

  return json(response);
};
