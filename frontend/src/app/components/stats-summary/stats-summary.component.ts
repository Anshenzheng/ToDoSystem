import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Todo, TodoStatus } from '../../models/todo.model';

@Component({
  selector: 'app-stats-summary',
  templateUrl: './stats-summary.component.html',
  styleUrls: ['./stats-summary.component.css']
})
export class StatsSummaryComponent implements OnChanges {
  @Input() todos: Todo[] = [];

  pendingCount = 0;
  inProgressCount = 0;
  completedCount = 0;
  totalCount = 0;
  completionRate = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todos']) {
      this.calculateStats();
    }
  }

  private calculateStats(): void {
    this.totalCount = this.todos.length;
    this.pendingCount = this.todos.filter(t => t.status === TodoStatus.PENDING).length;
    this.inProgressCount = this.todos.filter(t => t.status === TodoStatus.IN_PROGRESS).length;
    this.completedCount = this.todos.filter(t => t.status === TodoStatus.COMPLETED).length;
    
    this.completionRate = this.totalCount > 0 
      ? Math.round((this.completedCount / this.totalCount) * 100) 
      : 0;
  }
}
