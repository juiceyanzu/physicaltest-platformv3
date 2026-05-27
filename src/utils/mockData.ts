import type { Student, TestBatch, Appointment, TestScore, TestNotice, Teacher, ScoreEntry, Admin, Banner, TestProject } from '@/types'

export const mockStudents: Student[] = [
  {
    id: 'stu_001',
    name: '张三',
    studentId: '2026001',
    class: '计科2601',
    phone: '13800138000',
    major: '计算机应用技术',
  },
  {
    id: 'stu_002',
    name: '李四',
    studentId: '2026002',
    class: '计科2601',
    phone: '13800138001',
    major: '计算机应用技术',
  },
  {
    id: 'stu_003',
    name: '王五',
    studentId: '2026003',
    class: '软工2601',
    phone: '13800138002',
    major: '计算机应用技术',
  },
]

export const mockBatches: TestBatch[] = [
  {
    id: 'batch_001',
    name: '体测第一批',
    project: '身高体重与BMI',
    location: '体育馆A区',
    date: '2026-04-01',
    timeSlot: '09:00-11:00',
    totalSlots: 30,
    remainingSlots: 25,
    teacher: '王教练',
    status: 'open',
  },
  {
    id: 'batch_002',
    name: '体测第二批',
    project: '肺活量',
    location: '体育馆B区',
    date: '2026-04-01',
    timeSlot: '14:00-16:00',
    totalSlots: 25,
    remainingSlots: 18,
    teacher: '李教练',
    status: 'open',
  },
  {
    id: 'batch_003',
    name: '体测第三批',
    project: '50米跑',
    location: '操场',
    date: '2026-04-02',
    timeSlot: '08:00-10:00',
    totalSlots: 40,
    remainingSlots: 38,
    teacher: '张教练',
    status: 'open',
  },
  {
    id: 'batch_004',
    name: '体测第四批',
    project: '坐位体前屈',
    location: '体育馆C区',
    date: '2026-04-02',
    timeSlot: '10:00-12:00',
    totalSlots: 35,
    remainingSlots: 28,
    teacher: '陈教练',
    status: 'open',
  },
  {
    id: 'batch_005',
    name: '体测第五批',
    project: '1000米/800米跑',
    location: '操场',
    date: '2026-04-03',
    timeSlot: '15:00-17:00',
    totalSlots: 50,
    remainingSlots: 42,
    teacher: '吴教练',
    status: 'open',
  },
  {
    id: 'batch_006',
    name: '体测第六批',
    project: '引体向上/仰卧起坐',
    location: '体育馆D区',
    date: '2026-04-04',
    timeSlot: '09:00-11:00',
    totalSlots: 30,
    remainingSlots: 20,
    teacher: '周教练',
    status: 'closed',
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: 'appt_001',
    studentId: 'stu_001',
    batchId: 'batch_001',
    batchName: '体测第一批',
    project: '身高体重与BMI',
    date: '2026-04-01',
    timeSlot: '09:00-11:00',
    location: '体育馆A区',
    status: 'confirmed',
    createdAt: '2026-03-20T10:00:00Z',
  },
  {
    id: 'appt_002',
    studentId: 'stu_001',
    batchId: 'batch_005',
    batchName: '体测第五批',
    project: '1000米/800米跑',
    date: '2026-04-03',
    timeSlot: '15:00-17:00',
    location: '操场',
    status: 'completed',
    createdAt: '2026-03-19T14:30:00Z',
  },
]

export const mockScores: TestScore[] = [
  {
    id: 'score_001',
    studentId: 'stu_001',
    testDate: '2026-04-15',
    items: [
      { name: '身高体重', score: 18, maxScore: 20, grade: 'A' },
      { name: '肺活量', score: 16, maxScore: 20, grade: 'B' },
      { name: '50米跑', score: 17, maxScore: 20, grade: 'A' },
      { name: '坐位体前屈', score: 15, maxScore: 20, grade: 'B' },
      { name: '1000米跑', score: 14, maxScore: 20, grade: 'B' },
    ],
    totalScore: 80,
    maxTotalScore: 100,
    status: 'pass',
  },
  {
    id: 'score_002',
    studentId: 'stu_001',
    testDate: '2026-04-10',
    items: [
      { name: '身高体重', score: 17, maxScore: 20, grade: 'B' },
      { name: '肺活量', score: 15, maxScore: 20, grade: 'B' },
      { name: '50米跑', score: 16, maxScore: 20, grade: 'B' },
      { name: '坐位体前屈', score: 14, maxScore: 20, grade: 'C' },
      { name: '1000米跑', score: 13, maxScore: 20, grade: 'C' },
    ],
    totalScore: 75,
    maxTotalScore: 100,
    status: 'pass',
  },
]

