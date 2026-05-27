# 体测平台API接口文档

## 1. 认证接口

### 1.1 登录
- **URL**: `/api/users/login`
- **Method**: POST
- **Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": { "id": "string", "username": "string", "role": "string", "nickname": "string" },
    "profile": { ... },
    "token": "string"
  }
}
```

### 1.2 微信登录
- **URL**: `/api/users/wechat-login`
- **Method**: POST
- **Request Body**:
```json
{
  "code": "string"
}
```

### 1.3 获取当前用户
- **URL**: `/api/users/me`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`

## 2. 用户管理接口

### 2.1 获取学生列表
- **URL**: `/api/users/students`
- **Method**: GET
- **Roles**: admin, teacher

### 2.2 创建学生
- **URL**: `/api/users/students`
- **Method**: POST
- **Roles**: admin

### 2.3 更新学生
- **URL**: `/api/users/students/:id`
- **Method**: PUT
- **Roles**: admin

### 2.4 删除学生
- **URL**: `/api/users/students/:id`
- **Method**: DELETE
- **Roles**: admin

## 3. 批次管理接口

### 3.1 获取批次列表
- **URL**: `/api/batches`
- **Method**: GET

### 3.2 创建批次
- **URL**: `/api/batches`
- **Method**: POST
- **Roles**: admin

### 3.3 更新批次
- **URL**: `/api/batches/:id`
- **Method**: PUT
- **Roles**: admin

### 3.4 删除批次
- **URL**: `/api/batches/:id`
- **Method**: DELETE
- **Roles**: admin

## 4. 预约接口

### 4.1 获取预约列表
- **URL**: `/api/appointments`
- **Method**: GET
- **Query Params**: studentId, batchId, status

### 4.2 创建预约
- **URL**: `/api/appointments`
- **Method**: POST
- **Roles**: student

### 4.3 更新预约状态
- **URL**: `/api/appointments/:id`
- **Method**: PUT

### 4.4 取消预约
- **URL**: `/api/appointments/:id`
- **Method**: DELETE

## 5. 成绩接口

### 5.1 获取成绩列表
- **URL**: `/api/scores`
- **Method**: GET
- **Query Params**: studentId, batchId, projectId

### 5.2 录入成绩
- **URL**: `/api/scores`
- **Method**: POST
- **Roles**: teacher

### 5.3 更新成绩
- **URL**: `/api/scores/:id`
- **Method**: PUT
- **Roles**: teacher

### 5.4 删除成绩
- **URL**: `/api/scores/:id`
- **Method**: DELETE
- **Roles**: teacher, admin

## 6. 公告接口

### 6.1 获取公告列表
- **URL**: `/api/notices`
- **Method**: GET

### 6.2 发布公告
- **URL**: `/api/notices`
- **Method**: POST
- **Roles**: admin

### 6.3 更新公告
- **URL**: `/api/notices/:id`
- **Method**: PUT
- **Roles**: admin

### 6.4 删除公告
- **URL**: `/api/notices/:id`
- **Method**: DELETE
- **Roles**: admin

## 7. 项目接口

### 7.1 获取项目列表
- **URL**: `/api/projects`
- **Method**: GET

### 7.2 创建项目
- **URL**: `/api/projects`
- **Method**: POST
- **Roles**: admin

### 7.3 更新项目
- **URL**: `/api/projects/:id`
- **Method**: PUT
- **Roles**: admin

### 7.4 删除项目
- **URL**: `/api/projects/:id`
- **Method**: DELETE
- **Roles**: admin

## 8. 错误响应格式

```json
{
  "success": false,
  "message": "error message"
}
```

## 9. 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |