import { Component, OnInit } from '@angular/core';
import { Todo, TodoStatus, TodoCategory, TodoPriority, statusLabels, priorityLabels, categoryLabels } from './models/todo.model';
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
  
  searchKeyword = '';
  selectedCategory: TodoCategory | null = null;
  activeStatus: TodoStatus | null = null;
  
  TodoStatus = TodoStatus;
  TodoCategory = TodoCategory;
  TodoPriority = TodoPriority;
  statusLabels = statusLabels;
  priorityLabels = priorityLabels;
  categoryLabels = categoryLabels;

  tabs = [
    { key: null, label: '全部' },
    { key: TodoStatus.PENDING, label: '待办' },
    { key: TodoStatus.IN_PROGRESS, label: '进行中' },
    { key: TodoStatus.COMPLETED, label: '已完成' }
  ];

  categories = [
    { key: null, label: '全部分类' },
    { key: TodoCategory.WORK, label: '工作' },
    { key: TodoCategory.STUDY, label: '学习' },
    { key: TodoCategory.LIFE, label: '生活' }
  ];

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

    if (this.activeStatus !== null) {
      result = result.filter(t => t.status === this.activeStatus);
    }

    if (this.selectedCategory !== null) {
      result = result.filter(t => t.category === this.selectedCategory);
    }

    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(keyword) ||
        (t.description && t.description.toLowerCase().includes(keyword))
      );
    }

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

  onSearch(): void {
    this.applyFilters();
  }

  onTabClick(status: TodoStatus | null): void {
    this.activeStatus = status;
    this.applyFilters();
  }

  onCategoryChange(): void {
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

  clearAllFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = null;
    this.activeStatus = null;
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return this.searchKeyword.trim() !== '' || 
           this.selectedCategory !== null;
  }

  getCountByStatus(status: TodoStatus): number {
    return this.todos.filter(t => t.status === status).length;
  }

  getTotalCount(): number {
    return this.todos.length;
  }

  trackById(index: number, todo: Todo): number | null {
    return todo.id;
  }

  toggleStatus(todo: Todo): void {
    const newStatus = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED;
    if (todo.id !== null) {
      this.onStatusChange({ id: todo.id, status: newStatus });
    }
  }

  toggleProgress(todo: Todo): void {
    const newStatus = todo.status === TodoStatus.IN_PROGRESS ? TodoStatus.PENDING : TodoStatus.IN_PROGRESS;
    if (todo.id !== null) {
      this.onStatusChange({ id: todo.id, status: newStatus });
    }
  }

  getPriorityLabel(priority: TodoPriority): string {
    return priorityLabels[priority];
  }

  getCategoryLabel(category: TodoCategory): string {
    return categoryLabels[category];
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) {
      return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (isTomorrow) {
      return `明天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }

  isOverdue(todo: Todo): boolean {
    if (!todo.dueDate || todo.status === TodoStatus.COMPLETED) return false;
    const dueDate = new Date(todo.dueDate);
    return dueDate < new Date();
  }
}
