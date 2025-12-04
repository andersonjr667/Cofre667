const transactionsModel = require('../models/transactionsModel');

class TransactionsController {
  // Listar todas as transações do usuário
  async getAll(req, res) {
    try {
      const transactions = await transactionsModel.findByUserId(req.userId);
      
      // Ordenar por data (mais recentes primeiro)
      transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.json({
        sucesso: true,
        transacoes: transactions
      });
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar transações',
        erro: error.message
      });
    }
  }

  // Buscar transação por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await transactionsModel.findById(id);

      if (!transaction) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Transação não encontrada'
        });
      }

      // Verificar se a transação pertence ao usuário
      if (transaction.userId !== req.userId) {
        return res.status(403).json({
          sucesso: false,
          mensagem: 'Acesso negado'
        });
      }

      res.json({
        sucesso: true,
        transacao: transaction
      });
    } catch (error) {
      console.error('Erro ao buscar transação:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar transação',
        erro: error.message
      });
    }
  }

  // Criar nova transação
  async create(req, res) {
    try {
      const { type, category, amount, description, date } = req.body;

      // Validação
      if (!type || amount === undefined) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Tipo e valor são obrigatórios'
        });
      }

      if (type !== 'entrada' && type !== 'saida') {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Tipo deve ser "entrada" ou "saida"'
        });
      }

      const transaction = await transactionsModel.create({
        userId: req.userId,
        type,
        category,
        amount,
        description,
        date
      });

      res.status(201).json({
        sucesso: true,
        mensagem: 'Transação criada com sucesso',
        transacao: transaction
      });
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao criar transação',
        erro: error.message
      });
    }
  }

  // Atualizar transação
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Verificar se a transação existe e pertence ao usuário
      const transaction = await transactionsModel.findById(id);
      if (!transaction) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Transação não encontrada'
        });
      }

      if (transaction.userId !== req.userId) {
        return res.status(403).json({
          sucesso: false,
          mensagem: 'Acesso negado'
        });
      }

      // Validar tipo se estiver sendo atualizado
      if (updates.type && updates.type !== 'entrada' && updates.type !== 'saida') {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Tipo deve ser "entrada" ou "saida"'
        });
      }

      const updatedTransaction = await transactionsModel.update(id, updates);

      res.json({
        sucesso: true,
        mensagem: 'Transação atualizada com sucesso',
        transacao: updatedTransaction
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao atualizar transação',
        erro: error.message
      });
    }
  }

  // Deletar transação
  async delete(req, res) {
    try {
      const { id } = req.params;

      // Verificar se a transação existe e pertence ao usuário
      const transaction = await transactionsModel.findById(id);
      if (!transaction) {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Transação não encontrada'
        });
      }

      if (transaction.userId !== req.userId) {
        return res.status(403).json({
          sucesso: false,
          mensagem: 'Acesso negado'
        });
      }

      await transactionsModel.delete(id);

      res.json({
        sucesso: true,
        mensagem: 'Transação deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao deletar transação',
        erro: error.message
      });
    }
  }

  // Obter saldo
  async getBalance(req, res) {
    try {
      const balance = await transactionsModel.calculateBalance(req.userId);

      res.json({
        sucesso: true,
        saldo: balance
      });
    } catch (error) {
      console.error('Erro ao calcular saldo:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao calcular saldo',
        erro: error.message
      });
    }
  }
}

module.exports = new TransactionsController();
