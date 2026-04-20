import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo, TodoStatus, TodoPriority, TodoCategory, createDefaultTodo, statusLabels, priorityLabels, categoryLabels } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  @Input() todo: Todo | null = null;
  @Output() submit = new EventEmitter<Todo>();
  @Output() cancel = new EventEmitter<void>();

  todoForm!: FormGroup;
  statuses = Object.values(TodoStatus);
  priorities = Object.values(TodoPriority);
  categories = Object.values(TodoCategory);
  
  statusLabels = statusLabels;
  priorityLabels = priorityLabels;
  categoryLabels = categoryLabels;

  TodoPriority = TodoPriority;
  TodoCategory = TodoCategory;

  showReminder = false;
  isEditing = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.isEditing = this.todo !== null && this.todo.id !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['todo'] && this.todoForm) {
      this.updateFormWithTodo();
      this.isEditing = this.todo !== null && this.todo.id !== null;
    }
  }

  private initForm(): void {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', Validators.maxLength(1000)],
      status: [TodoStatus.PENDING],
      priority: [TodoPriority.MEDIUM],
      category: [TodoCategory.WORK],
      dueDate: [''],
      reminderEnabled: [false],
      reminderTime: ['']
    });

    this.showReminder = this.todoForm.get('reminderEnabled')?.value || false;

    // 监听提醒开关变化
    this.todoForm.get('reminderEnabled')?.valueChanges.subscribe((value: boolean) => {
      this.showReminder = value;
      if (!value) {
        this.todoForm.get('reminderTime')?.setValue('');
      }
    });

    this.updateFormWithTodo();
  }

  private updateFormWithTodo(): void {
    if (this.todo && this.todoForm) {
      this.todoForm.patchValue({
        title: this.todo.title,
        description: this.todo.description || '',
        status: this.todo.status,
        priority: this.todo.priority,
        category: this.todo.category,
        dueDate: this.formatDateTimeForInput(this.todo.dueDate),
        reminderEnabled: this.todo.reminderEnabled,
        reminderTime: this.formatDateTimeForInput(this.todo.reminderTime)
      });
      this.showReminder = this.todo.reminderEnabled;
    }
  }

  private formatDateTimeForInput(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  private parseDateTimeFromInput(dateStr: string): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).toISOString();
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const formValue = this.todoForm.value;
    const todo: Todo = {
      id: this.todo?.id || null,
      title: formValue.title.trim(),
      description: formValue.description?.trim() || null,
      status: formValue.status,
      priority: formValue.priority,
      category: formValue.category,
      dueDate: this.parseDateTimeFromInput(formValue.dueDate),
      reminderEnabled: formValue.reminderEnabled,
      reminderTime: formValue.reminderEnabled ? this.parseDateTimeFromInput(formValue.reminderTime) : null,
      reminderSent: this.todo?.reminderSent || false,
      createdAt: this.todo?.createdAt || null,
      updatedAt: this.todo?.updatedAt || null,
      completedAt: this.todo?.completedAt || null
    };

    this.submit.emit(todo);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  get formTitle(): string {
    return this.isEditing ? '编辑待办' : '新建待办';
  }

  get submitButtonText(): string {
    return this.isEditing ? '保存修改' : '创建待办';
  }

  // 便捷设置方法
  setHighPriority(): void {
    this.todoForm.get('priority')?.setValue(TodoPriority.HIGH);
  }

  setDueDateTomorrow(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    this.todoForm.get('dueDate')?.setValue(this.formatDateTimeForInput(tomorrow.toISOString()));
  }

  setDueDateNextWeek(): void {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(18, 0, 0, 0);
    this.todoForm.get('dueDate')?.setValue(this.formatDateTimeForInput(nextWeek.toISOString()));
  }

  // 获取字段错误信息
  getFieldError(fieldName: string): string {
    const control = this.todoForm.get(fieldName);
    if (!control || !control.errors || !control.touched) return '';

    if (control.errors['required']) {
      return '此字段为必填项';
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `最多输入 ${max} 个字符`;
    }
    return '';
  }
}