export const mockNotices: TestNotice[] = [
  {
    id: 'notice_001',
    title: '2026年体测工作通知',
    content: `
各位同学：

    2026年体质测试工作即将开始，现将相关事项通知如下：

    一、测试时间
    2026年4月1日至4月7日

    二、测试项目
    1. 身高体重与BMI
    2. 肺活量
    3. 50米跑
    4. 坐位体前屈
    5. 1000米跑（女）/1200米跑（男）
    6. 引体向上（男）/仰卧起坐（女）

    三、测试地点
    体育馆及校运动场

    四、报名方式
    请登录体测预约平台进行在线预约，预约期间为3月25日至3月31日。

    五、注意事项
    1. 请携带学生证或身份证
    2. 穿着运动装备
    3. 不要空腹参加测试
    4. 如有身体不适，请提前说明

    六、咨询电话
    体育教学部：0551-63612345

    特此通知
    体育教学部
    2026年3月1日
    `,
    type: 'schedule',
    publishDate: '2026-03-01',
    priority: 'high',
    tags: ['时间安排', '测试项目', '注意事项'],
  },
  {
    id: 'notice_002',
    title: '体测补测通知',
    content: '因故未能在规定时间内参加体测的同学，可申请补测。补测时间为4月15日至4月20日。',
    type: 'makeup',
    publishDate: '2026-03-10',
    priority: 'normal',
    tags: ['补测'],
  },
  {
    id: 'notice_003',
    title: '2026年体测成绩公示',
    content: '2026年体质测试成绩已全部录入系统，请登录平台查看个人成绩。如有异议，请在7天内提出。',
    type: 'result',
    publishDate: '2026-03-20',
    priority: 'normal',
    tags: ['成绩公示'],
  },
  {
    id: 'notice_004',
    title: '体测参加人数统计',
    content: '截至目前，已有1250人完成体测，占应测人数的85%。请未预约的同学尽快进行预约。',
    type: 'notice',
    publishDate: '2026-03-25',
    priority: 'high',
    tags: ['统计信息'],
  },
  {
    id: 'notice_005',
    title: '体测常见问题解答',
    content: `
Q: 女生参加1000米跑还是800米跑？
A: 女生参加800米跑。

Q: 如果体测不合格怎么办？
A: 体测不合格的同学可参加补测，补测合格即视为合格。

Q: 体测成绩如何计算？
A: 总分100分，各项目20分，根据评分标准评定等级。

更多问题请咨询体育教学部。
    `,
    type: 'notice',
    publishDate: '2026-03-22',
    priority: 'normal',
    tags: ['常见问题'],
  },
]

// 教师数据
export const mockTeachers: Teacher[] = [
  {
    id: 'tea_001',
    name: '王教练',
    workId: 'T001',
    phone: '13900009001',
    email: 'wang@example.edu.cn',
    batchIds: ['batch_001', 'batch_004'],
  },
  {
    id: 'tea_002',
    name: '李教练',
    workId: 'T002',
    phone: '13900009002',
    email: 'li@example.edu.cn',
    batchIds: ['batch_002', 'batch_005'],
  },
  {
    id: 'tea_003',
    name: '张教练',
    workId: 'T003',
    phone: '13900009003',
    email: 'zhang@example.edu.cn',
    batchIds: ['batch_003', 'batch_006'],
  },
]

