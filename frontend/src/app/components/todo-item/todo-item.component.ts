import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Todo, TodoStatus, TodoPriority, TodoCategory, statusLabels, priorityLabels, categoryLabels } from '../../models/todo.model';

interface StatusChangeEvent {
  id: number;
  status: TodoStatus;
}

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {
  @Input() todo!: Todo;
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<StatusChangeEvent>();

  TodoStatus = TodoStatus;
  statusLabels = statusLabels;
  priorityLabels = priorityLabels;
  categoryLabels = categoryLabels;

  showActions = false;

  ngOnInit(): void {}

  isCompleted(): boolean {
    return this.todo.status === TodoStatus.COMPLETED;
  }

  isInProgress(): boolean {
    return this.todo.status === TodoStatus.IN_PROGRESS;
  }

  getPriorityClass(): string {
    switch (this.todo.priority) {
      case TodoPriority.HIGH:
        return 'high';
      case TodoPriority.MEDIUM:
        return 'medium';
      case TodoPriority.LOW:
        return 'low';
      default:
        return 'medium';
    }
  }

  getCategoryClass(): string {
    switch (this.todo.category) {
      case TodoCategory.WORK:
        return 'work';
      case TodoCategory.STUDY:
        return 'study';
      case TodoCategory.LIFE:
        return 'life';
      default:
        return 'work';
    }
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

  isOverdue(): boolean {
    if (!this.todo.dueDate || this.isCompleted()) return false;
    const dueDate = new Date(this.todo.dueDate);
    return dueDate < new Date();
  }

  toggleComplete(): void {
    const newStatus = this.isCompleted() ? TodoStatus.PENDING : TodoStatus.COMPLETED;
    if (this.todo.id !== null) {
      this.statusChange.emit({ id: this.todo.id, status: newStatus });
    }
  }

  toggleInProgress(): void {
    const newStatus = this.isInProgress() ? TodoStatus.PENDING : TodoStatus.IN_PROGRESS;
    if (this.todo.id !== null) {
      this.statusChange.emit({ id: this.todo.id, status: newStatus });
    }
  }

  onEdit(): void {
    this.edit.emit(this.todo);
  }

  onDelete(): void {
    if (this.todo.id !== null) {
      this.delete.emit(this.todo.id);
    }
  }
}
