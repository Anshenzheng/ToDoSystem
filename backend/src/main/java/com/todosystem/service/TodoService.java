package com.todosystem.service;

import com.todosystem.entity.Todo;
import com.todosystem.entity.Todo.TodoCategory;
import com.todosystem.entity.Todo.TodoPriority;
import com.todosystem.entity.Todo.TodoStatus;
import com.todosystem.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class TodoService {
    
    private final TodoRepository todoRepository;
    
    // 获取所有待办事项
    public List<Todo> getAllTodos() {
        return todoRepository.findAllByOrderByCreatedAtDesc();
    }
    
    // 根据ID获取待办事项
    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }
    
    // 创建新的待办事项
    @Transactional
    public Todo createTodo(Todo todo) {
        todo.setStatus(TodoStatus.PENDING);
        todo.setCreatedAt(null);
        todo.setUpdatedAt(null);
        todo.setCompletedAt(null);
        Todo savedTodo = todoRepository.save(todo);
        log.info("创建新待办: {}", savedTodo.getTitle());
        return savedTodo;
    }
    
    // 更新待办事项
    @Transactional
    public Optional<Todo> updateTodo(Long id, Todo todoDetails) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(todoDetails.getTitle());
                    todo.setDescription(todoDetails.getDescription());
                    todo.setPriority(todoDetails.getPriority());
                    todo.setCategory(todoDetails.getCategory());
                    todo.setDueDate(todoDetails.getDueDate());
                    todo.setReminderEnabled(todoDetails.getReminderEnabled());
                    todo.setReminderTime(todoDetails.getReminderTime());
                    Todo updatedTodo = todoRepository.save(todo);
                    log.info("更新待办: {}", updatedTodo.getTitle());
                    return updatedTodo;
                });
    }
    
    // 更新待办状态
    @Transactional
    public Optional<Todo> updateStatus(Long id, TodoStatus status) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setStatus(status);
                    Todo updatedTodo = todoRepository.save(todo);
                    log.info("更新待办状态: {} -> {}", updatedTodo.getTitle(), status);
                    return updatedTodo;
                });
    }
    
    // 删除待办事项
    @Transactional
    public boolean deleteTodo(Long id) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todoRepository.delete(todo);
                    log.info("删除待办: {}", todo.getTitle());
                    return true;
                })
                .orElse(false);
    }
    
    // 按状态查询
    public List<Todo> getTodosByStatus(TodoStatus status) {
        return todoRepository.findByStatusOrderByPriorityDescDueDateAsc(status);
    }
    
    // 按分类查询
    public List<Todo> getTodosByCategory(TodoCategory category) {
        return todoRepository.findByCategory(category);
    }
    
    // 按状态和分类查询
    public List<Todo> getTodosByStatusAndCategory(TodoStatus status, TodoCategory category) {
        return todoRepository.findByStatusAndCategory(status, category);
    }
    
    // 按状态和优先级查询
    public List<Todo> getTodosByStatusAndPriority(TodoStatus status, TodoPriority priority) {
        return todoRepository.findByStatusAndPriority(status, priority);
    }
    
    // 搜索待办
    public List<Todo> searchTodos(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllTodos();
        }
        return todoRepository.searchByKeyword(keyword.trim());
    }
    
    // 按状态搜索待办
    public List<Todo> searchTodosByStatus(TodoStatus status, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getTodosByStatus(status);
        }
        return todoRepository.searchByStatusAndKeyword(status, keyword.trim());
    }
    
    // 获取需要提醒的待办事项
    public List<Todo> getTodosNeedingReminder() {
        return todoRepository.findByReminderEnabledTrueAndReminderTimeBeforeAndReminderSentFalse(LocalDateTime.now());
    }
    
    // 标记提醒已发送
    @Transactional
    public void markReminderSent(Long id) {
        todoRepository.findById(id).ifPresent(todo -> {
            todo.setReminderSent(true);
            todoRepository.save(todo);
            log.info("标记待办提醒已发送: {}", todo.getTitle());
        });
    }
    
    // 获取待办数量统计
    public long countByStatus(TodoStatus status) {
        return todoRepository.findByStatus(status).size();
    }
}
