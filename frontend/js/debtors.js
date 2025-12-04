let debtors = [];
let editingId = null;

const modal = document.getElementById('debtor-modal');
const form = document.getElementById('debtor-form');
const addBtn = document.getElementById('add-debtor-btn');
const closeBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');

addBtn.addEventListener('click', () => {
  editingId = null;
  form.reset();
  document.getElementById('modal-title').textContent = 'Novo Devedor';
  modal.classList.add('active');
});

closeBtn.addEventListener('click', () => modal.classList.remove('active'));
cancelBtn.addEventListener('click', () => modal.classList.remove('active'));

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    amount: parseFloat(document.getElementById('amount').value),
    description: document.getElementById('description').value,
    dueDate: document.getElementById('dueDate').value || null,
    status: document.getElementById('status').value
  };

  try {
    if (editingId) {
      await api.updateDebtor(editingId, data);
    } else {
      await api.createDebtor(data);
    }

    modal.classList.remove('active');
    loadDebtors();
  } catch (error) {
    alert('Erro ao salvar devedor');
  }
});

async function loadDebtors() {
  try {
    const response = await api.getDebtors();
    if (response.data.sucesso) {
      debtors = response.data.devedores;
      displayDebtors();
      updateTotal();
    }
  } catch (error) {
    console.error('Erro ao carregar devedores:', error);
  }
}

function displayDebtors() {
  const container = document.getElementById('debtors-table');

  if (debtors.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon"><span class="icon icon-people"></span></div><p>Nenhum devedor cadastrado</p></div>';
    return;
  }

  const html = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Valor</th>
          <th>Descrição</th>
          <th>Vencimento</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${debtors.map(d => `
          <tr>
            <td>${d.name}</td>
            <td class="amount negative">R$ ${d.amount.toFixed(2).replace('.', ',')}</td>
            <td>${d.description || '-'}</td>
            <td>${d.dueDate ? new Date(d.dueDate).toLocaleDateString('pt-BR') : '-'}</td>
            <td><span class="status-badge ${d.status}">${d.status}</span></td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-small btn-secondary" onclick="editDebtor('${d.id}')">Editar</button>
                <button class="btn btn-small btn-danger" onclick="deleteDebtor('${d.id}')">Excluir</button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

async function editDebtor(id) {
  const debtor = debtors.find(d => d.id === id);
  if (!debtor) return;

  editingId = id;
  document.getElementById('modal-title').textContent = 'Editar Devedor';
  document.getElementById('name').value = debtor.name;
  document.getElementById('amount').value = debtor.amount;
  document.getElementById('description').value = debtor.description || '';
  document.getElementById('dueDate').value = debtor.dueDate ? debtor.dueDate.split('T')[0] : '';
  document.getElementById('status').value = debtor.status;

  modal.classList.add('active');
}

async function deleteDebtor(id) {
  if (!confirm('Deseja realmente excluir este devedor?')) return;

  try {
    await api.deleteDebtor(id);
    loadDebtors();
  } catch (error) {
    alert('Erro ao excluir devedor');
  }
}

function updateTotal() {
  const total = debtors.filter(d => d.status !== 'pago').reduce((sum, d) => sum + d.amount, 0);
  document.getElementById('total-debt').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

document.addEventListener('DOMContentLoaded', loadDebtors);
