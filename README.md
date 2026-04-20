# 待办事项管理平台

一款简洁实用的待办事项管理平台，用于统筹个人工作、学习、生活的待办事项。

## 功能特性

- ✅ **待办添加**: 轻松创建新的待办事项，支持标题、描述、优先级、分类
- 📊 **状态管理**: 支持三种状态（待办、进行中、已完成）
- 🔍 **搜索功能**: 快速搜索待办事项的标题和描述
- 🔧 **筛选功能**: 按状态、分类、优先级进行多条件筛选
- 🔔 **提醒功能**: 设置待办提醒，定时推送通知
- 🎨 **简洁界面**: 柔和配色，清晰区分待办列表和已完成列表
- 📈 **统计概览**: 实时显示待办数量、完成率等统计信息

## 技术栈

### 前端
- **框架**: Angular 17.3
- **语言**: TypeScript 5.4
- **样式**: CSS3 (响应式设计)
- **HTTP客户端**: Angular HttpClient

### 后端
- **框架**: Spring Boot 3.2.5
- **语言**: Java 17
- **数据访问**: Spring Data JPA
- **任务调度**: Quartz Scheduler
- **简化工具**: Lombok

### 数据库
- **MySQL 8.0+**

## 项目结构

```
ToDoSystem/
├── backend/                    # 后端项目
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/todosystem/
│   │   │   │   ├── config/          # 配置类
│   │   │   │   ├── controller/      # 控制器
│   │   │   │   ├── entity/          # 实体类
│   │   │   │   ├── repository/      # 数据访问层
│   │   │   │   ├── service/         # 业务逻辑层
│   │   │   │   └── TodoSystemApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── frontend/                   # 前端项目
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/         # 组件
│   │   │   │   ├── todo-list/
│   │   │   │   ├── todo-item/
│   │   │   │   ├── todo-form/
│   │   │   │   ├── search-filter/
│   │   │   │   ├── stats-summary/
│   │   │   │   └── reminder-notification/
│   │   │   ├── models/             # 数据模型
│   │   │   ├── services/           # 服务层
│   │   │   ├── app.component.*
│   │   │   └── app.module.ts
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
├── database/                   # 数据库脚本
│   └── init.sql
└── README.md
```

## 环境准备

### 必需软件
1. **JDK 17+** - 下载地址: https://adoptium.net/
2. **Node.js 18+** - 下载地址: https://nodejs.org/
3. **MySQL 8.0+** - 下载地址: https://dev.mysql.com/downloads/
4. **Maven 3.8+** - 下载地址: https://maven.apache.org/
5. **Angular CLI 17+** - 安装命令: `npm install -g @angular/cli`

### 环境验证
打开命令行终端，执行以下命令验证环境：

```bash
# 验证Java
java -version

# 验证Node.js
node -v

# 验证npm
npm -v

# 验证Maven
mvn -version

# 验证Angular CLI
ng version
```

## 启动步骤

### 第一步：配置数据库

1. **启动MySQL服务**，确保MySQL服务正在运行

2. **创建数据库并初始化数据**
   
   方法一：使用MySQL命令行
   ```bash
   mysql -u root -p < database/init.sql
   ```
   
   方法二：手动执行SQL
   - 使用MySQL客户端（如Navicat、MySQL Workbench）连接数据库
   - 打开 `database/init.sql` 文件
   - 执行所有SQL语句

