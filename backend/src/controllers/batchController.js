const { v4: uuidv4 } = require('uuid');
const { query, run } = require('../config/database');

function now() {
  return new Date().toISOString();
}

async function getBatches(req, res) {
  try {
    const batches = await query('SELECT * FROM batches ORDER BY start_date DESC');
    const data = batches.map(b => ({
      id: b.id,
      name: b.name,
      startDate: b.start_date,
      endDate: b.end_date,
      status: b.status,
      maxCapacity: b.max_capacity,
      currentCount: b.current_count,
      date: b.start_date,
      timeSlot: b.time_slot || '',
      location: b.location || '',
      teacher: b.teacher || '',
      project: b.project || '',
      remainingSlots: b.max_capacity - b.current_count,
      capacity: b.max_capacity,
      createdAt: b.created_at,
      updatedAt: b.updated_at
    }));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function getBatch(req, res) {
  try {
    const { id } = req.params;
    const batches = await query('SELECT * FROM batches WHERE id = ?', [id]);

    if (batches.length === 0) {
      return res.status(404).json({ success: false, message: '批次不存在' });
    }

    const b = batches[0];
    res.json({
      success: true, data: {
        id: b.id,
        name: b.name,
        startDate: b.start_date,
        endDate: b.end_date,
        status: b.status,
        maxCapacity: b.max_capacity,
        currentCount: b.current_count,
        date: b.start_date,
        timeSlot: b.time_slot || '',
        location: b.location || '',
        teacher: b.teacher || '',
        project: b.project || '',
        remainingSlots: b.max_capacity - b.current_count,
        capacity: b.max_capacity,
        createdAt: b.created_at,
        updatedAt: b.updated_at
      }
    });
  } catch (error) {
    console.error('Get batch error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function createBatch(req, res) {
  try {
    const { name, startDate, endDate, maxCapacity, timeSlot, location, teacher, project } = req.body;
    const id = uuidv4();

    await run('INSERT INTO batches (id, name, start_date, end_date, status, max_capacity, current_count, time_slot, location, teacher, project, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, startDate, endDate, 'open', maxCapacity, 0, timeSlot || '', location || '', teacher || '', project || '', now(), now()]);

    res.json({ success: true, message: '创建成功', data: { id, name, startDate, endDate, maxCapacity } });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function updateBatch(req, res) {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, status, maxCapacity, timeSlot, location, teacher, project } = req.body;

    await run('UPDATE batches SET name = ?, start_date = ?, end_date = ?, status = ?, max_capacity = ?, time_slot = ?, location = ?, teacher = ?, project = ?, updated_at = ? WHERE id = ?',
      [name, startDate, endDate, status, maxCapacity, timeSlot || '', location || '', teacher || '', project || '', now(), id]);

    res.json({ success: true, message: '更新成功' });
  } catch (error) {
    console.error('Update batch error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

async function deleteBatch(req, res) {
  try {
    const { id } = req.params;

    await run('DELETE FROM batches WHERE id = ?', [id]);

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('Delete batch error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

module.exports = {
  getBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch
};
