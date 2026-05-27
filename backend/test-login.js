const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(JSON.stringify({ username: 'admin', password: 'admin123' }))
  }
};

const req = http.request(options, (res) => {
  console.log('状态码:', res.statusCode);
  console.log('响应头:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应体:', data);
  });
});

req.on('error', (e) => {
  console.error('请求遇到问题:', e.message);
});

req.write(JSON.stringify({ username: 'admin', password: 'admin123' }));
req.end();