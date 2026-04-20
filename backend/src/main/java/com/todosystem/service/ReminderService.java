package com.todosystem.service;

import com.todosystem.entity.Todo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReminderService {
    
    private final TodoService todoService;
    
    // 存储待发送的提醒（供前端轮询获取）
    private List<Todo> pendingReminders = null;
    
    // 每30秒检查一次需要提醒的待办事项
    @Scheduled(fixedRate = 30000)
    public void checkReminders() {
        log.debug("检查待办提醒...");
        List<Todo> todosNeedingReminder = todoService.getTodosNeedingReminder();
        
        if (!todosNeedingReminder.isEmpty()) {
            log.info("发现 {} 个待办需要提醒", todosNeedingReminder.size());
            pendingReminders = todosNeedingReminder;
            
            // 标记提醒已发送
            for (Todo todo : todosNeedingReminder) {
                todoService.markReminderSent(todo.getId());
                logReminder(todo);
            }
        }
    }
    
    // 获取待发送的提醒列表
    public List<Todo> getPendingReminders() {
        List<Todo> reminders = pendingReminders;
        pendingReminders = null; // 清空已获取的提醒
        return reminders;
    }
    
    // 模拟发送提醒（实际项目中可以发送邮件、短信、推送等）
    private void logReminder(Todo todo) {
        StringBuilder reminder = new StringBuilder();
        reminder.append("\n========================================\n");
        reminder.append("           待办事项提醒\n");
        reminder.append("========================================\n");
        reminder.append("标题: ").append(todo.getTitle()).append("\n");
        reminder.append("分类: ").append(todo.getCategory()).append("\n");
        reminder.append("优先级: ").append(todo.getPriority()).append("\n");
        
        if (todo.getDueDate() != null) {
            reminder.append("截止日期: ").append(todo.getDueDate()).append("\n");
        }
        
        if (todo.getDescription() != null && !todo.getDescription().isEmpty()) {
            reminder.append("描述: ").append(todo.getDescription()).append("\n");
        }
        
        reminder.append("========================================\n");
        
        log.info("发送提醒: {}", reminder.toString());
    }
    
    // 手动触发提醒检查（用于测试）
    public void triggerReminderCheck() {
        checkReminders();
    }
}