// 成绩录入记录
export const mockScoreEntries: ScoreEntry[] = [
  {
    id: 'score_entry_001',
    studentId: 'stu_001',
    studentName: '张三',
    studentClass: '计科2601',
    batchId: 'batch_001',
    items: [
      { name: '身高体重', score: 18, remarks: '' },
      { name: '肺活量', score: 16, remarks: '' },
      { name: '50米跑', score: 17, remarks: '' },
      { name: '坐位体前屈', score: 15, remarks: '' },
      { name: '1000米跑', score: 14, remarks: '' },
      { name: '引体向上', score: 16, remarks: '' },
    ],
    totalScore: 96,
    status: 'submitted',
    submittedAt: '2026-04-01T10:30:00Z',
  },
  {
    id: 'score_entry_002',
    studentId: 'stu_002',
    studentName: '李四',
    studentClass: '计科2601',
    batchId: 'batch_001',
    items: [
      { name: '身高体重', score: 16, remarks: '体重偏高' },
      { name: '肺活量', score: 14, remarks: '' },
      { name: '50米跑', score: 15, remarks: '' },
      { name: '坐位体前屈', score: 13, remarks: '' },
      { name: '1000米跑', score: 12, remarks: '' },
      { name: '引体向上', score: 14, remarks: '' },
    ],
    totalScore: 84,
    status: 'draft',
  },
  {
    id: 'score_entry_003',
    studentId: 'stu_003',
    studentName: '王五',
    studentClass: '软工2601',
    batchId: 'batch_002',
    items: [
      { name: '身高体重', score: null },
      { name: '肺活量', score: null },
      { name: '50米跑', score: null },
      { name: '坐位体前屈', score: null },
      { name: '1000米跑', score: null },
      { name: '引体向上', score: null },
    ],
    status: 'draft',
  },
]

// 管理员数据
export const mockAdmins: Admin[] = [
  {
    id: 'admin_001',
    name: '系统管理员',
    username: 'admin',
    role: 'super_admin',
    email: 'admin@example.edu.cn',
    lastLogin: '2026-03-28T10:00:00Z',
  },
  {
    id: 'admin_002',
    name: '平台管理员',
    username: 'manager',
    role: 'admin',
    email: 'manager@example.edu.cn',
    lastLogin: '2026-03-27T15:30:00Z',
  },
]

// 轮播图数据
export const mockBanners: Banner[] = [
  {
    id: 'banner_001',
    title: '2026年体测工作启动',
    imageUrl: 'https://via.placeholder.com/1200x400?text=2026+Physical+Test+Begins',
    linkUrl: '/student/notices/notice_001',
    displayOrder: 1,
    isActive: true,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'banner_002',
    title: '在线预约开启',
    imageUrl: 'https://via.placeholder.com/1200x400?text=Online+Registration+Open',
    linkUrl: '/student/appointments',
    displayOrder: 2,
    isActive: true,
    createdAt: '2026-03-05T10:00:00Z',
  },
  {
    id: 'banner_003',
    title: '体测成绩查询',
    imageUrl: 'https://via.placeholder.com/1200x400?text=View+Your+Test+Scores',
    linkUrl: '/student/scores',
    displayOrder: 3,
    isActive: true,
    createdAt: '2026-03-20T10:00:00Z',
  },
]

// 体测项目数据
export const mockProjects: TestProject[] = [
  {
    id: 'project_001',
    name: '身高体重与BMI',
    description: '测量学生的身高、体重，计算BMI指数',
    scoringStandard: {
      A: [18, 20],
      B: [15, 17],
      C: [12, 14],
      D: [0, 11],
    },
    passingScore: 12,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'project_002',
    name: '肺活量',
    description: '测定学生最大的呼气肺活量',
    scoringStandard: {
      A: [18, 20],
      B: [15, 17],
      C: [12, 14],
      D: [0, 11],
    },
    passingScore: 12,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'project_003',
    name: '50米跑',
    description: '测试学生的快速跑能力',
    scoringStandard: {
      A: [18, 20],
      B: [15, 17],
      C: [12, 14],
      D: [0, 11],
    },
    passingScore: 12,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'project_004',
    name: '坐位体前屈',
    description: '测试学生的柔韧性',
    scoringStandard: {
      A: [18, 20],
      B: [15, 17],
      C: [12, 14],
      D: [0, 11],
    },
    passingScore: 12,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'project_005',
    name: '1000米/800米跑',
    description: '测试学生的耐力素质',
    scoringStandard: {
      A: [18, 20],
      B: [15, 17],
      C: [12, 14],
      D: [0, 11],
    },
    passingScore: 12,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'project_006',
    name: '引体向上/仰卧起坐',
    description: '男生测引体向上，女生测仰卧起坐，测试上肢和腰腹肌力',
    scoringStandard: {
      A: [18, 20],
      B: [15, 17],
      C: [12, 14],
      D: [0, 11],
    },
    passingScore: 12,
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
]
