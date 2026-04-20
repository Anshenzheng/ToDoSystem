import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Todo, TodoStatus, TodoCategory, statusLabels, categoryLabels } from '../../models/todo.model';

interface StatusChangeEvent {
  id: number;
  status: TodoStatus;
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Input() title: string = '';
  @Input() showCompleted: boolean = false;
  @Input() icon: string = '📋';
  
  @Output() edit = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<StatusChangeEvent>();

  statusLabels = statusLabels;
  categoryLabels = categoryLabels;

  get displayTodos(): Todo[] {
    if (this.showCompleted) {
      return this.todos.filter(t => t.status === TodoStatus.COMPLETED);
    }
    return this.todos.filter(t => t.status !== TodoStatus.COMPLETED);
  }

  get isEmpty(): boolean {
    return this.displayTodos.length === 0;
  }

  onEdit(todo: Todo): void {
    this.edit.emit(todo);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }

  onStatusChange(event: StatusChangeEvent): void {
    this.statusChange.emit(event);
  }

  getTodoCountByCategory(category: TodoCategory): number {
    return this.displayTodos.filter(t => t.category === category).length;
  }
}
