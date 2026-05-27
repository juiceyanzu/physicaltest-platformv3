# 体测平台数据库设计文档

## 1. 数据库概述

本数据库设计用于支持体测平台的三端（学生端、教师端、管理员端）数据存储与访问控制，确保数据的一致性、安全性和可扩展性。

## 2. 数据库表结构

### 2.1 用户表 (users)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 用户唯一标识 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名/学号/工号 |
| password | VARCHAR(255) | NOT NULL | 加密后的密码 |
| nickname | VARCHAR(100) | | 用户昵称 |
| avatar | VARCHAR(255) | | 头像URL |
| role | ENUM | NOT NULL | 用户角色：student/teacher/admin |
| status | ENUM | NOT NULL | 用户状态：active/inactive |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

### 2.2 学生信息表 (students)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 学生唯一标识 |
| user_id | VARCHAR(36) | FOREIGN KEY | 关联用户ID |
| name | VARCHAR(50) | NOT NULL | 学生姓名 |
| gender | ENUM | | 性别：male/female |
| birth_date | DATE | | 出生日期 |
| class | VARCHAR(50) | | 班级 |
| major | VARCHAR(100) | | 专业 |
| grade | VARCHAR(20) | | 年级 |
| phone | VARCHAR(20) | | 联系电话 |

### 2.3 教师信息表 (teachers)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 教师唯一标识 |
| user_id | VARCHAR(36) | FOREIGN KEY | 关联用户ID |
| name | VARCHAR(50) | NOT NULL | 教师姓名 |
| gender | ENUM | | 性别 |
| title | VARCHAR(50) | | 职称 |
| department | VARCHAR(100) | | 部门 |
| phone | VARCHAR(20) | | 联系电话 |

### 2.4 体测批次表 (batches)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 批次唯一标识 |
| name | VARCHAR(100) | NOT NULL | 批次名称 |
| start_date | DATE | NOT NULL | 开始日期 |
| end_date | DATE | NOT NULL | 结束日期 |
| status | ENUM | NOT NULL | 状态：draft/active/completed |
| max_capacity | INT | | 最大预约人数 |
| current_count | INT | DEFAULT 0 | 当前预约人数 |
| created_at | DATETIME | NOT NULL | 创建时间 |

### 2.5 体测项目表 (projects)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 项目唯一标识 |
| name | VARCHAR(50) | NOT NULL | 项目名称 |
| unit | VARCHAR(20) | | 单位 |
| gender_requirement | ENUM | | 性别要求：male/female/all |
| min_score | DECIMAL | DEFAULT 0 | 最低分 |
| max_score | DECIMAL | DEFAULT 100 | 最高分 |

### 2.6 预约表 (appointments)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 预约唯一标识 |
| student_id | VARCHAR(36) | FOREIGN KEY | 学生ID |
| batch_id | VARCHAR(36) | FOREIGN KEY | 批次ID |
| status | ENUM | NOT NULL | 状态：pending/completed/canceled |
| appointment_time | DATETIME | | 预约时间 |
| completed_at | DATETIME | | 完成时间 |
| created_at | DATETIME | NOT NULL | 创建时间 |

### 2.7 成绩表 (scores)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 成绩唯一标识 |
| student_id | VARCHAR(36) | FOREIGN KEY | 学生ID |
| batch_id | VARCHAR(36) | FOREIGN KEY | 批次ID |
| project_id | VARCHAR(36) | FOREIGN KEY | 项目ID |
| score | DECIMAL | NOT NULL | 成绩分数 |
| remarks | VARCHAR(200) | | 备注 |
| entered_by | VARCHAR(36) | FOREIGN KEY | 录入教师ID |
| entered_at | DATETIME | NOT NULL | 录入时间 |

### 2.8 公告表 (notices)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 公告唯一标识 |
| title | VARCHAR(200) | NOT NULL | 公告标题 |
| content | TEXT | NOT NULL | 公告内容 |
| priority | ENUM | DEFAULT normal | 优先级：low/normal/high |
| status | ENUM | NOT NULL | 状态：draft/published/archived |
| created_by | VARCHAR(36) | FOREIGN KEY | 创建者ID |
| created_at | DATETIME | NOT NULL | 创建时间 |

### 2.9 横幅表 (banners)

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | VARCHAR(36) | PRIMARY KEY | 横幅唯一标识 |
| title | VARCHAR(100) | NOT NULL | 横幅标题 |
| image_url | VARCHAR(255) | NOT NULL | 图片URL |
| link_url | VARCHAR(255) | | 跳转链接 |
| position | ENUM | NOT NULL | 位置：home/other |
| sort_order | INT | DEFAULT 0 | 排序号 |
| status | ENUM | NOT NULL | 状态：active/inactive |
| created_at | DATETIME | NOT NULL | 创建时间 |

## 3. 索引设计

| 表名 | 索引字段 | 索引类型 | 说明 |
|------|----------|----------|------|
| users | username | UNIQUE | 用户名唯一索引 |
| users | role | INDEX | 角色索引 |
| students | user_id | FOREIGN KEY | 用户关联 |
| teachers | user_id | FOREIGN KEY | 用户关联 |
| appointments | student_id | INDEX | 学生预约索引 |
| appointments | batch_id | INDEX | 批次预约索引 |
| scores | student_id | INDEX | 学生成绩索引 |
| scores | batch_id | INDEX | 批次成绩索引 |
| notices | status | INDEX | 公告状态索引 |

## 4. 权限控制设计

### 4.1 角色权限矩阵

| 资源 | 学生 | 教师 | 管理员 |
|------|------|------|--------|
| 查看个人信息 | ✅ | ✅ | ✅ |
| 修改个人信息 | ✅ | ✅ | ✅ |
| 预约体测 | ✅ | ❌ | ❌ |
| 查看预约记录 | ✅ | ✅ | ✅ |
| 查看成绩 | ✅ | ✅ | ✅ |
| 录入成绩 | ❌ | ✅ | ❌ |
| 管理批次 | ❌ | ❌ | ✅ |
| 管理项目 | ❌ | ❌ | ✅ |
| 管理用户 | ❌ | ❌ | ✅ |
| 发布公告 | ❌ | ❌ | ✅ |
| 管理横幅 | ❌ | ❌ | ✅ |

### 4.2 数据访问规则

1. **学生**：只能访问自己的数据，不能修改他人数据
2. **教师**：可以查看所有学生的预约和成绩，可录入成绩
3. **管理员**：拥有全部权限，可管理所有数据

## 5. 数据同步机制

### 5.1 实时同步策略

- **预约变更**：学生预约/取消后立即同步到数据库
- **成绩录入**：教师录入成绩后立即更新相关统计
- **公告发布**：管理员发布后立即推送给所有端

### 5.2 缓存策略

- 使用Redis缓存热门数据（如公告、批次信息）
- 设置合理的缓存过期时间，确保数据新鲜度

### 5.3 数据一致性保障

- 使用数据库事务确保操作的原子性
- 定期数据校验任务检查数据完整性