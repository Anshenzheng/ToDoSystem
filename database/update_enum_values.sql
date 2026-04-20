-- 更新数据库中的中文枚举值为英文枚举值
-- 这个脚本用于将旧数据中的中文枚举值转换为英文枚举值

USE todo_system;

-- 查看当前数据
SELECT id, title, status, priority, category FROM todos;

-- 更新category字段
UPDATE todos SET category = 'WORK' WHERE category = '工作';
UPDATE todos SET category = 'STUDY' WHERE category = '学习';
UPDATE todos SET category = 'LIFE' WHERE category = '生活';

-- 更新status字段（如果有中文值）
UPDATE todos SET status = 'PENDING' WHERE status = '待办';
UPDATE todos SET status = 'IN_PROGRESS' WHERE status = '进行中';
UPDATE todos SET status = 'COMPLETED' WHERE status = '已完成';

-- 更新priority字段（如果有中文值）
UPDATE todos SET priority = 'LOW' WHERE priority = '低';
UPDATE todos SET priority = 'MEDIUM' WHERE priority = '中';
UPDATE todos SET priority = 'HIGH' WHERE priority = '高';

-- 验证更新结果
SELECT id, title, status, priority, category FROM todos;
