package com.todosystem.controller;

import com.todosystem.entity.Todo;
import com.todosystem.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReminderController {
    
    private final ReminderService reminderService;
    
    // 获取待发送的提醒列表
    @GetMapping("/pending")
    public ResponseEntity<List<Todo>> getPendingReminders() {
        List<Todo> reminders = reminderService.getPendingReminders();
        return ResponseEntity.ok(reminders);
    }
    
    // 手动触发提醒检查（用于测试）
    @PostMapping("/check")
    public ResponseEntity<String> triggerReminderCheck() {
        reminderService.triggerReminderCheck();
        return ResponseEntity.ok("提醒检查已触发");
    }
}
