const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');

async function getProjects(req, res) {
  try {
    const projects = await query('SELECT * FROM projects');
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getProject(req, res) {
  try {
    const { id } = req.params;
    const projects = await query('SELECT * FROM projects WHERE id = ?', [id]);
    
    if (projects.length === 0) {
      return res.status(404).json({ success: false, message: '项目不存在' });
    }

    res.json({ success: true, data: projects[0] });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function createProject(req, res) {
  try {
    const { name, unit, genderRequirement, minScore, maxScore, isRequired } = req.body;
    const id = uuidv4();

    await run('INSERT INTO projects (id, name, unit, gender_requirement, min_score, max_score, is_required) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, unit, genderRequirement || 'all', minScore || 0, maxScore || 100, isRequired ? 1 : 0]);

    res.json({ success: true, message: '创建成功', data: { id, name } });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;
    const { name, unit, genderRequirement, minScore, maxScore, isRequired } = req.body;

    await run('UPDATE projects SET name = ?, unit = ?, gender_requirement = ?, min_score = ?, max_score = ?, is_required = ? WHERE id = ?',
      [name, unit, genderRequirement, minScore, maxScore, isRequired ? 1 : 0, id]);

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    await run('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};