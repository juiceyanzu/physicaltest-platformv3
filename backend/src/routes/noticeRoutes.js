const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const noticeController = require('../controllers/noticeController');

const router = express.Router();

router.get('/', authenticateToken, noticeController.getNotices);
router.get('/all', authenticateToken, authorizeRole(['admin']), noticeController.getAllNotices);
router.get('/:id', authenticateToken, noticeController.getNotice);
router.post('/', authenticateToken, authorizeRole(['admin']), noticeController.createNotice);
router.put('/:id', authenticateToken, authorizeRole(['admin']), noticeController.updateNotice);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), noticeController.deleteNotice);

module.exports = router;