const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.get('/', authenticateToken, projectController.getProjects);
router.get('/:id', authenticateToken, projectController.getProject);
router.post('/', authenticateToken, authorizeRole(['admin']), projectController.createProject);
router.put('/:id', authenticateToken, authorizeRole(['admin']), projectController.updateProject);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), projectController.deleteProject);

module.exports = router;