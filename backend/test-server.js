const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.sqlite');

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ success: false, message: '数据库错误' });
      }
      
      if (!user) {
        return res.status(401).json({ success: false, message: '用户名或密码错误' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: '用户名或密码错误' });
      }
      
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, 'secret', { expiresIn: '1h' });
      
      res.json({
        success: true,
        data: {
          user: { id: user.id, username: user.username, role: user.role, nickname: user.nickname },
          token
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});