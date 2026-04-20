-- 安全更新数据库中的中文枚举值为英文枚举值
-- 步骤：
-- 1. 先查看当前表结构
-- 2. 如果是ENUM类型，先临时改为VARCHAR
-- 3. 更新数据
-- 4. (可选) 如果需要，再改回ENUM

USE todo_system;

-- 第一步：查看当前表结构
-- 执行此命令查看category列的定义
-- SHOW COLUMNS FROM todos;

-- 第二步：临时将category列改为VARCHAR，避免ENUM限制
-- 如果已经是VARCHAR，此命令不会报错
ALTER TABLE todos MODIFY COLUMN category VARCHAR(50) DEFAULT 'WORK' COMMENT '分类：WORK(工作), STUDY(学习), LIFE(生活)';

-- 第三步：更新category字段
UPDATE todos SET category = 'WORK' WHERE category = '工作' OR category = 'WORK';
UPDATE todos SET category = 'STUDY' WHERE category = '学习' OR category = 'STUDY';
UPDATE todos SET category = 'LIFE' WHERE category = '生活' OR category = 'LIFE';

-- 第四步：更新status字段（如果有中文值）
-- 先确保status列也是VARCHAR
ALTER TABLE todos MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '状态：PENDING(待办), IN_PROGRESS(进行中), COMPLETED(已完成)';

UPDATE todos SET status = 'PENDING' WHERE status = '待办' OR status = 'PENDING';
UPDATE todos SET status = 'IN_PROGRESS' WHERE status = '进行中' OR status = 'IN_PROGRESS';
UPDATE todos SET status = 'COMPLETED' WHERE status = '已完成' OR status = 'COMPLETED';

-- 第五步：更新priority字段（如果有中文值）
-- 先确保priority列也是VARCHAR
ALTER TABLE todos MODIFY COLUMN priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' COMMENT '优先级：LOW(低), MEDIUM(中), HIGH(高)';

UPDATE todos SET priority = 'LOW' WHERE priority = '低' OR priority = 'LOW';
UPDATE todos SET priority = 'MEDIUM' WHERE priority = '中' OR priority = 'MEDIUM';
UPDATE todos SET priority = 'HIGH' WHERE priority = '高' OR priority = 'HIGH';

-- 第六步：验证更新结果
SELECT id, title, status, priority, category FROM todos;
