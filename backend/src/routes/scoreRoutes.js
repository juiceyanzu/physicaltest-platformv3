const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const scoreController = require('../controllers/scoreController');

const router = express.Router();

router.get('/', authenticateToken, scoreController.getScores);
router.get('/:id', authenticateToken, scoreController.getScore);
router.post('/', authenticateToken, authorizeRole(['teacher']), scoreController.createScore);
router.put('/:id', authenticateToken, authorizeRole(['teacher']), scoreController.updateScore);
router.delete('/:id', authenticateToken, authorizeRole(['teacher', 'admin']), scoreController.deleteScore);

module.exports = router;