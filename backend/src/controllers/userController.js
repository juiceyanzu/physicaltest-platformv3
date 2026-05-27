const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');
const { generateToken } = require('../middleware/auth');

function now() {
  return new Date().toISOString();
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const users = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ success: false, message: '用户已禁用' });
    }

    const token = generateToken({ id: user.id, username: user.username, role: user.role });

    let profile = null;
    const userData = {
      id: user.id,
      username: user.username,
      role: user.role,
      nickname: user.nickname,
      avatar: user.avatar || '',
      name: user.nickname || user.username,
      studentId: '',
      class: '',
      type: user.role
    };

    if (user.role === 'student') {
      const profiles = await query('SELECT * FROM students WHERE user_id = ?', [user.id]);
      profile = profiles[0] || null;
      if (profile) {
        userData.name = profile.name;
        userData.studentId = user.username;
        userData.class = profile.class || '';
        userData.gender = profile.gender || '';
      }
    } else if (user.role === 'teacher') {
      const profiles = await query('SELECT * FROM teachers WHERE user_id = ?', [user.id]);
      profile = profiles[0] || null;
      if (profile) {
        userData.name = profile.name;
        userData.department = profile.department || '';
      }
    }

    res.json({
      success: true,
      data: { user: userData, profile, token }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function register(req, res) {
  try {
    const { username, password, nickname, role } = req.body;

    const existing = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const timestamp = now();

    await run('INSERT INTO users (id, username, password, nickname, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, username, hashedPassword, nickname, role, 'active', timestamp, timestamp]);

    res.json({ success: true, message: '注册成功' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function wechatLogin(req, res) {
  try {
    const { code } = req.body;
    
    const token = generateToken({ id: 'wx_user_id', username: 'wx_user', role: 'student' });
    
    res.json({
      success: true,
      data: {
        user: { id: 'wx_user_id', username: 'wx_user', role: 'student', nickname: '微信用户' },
        token
      }
    });
  } catch (error) {
    console.error('WeChat login error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getMe(req, res) {
  try {
    const userId = req.user.id;

    const users = await query('SELECT id, username, nickname, role, status, avatar FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const user = users[0];
    let profile = null;
    const userData = {
      id: user.id,
      username: user.username,
      role: user.role,
      nickname: user.nickname,
      avatar: user.avatar || '',
      name: user.nickname || user.username,
      studentId: '',
      class: '',
      type: user.role
    };

    if (user.role === 'student') {
      const profiles = await query('SELECT * FROM students WHERE user_id = ?', [userId]);
      profile = profiles[0] || null;
      if (profile) {
        userData.name = profile.name;
        userData.studentId = user.username;
        userData.class = profile.class || '';
        userData.gender = profile.gender || '';
      }
    } else if (user.role === 'teacher') {
      const profiles = await query('SELECT * FROM teachers WHERE user_id = ?', [userId]);
      profile = profiles[0] || null;
      if (profile) {
        userData.name = profile.name;
        userData.department = profile.department || '';
      }
    }

    res.json({ success: true, data: { user: userData, profile } });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function updateMe(req, res) {
  try {
    const userId = req.user.id;
    const { nickname, avatar } = req.body;

    await run('UPDATE users SET nickname = ?, avatar = ?, updated_at = ? WHERE id = ?',
      [nickname, avatar, now(), userId]);

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update me error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getStudents(req, res) {
  try {
    const students = await query('SELECT s.*, u.status FROM students s JOIN users u ON s.user_id = u.id');
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getStudent(req, res) {
  try {
    const { id } = req.params;
    const students = await query('SELECT * FROM students WHERE id = ?', [id]);
    
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: '学生不存在' });
    }

    res.json({ success: true, data: students[0] });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function createStudent(req, res) {
  try {
    const { name, gender, birthDate, className, major, grade, phone } = req.body;
    const userId = uuidv4();
    const studentId = uuidv4();

    const hashedPassword = await bcrypt.hash('123456', 10);
    const timestamp = now();
    
    await run('INSERT INTO users (id, username, password, nickname, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, phone, hashedPassword, name, 'student', 'active', timestamp, timestamp]);

    await run('INSERT INTO students (id, user_id, name, gender, birth_date, class, major, grade, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [studentId, userId, name, gender, birthDate, className, major, grade, phone]);

    res.json({ success: true, message: '创建成功' });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { name, gender, birthDate, className, major, grade, phone } = req.body;

    await run('UPDATE students SET name = ?, gender = ?, birth_date = ?, class = ?, major = ?, grade = ?, phone = ? WHERE id = ?',
      [name, gender, birthDate, className, major, grade, phone, id]);

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function deleteStudent(req, res) {
  try {
    const { id } = req.params;

    const students = await query('SELECT user_id FROM students WHERE id = ?', [id]);
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: '学生不存在' });
    }

    const userId = students[0].user_id;
    
    await run('DELETE FROM students WHERE id = ?', [id]);
    await run('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getTeachers(req, res) {
  try {
    const teachers = await query('SELECT t.*, u.status FROM teachers t JOIN users u ON t.user_id = u.id');
    res.json({ success: true, data: teachers });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function createTeacher(req, res) {
  try {
    const { name, gender, title, department, phone } = req.body;
    const userId = uuidv4();
    const teacherId = uuidv4();

    const hashedPassword = await bcrypt.hash('123456', 10);
    const timestamp = now();
    
    await run('INSERT INTO users (id, username, password, nickname, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, phone, hashedPassword, name, 'teacher', 'active', timestamp, timestamp]);

    await run('INSERT INTO teachers (id, user_id, name, gender, title, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [teacherId, userId, name, gender, title, department, phone]);

    res.json({ success: true, message: '创建成功' });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function updateTeacher(req, res) {
  try {
    const { id } = req.params;
    const { name, gender, title, department, phone } = req.body;

    await run('UPDATE teachers SET name = ?, gender = ?, title = ?, department = ?, phone = ? WHERE id = ?',
      [name, gender, title, department, phone, id]);

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function deleteTeacher(req, res) {
  try {
    const { id } = req.params;

    const teachers = await query('SELECT user_id FROM teachers WHERE id = ?', [id]);
    if (teachers.length === 0) {
      return res.status(404).json({ success: false, message: '教师不存在' });
    }

    const userId = teachers[0].user_id;

    await run('DELETE FROM teachers WHERE id = ?', [id]);
    await run('DELETE FROM users WHERE id = ?', [userId]);

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getAdmins(req, res) {
  try {
    const admins = await query("SELECT u.id, u.username, u.nickname as name, u.role, u.status FROM users u WHERE u.role = 'admin'");
    res.json({ success: true, data: admins });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function toggleUserStatus(req, res) {
  try {
    const { id } = req.params;

    const users = await query('SELECT status FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    const newStatus = users[0].status === 'active' ? 'inactive' : 'active';
    await run('UPDATE users SET status = ?, updated_at = ? WHERE id = ?', [newStatus, now(), id]);

    res.json({ success: true, message: `用户已${newStatus === 'active' ? '解冻' : '冻结'}`, data: { status: newStatus } });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

module.exports = {
  login,
  register,
  wechatLogin,
  getMe,
  updateMe,
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getAdmins,
  toggleUserStatus
};