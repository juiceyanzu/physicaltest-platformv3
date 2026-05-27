const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5173,
  path: '/teacher/scores',
  method: 'GET',
  headers: {
    'Cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlYWNoZXJfMDAxIiwidXNlcm5hbWUiOiJUMjAyNjAwMSIsInJvbGUiOiJ0ZWFjaGVyIiwiaWF0IjoxNzc4NDY1MzIxLCJleHAiOjE3Nzg0Njg5MjF9.8g6H7r2aS0E4T5Y6U7I8O9P0Q1R2T3Y4U5I6O7P8Q9R0T1Y2U3I4O5P6Q7R8T9'
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
    console.log('响应体长度:', data.length);
    console.log('响应体前500字符:', data.substring(0, 500));
  });
});

req.on('error', (e) => {
  console.error('请求遇到问题:', e.message);
});

req.end();