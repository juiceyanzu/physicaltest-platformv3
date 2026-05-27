const bcrypt = require('bcryptjs');
const { query, run } = require('../config/database');

function now() {
  return new Date().toISOString();
}

async function seedData() {
  // ========== 管理员 ==========
  const admins = [
    ['admin_id_001', 'admin', 'admin123', '管理员'],
  ];
  for (const [id, username, password, nickname] of admins) {
    const existing = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const timestamp = now();
      await run('INSERT INTO users (id, username, password, nickname, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, username, hashedPassword, nickname, 'admin', 'active', timestamp, timestamp]);
      console.log(`Admin "${nickname}" created`);
    }
  }

  // ========== 教师 ==========
  const teachers = [
    ['teacher_user_001', 'T2026001', '王建国', 'male', '教授', '体育学院', '13900139001'],
    ['teacher_user_002', 'T2026002', '李芳', 'female', '副教授', '体育学院', '13900139002'],
    ['teacher_user_003', 'T2026003', '陈志远', 'male', '讲师', '体育学院', '13900139003'],
    ['teacher_user_004', 'T2026004', '刘晓梅', 'female', '讲师', '运动训练系', '13900139004'],
  ];
  for (const [uid, username, name, gender, title, department, phone] of teachers) {
    const existing = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const timestamp = now();
      await run('INSERT INTO users (id, username, password, nickname, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uid, username, hashedPassword, name, 'teacher', 'active', timestamp, timestamp]);
      await run('INSERT INTO teachers (id, user_id, name, gender, title, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [`teacher_${username}`, uid, name, gender, title, department, phone]);
      console.log(`Teacher "${name}" created`);
    }
  }

  // ========== 学生 ==========
  const students = [
    // 计科2201班
    ['student_user_001', '2026001', '张三',   'male',   '2004-06-15', '计科2201', '计算机科学与技术', '2022级', '13800138001'],
    ['student_user_002', '2026002', '李四',   'female', '2004-09-20', '计科2201', '计算机科学与技术', '2022级', '13800138002'],
    ['student_user_006', '2026006', '周文静', 'female', '2004-04-12', '计科2201', '计算机科学与技术', '2022级', '13800138006'],
    ['student_user_007', '2026007', '吴强',   'male',   '2004-08-03', '计科2201', '计算机科学与技术', '2022级', '13800138007'],
    ['student_user_008', '2026008', '郑丽华', 'female', '2005-02-14', '计科2201', '计算机科学与技术', '2022级', '13800138008'],
    // 计科2202班
    ['student_user_005', '2026005', '孙七',   'male',   '2004-11-22', '计科2202', '计算机科学与技术', '2022级', '13800138005'],
    ['student_user_009', '2026009', '马小龙', 'male',   '2004-07-18', '计科2202', '计算机科学与技术', '2022级', '13800138009'],
    ['student_user_010', '2026010', '黄晓燕', 'female', '2004-12-05', '计科2202', '计算机科学与技术', '2022级', '13800138010'],
    // 软工2201班
    ['student_user_003', '2026003', '王五',   'male',   '2004-03-10', '软工2201', '软件工程', '2022级', '13800138003'],
    ['student_user_004', '2026004', '赵六',   'female', '2005-01-05', '软工2201', '软件工程', '2022级', '13800138004'],
    ['student_user_011', '2026011', '林思远', 'male',   '2004-05-28', '软工2201', '软件工程', '2022级', '13800138011'],
    ['student_user_012', '2026012', '何雅琴', 'female', '2004-10-16', '软工2201', '软件工程', '2022级', '13800138012'],
    // 软工2202班
    ['student_user_013', '2026013', '徐鹏飞', 'male',   '2004-09-08', '软工2202', '软件工程', '2022级', '13800138013'],
    ['student_user_014', '2026014', '朱美玲', 'female', '2005-03-22', '软工2202', '软件工程', '2022级', '13800138014'],
    ['student_user_015', '2026015', '胡明辉', 'male',   '2004-06-30', '软工2202', '软件工程', '2022级', '13800138015'],
    // 数媒2201班
    ['student_user_016', '2026016', '高雨萱', 'female', '2004-11-11', '数媒2201', '数字媒体技术', '2022级', '13800138016'],
    ['student_user_017', '2026017', '曹宇航', 'male',   '2004-02-25', '数媒2201', '数字媒体技术', '2022级', '13800138017'],
    ['student_user_018', '2026018', '谢佳宁', 'female', '2005-04-03', '数媒2201', '数字媒体技术', '2022级', '13800138018'],
    ['student_user_019', '2026019', '韩志豪', 'male',   '2004-08-19', '数媒2201', '数字媒体技术', '2022级', '13800138019'],
    ['student_user_020', '2026020', '唐雪芳', 'female', '2004-12-28', '数媒2201', '数字媒体技术', '2022级', '13800138020'],
  ];
  for (const [uid, username, name, gender, birth, cls, major, grade, phone] of students) {
    const existing = await query('SELECT * FROM users WHERE username = ?', [username]);
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const timestamp = now();
      await run('INSERT INTO users (id, username, password, nickname, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [uid, username, hashedPassword, name, 'student', 'active', timestamp, timestamp]);
      await run('INSERT INTO students (id, user_id, name, gender, birth_date, class, major, grade, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [`student_${username}`, uid, name, gender, birth, cls, major, grade, phone]);
      console.log(`Student "${name}" created`);
    }
  }

  // ========== 体测项目 ==========
  const projects = [
    ['proj_001', '身高体重', 'cm/kg', 'all', 0, 100, 1],
    ['proj_002', '肺活量', 'ml', 'all', 0, 100, 1],
    ['proj_003', '50米跑', '秒', 'all', 0, 100, 1],
    ['proj_004', '坐位体前屈', 'cm', 'all', 0, 100, 1],
    ['proj_005', '立定跳远', 'cm', 'all', 0, 100, 1],
    ['proj_006', '引体向上', '次', 'male', 0, 100, 1],
    ['proj_007', '仰卧起坐', '次', 'female', 0, 100, 1],
    ['proj_008', '800米跑', '秒', 'female', 0, 100, 1],
    ['proj_009', '1000米跑', '秒', 'male', 0, 100, 1],
  ];
  for (const [id, name, unit, gender, min, max, required] of projects) {
    const existing = await query('SELECT * FROM projects WHERE id = ?', [id]);
    if (existing.length === 0) {
      await run('INSERT INTO projects (id, name, unit, gender_requirement, min_score, max_score, is_required) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, name, unit, gender, min, max, required]);
      console.log(`Project "${name}" created`);
    }
  }

  // ========== 批次 ==========
  const batches = [
    ['batch_001', '2024年秋季体测第一批', '2024-10-10', '2024-10-20', 'completed', 150, 150, '08:00-12:00', '体育馆A区', '王建国', '国标体测全套'],
    ['batch_002', '2024年秋季体测第二批', '2024-11-01', '2024-11-10', 'completed', 120, 120, '14:00-17:00', '体育馆B区', '李芳', '国标体测全套'],
    ['batch_003', '2025年春季体测第一批', '2025-03-10', '2025-03-20', 'completed', 100, 100, '08:00-12:00', '体育馆A区', '王建国', '国标体测全套'],
    ['batch_004', '2025年春季体测补测',   '2025-04-15', '2025-04-20', 'completed', 60, 55, '14:00-17:00', '田径场', '陈志远', '补测项目'],
    ['batch_005', '2025年秋季体测第一批', '2025-10-13', '2025-10-24', 'closed', 150, 142, '08:00-12:00', '体育馆A区', '王建国', '国标体测全套'],
    ['batch_006', '2025年秋季体测第二批', '2025-10-27', '2025-11-07', 'closed', 120, 115, '14:00-17:00', '体育馆B区', '李芳', '国标体测全套'],
    ['batch_007', '2025年秋季体测第三批', '2025-11-10', '2025-11-21', 'open', 100, 23, '08:00-12:00', '体育馆A区', '陈志远', '国标体测全套'],
    ['batch_008', '2026年春季体测第一批', '2026-03-09', '2026-03-20', 'completed', 100, 100, '08:00-12:00', '体育馆A区', '王建国', '国标体测全套'],
    ['batch_009', '2026年春季体测第二批', '2026-03-23', '2026-04-03', 'completed', 80, 78, '14:00-17:00', '体育馆B区', '刘晓梅', '国标体测全套'],
    ['batch_010', '2026年春季补测',       '2026-05-18', '2026-05-28', 'open', 50, 8, '14:00-17:00', '田径场', '李芳', '补测项目'],
  ];
  for (const [id, name, startDate, endDate, status, maxCap, curCount, timeSlot, location, teacher, project] of batches) {
    const existing = await query('SELECT * FROM batches WHERE id = ?', [id]);
    if (existing.length === 0) {
      const timestamp = now();
      await run('INSERT INTO batches (id, name, start_date, end_date, status, max_capacity, current_count, time_slot, location, teacher, project, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, name, startDate, endDate, status, maxCap, curCount, timeSlot, location, teacher, project, timestamp, timestamp]);
      console.log(`Batch "${name}" created`);
    }
  }

  // ========== 预约记录 ==========
  const appointments = [
    // batch_005 (2025秋第一批 closed)
    ['appt_001', 'student_2026001', 'batch_005', 'completed', '2025-10-14 08:30', '2025-10-14 10:30', '2025-10-14T08:30:00.000Z'],
    ['appt_101', 'student_2026002', 'batch_005', 'completed', '2025-10-15 09:00', '2025-10-15 11:00', '2025-10-15T09:00:00.000Z'],
    ['appt_102', 'student_2026003', 'batch_005', 'completed', '2025-10-16 08:00', '2025-10-16 10:00', '2025-10-16T08:00:00.000Z'],
    ['appt_103', 'student_2026005', 'batch_005', 'completed', '2025-10-17 09:00', '2025-10-17 11:00', '2025-10-17T09:00:00.000Z'],
    ['appt_104', 'student_2026006', 'batch_005', 'completed', '2025-10-14 14:00', '2025-10-14 16:00', '2025-10-14T14:00:00.000Z'],
    ['appt_105', 'student_2026007', 'batch_005', 'completed', '2025-10-15 08:00', '2025-10-15 10:00', '2025-10-15T08:00:00.000Z'],
    ['appt_106', 'student_2026009', 'batch_005', 'completed', '2025-10-18 08:30', '2025-10-18 10:30', '2025-10-18T08:30:00.000Z'],
    ['appt_107', 'student_2026011', 'batch_005', 'completed', '2025-10-16 14:00', '2025-10-16 16:00', '2025-10-16T14:00:00.000Z'],
    // batch_006 (2025秋第二批 closed)
    ['appt_108', 'student_2026004', 'batch_006', 'completed', '2025-10-28 14:00', '2025-10-28 16:30', '2025-10-28T14:00:00.000Z'],
    ['appt_109', 'student_2026008', 'batch_006', 'completed', '2025-10-29 14:00', '2025-10-29 16:00', '2025-10-29T14:00:00.000Z'],
    ['appt_110', 'student_2026010', 'batch_006', 'completed', '2025-10-30 14:30', '2025-10-30 16:30', '2025-10-30T14:30:00.000Z'],
    ['appt_111', 'student_2026012', 'batch_006', 'completed', '2025-11-03 14:00', '2025-11-03 16:00', '2025-11-03T14:00:00.000Z'],
    ['appt_112', 'student_2026013', 'batch_006', 'completed', '2025-11-04 14:00', '2025-11-04 16:00', '2025-11-04T14:00:00.000Z'],
    ['appt_113', 'student_2026015', 'batch_006', 'completed', '2025-11-05 14:00', '2025-11-05 16:00', '2025-11-05T14:00:00.000Z'],
    // batch_007 (2025秋第三批 open - 张三当前预约)
    ['appt_114', 'student_2026001', 'batch_007', 'confirmed', '2025-11-12 08:00', null, '2025-11-08T10:00:00.000Z'],
    ['appt_115', 'student_2026014', 'batch_007', 'confirmed', '2025-11-13 08:00', null, '2025-11-09T11:00:00.000Z'],
    ['appt_116', 'student_2026017', 'batch_007', 'confirmed', '2025-11-14 08:00', null, '2025-11-10T09:00:00.000Z'],
    ['appt_117', 'student_2026019', 'batch_007', 'confirmed', '2025-11-15 08:00', null, '2025-11-10T14:00:00.000Z'],
    // batch_008 (2026春第一批 completed)
    ['appt_002', 'student_2026001', 'batch_008', 'completed', '2026-03-10 08:30', '2026-03-10 11:00', '2026-03-10T08:30:00.000Z'],
    ['appt_201', 'student_2026002', 'batch_008', 'completed', '2026-03-11 09:00', '2026-03-11 11:00', '2026-03-11T09:00:00.000Z'],
    ['appt_202', 'student_2026003', 'batch_008', 'completed', '2026-03-12 08:00', '2026-03-12 10:30', '2026-03-12T08:00:00.000Z'],
    ['appt_203', 'student_2026005', 'batch_008', 'completed', '2026-03-13 09:00', '2026-03-13 11:00', '2026-03-13T09:00:00.000Z'],
    ['appt_204', 'student_2026006', 'batch_008', 'completed', '2026-03-14 08:00', '2026-03-14 10:00', '2026-03-14T08:00:00.000Z'],
    ['appt_205', 'student_2026007', 'batch_008', 'completed', '2026-03-10 14:00', '2026-03-10 16:00', '2026-03-10T14:00:00.000Z'],
    ['appt_206', 'student_2026009', 'batch_008', 'completed', '2026-03-11 14:00', '2026-03-11 16:00', '2026-03-11T14:00:00.000Z'],
    ['appt_207', 'student_2026011', 'batch_008', 'completed', '2026-03-12 14:00', '2026-03-12 16:00', '2026-03-12T14:00:00.000Z'],
    ['appt_208', 'student_2026017', 'batch_008', 'cancelled',  '2026-03-13 14:00', null, '2026-03-13T14:00:00.000Z'],
    // batch_009 (2026春第二批 completed)
    ['appt_209', 'student_2026004', 'batch_009', 'completed', '2026-03-24 14:00', '2026-03-24 16:30', '2026-03-24T14:00:00.000Z'],
    ['appt_210', 'student_2026008', 'batch_009', 'completed', '2026-03-25 14:00', '2026-03-25 16:00', '2026-03-25T14:00:00.000Z'],
    ['appt_211', 'student_2026010', 'batch_009', 'completed', '2026-03-26 14:00', '2026-03-26 16:00', '2026-03-26T14:00:00.000Z'],
    ['appt_212', 'student_2026012', 'batch_009', 'completed', '2026-03-27 14:00', '2026-03-27 16:00', '2026-03-27T14:00:00.000Z'],
    ['appt_213', 'student_2026015', 'batch_009', 'completed', '2026-03-28 14:00', '2026-03-28 16:00', '2026-03-28T14:00:00.000Z'],
    ['appt_214', 'student_2026013', 'batch_009', 'completed', '2026-03-31 14:00', '2026-03-31 16:00', '2026-03-31T14:00:00.000Z'],
    // batch_010 (2026春补测 open)
    ['appt_215', 'student_2026003', 'batch_010', 'confirmed', '2026-05-19 14:00', null, '2026-05-16T10:00:00.000Z'],
    ['appt_216', 'student_2026017', 'batch_010', 'confirmed', '2026-05-20 14:00', null, '2026-05-17T09:00:00.000Z'],
    ['appt_217', 'student_2026019', 'batch_010', 'confirmed', '2026-05-21 14:00', null, '2026-05-18T11:00:00.000Z'],
  ];
  for (const [id, studentId, batchId, status, apptTime, completedAt, createdAt] of appointments) {
    const existing = await query('SELECT * FROM appointments WHERE id = ?', [id]);
    if (existing.length === 0) {
      await run('INSERT INTO appointments (id, student_id, batch_id, status, appointment_time, completed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, studentId, batchId, status, apptTime, completedAt, createdAt || now()]);
      console.log(`Appointment ${id} created`);
    }
  }

  // ========== 成绩 ==========
  const scores = [
    // batch_005 张三 2025秋第一批
    ['s_001', 'student_2026001', 'batch_005', 'proj_001', 85, '良好', 'teacher_T2026001', '2025-10-14T10:30:00.000Z'],
    ['s_002', 'student_2026001', 'batch_005', 'proj_002', 92, '优秀', 'teacher_T2026001', '2025-10-14T10:30:00.000Z'],
    ['s_003', 'student_2026001', 'batch_005', 'proj_003', 78, '良好', 'teacher_T2026001', '2025-10-14T10:30:00.000Z'],
    ['s_004', 'student_2026001', 'batch_005', 'proj_004', 70, '及格', 'teacher_T2026001', '2025-10-14T10:30:00.000Z'],
    ['s_005', 'student_2026001', 'batch_005', 'proj_005', 88, '良好', 'teacher_T2026001', '2025-10-14T10:30:00.000Z'],
    ['s_006', 'student_2026001', 'batch_005', 'proj_009', 75, '良好', 'teacher_T2026001', '2025-10-14T10:30:00.000Z'],
    // batch_008 张三 2026春第一批
    ['s_007', 'student_2026001', 'batch_008', 'proj_001', 87, '良好', 'teacher_T2026001', '2026-03-10T11:00:00.000Z'],
    ['s_008', 'student_2026001', 'batch_008', 'proj_002', 95, '优秀', 'teacher_T2026001', '2026-03-10T11:00:00.000Z'],
    ['s_009', 'student_2026001', 'batch_008', 'proj_003', 82, '良好', 'teacher_T2026001', '2026-03-10T11:00:00.000Z'],
    ['s_010', 'student_2026001', 'batch_008', 'proj_004', 75, '良好', 'teacher_T2026001', '2026-03-10T11:00:00.000Z'],
    ['s_011', 'student_2026001', 'batch_008', 'proj_005', 90, '优秀', 'teacher_T2026001', '2026-03-10T11:00:00.000Z'],
    ['s_012', 'student_2026001', 'batch_008', 'proj_009', 80, '良好', 'teacher_T2026001', '2026-03-10T11:00:00.000Z'],
    // batch_005 李四
    ['s_013', 'student_2026002', 'batch_005', 'proj_001', 80, '良好', 'teacher_T2026001', '2025-10-15T11:00:00.000Z'],
    ['s_014', 'student_2026002', 'batch_005', 'proj_002', 88, '良好', 'teacher_T2026001', '2025-10-15T11:00:00.000Z'],
    ['s_015', 'student_2026002', 'batch_005', 'proj_003', 72, '良好', 'teacher_T2026001', '2025-10-15T11:00:00.000Z'],
    ['s_016', 'student_2026002', 'batch_005', 'proj_007', 85, '良好', 'teacher_T2026001', '2025-10-15T11:00:00.000Z'],
    ['s_017', 'student_2026002', 'batch_005', 'proj_008', 78, '良好', 'teacher_T2026001', '2025-10-15T11:00:00.000Z'],
    ['s_018', 'student_2026002', 'batch_005', 'proj_004', 68, '及格', 'teacher_T2026001', '2025-10-15T11:00:00.000Z'],
    // batch_005 王五
    ['s_019', 'student_2026003', 'batch_005', 'proj_001', 76, '及格', 'teacher_T2026001', '2025-10-16T10:00:00.000Z'],
    ['s_020', 'student_2026003', 'batch_005', 'proj_002', 65, '及格', 'teacher_T2026001', '2025-10-16T10:00:00.000Z'],
    ['s_021', 'student_2026003', 'batch_005', 'proj_003', 70, '及格', 'teacher_T2026001', '2025-10-16T10:00:00.000Z'],
    ['s_022', 'student_2026003', 'batch_005', 'proj_004', 62, '及格', 'teacher_T2026001', '2025-10-16T10:00:00.000Z'],
    ['s_023', 'student_2026003', 'batch_005', 'proj_005', 73, '良好', 'teacher_T2026001', '2025-10-16T10:00:00.000Z'],
    ['s_024', 'student_2026003', 'batch_005', 'proj_009', 68, '及格', 'teacher_T2026001', '2025-10-16T10:00:00.000Z'],
    // batch_005 孙七
    ['s_025', 'student_2026005', 'batch_005', 'proj_001', 90, '优秀', 'teacher_T2026001', '2025-10-17T11:00:00.000Z'],
    ['s_026', 'student_2026005', 'batch_005', 'proj_002', 96, '优秀', 'teacher_T2026001', '2025-10-17T11:00:00.000Z'],
    ['s_027', 'student_2026005', 'batch_005', 'proj_003', 88, '良好', 'teacher_T2026001', '2025-10-17T11:00:00.000Z'],
    ['s_028', 'student_2026005', 'batch_005', 'proj_005', 92, '优秀', 'teacher_T2026001', '2025-10-17T11:00:00.000Z'],
    ['s_029', 'student_2026005', 'batch_005', 'proj_009', 85, '良好', 'teacher_T2026001', '2025-10-17T11:00:00.000Z'],
    // batch_005 周文静
    ['s_030', 'student_2026006', 'batch_005', 'proj_001', 82, '良好', 'teacher_T2026001', '2025-10-14T16:00:00.000Z'],
    ['s_031', 'student_2026006', 'batch_005', 'proj_002', 90, '优秀', 'teacher_T2026001', '2025-10-14T16:00:00.000Z'],
    ['s_032', 'student_2026006', 'batch_005', 'proj_003', 75, '良好', 'teacher_T2026001', '2025-10-14T16:00:00.000Z'],
    ['s_033', 'student_2026006', 'batch_005', 'proj_007', 88, '良好', 'teacher_T2026001', '2025-10-14T16:00:00.000Z'],
    ['s_034', 'student_2026006', 'batch_005', 'proj_008', 80, '良好', 'teacher_T2026001', '2025-10-14T16:00:00.000Z'],
    ['s_035', 'student_2026006', 'batch_005', 'proj_004', 78, '良好', 'teacher_T2026001', '2025-10-14T16:00:00.000Z'],
    // batch_008 李四 2026春
    ['s_036', 'student_2026002', 'batch_008', 'proj_001', 83, '良好', 'teacher_T2026002', '2026-03-11T11:00:00.000Z'],
    ['s_037', 'student_2026002', 'batch_008', 'proj_002', 91, '优秀', 'teacher_T2026002', '2026-03-11T11:00:00.000Z'],
    ['s_038', 'student_2026002', 'batch_008', 'proj_003', 76, '良好', 'teacher_T2026002', '2026-03-11T11:00:00.000Z'],
    ['s_039', 'student_2026002', 'batch_008', 'proj_007', 90, '优秀', 'teacher_T2026002', '2026-03-11T11:00:00.000Z'],
    ['s_040', 'student_2026002', 'batch_008', 'proj_008', 82, '良好', 'teacher_T2026002', '2026-03-11T11:00:00.000Z'],
    ['s_041', 'student_2026002', 'batch_008', 'proj_004', 74, '良好', 'teacher_T2026002', '2026-03-11T11:00:00.000Z'],
    // batch_008 王五 2026春
    ['s_042', 'student_2026003', 'batch_008', 'proj_001', 79, '良好', 'teacher_T2026001', '2026-03-12T10:30:00.000Z'],
    ['s_043', 'student_2026003', 'batch_008', 'proj_002', 72, '良好', 'teacher_T2026001', '2026-03-12T10:30:00.000Z'],
    ['s_044', 'student_2026003', 'batch_008', 'proj_003', 75, '良好', 'teacher_T2026001', '2026-03-12T10:30:00.000Z'],
    ['s_045', 'student_2026003', 'batch_008', 'proj_005', 80, '良好', 'teacher_T2026001', '2026-03-12T10:30:00.000Z'],
    ['s_046', 'student_2026003', 'batch_008', 'proj_009', 73, '良好', 'teacher_T2026001', '2026-03-12T10:30:00.000Z'],
    ['s_047', 'student_2026003', 'batch_008', 'proj_004', 66, '及格', 'teacher_T2026001', '2026-03-12T10:30:00.000Z'],
    // batch_008 孙七 2026春
    ['s_048', 'student_2026005', 'batch_008', 'proj_001', 92, '优秀', 'teacher_T2026001', '2026-03-13T11:00:00.000Z'],
    ['s_049', 'student_2026005', 'batch_008', 'proj_002', 98, '优秀', 'teacher_T2026001', '2026-03-13T11:00:00.000Z'],
    ['s_050', 'student_2026005', 'batch_008', 'proj_003', 90, '优秀', 'teacher_T2026001', '2026-03-13T11:00:00.000Z'],
    ['s_051', 'student_2026005', 'batch_008', 'proj_005', 94, '优秀', 'teacher_T2026001', '2026-03-13T11:00:00.000Z'],
    ['s_052', 'student_2026005', 'batch_008', 'proj_009', 88, '良好', 'teacher_T2026001', '2026-03-13T11:00:00.000Z'],
    // batch_008 周文静 2026春
    ['s_053', 'student_2026006', 'batch_008', 'proj_001', 85, '良好', 'teacher_T2026002', '2026-03-14T10:00:00.000Z'],
    ['s_054', 'student_2026006', 'batch_008', 'proj_002', 93, '优秀', 'teacher_T2026002', '2026-03-14T10:00:00.000Z'],
    ['s_055', 'student_2026006', 'batch_008', 'proj_003', 80, '良好', 'teacher_T2026002', '2026-03-14T10:00:00.000Z'],
    ['s_056', 'student_2026006', 'batch_008', 'proj_007', 92, '优秀', 'teacher_T2026002', '2026-03-14T10:00:00.000Z'],
    ['s_057', 'student_2026006', 'batch_008', 'proj_008', 85, '良好', 'teacher_T2026002', '2026-03-14T10:00:00.000Z'],
    ['s_058', 'student_2026006', 'batch_008', 'proj_004', 82, '良好', 'teacher_T2026002', '2026-03-14T10:00:00.000Z'],
    // batch_008 吴强 2026春
    ['s_059', 'student_2026007', 'batch_008', 'proj_001', 78, '良好', 'teacher_T2026001', '2026-03-10T16:00:00.000Z'],
    ['s_060', 'student_2026007', 'batch_008', 'proj_002', 84, '良好', 'teacher_T2026001', '2026-03-10T16:00:00.000Z'],
    ['s_061', 'student_2026007', 'batch_008', 'proj_003', 72, '良好', 'teacher_T2026001', '2026-03-10T16:00:00.000Z'],
    ['s_062', 'student_2026007', 'batch_008', 'proj_005', 76, '良好', 'teacher_T2026001', '2026-03-10T16:00:00.000Z'],
    ['s_063', 'student_2026007', 'batch_008', 'proj_009', 70, '及格', 'teacher_T2026001', '2026-03-10T16:00:00.000Z'],
    // batch_008 马小龙 2026春
    ['s_064', 'student_2026009', 'batch_008', 'proj_001', 88, '良好', 'teacher_T2026002', '2026-03-11T16:00:00.000Z'],
    ['s_065', 'student_2026009', 'batch_008', 'proj_002', 82, '良好', 'teacher_T2026002', '2026-03-11T16:00:00.000Z'],
    ['s_066', 'student_2026009', 'batch_008', 'proj_003', 85, '良好', 'teacher_T2026002', '2026-03-11T16:00:00.000Z'],
    ['s_067', 'student_2026009', 'batch_008', 'proj_005', 80, '良好', 'teacher_T2026002', '2026-03-11T16:00:00.000Z'],
    ['s_068', 'student_2026009', 'batch_008', 'proj_009', 78, '良好', 'teacher_T2026002', '2026-03-11T16:00:00.000Z'],
    // batch_008 林思远 2026春
    ['s_069', 'student_2026011', 'batch_008', 'proj_001', 74, '良好', 'teacher_T2026001', '2026-03-12T16:00:00.000Z'],
    ['s_070', 'student_2026011', 'batch_008', 'proj_002', 68, '及格', 'teacher_T2026001', '2026-03-12T16:00:00.000Z'],
    ['s_071', 'student_2026011', 'batch_008', 'proj_003', 65, '及格', 'teacher_T2026001', '2026-03-12T16:00:00.000Z'],
    ['s_072', 'student_2026011', 'batch_008', 'proj_005', 70, '及格', 'teacher_T2026001', '2026-03-12T16:00:00.000Z'],
    ['s_073', 'student_2026011', 'batch_008', 'proj_009', 62, '及格', 'teacher_T2026001', '2026-03-12T16:00:00.000Z'],
    // batch_009 赵六 2026春第二批
    ['s_074', 'student_2026004', 'batch_009', 'proj_001', 83, '良好', 'teacher_T2026003', '2026-03-24T16:30:00.000Z'],
    ['s_075', 'student_2026004', 'batch_009', 'proj_002', 86, '良好', 'teacher_T2026003', '2026-03-24T16:30:00.000Z'],
    ['s_076', 'student_2026004', 'batch_009', 'proj_003', 78, '良好', 'teacher_T2026003', '2026-03-24T16:30:00.000Z'],
    ['s_077', 'student_2026004', 'batch_009', 'proj_007', 90, '优秀', 'teacher_T2026003', '2026-03-24T16:30:00.000Z'],
    ['s_078', 'student_2026004', 'batch_009', 'proj_008', 82, '良好', 'teacher_T2026003', '2026-03-24T16:30:00.000Z'],
    ['s_079', 'student_2026004', 'batch_009', 'proj_004', 75, '良好', 'teacher_T2026003', '2026-03-24T16:30:00.000Z'],
    // batch_009 郑丽华
    ['s_080', 'student_2026008', 'batch_009', 'proj_001', 77, '良好', 'teacher_T2026003', '2026-03-25T16:00:00.000Z'],
    ['s_081', 'student_2026008', 'batch_009', 'proj_002', 80, '良好', 'teacher_T2026003', '2026-03-25T16:00:00.000Z'],
    ['s_082', 'student_2026008', 'batch_009', 'proj_003', 72, '良好', 'teacher_T2026003', '2026-03-25T16:00:00.000Z'],
    ['s_083', 'student_2026008', 'batch_009', 'proj_007', 85, '良好', 'teacher_T2026003', '2026-03-25T16:00:00.000Z'],
    ['s_084', 'student_2026008', 'batch_009', 'proj_008', 76, '良好', 'teacher_T2026003', '2026-03-25T16:00.00.000Z'],
    ['s_085', 'student_2026008', 'batch_009', 'proj_004', 70, '及格', 'teacher_T2026003', '2026-03-25T16:00:00.000Z'],
    // batch_009 黄晓燕
    ['s_086', 'student_2026010', 'batch_009', 'proj_001', 91, '优秀', 'teacher_T2026003', '2026-03-26T16:00:00.000Z'],
    ['s_087', 'student_2026010', 'batch_009', 'proj_002', 94, '优秀', 'teacher_T2026003', '2026-03-26T16:00:00.000Z'],
    ['s_088', 'student_2026010', 'batch_009', 'proj_003', 86, '良好', 'teacher_T2026003', '2026-03-26T16:00:00.000Z'],
    ['s_089', 'student_2026010', 'batch_009', 'proj_007', 88, '良好', 'teacher_T2026003', '2026-03-26T16:00:00.000Z'],
    ['s_090', 'student_2026010', 'batch_009', 'proj_008', 84, '良好', 'teacher_T2026003', '2026-03-26T16:00:00.000Z'],
    ['s_091', 'student_2026010', 'batch_009', 'proj_004', 82, '良好', 'teacher_T2026003', '2026-03-26T16:00:00.000Z'],
  ];
  for (const [id, studentId, batchId, projectId, score, remarks, enteredBy, enteredAt] of scores) {
    const existing = await query('SELECT * FROM scores WHERE id = ?', [id]);
    if (existing.length === 0) {
      await run('INSERT INTO scores (id, student_id, batch_id, project_id, score, remarks, entered_by, entered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, studentId, batchId, projectId, score, remarks, enteredBy, enteredAt]);
      console.log(`Score ${id} created`);
    }
  }

  // ========== 公告 ==========
  const notices = [
    ['notice_001', '欢迎使用体测管理系统', '欢迎使用体测管理系统！请各位同学按时参加体质健康测试，测试前请做好热身准备。如有问题请联系体育学院办公室。', 'normal', 'published', '管理员', 'admin_id_001', '2024-09-01T08:00:00.000Z'],
    ['notice_002', '2024年秋季体测安排通知', '2024年秋季体质健康测试将于10月10日开始，请各位同学查看批次安排，提前预约。\n\n测试项目包括：身高体重、肺活量、50米跑、坐位体前屈、立定跳远、引体向上（男）/仰卧起坐（女）、1000米跑（男）/800米跑（女）。\n\n测试地点：体育馆A区、体育馆B区', 'high', 'published', '王建国', 'admin_id_001', '2024-09-28T09:00:00.000Z'],
    ['notice_003', '体测注意事项', '1. 测试当天请穿着运动服和运动鞋\n2. 测试前2小时请勿进食过饱\n3. 请携带学生证或校园卡\n4. 因身体原因无法参加测试的同学，请提前向辅导员申请免测\n5. 补测安排将在主测结束后另行通知\n6. 请提前15分钟到达测试地点签到', 'high', 'published', '管理员', 'admin_id_001', '2024-10-08T10:00:00.000Z'],
    ['notice_004', '2024年秋季体测成绩已公布', '2024年秋季体质健康测试成绩已公布，请各位同学登录系统查看个人成绩。如有疑问，请联系体育学院办公室。', 'normal', 'published', '管理员', 'admin_id_001', '2024-12-01T14:00:00.000Z'],
    ['notice_005', '2025年春季体测安排通知', '2025年春季体质健康测试将于3月10日开始，请各位同学查看批次安排，提前预约。补测时间安排在4月15日-20日。', 'high', 'published', '王建国', 'admin_id_001', '2025-02-25T09:00:00.000Z'],
    ['notice_006', '2025年春季体测成绩已公布', '2025年春季体质健康测试成绩已公布，请各位同学登录系统查看个人成绩。不及格的同学请关注补测通知。', 'normal', 'published', '管理员', 'admin_id_001', '2025-04-25T14:00:00.000Z'],
    ['notice_007', '2025年秋季体测安排通知', '2025年秋季体质健康测试将于10月13日开始，共分三批进行。请各位同学根据班级安排选择对应批次预约。\n\n第一批：10月13日-24日（计科专业优先）\n第二批：10月27日-11月7日（软工专业优先）\n第三批：11月10日-21日（补测及其他专业）', 'high', 'published', '王建国', 'admin_id_001', '2025-09-20T10:00:00.000Z'],
    ['notice_008', '体测标准更新说明', '根据教育部最新文件，2025年起体测评分标准有所调整：\n1. BMI评分标准微调\n2. 肺活量评分标准提高\n3. 耐力跑项目权重增加\n请同学们注意对照新标准进行训练准备。', 'normal', 'published', '李芳', 'admin_id_001', '2025-09-25T10:00:00.000Z'],
    ['notice_009', '2025年秋季体测第三批即将截止', '2025年秋季体测第三批（11月10日-21日）预约即将截止，尚未预约的同学请尽快完成预约。逾期未预约的同学需等待补测安排。', 'high', 'published', '陈志远', 'admin_id_001', '2025-11-08T14:00:00.000Z'],
    ['notice_010', '2026年春季体测安排通知', '2026年春季体质健康测试将于3月9日开始，共分两批进行。补测安排在5月18日-28日。\n\n请各位同学按时参加测试，因故不能参加的请提前请假。', 'high', 'published', '王建国', 'admin_id_001', '2026-02-20T09:00:00.000Z'],
    ['notice_011', '2026年春季体测成绩已公布', '2026年春季体质健康测试成绩已公布，请各位同学登录系统查看个人成绩。如有疑问，请联系体育学院办公室。不及格的同学请关注补测通知。', 'normal', 'published', '管理员', 'admin_id_001', '2026-04-10T14:00:00.000Z'],
    ['notice_012', '2026年春季补测报名通知', '2026年春季体测补测将于5月18日-28日在田径场进行，每天下午14:00-17:00。需要补测的同学请尽快预约。', 'high', 'published', '李芳', 'admin_id_001', '2026-05-10T09:00:00.000Z'],
    ['notice_013', '体测免测申请通知', '因伤病等原因无法参加体质健康测试的同学，请在测试开始前两周内向所在学院提交免测申请，附医院诊断证明。逾期不再受理。', 'normal', 'published', '刘晓梅', 'admin_id_001', '2026-05-11T10:00:00.000Z'],
    ['notice_014', '体测系统维护通知（草稿）', '体测系统将于本周末进行例行维护，届时系统将暂时无法访问。', 'low', 'draft', '管理员', 'admin_id_001', '2026-05-12T08:00:00.000Z'],
  ];
  for (const [id, title, content, priority, status, author, createdBy, createdAt] of notices) {
    const existing = await query('SELECT * FROM notices WHERE id = ?', [id]);
    if (existing.length === 0) {
      await run('INSERT INTO notices (id, title, content, priority, status, author, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, title, content, priority, status, author, createdBy, createdAt]);
      console.log(`Notice "${title}" created`);
    }
  }

  // ========== 横幅 ==========
  const banners = [
    ['banner_001', '2025秋季体测进行中', 'https://img.zcool.cn/community/01f9a65d3b1a20a801213f262cfe72.jpg', '/pages/student/appointments', 'home', 1, 'active'],
    ['banner_002', '体测成绩查询', 'https://img.zcool.cn/community/0139de5d3b1a20a801213f2691e892.jpg', '/pages/student/scores', 'home', 2, 'active'],
    ['banner_003', '春季补测预约中', 'https://img.zcool.cn/community/01de4a5d3b1a20a801213f2633e861.jpg', '/pages/student/notices', 'home', 3, 'active'],
  ];
  for (const [id, title, imageUrl, linkUrl, position, sortOrder, status] of banners) {
    const existing = await query('SELECT * FROM banners WHERE id = ?', [id]);
    if (existing.length === 0) {
      const timestamp = now();
      await run('INSERT INTO banners (id, title, image_url, link_url, position, sort_order, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [id, title, imageUrl, linkUrl, position, sortOrder, status, timestamp, timestamp]);
      console.log(`Banner "${title}" created`);
    }
  }

  console.log('Seed data initialization completed');
}

module.exports = { seedData };
