const { v4: uuidv4 } = require('uuid');
const { query, run, db } = require('../config/database');

function now() {
  return new Date().toISOString();
}

async function getAppointments(req, res) {
  try {
    const { studentId, batchId, status } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let sql = 'SELECT a.*, b.name as batch_name, b.start_date, b.end_date, b.time_slot as batch_time_slot, b.location as batch_location, b.project as batch_project, s.name as student_name FROM appointments a LEFT JOIN batches b ON a.batch_id = b.id LEFT JOIN students s ON a.student_id = s.id WHERE 1=1';
    const params = [];

    if (userRole === 'student') {
      const students = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
      if (students.length > 0) {
        sql += ' AND a.student_id = ?';
        params.push(students[0].id);
      } else {
        return res.json({ success: true, data: [] });
      }
    }

    if (studentId) {
      sql += ' AND a.student_id = ?';
      params.push(studentId);
    }

    if (batchId) {
      sql += ' AND a.batch_id = ?';
      params.push(batchId);
    }

    if (status) {
      sql += ' AND a.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY a.created_at DESC';

    const appointments = await query(sql, params);
    const data = appointments.map(a => ({
      id: a.id,
      studentId: a.student_id,
      batchId: a.batch_id,
      status: a.status,
      batchName: a.batch_name || a.batch_id,
      studentName: a.student_name || a.student_id,
      date: a.appointment_time ? a.appointment_time.split(' ')[0] : a.start_date || '',
      timeSlot: a.batch_time_slot || '',
      location: a.batch_location || '',
      project: a.batch_project || '',
      createdAt: a.created_at,
      completedAt: a.completed_at,
      appointmentTime: a.appointment_time
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getAppointment(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const appointments = await query('SELECT a.*, b.name as batch_name, b.time_slot as batch_time_slot, b.location as batch_location, b.project as batch_project, s.name as student_name FROM appointments a LEFT JOIN batches b ON a.batch_id = b.id LEFT JOIN students s ON a.student_id = s.id WHERE a.id = ?', [id]);

    if (appointments.length === 0) {
      return res.status(404).json({ success: false, message: '预约不存在' });
    }

    const a = appointments[0];

    if (userRole === 'student') {
      const students = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
      if (students.length > 0 && a.student_id !== students[0].id) {
        return res.status(403).json({ success: false, message: '无权访问' });
      }
    }

    res.json({
      success: true, data: {
        id: a.id,
        studentId: a.student_id,
        batchId: a.batch_id,
        status: a.status,
        batchName: a.batch_name || a.batch_id,
        studentName: a.student_name || a.student_id,
        date: a.appointment_time ? a.appointment_time.split(' ')[0] : '',
        timeSlot: a.batch_time_slot || '',
        location: a.batch_location || '',
        project: a.batch_project || '',
        createdAt: a.created_at,
        completedAt: a.completed_at
      }
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function createAppointment(req, res) {
  try {
    const { batchId } = req.body;
    const userId = req.user.id;

    const students = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
    if (students.length === 0) {
      return res.status(400).json({ success: false, message: '学生信息不存在' });
    }

    const studentId = students[0].id;

    const existing = await query('SELECT * FROM appointments WHERE student_id = ? AND batch_id = ? AND status IN (?, ?)', [studentId, batchId, 'pending', 'confirmed']);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: '已预约该批次' });
    }

    const batches = await query('SELECT max_capacity, current_count FROM batches WHERE id = ?', [batchId]);
    if (batches.length === 0) {
      return res.status(400).json({ success: false, message: '批次不存在' });
    }

    const batch = batches[0];
    if (batch.current_count >= batch.max_capacity) {
      return res.status(400).json({ success: false, message: '批次已满' });
    }

    return new Promise((resolve) => {
      db.serialize(async () => {
        try {
          const id = uuidv4();
          await run('INSERT INTO appointments (id, student_id, batch_id, status, created_at) VALUES (?, ?, ?, ?, ?)',
            [id, studentId, batchId, 'confirmed', now()]);

          await run('UPDATE batches SET current_count = current_count + 1 WHERE id = ?', [batchId]);

          res.json({ success: true, message: '预约成功', data: { id } });
          resolve();
        } catch (error) {
          console.error('Create appointment error:', error);
          res.status(500).json({ success: false, message: '服务器错误' });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointments = await query('SELECT batch_id, status as old_status FROM appointments WHERE id = ?', [id]);
    if (appointments.length === 0) {
      return res.status(404).json({ success: false, message: '预约不存在' });
    }

    const appointment = appointments[0];
    const wasActive = appointment.old_status === 'pending' || appointment.old_status === 'confirmed';
    const isActive = status === 'pending' || status === 'confirmed';

    await run('UPDATE appointments SET status = ?, completed_at = ? WHERE id = ?',
      [status, status === 'completed' ? now() : null, id]);

    if (wasActive && !isActive && appointment.batch_id) {
      await run('UPDATE batches SET current_count = current_count - 1 WHERE id = ? AND current_count > 0', [appointment.batch_id]);
    } else if (!wasActive && isActive && appointment.batch_id) {
      await run('UPDATE batches SET current_count = current_count + 1 WHERE id = ?', [appointment.batch_id]);
    }

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;

    const appointments = await query('SELECT batch_id, status FROM appointments WHERE id = ?', [id]);
    if (appointments.length === 0) {
      return res.status(404).json({ success: false, message: '预约不存在' });
    }

    const appointment = appointments[0];

    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: '已完成的预约无法取消' });
    }

    return new Promise((resolve) => {
      db.serialize(async () => {
        try {
          await run('DELETE FROM appointments WHERE id = ?', [id]);

          if (appointment.status === 'pending' || appointment.status === 'confirmed') {
            await run('UPDATE batches SET current_count = current_count - 1 WHERE id = ?', [appointment.batch_id]);
          }

          res.json({ success: true, message: '取消成功' });
          resolve();
        } catch (error) {
          console.error('Delete appointment error:', error);
          res.status(500).json({ success: false, message: '服务器错误' });
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
