const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const batchController = require('../controllers/batchController');

const router = express.Router();

router.get('/', authenticateToken, batchController.getBatches);
router.get('/:id', authenticateToken, batchController.getBatch);
router.post('/', authenticateToken, authorizeRole(['admin']), batchController.createBatch);
router.put('/:id', authenticateToken, authorizeRole(['admin']), batchController.updateBatch);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), batchController.deleteBatch);

module.exports = router;