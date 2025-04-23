import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EventSourcePolyfill } from 'event-source-polyfill';

@Injectable({ providedIn: 'root' })

export class NotificationService {

  private eventSource!: EventSource;
  constructor(
    private http: HttpClient,
    private zone: NgZone
  ) {}



  // connectToNotifications(): Observable<any> {
  //   return new Observable(observer => {
  //     const token = localStorage.getItem('access_token');

  //     if (!token) {
  //       observer.error('No token found');
  //       return;
  //     }

  //     // Supprimer withCredentials et ajouter le token dans l'URL
  //     const url = `http://localhost:5000/stream?token=${token}`;

  //     this.eventSource = new EventSource(url);


  //     this.eventSource.onopen = (event) => {
  //       console.log('SSE connection opened', event);
  //     };

  //     this.eventSource.onmessage = (event) => {
  //       const data = JSON.parse(event.data);
  //       this.zone.run(() => {
  //         observer.next(data.data);
  //       });
  //     };

  //     this.eventSource.onerror = (err) => {
  //       console.error('SSE error:', err);
  //       observer.error(err);
  //     };

  //     return () => {
  //       if (this.eventSource) {
  //         this.eventSource.close();
  //        // this.eventSource = undefined;
  //       }
  //     };
  //   });
  // }


  connectToNotifications(): Observable<any> {
    return new Observable(observer => {
      const token = localStorage.getItem('access_token');

      // Configuration ESSENTIELLE
      this.eventSource = new EventSourcePolyfill('http://localhost:5000/stream', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
        heartbeatTimeout: 300000, // 5 minutes
        connectionTimeout: 10000
      });


      // Événements spécifiques
      const eventTypes = [
        'new_wirebreak_added',
        'new_consumption_data_validated',
        'notification'
      ];


      eventTypes.forEach(type => {
        this.eventSource!.addEventListener(type, (event: any) => {
          this.zone.run(() => {
            try {
              const data = JSON.parse(event.data);

              observer.next({ type, data });
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          });
        });
      });


      this.eventSource.onerror = (error) => {
        this.zone.run(() => {
          if (this.eventSource?.readyState === 2) {
            console.warn('SSE connection closed');
          } else {
            console.error('SSE error:', error);
            observer.error(error);
          }
        });
      };


      return () => this.closeConnection();
    });
  }






  closeConnection() {
    this.eventSource?.close();
   // this.eventSource = null;
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
