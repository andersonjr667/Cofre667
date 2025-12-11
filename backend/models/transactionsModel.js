const jsonStore = require('../config/jsonStore');
const { isConnected } = require('../config/db');
const TransactionSchema = require('./schemas/Transaction');

// Normaliza datas vindas do cliente para evitar inversão dia/mês
function normalizeDateInput(raw) {
  if (!raw) return new Date();
  if (raw instanceof Date) return raw;

  // ISO ou YYYY-MM-DD
  if (typeof raw === 'string' && (raw.includes('T') || /^\d{4}-\d{2}-\d{2}$/.test(raw))) {
    const d = new Date(raw);
    if (!isNaN(d)) return d;
  }

  // Formato com barras: tentar detectar D/M/Y vs M/D/Y
  if (typeof raw === 'string' && raw.includes('/')) {
    const parts = raw.split('/').map(p => parseInt(p, 10));
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
      let [p1, p2, year] = parts;
      let day, month;
      // heurísticas
      if (p1 > 12 && p2 <= 12) {
        day = p1; month = p2; // claro D/M/Y
      } else if (p2 > 12 && p1 <= 12) {
        day = p2; month = p1; // claro M/D/Y
      } else {
        day = p1; month = p2; // assume D/M/Y
      }
      const d = new Date(Date.UTC(year, month - 1, day));
      if (!isNaN(d)) return d;
    }
  }

  // fallback
  const d = new Date(raw);
  if (!isNaN(d)) return d;
  return new Date();
}

class TransactionsModel {
  // Criar nova transação
  async create(transactionData) {
    try {
      if (isConnected()) {
        const transaction = new TransactionSchema({
          userId: transactionData.userId,
          type: transactionData.type,
          category: transactionData.category || '',
          amount: parseFloat(transactionData.amount) || 0,
          description: transactionData.description || '',
          date: normalizeDateInput(transactionData.date)
        });
        const saved = await transaction.save();
        return saved.toJSON();
      } else {
        const transaction = {
          id: this.generateId(),
          userId: transactionData.userId,
          type: transactionData.type,
          category: transactionData.category || '',
          amount: parseFloat(transactionData.amount) || 0,
          description: transactionData.description || '',
          date: normalizeDateInput(transactionData.date).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return jsonStore.addItem('transactions', transaction);
      }
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as transações de um usuário
  async findByUserId(userId) {
    try {
      if (isConnected()) {
        const transactions = await TransactionSchema.find({ userId }).sort({ date: -1 });
        return transactions.map(t => t.toJSON());
      } else {
        return jsonStore.findAll('transactions', transaction => transaction.userId === userId);
      }
    } catch (error) {
      throw error;
    }
  }

  // Buscar transação por ID
  async findById(id) {
    try {
      if (isConnected()) {
        const transaction = await TransactionSchema.findById(id);
        return transaction ? transaction.toJSON() : null;
      } else {
        return jsonStore.findById('transactions', id);
      }
    } catch (error) {
      throw error;
    }
  }

  // Listar todas as transações
  async findAll() {
    try {
      if (isConnected()) {
        const transactions = await TransactionSchema.find().sort({ date: -1 });
        return transactions.map(t => t.toJSON());
      } else {
        return jsonStore.getTable('transactions');
      }
    } catch (error) {
      throw error;
    }
  }

  // Atualizar transação
  async update(id, updates) {
    try {
      if (isConnected()) {
        if (updates.amount) {
          updates.amount = parseFloat(updates.amount);
        }
        if (updates.date) {
          updates.date = normalizeDateInput(updates.date);
        }
        const transaction = await TransactionSchema.findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true, runValidators: true }
        );
        return transaction ? transaction.toJSON() : null;
      } else {
        if (updates.amount) {
          updates.amount = parseFloat(updates.amount);
        }
        if (updates.date) {
          updates.date = normalizeDateInput(updates.date).toISOString();
        }
        updates.updatedAt = new Date().toISOString();
        return jsonStore.updateItem('transactions', id, updates);
      }
    } catch (error) {
      throw error;
    }
  }

  // Deletar transação
  async delete(id) {
    try {
      if (isConnected()) {
        const transaction = await TransactionSchema.findByIdAndDelete(id);
        return transaction ? transaction.toJSON() : null;
      } else {
        return jsonStore.deleteItem('transactions', id);
      }
    } catch (error) {
      throw error;
    }
  }

  // Calcular saldo total
  async calculateBalance(userId) {
    try {
      const transactions = await this.findByUserId(userId);
      
      const balance = transactions.reduce((total, transaction) => {
        if (transaction.type === 'entrada') {
          return total + transaction.amount;
        } else if (transaction.type === 'saida') {
          return total - transaction.amount;
        }
        return total;
      }, 0);

      return balance;
    } catch (error) {
      throw error;
    }
  }

  // Gerar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = new TransactionsModel();
