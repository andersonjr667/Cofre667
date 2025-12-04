const debtHistoryModel = require('../models/debtHistoryModel');

class DebtHistoryController {
  // Listar todo o histórico do usuário
  async getAll(req, res) {
    try {
      const history = await debtHistoryModel.findByUserId(req.userId);
      
      // Ordenar por data (mais recentes primeiro)
      history.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.json({
        sucesso: true,
        historico: history
      });
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar histórico',
        erro: error.message
      });
    }
  }

  // Buscar histórico de um devedor específico
  async getByDebtorId(req, res) {
    try {
      const { debtorId } = req.params;
      const history = await debtHistoryModel.findByDebtorId(debtorId);
      
      // Filtrar apenas registros do usuário autenticado
      const userHistory = history.filter(h => h.userId === req.userId);
      
      // Ordenar por data (mais recentes primeiro)
      userHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

      res.json({
        sucesso: true,
        historico: userHistory
      });
    } catch (error) {
      console.error('Erro ao buscar histórico do devedor:', error);
      res.status(500).json({
        sucesso: false,
        mensagem: 'Erro ao buscar histórico do devedor',
        erro: error.message
      });
    }
  }
}

module.exports = new DebtHistoryController();
