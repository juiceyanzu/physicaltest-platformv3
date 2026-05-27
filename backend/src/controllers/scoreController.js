const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');

function now() {
  return new Date().toISOString();
}

function getLevel(avgScore) {
  if (avgScore >= 90) return '优秀';
  if (avgScore >= 80) return '良好';
  if (avgScore >= 60) return '及格';
  return '不及格';
}

async function getScores(req, res) {
  try {
    const { studentId, batchId, projectId } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let sql = 'SELECT s.*, p.name as project_name, b.name as batch_name, st.name as student_name FROM scores s LEFT JOIN projects p ON s.project_id = p.id LEFT JOIN batches b ON s.batch_id = b.id LEFT JOIN students st ON s.student_id = st.id WHERE 1=1';
    const params = [];

    if (userRole === 'student') {
      const students = await query('SELECT id FROM students WHERE user_id = ?', [userId]);
      if (students.length > 0) {
        sql += ' AND s.student_id = ?';
        params.push(students[0].id);
      } else {
        return res.json({ success: true, data: [] });
      }
    }

    if (studentId) {
      sql += ' AND s.student_id = ?';
      params.push(studentId);
    }

    if (batchId) {
      sql += ' AND s.batch_id = ?';
      params.push(batchId);
    }

    if (projectId) {
      sql += ' AND s.project_id = ?';
      params.push(projectId);
    }

    const rawScores = await query(sql, params);

    // Group by batch for student view
    if (userRole === 'student') {
      const batchMap = {};
      for (const s of rawScores) {
        const key = s.batch_id;
        if (!batchMap[key]) {
          batchMap[key] = {
            id: key,
            studentId: s.student_id,
            studentName: s.student_name || s.student_id,
            batchId: s.batch_id,
            batchName: s.batch_name || s.batch_id,
            testDate: s.entered_at ? s.entered_at.split('T')[0] : '',
            items: [],
            totalScore: 0
          };
        }
        batchMap[key].items.push({
          name: s.project_name || s.project_id,
          score: s.score,
          remarks: s.remarks || ''
        });
      }

      // Calculate totalScore and level for each batch group
      const data = Object.values(batchMap).map(group => {
        const validScores = group.items.filter(i => i.score != null);
        const totalScore = validScores.length > 0
          ? Math.round(validScores.reduce((sum, i) => sum + i.score, 0) / validScores.length * 10) / 10
          : 0;
        return {
          ...group,
          totalScore,
          level: getLevel(totalScore)
        };
      });

      return res.json({ success: true, data });
    }

    // For teacher/admin, return flat list
    const data = rawScores.map(s => ({
      id: s.id,
      studentId: s.student_id,
      batchId: s.batch_id,
      projectId: s.project_id,
      score: s.score,
      remarks: s.remarks,
      projectName: s.project_name || s.project_id,
      studentName: s.student_name || s.student_id,
      batchName: s.batch_name || s.batch_id,
      enteredBy: s.entered_by,
      enteredAt: s.entered_at
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getScore(req, res) {
  try {
    const { id } = req.params;
    const scores = await query('SELECT s.*, p.name as project_name FROM scores s LEFT JOIN projects p ON s.project_id = p.id WHERE s.id = ?', [id]);

    if (scores.length === 0) {
      return res.status(404).json({ success: false, message: '成绩不存在' });
    }

    res.json({ success: true, data: scores[0] });
  } catch (error) {
    console.error('Get score error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function createScore(req, res) {
  try {
    const { studentId, batchId, projectId, score, remarks } = req.body;
    const teacherId = req.user.id;

    const teachers = await query('SELECT id FROM teachers WHERE user_id = ?', [teacherId]);
    if (teachers.length === 0) {
      return res.status(400).json({ success: false, message: '教师信息不存在' });
    }

    const existing = await query('SELECT id FROM scores WHERE student_id = ? AND batch_id = ? AND project_id = ?', [studentId, batchId, projectId]);
    if (existing.length > 0) {
      await run('UPDATE scores SET score = ?, remarks = ?, entered_by = ?, entered_at = ? WHERE id = ?',
        [score, remarks, teachers[0].id, now(), existing[0].id]);
      return res.json({ success: true, message: '成绩已更新', data: { id: existing[0].id } });
    }

    const id = uuidv4();
    await run('INSERT INTO scores (id, student_id, batch_id, project_id, score, remarks, entered_by, entered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, studentId, batchId, projectId, score, remarks, teachers[0].id, now()]);

    res.json({ success: true, message: '录入成功', data: { id } });
  } catch (error) {
    console.error('Create score error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function updateScore(req, res) {
  try {
    const { id } = req.params;
    const { score, remarks } = req.body;

    await run('UPDATE scores SET score = ?, remarks = ?, entered_at = ? WHERE id = ?',
      [score, remarks, now(), id]);

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update score error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function deleteScore(req, res) {
  try {
    const { id } = req.params;

    await run('DELETE FROM scores WHERE id = ?', [id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete score error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

module.exports = {
  getScores,
  getScore,
  createScore,
  updateScore,
  deleteScore
};
