import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subject } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = 'http://localhost:8080/api/reminders';
  private reminderSubject = new Subject<Todo>();
  private pollingInterval = 30000; // 30秒轮询一次

  constructor(private http: HttpClient) { }

  getPendingReminders(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}/pending`);
  }

  triggerReminderCheck(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/check`, {});
  }

  startPolling(): void {
    interval(this.pollingInterval)
      .pipe(
        switchMap(() => this.getPendingReminders()),
        filter(reminders => reminders.length > 0)
      )
      .subscribe({
        next: (reminders) => {
          reminders.forEach(reminder => this.reminderSubject.next(reminder));
        },
        error: (error) => {
          console.warn('提醒轮询失败:', error);
        }
      });
  }

  onReminder(): Observable<Todo> {
    return this.reminderSubject.asObservable();
  }
}
