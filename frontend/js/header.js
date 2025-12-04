// Header Component - Carrega e gerencia o header em todas as páginas

(function() {
  'use strict';

  // Carregar o header
  async function loadHeader() {
    try {
      const response = await fetch('/components/header.html');
      if (!response.ok) throw new Error('Erro ao carregar header');
      
      const headerHTML = await response.text();
      const headerContainer = document.getElementById('header-container');
      
      if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
        initializeHeader();
      }
    } catch (error) {
      console.error('Erro ao carregar header:', error);
    }
  }

  // Inicializar funcionalidades do header
  function initializeHeader() {
    // Carregar nome do usuário
    loadUserName();

    // Destacar página ativa
    highlightActivePage();

    // Configurar logout
    setupLogout();

    // Configurar menu mobile
    setupMobileMenu();
  }

  // Carregar nome do usuário do localStorage
  function loadUserName() {
    const userNameElement = document.getElementById('user-name');
    if (!userNameElement) return;

    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Decodificar token JWT (payload está no meio)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userName = payload.name || payload.email || 'Usuário';
        userNameElement.textContent = userName;
      }
    } catch (error) {
      console.error('Erro ao carregar nome do usuário:', error);
      userNameElement.textContent = 'Usuário';
    }
  }

  // Destacar link da página ativa
  function highlightActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (currentPath.includes(linkPath)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Configurar botão de logout
  function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
      // Limpar dados de autenticação
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirecionar para login
      window.location.href = '/pages/login.html';
    });
  }

  // Configurar menu mobile (toggle)
  function setupMobileMenu() {
    // Criar botão de toggle se não existir
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    let toggleBtn = document.querySelector('.mobile-menu-toggle');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'mobile-menu-toggle';
      toggleBtn.innerHTML = '☰';
      toggleBtn.setAttribute('aria-label', 'Menu');
      navContainer.appendChild(toggleBtn);
    }

    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      toggleBtn.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
    });

    // Fechar menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('active');
          toggleBtn.innerHTML = '☰';
        }
      });
    });
  }

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
  } else {
    loadHeader();
  }
})();
