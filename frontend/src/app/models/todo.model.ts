export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum TodoPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TodoCategory {
  工作 = '工作',
  学习 = '学习',
  生活 = '生活'
}

export interface Todo {
  id: number | null;
  title: string;
  description: string | null;
  status: TodoStatus;
  priority: TodoPriority;
  category: TodoCategory;
  dueDate: string | null;
  reminderEnabled: boolean;
  reminderTime: string | null;
  reminderSent: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  completedAt: string | null;
}

export interface TodoStats {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}

export interface TodoEnums {
  statuses: TodoStatus[];
  priorities: TodoPriority[];
  categories: TodoCategory[];
}

export const statusLabels: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: '待办',
  [TodoStatus.IN_PROGRESS]: '进行中',
  [TodoStatus.COMPLETED]: '已完成'
};

export const priorityLabels: Record<TodoPriority, string> = {
  [TodoPriority.LOW]: '低',
  [TodoPriority.MEDIUM]: '中',
  [TodoPriority.HIGH]: '高'
};

export const categoryLabels: Record<TodoCategory, string> = {
  [TodoCategory.工作]: '工作',
  [TodoCategory.学习]: '学习',
  [TodoCategory.生活]: '生活'
};

export function createDefaultTodo(): Todo {
  return {
    id: null,
    title: '',
    description: '',
    status: TodoStatus.PENDING,
    priority: TodoPriority.MEDIUM,
    category: TodoCategory.工作,
    dueDate: null,
    reminderEnabled: false,
    reminderTime: null,
    reminderSent: false,
    createdAt: null,
    updatedAt: null,
    completedAt: null
  };
}
