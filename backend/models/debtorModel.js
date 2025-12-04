const jsonStore = require('../config/jsonStore');

class DebtorModel {
  // Criar novo devedor
  async create(debtorData) {
    try {
      const debtor = {
        id: this.generateId(),
        userId: debtorData.userId,
        name: debtorData.name,
        amount: parseFloat(debtorData.amount) || 0,
        description: debtorData.description || '',
        dueDate: debtorData.dueDate || null,
        status: debtorData.status || 'pendente', // pendente, pago, atrasado
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return jsonStore.addItem('debtors', debtor);
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os devedores de um usuário
  async findByUserId(userId) {
    try {
      return jsonStore.findAll('debtors', debtor => debtor.userId === userId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar devedor por ID
  async findById(id) {
    try {
      return jsonStore.findById('debtors', id);
    } catch (error) {
      throw error;
    }
  }

  // Listar todos os devedores
  async findAll() {
    try {
      return jsonStore.getTable('debtors');
    } catch (error) {
      throw error;
    }
  }

  // Atualizar devedor
  async update(id, updates) {
    try {
      if (updates.amount) {
        updates.amount = parseFloat(updates.amount);
      }
      updates.updatedAt = new Date().toISOString();
      return jsonStore.updateItem('debtors', id, updates);
    } catch (error) {
      throw error;
    }
  }

  // Deletar devedor
  async delete(id) {
    try {
      return jsonStore.deleteItem('debtors', id);
    } catch (error) {
      throw error;
    }
  }

  // Gerar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = new DebtorModel();
