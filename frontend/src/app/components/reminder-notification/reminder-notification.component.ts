import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReminderService } from '../../services/reminder.service';
import { Todo, statusLabels, categoryLabels, TodoCategory } from '../../models/todo.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reminder-notification',
  templateUrl: './reminder-notification.component.html',
  styleUrls: ['./reminder-notification.component.css']
})
export class ReminderNotificationComponent implements OnInit, OnDestroy {
  reminders: Todo[] = [];
  private subscription!: Subscription;

  statusLabels = statusLabels;
  categoryLabels = categoryLabels;

  constructor(private reminderService: ReminderService) {}

  ngOnInit(): void {
    this.subscription = this.reminderService.onReminder().subscribe({
      next: (reminder) => {
        this.addReminder(reminder);
        this.showBrowserNotification(reminder);
      }
    });

    // 请求通知权限
    this.requestNotificationPermission();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private addReminder(reminder: Todo): void {
    this.reminders.unshift(reminder);
    // 最多显示5个提醒
    if (this.reminders.length > 5) {
      this.reminders.pop();
    }

    // 5秒后自动关闭提醒
    setTimeout(() => {
      this.removeReminder(reminder);
    }, 5000);
  }

  removeReminder(reminder: Todo): void {
    const index = this.reminders.indexOf(reminder);
    if (index > -1) {
      this.reminders.splice(index, 1);
    }
  }

  dismissAll(): void {
    this.reminders = [];
  }

  private requestNotificationPermission(): void {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  private showBrowserNotification(reminder: Todo): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('📝 待办事项提醒', {
        body: `${reminder.title}\n分类: ${this.categoryLabels[reminder.category]}`,
        icon: ''
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // 5秒后自动关闭
      setTimeout(() => notification.close(), 5000);
    }
  }

  getCategoryClass(category: TodoCategory): string {
    switch (category) {
      case TodoCategory.工作:
        return 'work';
      case TodoCategory.学习:
        return 'study';
      case TodoCategory.生活:
        return 'life';
      default:
        return 'work';
    }
  }

  hasReminders(): boolean {
    return this.reminders.length > 0;
  }
}
