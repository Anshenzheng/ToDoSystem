import { Component, OnInit } from '@angular/core';
import { Todo, TodoStatus, TodoCategory, TodoPriority } from './models/todo.model';
import { TodoService } from './services/todo.service';
import { ReminderService } from './services/reminder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = '待办事项管理平台';
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  showForm = false;
  editingTodo: Todo | null = null;
  selectedStatus: TodoStatus | null = null;
  selectedCategory: TodoCategory | null = null;
  searchKeyword = '';
  activeTab: 'all' | 'pending' | 'completed' = 'all';

  constructor(
    private todoService: TodoService,
    private reminderService: ReminderService
  ) { }

  ngOnInit(): void {
    this.loadTodos();
    this.reminderService.startPolling();
  }

  loadTodos(): void {
    this.todoService.getAllTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.applyFilters();
      },
      error: (error) => {
        console.error('加载待办失败:', error);
      }
    });
  }

  applyFilters(): void {
    let result = [...this.todos];

    // 标签页筛选
    if (this.activeTab === 'pending') {
      result = result.filter(t => 
        t.status === TodoStatus.PENDING || t.status === TodoStatus.IN_PROGRESS
      );
    } else if (this.activeTab === 'completed') {
      result = result.filter(t => t.status === TodoStatus.COMPLETED);
    }

    // 状态筛选
    if (this.selectedStatus) {
      result = result.filter(t => t.status === this.selectedStatus);
    }

    // 分类筛选
    if (this.selectedCategory) {
      result = result.filter(t => t.category === this.selectedCategory);
    }

    // 关键词搜索
    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(keyword) ||
        (t.description && t.description.toLowerCase().includes(keyword))
      );
    }

    // 排序：待办按优先级降序、截止日期升序；已完成按完成时间降序
    result.sort((a, b) => {
      if (a.status === TodoStatus.COMPLETED && b.status !== TodoStatus.COMPLETED) {
        return 1;
      }
      if (a.status !== TodoStatus.COMPLETED && b.status === TodoStatus.COMPLETED) {
        return -1;
      }
      if (a.status === TodoStatus.COMPLETED && b.status === TodoStatus.COMPLETED) {
        return new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime();
      }
      const priorityOrder = { [TodoPriority.HIGH]: 0, [TodoPriority.MEDIUM]: 1, [TodoPriority.LOW]: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
    });

    this.filteredTodos = result;
  }

  onSearch(keyword: string): void {
    this.searchKeyword = keyword;
    this.applyFilters();
  }

  onFilterChange(filters: { status?: TodoStatus; category?: TodoCategory }): void {
    if (filters.status !== undefined) {
      this.selectedStatus = filters.status || null;
    }
    if (filters.category !== undefined) {
      this.selectedCategory = filters.category || null;
    }
    this.applyFilters();
  }

  onTabChange(tab: 'all' | 'pending' | 'completed'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  openCreateForm(): void {
    this.editingTodo = null;
    this.showForm = true;
  }

  openEditForm(todo: Todo): void {
    this.editingTodo = { ...todo };
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTodo = null;
  }

  onFormSubmit(todo: Todo): void {
    if (this.editingTodo && this.editingTodo.id) {
      this.todoService.updateTodo(this.editingTodo.id, todo).subscribe({
        next: () => {
          this.loadTodos();
          this.closeForm();
        },
        error: (error) => {
          console.error('更新待办失败:', error);
        }
      });
    } else {
      this.todoService.createTodo(todo).subscribe({
        next: () => {
          this.loadTodos();
          this.closeForm();
        },
        error: (error) => {
          console.error('创建待办失败:', error);
        }
      });
    }
  }

  onStatusChange(event: { id: number; status: TodoStatus }): void {
    this.todoService.updateStatus(event.id, event.status).subscribe({
      next: () => {
        this.loadTodos();
      },
      error: (error) => {
        console.error('更新状态失败:', error);
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('确定要删除这条待办事项吗？')) {
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.loadTodos();
        },
        error: (error) => {
          console.error('删除待办失败:', error);
        }
      });
    }
  }

  get pendingTodos(): Todo[] {
    return this.filteredTodos.filter(t => t.status !== TodoStatus.COMPLETED);
  }

  get completedTodos(): Todo[] {
    return this.filteredTodos.filter(t => t.status === TodoStatus.COMPLETED);
  }
}
