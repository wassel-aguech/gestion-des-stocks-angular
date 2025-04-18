// // notification.service.ts
// import { inject, Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
// import { Observable, fromEvent } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class NotificationService {


//   constructor(private socket: Socket) {}

//   onNewWireBreak(): Observable<any> {
//     return this.socket.fromEvent('new_wirebreak_added');
//   }

//   onNewConsumptionValidated(): Observable<any> {
//     return this.socket.fromEvent('new_consumption_data_validated');
//   }

//   onNewDataValidated(): Observable<any> {
//     return this.socket.fromEvent('new_data_validated');
//   }

//   disconnect(): void {
//     this.socket.disconnect();
//   }
// }
