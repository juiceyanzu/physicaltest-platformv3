const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', authenticateToken, appointmentController.getAppointments);
router.get('/:id', authenticateToken, appointmentController.getAppointment);
router.post('/', authenticateToken, authorizeRole(['student']), appointmentController.createAppointment);
router.put('/:id', authenticateToken, authorizeRole(['teacher', 'admin']), appointmentController.updateAppointment);
router.delete('/:id', authenticateToken, appointmentController.deleteAppointment);

module.exports = router;