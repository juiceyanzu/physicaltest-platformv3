const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post('/wechat-login', userController.wechatLogin);

router.get('/me', authenticateToken, userController.getMe);
router.put('/me', authenticateToken, userController.updateMe);

router.get('/students', authenticateToken, authorizeRole(['admin', 'teacher']), userController.getStudents);
router.get('/students/:id', authenticateToken, authorizeRole(['admin', 'teacher']), userController.getStudent);
router.post('/students', authenticateToken, authorizeRole(['admin']), userController.createStudent);
router.put('/students/:id', authenticateToken, authorizeRole(['admin']), userController.updateStudent);
router.delete('/students/:id', authenticateToken, authorizeRole(['admin']), userController.deleteStudent);

router.get('/teachers', authenticateToken, authorizeRole(['admin']), userController.getTeachers);
router.post('/teachers', authenticateToken, authorizeRole(['admin']), userController.createTeacher);
router.put('/teachers/:id', authenticateToken, authorizeRole(['admin']), userController.updateTeacher);
router.delete('/teachers/:id', authenticateToken, authorizeRole(['admin']), userController.deleteTeacher);

router.get('/admins', authenticateToken, authorizeRole(['admin']), userController.getAdmins);

router.put('/:id/status', authenticateToken, authorizeRole(['admin']), userController.toggleUserStatus);

module.exports = router;