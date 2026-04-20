import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoStats, TodoEnums, TodoStatus, TodoCategory, TodoPriority } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8080/api/todos';

  constructor(private http: HttpClient) { }

  getAllTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl);
  }

  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  updateTodo(id: number, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }

  updateStatus(id: number, status: TodoStatus): Observable<Todo> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<Todo>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTodosByStatus(status: TodoStatus): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/status/${status}`);
  }

  getTodosByCategory(category: TodoCategory): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/category/${category}`);
  }

  searchTodos(keyword?: string, status?: TodoStatus): Observable<Todo[]> {
    let params = new HttpParams();
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Todo[]>(`${this.apiUrl}/search`, { params });
  }

  filterTodos(status?: TodoStatus, category?: TodoCategory, priority?: TodoPriority, keyword?: string): Observable<Todo[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    if (category) {
      params = params.set('category', category);
    }
    if (priority) {
      params = params.set('priority', priority);
    }
    if (keyword) {
      params = params.set('keyword', keyword);
    }
    return this.http.get<Todo[]>(`${this.apiUrl}/filter`, { params });
  }

  getStats(): Observable<TodoStats> {
    return this.http.get<TodoStats>(`${this.apiUrl}/stats`);
  }

  getEnums(): Observable<TodoEnums> {
    return this.http.get<TodoEnums>(`${this.apiUrl}/enums`);
  }
}
