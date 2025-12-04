const express = require('express');
const router = express.Router();
const debtorsController = require('../controllers/debtorsController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas de devedores requerem autenticação
router.use(authMiddleware);

router.get('/', (req, res) => debtorsController.getAll(req, res));
router.get('/:id', (req, res) => debtorsController.getById(req, res));
router.post('/', (req, res) => debtorsController.create(req, res));
router.put('/:id', (req, res) => debtorsController.update(req, res));
router.delete('/:id', (req, res) => debtorsController.delete(req, res));

module.exports = router;
