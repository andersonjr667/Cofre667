const form = document.getElementById('settings-form');
const messageContainer = document.getElementById('message-container');
const cleanupContainer = document.getElementById('cleanup-actions');

let currentSettings = {
  currency: 'BRL',
  language: 'pt-BR',
  theme: 'light',
  notifications: true,
  categories: {
    income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
    expense: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros']
  }
};

const cleanupActions = [
  {
    scope: 'transactions_all',
    title: 'Apagar todas as transações',
    description: 'Remove entradas e saídas da sua conta.'
  },
  {
    scope: 'transactions_entrada',
    title: 'Apagar apenas entradas',
    description: 'Mantém saídas, apaga somente lançamentos de entrada.'
  },
  {
    scope: 'transactions_saida',
    title: 'Apagar apenas saídas',
    description: 'Mantém entradas, apaga apenas lançamentos de saída.'
  },
  {
    scope: 'investments_all',
    title: 'Apagar investimentos',
    description: 'Remove todos os investimentos cadastrados.'
  },
  {
    scope: 'debtors_all',
    title: 'Apagar devedores',
    description: 'Remove devedores e valores associados.'
  },
  {
    scope: 'debtHistory_all',
    title: 'Apagar histórico de dívidas',
    description: 'Limpa registros de histórico de dívidas.'
  }
];

// Carregar configurações
async function loadSettings() {
  try {
    const response = await api.getSettings();
    if (response.data.sucesso) {
      currentSettings = { ...currentSettings, ...response.data.configuracoes };
      
      // Garantir que categorias existam
      if (!currentSettings.categories) {
        currentSettings.categories = {
          income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
          expense: ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde', 'Educação', 'Outros']
        };
      }
      
      document.getElementById('currency').value = currentSettings.currency || 'BRL';
      document.getElementById('language').value = currentSettings.language || 'pt-BR';
      document.getElementById('theme').value = currentSettings.theme || 'light';
      document.getElementById('notifications').checked = currentSettings.notifications !== false;
      
      renderCategories();
    }
  } catch (error) {
    console.error('Erro ao carregar configurações:', error);
    renderCategories(); // Renderizar categorias padrão
  }
}

// Renderizar categorias
function renderCategories() {
  const incomeContainer = document.getElementById('income-categories');
  const expenseContainer = document.getElementById('expense-categories');
  
  incomeContainer.innerHTML = currentSettings.categories.income.map((cat, index) => `
    <div class="category-item">
      <span>${cat}</span>
      <button type="button" class="btn-delete" onclick="removeCategory('income', ${index})" title="Remover">×</button>
    </div>
  `).join('');
  
  expenseContainer.innerHTML = currentSettings.categories.expense.map((cat, index) => `
    <div class="category-item">
      <span>${cat}</span>
      <button type="button" class="btn-delete" onclick="removeCategory('expense', ${index})" title="Remover">×</button>
    </div>
  `).join('');
}

// Renderizar ações de limpeza
function renderCleanupActions() {
  if (!cleanupContainer) return;

  cleanupContainer.innerHTML = cleanupActions.map(action => `
    <div class="cleanup-card">
      <div>
        <h4>${action.title}</h4>
        <p>${action.description}</p>
      </div>
      <button type="button" class="btn btn-danger" data-scope="${action.scope}">Apagar</button>
    </div>
  `).join('');

  cleanupContainer.querySelectorAll('button[data-scope]').forEach(btn => {
    btn.addEventListener('click', () => handleCleanup(btn.dataset.scope));
  });
}

// Adicionar categoria
async function addCategory(type) {
  const inputId = type === 'income' ? 'new-income-category' : 'new-expense-category';
  const input = document.getElementById(inputId);
  const categoryName = input.value.trim();
  
  if (!categoryName) {
    showMessage('Digite o nome da categoria', 'error');
    return;
  }
  
  if (currentSettings.categories[type].includes(categoryName)) {
    showMessage('Esta categoria já existe', 'error');
    return;
  }
  
  currentSettings.categories[type].push(categoryName);
  input.value = '';
  
  await saveSettings();
  renderCategories();
  showMessage('Categoria adicionada com sucesso!', 'success');
}

// Remover categoria
async function removeCategory(type, index) {
  if (!confirm('Deseja realmente remover esta categoria?')) {
    return;
  }
  
  currentSettings.categories[type].splice(index, 1);
  
  await saveSettings();
  renderCategories();
  showMessage('Categoria removida com sucesso!', 'success');
}

// Salvar configurações
async function saveSettings() {
  try {
    const response = await api.updateSettings(currentSettings);
    
    if (!response.data.sucesso) {
      throw new Error('Erro ao salvar');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return false;
  }
}

// Salvar configurações do formulário
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  currentSettings.currency = document.getElementById('currency').value;
  currentSettings.language = document.getElementById('language').value;
  currentSettings.theme = document.getElementById('theme').value;
  currentSettings.notifications = document.getElementById('notifications').checked;

  if (await saveSettings()) {
    showMessage('Configurações salvas com sucesso!', 'success');
  } else {
    showMessage('Erro ao salvar configurações', 'error');
  }
});

// Mostrar mensagem
function showMessage(message, type) {
  messageContainer.innerHTML = `
    <div class="${type}-message">
      ${message}
    </div>
  `;
  
  setTimeout(() => {
    messageContainer.innerHTML = '';
  }, 3000);
}

// Carregar ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  renderCleanupActions();
  loadSettings();
});

// Executar limpeza
async function handleCleanup(scope) {
  const action = cleanupActions.find(item => item.scope === scope);
  const label = action ? action.title.toLowerCase() : 'esta ação';

  if (!confirm(`Deseja realmente ${label}? Esta ação não pode ser desfeita.`)) {
    return;
  }

  try {
    const response = await api.cleanupData(scope);
    if (response.data.sucesso) {
      showMessage('Dados apagados com sucesso!', 'success');
    } else {
      showMessage(response.data.mensagem || 'Erro ao apagar dados', 'error');
    }
  } catch (error) {
    showMessage('Erro ao apagar dados', 'error');
  }
}
