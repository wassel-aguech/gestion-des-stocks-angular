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
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';


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

  ]
})
export class DefaultLayoutComponent {
  public navItems = [...navItems];
  userRole: any;
  public filteredNavItems: any[] = [];
  notifications: any[] = [];
  notificationCount = 0;
  private sseSub?: Subscription;
  playAnimation = false;

    constructor(private authservice : AuthserviceService,
      private toastr: ToastrService,
      private notificationService: NotificationService

    ) {

    }





    ngOnInit(): void {

    //   this.userRole = localStorage.getItem('userRole') || '';
    //   if (this.userRole === 'Admin') {
    //   this.loadHistory();

    // this.sseSub = this.notificationService.connectToNotifications()
    // .subscribe({
    //   next: (event) => {
    //     this.notificationCount++;

    //     console.log('Nouvelle notification reçue:', event);
    //     // Extraction correcte du message selon la structure du backend
    //     const fullMessage = event.data?.data.message ||
    //    `New wire break added (${event.data?.event || 'unknown source'})`;

    //     const newNotif = {
    //       id: event.data?.wirebreak_id || Date.now(),
    //       message: fullMessage,
    //       created_at: new Date().toISOString(),
    //       is_read: false,
    //       type: event.type
    //     };

    //     this.notifications.unshift(newNotif);

    //     // Affichage toastr avec le message complet
    //     this.toastr.info(
    //       fullMessage,
    //       'Nouvelle Notification',
    //       {
    //         timeOut: 8000,
    //         closeButton: true,
    //         progressBar: true
    //       }
    //     );
    //   },
    //   error: (err) => {
    //     console.error('Erreur SSE:', err);
    //     this.toastr.error('Connexion aux notifications perdue', 'Erreur');
    //   }
    // });

    // }


      const userRole = this.authservice.getRole()?.trim().toLowerCase() || '';
      console.log('User role in sidebar:', userRole);
      this.filteredNavItems = this.filterNavItems(this.navItems, userRole);
      this.userRole = this.authservice.getRole().trim().toLowerCase();
      console.log(" le role est " , this.userRole)

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
