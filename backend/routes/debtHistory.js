const express = require('express');
const router = express.Router();
const debtHistoryController = require('../controllers/debtHistoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas de histórico requerem autenticação
router.use(authMiddleware);

router.get('/', (req, res) => debtHistoryController.getAll(req, res));
router.get('/debtor/:debtorId', (req, res) => debtHistoryController.getByDebtorId(req, res));

module.exports = router;
