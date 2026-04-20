package com.todosystem.repository;

import com.todosystem.entity.Todo;
import com.todosystem.entity.Todo.TodoCategory;
import com.todosystem.entity.Todo.TodoPriority;
import com.todosystem.entity.Todo.TodoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    // 按状态查询
    List<Todo> findByStatus(TodoStatus status);
    
    // 按优先级查询
    List<Todo> findByPriority(TodoPriority priority);
    
    // 按分类查询
    List<Todo> findByCategory(TodoCategory category);
    
    // 按状态和分类查询
    List<Todo> findByStatusAndCategory(TodoStatus status, TodoCategory category);
    
    // 按状态和优先级查询
    List<Todo> findByStatusAndPriority(TodoStatus status, TodoPriority priority);
    
    // 模糊搜索标题或描述
    @Query("SELECT t FROM Todo t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Todo> searchByKeyword(@Param("keyword") String keyword);
    
    // 按状态和关键词搜索
    @Query("SELECT t FROM Todo t WHERE t.status = :status AND (LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Todo> searchByStatusAndKeyword(@Param("status") TodoStatus status, @Param("keyword") String keyword);
    
    // 查询需要提醒的待办事项（提醒已开启，时间已到，且未发送）
    List<Todo> findByReminderEnabledTrueAndReminderTimeBeforeAndReminderSentFalse(LocalDateTime time);
    
    // 按截止日期升序排序查询待办
    List<Todo> findByStatusOrderByDueDateAsc(TodoStatus status);
    
    // 按创建时间降序查询
    List<Todo> findAllByOrderByCreatedAtDesc();
    
    // 按状态查询并按优先级降序、截止日期升序排序
    List<Todo> findByStatusOrderByPriorityDescDueDateAsc(TodoStatus status);
}
