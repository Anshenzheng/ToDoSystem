import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { TodoStatus, TodoCategory, statusLabels, categoryLabels } from '../../models/todo.model';

interface FilterChange {
  status?: TodoStatus | null;
  category?: TodoCategory | null;
}

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent implements OnInit {
  @Input() activeTab: 'all' | 'pending' | 'completed' = 'all';
  @Output() search = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<FilterChange>();
  @Output() tabChange = new EventEmitter<'all' | 'pending' | 'completed'>();

  searchKeyword = '';
  selectedStatus: TodoStatus | null = null;
  selectedCategory: TodoCategory | null = null;

  statuses = Object.values(TodoStatus);
  categories = Object.values(TodoCategory);
  statusLabels = statusLabels;
  categoryLabels = categoryLabels;

  tabs: { key: 'all' | 'pending' | 'completed'; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '📁' },
    { key: 'pending', label: '待办', icon: '📋' },
    { key: 'completed', label: '已完成', icon: '✅' }
  ];

  ngOnInit(): void {}

  onSearch(): void {
    this.search.emit(this.searchKeyword);
  }

  onStatusChange(): void {
    this.filterChange.emit({ status: this.selectedStatus });
  }

  onCategoryChange(): void {
    this.filterChange.emit({ category: this.selectedCategory });
  }

  onTabClick(tab: 'all' | 'pending' | 'completed'): void {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.selectedStatus = null;
    this.selectedCategory = null;
    this.search.emit('');
    this.filterChange.emit({ status: null, category: null });
  }

  hasFilters(): boolean {
    return this.searchKeyword.trim() !== '' || 
           this.selectedStatus !== null || 
           this.selectedCategory !== null;
  }
}
