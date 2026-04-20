package com.todosystem.controller;

import com.todosystem.entity.Todo;
import com.todosystem.entity.Todo.TodoCategory;
import com.todosystem.entity.Todo.TodoPriority;
import com.todosystem.entity.Todo.TodoStatus;
import com.todosystem.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TodoController {
    
    private final TodoService todoService;
    
    // 获取所有待办事项
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        List<Todo> todos = todoService.getAllTodos();
        return ResponseEntity.ok(todos);
    }
    
    // 根据ID获取待办事项
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 创建新的待办事项
    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo) {
        Todo createdTodo = todoService.createTodo(todo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }
    
    // 更新待办事项
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        return todoService.updateTodo(id, todoDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 更新待办状态
    @PatchMapping("/{id}/status")
    public ResponseEntity<Todo> updateStatus(@PathVariable Long id, @RequestParam TodoStatus status) {
        return todoService.updateStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // 删除待办事项
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        boolean deleted = todoService.deleteTodo(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    // 按状态获取待办列表
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Todo>> getTodosByStatus(@PathVariable TodoStatus status) {
        List<Todo> todos = todoService.getTodosByStatus(status);
        return ResponseEntity.ok(todos);
    }
    
    // 按分类获取待办列表
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Todo>> getTodosByCategory(@PathVariable TodoCategory category) {
        List<Todo> todos = todoService.getTodosByCategory(category);
        return ResponseEntity.ok(todos);
    }
    
    // 搜索待办
    @GetMapping("/search")
    public ResponseEntity<List<Todo>> searchTodos(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TodoStatus status) {
        List<Todo> todos;
        if (status != null) {
            todos = todoService.searchTodosByStatus(status, keyword);
        } else {
            todos = todoService.searchTodos(keyword);
        }
        return ResponseEntity.ok(todos);
    }
    
    // 筛选待办（多条件组合）
    @GetMapping("/filter")
    public ResponseEntity<List<Todo>> filterTodos(
            @RequestParam(required = false) TodoStatus status,
            @RequestParam(required = false) TodoCategory category,
            @RequestParam(required = false) TodoPriority priority,
            @RequestParam(required = false) String keyword) {
        
        List<Todo> todos;
        
        // 如果有搜索关键词，优先使用搜索
        if (keyword != null && !keyword.trim().isEmpty()) {
            if (status != null) {
                todos = todoService.searchTodosByStatus(status, keyword);
            } else {
                todos = todoService.searchTodos(keyword);
            }
            return ResponseEntity.ok(todos);
        }
        
        // 根据条件组合筛选
        if (status != null && category != null) {
            todos = todoService.getTodosByStatusAndCategory(status, category);
        } else if (status != null && priority != null) {
            todos = todoService.getTodosByStatusAndPriority(status, priority);
        } else if (status != null) {
            todos = todoService.getTodosByStatus(status);
        } else if (category != null) {
            todos = todoService.getTodosByCategory(category);
        } else {
            todos = todoService.getAllTodos();
        }
        
        return ResponseEntity.ok(todos);
    }
    
    // 获取统计信息
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("pending", todoService.countByStatus(TodoStatus.PENDING));
        stats.put("inProgress", todoService.countByStatus(TodoStatus.IN_PROGRESS));
        stats.put("completed", todoService.countByStatus(TodoStatus.COMPLETED));
        stats.put("total", todoService.getAllTodos().size());
        return ResponseEntity.ok(stats);
    }
    
    // 获取枚举选项
    @GetMapping("/enums")
    public ResponseEntity<Map<String, Object>> getEnums() {
        Map<String, Object> enums = new HashMap<>();
        enums.put("statuses", TodoStatus.values());
        enums.put("priorities", TodoPriority.values());
        enums.put("categories", TodoCategory.values());
        return ResponseEntity.ok(enums);
    }
}
