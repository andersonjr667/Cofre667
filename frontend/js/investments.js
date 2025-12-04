let investments = [];
let editingId = null;

const modal = document.getElementById('investment-modal');
const form = document.getElementById('investment-form');
const addBtn = document.getElementById('add-investment-btn');
const closeBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');

addBtn.addEventListener('click', () => {
  editingId = null;
  form.reset();
  document.getElementById('modal-title').textContent = 'Novo Investimento';
  document.getElementById('startDate').valueAsDate = new Date();
  modal.classList.add('active');
});

closeBtn.addEventListener('click', () => modal.classList.remove('active'));
cancelBtn.addEventListener('click', () => modal.classList.remove('active'));

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    type: document.getElementById('type').value,
    amount: parseFloat(document.getElementById('amount').value),
    initialAmount: parseFloat(document.getElementById('initialAmount').value) || parseFloat(document.getElementById('amount').value),
    returnRate: parseFloat(document.getElementById('returnRate').value) || 0,
    description: document.getElementById('description').value,
    startDate: document.getElementById('startDate').value,
    status: document.getElementById('status').value
  };

  try {
    if (editingId) {
      await api.updateInvestment(editingId, data);
    } else {
      await api.createInvestment(data);
    }

    modal.classList.remove('active');
    loadInvestments();
  } catch (error) {
    alert('Erro ao salvar investimento');
  }
});

async function loadInvestments() {
  try {
    const response = await api.getInvestments();
    if (response.data.sucesso) {
      investments = response.data.investimentos;
      displayInvestments();
      updateTotal();
    }
  } catch (error) {
    console.error('Erro ao carregar investimentos:', error);
  }
}

function displayInvestments() {
  const container = document.getElementById('investments-container');

  if (investments.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><span class="icon icon-chart"></span></div><p>Nenhum investimento cadastrado</p></div>';
    return;
  }

  const html = investments.map(inv => `
    <div class="investment-card">
      <div class="investment-header">
        <div>
          <div class="investment-name">${inv.name}</div>
          <span class="investment-type">${inv.type || 'N/A'}</span>
        </div>
        <span class="status-badge ${inv.status}">${inv.status}</span>
      </div>
      <div class="investment-details">
        <div class="detail-item">
          <div class="detail-label">Valor Atual</div>
          <div class="detail-value amount positive">R$ ${inv.amount.toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Valor Inicial</div>
          <div class="detail-value">R$ ${inv.initialAmount.toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Retorno</div>
          <div class="detail-value return-rate">${inv.returnRate}%</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">Início</div>
          <div class="detail-value">${new Date(inv.startDate).toLocaleDateString('pt-BR')}</div>
        </div>
      </div>
      ${inv.description ? `<p style="color: #666; margin-top: 10px;">${inv.description}</p>` : ''}
      <div class="action-buttons" style="margin-top: 15px;">
        <button class="btn btn-small btn-secondary" onclick="editInvestment('${inv.id}')">Editar</button>
        <button class="btn btn-small btn-danger" onclick="deleteInvestment('${inv.id}')">Excluir</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

async function editInvestment(id) {
  const investment = investments.find(i => i.id === id);
  if (!investment) return;

  editingId = id;
  document.getElementById('modal-title').textContent = 'Editar Investimento';
  document.getElementById('name').value = investment.name;
  document.getElementById('type').value = investment.type || '';
  document.getElementById('amount').value = investment.amount;
  document.getElementById('initialAmount').value = investment.initialAmount;
  document.getElementById('returnRate').value = investment.returnRate;
  document.getElementById('description').value = investment.description || '';
  document.getElementById('startDate').value = investment.startDate.split('T')[0];
  document.getElementById('status').value = investment.status;

  modal.classList.add('active');
}

async function deleteInvestment(id) {
  if (!confirm('Deseja realmente excluir este investimento?')) return;

  try {
    await api.deleteInvestment(id);
    loadInvestments();
  } catch (error) {
    alert('Erro ao excluir investimento');
  }
}

function updateTotal() {
  const total = investments.filter(i => i.status === 'ativo').reduce((sum, i) => sum + i.amount, 0);
  document.getElementById('total-invested').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

document.addEventListener('DOMContentLoaded', loadInvestments);
