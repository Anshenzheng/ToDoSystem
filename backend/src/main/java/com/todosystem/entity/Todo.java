package com.todosystem.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "todos")
public class Todo {
    
    public enum TodoStatus {
        PENDING,      // 待办
        IN_PROGRESS,  // 进行中
        COMPLETED     // 已完成
    }
    
    public enum TodoPriority {
        LOW,    // 低
        MEDIUM, // 中
        HIGH    // 高
    }
    
    public enum TodoCategory {
        WORK, STUDY, LIFE
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TodoStatus status = TodoStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TodoPriority priority = TodoPriority.MEDIUM;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private TodoCategory category = TodoCategory.WORK;
    
    @Column(name = "due_date")
    private LocalDateTime dueDate;
    
    @Column(name = "reminder_enabled")
    private Boolean reminderEnabled = false;
    
    @Column(name = "reminder_time")
    private LocalDateTime reminderTime;
    
    @Column(name = "reminder_sent")
    private Boolean reminderSent = false;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == TodoStatus.COMPLETED && completedAt == null) {
            completedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (status == TodoStatus.COMPLETED && completedAt == null) {
            completedAt = LocalDateTime.now();
        } else if (status != TodoStatus.COMPLETED) {
            completedAt = null;
        }
    }
}
