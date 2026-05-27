const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');

function now() {
  return new Date().toISOString();
}

function mapNotice(n) {
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    priority: n.priority,
    status: n.status,
    author: n.author || '管理员',
    publishDate: n.created_at ? n.created_at.split('T')[0] : '',
    createdBy: n.created_by,
    createdAt: n.created_at,
    updatedAt: n.updated_at,
    attachments: []
  };
}

async function getNotices(req, res) {
  try {
    const notices = await query('SELECT * FROM notices WHERE status = ? ORDER BY priority DESC, created_at DESC', ['published']);
    res.json({ success: true, data: notices.map(mapNotice) });
  } catch (error) {
    console.error('Get notices error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getAllNotices(req, res) {
  try {
    const notices = await query('SELECT * FROM notices ORDER BY priority DESC, created_at DESC');
    res.json({ success: true, data: notices.map(mapNotice) });
  } catch (error) {
    console.error('Get all notices error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getNotice(req, res) {
  try {
    const { id } = req.params;
    const notices = await query('SELECT * FROM notices WHERE id = ?', [id]);

    if (notices.length === 0) {
      return res.status(404).json({ success: false, message: '公告不存在' });
    }

    res.json({ success: true, data: mapNotice(notices[0]) });
  } catch (error) {
    console.error('Get notice error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function createNotice(req, res) {
  try {
    const { title, content, priority, author } = req.body;
    const adminId = req.user.id || 'admin';
    const id = uuidv4();

    await run('INSERT INTO notices (id, title, content, priority, status, author, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, content, priority || 'normal', 'published', author || '管理员', adminId, now()]);

    res.json({ success: true, message: '发布成功', data: { id, title } });
  } catch (error) {
    console.error('Create notice error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function updateNotice(req, res) {
  try {
    const { id } = req.params;
    const { title, content, priority, status, author } = req.body;

    await run('UPDATE notices SET title = ?, content = ?, priority = ?, status = ?, author = ?, updated_at = ? WHERE id = ?',
      [title, content, priority, status, author || '管理员', now(), id]);

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update notice error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function deleteNotice(req, res) {
  try {
    const { id } = req.params;

    await run('DELETE FROM notices WHERE id = ?', [id]);

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete notice error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

module.exports = {
  getNotices,
  getAllNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice
};
