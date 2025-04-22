import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private eventSource?: EventSource;



  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) {}

  connectToNotifications(): Observable<any> {
    return new Observable(observer => {
      this.eventSource = new EventSource('http://localhost:5000/stream', { withCredentials: true });

      this.eventSource.onmessage = (event) => {
        this.zone.run(() => {
          const data = JSON.parse(event.data);
          observer.next(data.data); 
        });
      };

      this.eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        observer.error(err);
        this.eventSource?.close();
      };

      return () => {
        this.eventSource?.close();
      };
    });
  }

  getNotificationHistory(): Observable<any[]> {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>('http://localhost:5000/notifications/history', { headers });
  }

  markAsRead(notificationId: number): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`http://localhost:5000/notifications/mark-read/${notificationId}`, {}, { headers });
  }
}