3. **修改数据库配置**（如需）
   
   打开 `backend/src/main/resources/application.properties` 文件，根据实际情况修改数据库连接信息：
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/todo_system?useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```

### 第二步：启动后端服务

1. **进入后端目录**
   ```bash
   cd backend
   ```

2. **编译项目**（可选，也可以跳过直接运行）
   ```bash
   mvn clean compile
   ```

3. **启动Spring Boot应用**
   
   方法一：使用Maven命令
   ```bash
   mvn spring-boot:run
   ```
   
   方法二：使用IDE（如IntelliJ IDEA）
   - 导入backend项目
   - 找到 `TodoSystemApplication.java`
   - 右键运行主方法

4. **验证后端启动成功**
   
   看到控制台输出以下信息表示启动成功：
   ```
   ========================================
      待办事项管理平台 - 后端服务启动成功!
      访问地址: http://localhost:8080
   ========================================
   ```

### 第三步：启动前端服务

1. **打开新的命令行终端**，进入前端目录
   ```bash
   cd frontend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```
   
   > 注意：首次运行需要安装依赖，后续启动无需重复执行

3. **启动Angular开发服务器**
   ```bash
   ng serve
   ```
   
   或使用npm脚本：
   ```bash
   npm start
   ```

4. **验证前端启动成功**
   
   看到控制台输出以下信息表示启动成功：
   ```
   ✔ Application bundle generation complete.
   Initial Chunk Files | Names         | Raw Size
   polyfills.js        | polyfills     | 82.71 kB |
   main.js             | main          | 25.63 kB |
   styles.css          | styles        | 10.21 kB |
   
   ** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
   ✔ Compiled successfully.
   ```

## 访问应用

### 前端页面
- **地址**: http://localhost:4200
- **说明**: 待办事项管理平台的主界面

### 后端API
- **基础地址**: http://localhost:8080
- **API文档**: 可通过Postman等工具测试接口

## 功能验证

### 1. 访问主页
打开浏览器访问 http://localhost:4200，应该能看到：
- 顶部标题栏和「新建待办」按钮
- 统计卡片（待办、进行中、已完成、完成率）
- 搜索和筛选区域
- 待办事项列表（如果有测试数据）

### 2. 创建新待办
1. 点击「新建待办」按钮
2. 填写表单：
   - **标题**（必填）: 例如「完成项目报告」
   - **描述**（可选）: 详细说明
   - **状态**: 选择「待办」或「进行中」
   - **优先级**: 选择低/中/高
   - **分类**: 选择工作/学习/生活
   - **截止日期**（可选）: 设置截止时间
   - **提醒**（可选）: 开启提醒并设置提醒时间
3. 点击「创建待办」按钮
4. 验证：新待办应该出现在列表中

### 3. 修改待办状态
1. 在待办列表中找到一条待办
2. 点击左侧的复选框：标记为已完成/取消完成
3. 或点击「进行中」按钮：标记为进行中/待办
4. 验证：待办状态应该立即更新

### 4. 搜索待办
1. 在搜索框中输入关键词（如「项目」）
2. 验证：列表应该只显示包含该关键词的待办

### 5. 筛选待办
1. 使用「标签页」切换：全部/待办/已完成
2. 或使用下拉框筛选：
   - 按状态筛选
   - 按分类筛选
3. 验证：列表应该根据筛选条件更新

### 6. 编辑待办
1. 将鼠标悬停在待办项上，显示操作按钮
2. 点击「编辑」按钮（✏️）
3. 修改待办信息
4. 点击「保存修改」
5. 验证：待办信息应该已更新

### 7. 删除待办
1. 将鼠标悬停在待办项上，显示操作按钮
2. 点击「删除」按钮（🗑️）
3. 在确认对话框中点击「确定」
4. 验证：待办应该从列表中消失

### 8. 测试提醒功能
1. 创建一个新待办，设置提醒时间为当前时间之后的1-2分钟
2. 等待提醒时间到达
3. 验证：
   - 页面右上角应该弹出提醒通知
   - 如果浏览器已授权通知权限，系统会弹出浏览器通知

### 9. API测试（可选）
使用Postman或curl测试后端API：

```bash
# 获取所有待办
curl http://localhost:8080/api/todos

# 创建新待办
curl -X POST http://localhost:8080/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"测试待办","description":"这是一个测试","status":"PENDING","priority":"HIGH","category":"工作"}'

# 获取统计信息
curl http://localhost:8080/api/todos/stats
```

## 常见问题

### 1. 后端启动失败 - 数据库连接错误
**问题**: 控制台显示 `Communications link failure` 或类似错误
**解决方案**:
- 确认MySQL服务已启动
- 检查 `application.properties` 中的数据库连接配置
- 确认数据库 `todo_system` 已创建
- 检查MySQL用户名和密码是否正确

### 2. 前端启动失败 - 端口占用
**问题**: 显示 `Port 4200 is already in use`
**解决方案**:
- 关闭占用4200端口的程序
- 或使用其他端口启动：`ng serve --port 4201`

### 3. 前端无法访问后端API
**问题**: 控制台显示 CORS 错误或网络错误
**解决方案**:
- 确认后端服务已在8080端口启动
- 检查浏览器控制台是否有CORS错误
- 后端已配置跨域支持，允许 http://localhost:4200 访问

### 4. 提醒功能不工作
**问题**: 设置了提醒但没有收到通知
**解决方案**:
- 确认后端服务正常运行
- 检查提醒时间是否已设置为当前时间之后
- 确认浏览器已允许通知权限（地址栏左侧的通知图标）
- 后端每30秒检查一次提醒，请耐心等待

## 开发指南

### 添加新功能
1. **后端**: 在 `controller` 中添加新接口，在 `service` 中实现业务逻辑
2. **前端**: 在 `services` 中添加新服务方法，在 `components` 中创建或修改组件

### 修改数据库
- 可以直接修改 `Todo` 实体类，JPA会自动更新表结构（`ddl-auto=update`）
- 或修改 `database/init.sql` 并重新执行

### 生产部署
1. **后端**: 执行 `mvn clean package` 生成jar包，使用 `java -jar` 运行
2. **前端**: 执行 `ng build --configuration production` 生成静态文件，部署到Web服务器

## 技术说明

### 数据模型
- **Todo**: 待办事项实体，包含标题、描述、状态、优先级、分类、截止日期、提醒等字段
- **状态**: PENDING(待办) / IN_PROGRESS(进行中) / COMPLETED(已完成)
- **优先级**: LOW(低) / MEDIUM(中) / HIGH(高)
- **分类**: 工作 / 学习 / 生活

### API接口
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/todos | 获取所有待办 |
| GET | /api/todos/{id} | 根据ID获取待办 |
| POST | /api/todos | 创建新待办 |
| PUT | /api/todos/{id} | 更新待办 |
| PATCH | /api/todos/{id}/status | 更新待办状态 |
| DELETE | /api/todos/{id} | 删除待办 |
| GET | /api/todos/status/{status} | 按状态查询 |
| GET | /api/todos/category/{category} | 按分类查询 |
| GET | /api/todos/search | 搜索待办 |
| GET | /api/todos/filter | 多条件筛选 |
| GET | /api/todos/stats | 获取统计信息 |
| GET | /api/todos/enums | 获取枚举选项 |
| GET | /api/reminders/pending | 获取待发送提醒 |

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。
