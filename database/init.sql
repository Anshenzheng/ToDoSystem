-- 待办事项管理平台数据库初始化脚本
-- 数据库名称: todo_system

-- 创建数据库
CREATE DATABASE IF NOT EXISTS todo_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE todo_system;

-- 待办事项表
CREATE TABLE IF NOT EXISTS todos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '待办标题',
    description TEXT COMMENT '待办详细描述',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态：PENDING(待办), IN_PROGRESS(进行中), COMPLETED(已完成)',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' COMMENT '优先级：LOW(低), MEDIUM(中), HIGH(高)',
    category VARCHAR(50) DEFAULT '工作' COMMENT '分类：工作, 学习, 生活',
    due_date DATETIME COMMENT '截止日期',
    reminder_enabled BOOLEAN DEFAULT FALSE COMMENT '是否开启提醒',
    reminder_time DATETIME COMMENT '提醒时间',
    reminder_sent BOOLEAN DEFAULT FALSE COMMENT '提醒是否已发送',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    completed_at DATETIME COMMENT '完成时间',
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_category (category),
    INDEX idx_due_date (due_date),
    INDEX idx_reminder (reminder_enabled, reminder_time, reminder_sent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='待办事项表';

-- 插入一些测试数据
INSERT INTO todos (title, description, status, priority, category, due_date, reminder_enabled) VALUES
('完成项目需求文档', '编写新功能的需求文档，包括用户故事和验收标准', 'PENDING', 'HIGH', '工作', DATE_ADD(NOW(), INTERVAL 2 DAY), TRUE),
('学习Angular基础', '完成Angular官方教程的基础部分', 'IN_PROGRESS', 'MEDIUM', '学习', DATE_ADD(NOW(), INTERVAL 5 DAY), FALSE),
('健身锻炼', '去健身房进行有氧和力量训练', 'PENDING', 'LOW', '生活', DATE_ADD(NOW(), INTERVAL 1 DAY), TRUE),
('周末聚餐安排', '安排周末与朋友的聚餐，预定餐厅', 'COMPLETED', 'MEDIUM', '生活', DATE_SUB(NOW(), INTERVAL 1 DAY), FALSE),
('代码审查', '审查团队成员提交的代码', 'PENDING', 'HIGH', '工作', DATE_ADD(NOW(), INTERVAL 3 HOUR), TRUE);

-- 查询测试数据
SELECT * FROM todos ORDER BY created_at DESC;
