const form = document.getElementById('settings-form');
const messageContainer = document.getElementById('message-container');

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
document.addEventListener('DOMContentLoaded', loadSettings);
