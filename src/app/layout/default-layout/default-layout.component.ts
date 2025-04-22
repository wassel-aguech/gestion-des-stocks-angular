import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';


import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { AuthserviceService } from '../../services/auth.service';

import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SocketIoModule } from 'ngx-socket-io';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { CustomNotificationToastComponent } from '../custom-notification-toast/custom-notification-toast.component';


function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  standalone: true,

  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    CommonModule,
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    SocketIoModule
  ]
})
export class DefaultLayoutComponent {
  public navItems = [...navItems];
  role: any;
  public filteredNavItems: any[] = [];
  notifications: any[] = [];
  notificationCount = 0;
  private sseSub?: Subscription;



    constructor(private authservice : AuthserviceService,
      private toastr: ToastrService,
      private notificationService: NotificationService

    ) {

    }



    ngOnInit(): void {

      this.role = localStorage.getItem('role') || '';

   // if (this.role === 'admin') {
    this.loadHistory();

    this.sseSub = this.notificationService.connectToNotifications()
      .subscribe(data => {
        this.notificationCount++;

        const newNotif = {
          id: Date.now(), // ID temporaire (ou utilise celui de ton backend si disponible)
          message: data.message,
          created_at: new Date().toISOString(),
          is_read: false
        };

        this.notifications.unshift(newNotif);


      });



   // }


      const userRole = this.authservice.getRole()?.trim().toLowerCase() || '';
      console.log('User role in sidebar:', userRole);

      this.filteredNavItems = this.filterNavItems(this.navItems, userRole);



      this.role = this.authservice.getRole().trim().toLowerCase();
    console.log(" le role est " , this.role)




    this.notificationService.getNotificationHistory().subscribe(history => {
      const unreadNotifications = history.filter(notif => !notif.is_read);

      unreadNotifications.forEach(notif => {
        this.toastr.show(
          notif.message,
          'Nouvelle Notification ',
          {
            disableTimeOut: true, 
            closeButton: false,
            toastClass: 'ngx-toastr custom-toast',
            positionClass: 'toast-bottom-right'
          }
        );
      });
    });



  }


  ngOnDestroy(): void {
    this.sseSub?.unsubscribe();
  }

  // Récupère l’historique au démarrage
  loadHistory(): void {
    this.notificationService.getNotificationHistory().subscribe(history => {
      this.notifications = history;
      this.notificationCount = this.notifications.filter(n => !n.is_read).length;
    });
  }

  markAsRead(notification: any): void {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.is_read = true;
      this.notificationCount = this.notifications.filter(n => !n.is_read).length;
    });
  }






      // filterNavItems(items: any[], role: any): any[] {
      //   return items
      //     .map(item => {
      //       const filteredChildren = item.children ? this.filterNavItems(item.children, role) : [];

      //       const isVisible = item.roles && item.roles.includes(role);

      //       console.log(`Item: ${item.name}, Roles: ${item.roles}, Visible: ${isVisible}`);

      //       if (isVisible || filteredChildren.length > 0) {
      //         return { ...item, children: filteredChildren };
      //       }
      //       return null;
      //     })
      //     .filter(item => item !== null);
      // filterNavItems(items: any[], role: string): any[] {
      //   return items
      //     .map(item => {
      //       const filteredChildren = item.children ? this.filterNavItems(item.children, role) : [];

      //       const isVisible = item.roles && item.roles.includes(role);
      //       console.log(`Item: ${item.name}, Roles: ${item.roles}, Visible: ${isVisible}`);

      //       if (isVisible || filteredChildren.length > 0) {
      //         return { ...item, children: filteredChildren };
      //       }
      //       return null;
      //     })
      //     .filter(item => item !== null);
      // }
      // }

      filterNavItems(items: any[], role: string): any[] {
        return items
          .map(item => {
            const filteredChildren = item.children ? this.filterNavItems(item.children, role) : [];

            // ✅ Gestion des items sans "roles"
            const isVisible = !item.roles || item.roles.includes(role);
           // console.log(`Item: ${item.name}, Roles: ${item.roles}, Visible: ${isVisible}`);

            if (isVisible || filteredChildren.length > 0) {
              return { ...item, children: filteredChildren };
            }

            return null;
          })
          .filter(item => item !== null);
      }


}
