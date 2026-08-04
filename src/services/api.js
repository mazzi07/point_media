const BASE_URL = '';

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include' // manda os cookies junto na requisicao
    });

    // se o servidor devolver 401, desloga o usuario
    if (response.status === 401) {
      localStorage.removeItem('pm_user');
      if (path !== '/api/auth/login' && path !== '/api/auth/register') {
         window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    // so retorna a response se for json
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response;
    } else {
      return {
        ok: response.ok,
        status: response.status,
        json: async () => ({ success: false, message: 'Servidor indisponível no momento' })
      };
    }
  } catch (error) {
    // sem conexao com o servidor
    return {
      ok: false,
      status: 503,
      json: async () => ({ success: false, message: 'Erro de conexão com o servidor' })
    };
  }
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
