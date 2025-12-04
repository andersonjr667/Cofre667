// Verificar autenticação
function checkAuth() {
  const token = api.getToken();
  const currentPage = window.location.pathname;

  // Páginas que não requerem autenticação
  const publicPages = ['/pages/login.html', '/index.html', '/'];

  if (!token && !publicPages.some(page => currentPage.includes(page))) {
    window.location.href = '/pages/login.html';
    return false;
  }

  if (token && publicPages.some(page => currentPage.includes(page))) {
    window.location.href = '/pages/dashboard.html';
    return false;
  }

  return true;
}

// Executar verificação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
});
