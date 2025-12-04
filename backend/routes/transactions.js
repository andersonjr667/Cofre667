const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas de transações requerem autenticação
router.use(authMiddleware);

router.get('/', (req, res) => transactionsController.getAll(req, res));
router.get('/balance', (req, res) => transactionsController.getBalance(req, res));
router.get('/:id', (req, res) => transactionsController.getById(req, res));
router.post('/', (req, res) => transactionsController.create(req, res));
router.put('/:id', (req, res) => transactionsController.update(req, res));
router.delete('/:id', (req, res) => transactionsController.delete(req, res));

module.exports = router;
