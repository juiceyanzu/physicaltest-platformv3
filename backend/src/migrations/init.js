const { db } = require('../config/database');

function runSql(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function initDatabase() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT,
      avatar TEXT,
      role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin')),
      status TEXT NOT NULL CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      gender TEXT CHECK(gender IN ('male', 'female')),
      birth_date TEXT,
      class TEXT,
      major TEXT,
      grade TEXT,
      phone TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS teachers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      gender TEXT CHECK(gender IN ('male', 'female')),
      title TEXT,
      department TEXT,
      phone TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('draft', 'open', 'closed', 'completed')) DEFAULT 'open',
      max_capacity INTEGER DEFAULT 100,
      current_count INTEGER DEFAULT 0,
      time_slot TEXT,
      location TEXT,
      teacher TEXT,
      project TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      unit TEXT,
      gender_requirement TEXT CHECK(gender_requirement IN ('male', 'female', 'all')) DEFAULT 'all',
      min_score REAL DEFAULT 0,
      max_score REAL DEFAULT 100,
      is_required INTEGER DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      batch_id TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
      appointment_time TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS scores (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      batch_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      score REAL NOT NULL,
      remarks TEXT,
      entered_by TEXT NOT NULL,
      entered_at TEXT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS notices (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      priority TEXT CHECK(priority IN ('low', 'normal', 'high')) DEFAULT 'normal',
      status TEXT NOT NULL CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
      author TEXT,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS banners (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      link_url TEXT,
      position TEXT NOT NULL CHECK(position IN ('home', 'other')) DEFAULT 'home',
      sort_order INTEGER DEFAULT 0,
      status TEXT NOT NULL CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
      created_at TEXT NOT NULL,
      updated_at TEXT
    )`,
    'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)',
    'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
    'CREATE INDEX IF NOT EXISTS idx_appointments_student ON appointments(student_id)',
    'CREATE INDEX IF NOT EXISTS idx_appointments_batch ON appointments(batch_id)',
    'CREATE INDEX IF NOT EXISTS idx_scores_student ON scores(student_id)',
    'CREATE INDEX IF NOT EXISTS idx_scores_batch ON scores(batch_id)',
    'CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status)',
  ];

  for (const sql of statements) {
    await runSql(sql);
  }
  console.log('All tables created successfully');
}

module.exports = { initDatabase };
