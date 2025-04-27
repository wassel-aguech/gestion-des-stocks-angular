import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import {

  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { AuthserviceService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
  imports: [ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective,
     HeaderNavComponent, NavLinkDirective, NgTemplateOutlet,
       DropdownComponent, DropdownToggleDirective,
      DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective
       ,CommonModule],
})
// NavItemComponent
//BreadcrumbRouterComponent,
//RouterLinkActive
export class DefaultHeaderComponent extends HeaderComponent {

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });


    public filteredNavItems: any[] = [];
    notifications: any[] = [];
    notificationCount = 0;
    playAnimation = false;
    showNotifications : boolean = false;
    sseSub: any;
    userRole: any;


  constructor(private authService: AuthserviceService,
    private toastr: ToastrService,
    private notificationService: NotificationService,
    private router: Router,    private cdRef: ChangeDetectorRef  // Injection de ChangeDetectorRef
  ) {
    super();

  }


ngOnInit(): void {

  this.userRole = localStorage.getItem('userRole') || '';
  if (this.userRole === 'Admin') {

  this.loadHistory();

  this.sseSub = this.notificationService.connectToNotifications().subscribe({
    next: (event) => {
      this.notificationCount++;

      console.log('Nouvelle notification reçue:', event);

      const fullMessage = event.data?.data.message ||
        `New wire break added (${event.data?.event || 'unknown source'})`;

      const newNotif = {
        id: event.data?.wirebreak_id || Date.now(),
        message: fullMessage,
        created_at: new Date().toISOString(),
        is_read: false,
        type: event.type
      };

      this.notifications.unshift(newNotif);

      this.cdRef.detectChanges();  // Force la détection des changements


      // Affichage toastr avec le message complet
      this.toastr.info(fullMessage, 'Nouvelle Notification', {
        timeOut: 8000,
        closeButton: true,
        progressBar: true
      });
    },
    error: (err) => {
      console.error('Erreur SSE:', err);
      this.toastr.error('Connexion aux notifications perdue', 'Erreur');
    }
  });
}}

ngOnDestroy(): void {
  this.sseSub?.unsubscribe();
}

// Récupère l’historique des notifications
loadHistory(): void {
  this.notificationService.getNotificationHistory().subscribe(history => {
    this.notifications = history;
    this.notificationCount = this.notifications.filter(n => !n.is_read).length;

    this.cdRef.detectChanges();  // Force la détection des changements

  });
}

// Méthode pour marquer les notifications comme lues
markAsRead(notification: any): void {
  this.notificationService.markAsRead(notification.id).subscribe(() => {
    notification.is_read = true;
    this.notificationCount = this.notifications.filter(n => !n.is_read).length;


  });
}

toggleNotifications(): void {
  console.log('Toggle notifications:', this.showNotifications); // Vérifie si la variable bascule
  console.log('Notifications:', this.notifications);  // Vérifie le contenu de la liste des notifications
  this.showNotifications = !this.showNotifications;
}



  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Even if the server request fails, we should still clear local data
        this.router.navigate(['/login']);
      }
    });
  }





  sidebarId = input('sidebar1');

  public newMessages = [
    {
      id: 0,
      from: 'Jessica Williams',
      avatar: '7.jpg',
      status: 'success',
      title: 'Urgent: System Maintenance Tonight',
      time: 'Just now',
      link: 'apps/email/inbox/message',
      message: 'Attention team, we\'ll be conducting critical system maintenance tonight from 10 PM to 2 AM. Plan accordingly...'
    },
    {
      id: 1,
      from: 'Richard Johnson',
      avatar: '6.jpg',
      status: 'warning',
      title: 'Project Update: Milestone Achieved',
      time: '5 minutes ago',
      link: 'apps/email/inbox/message',
      message: 'Kudos on hitting sales targets last quarter! Let\'s keep the momentum. New goals, new victories ahead...'
    },
    {
      id: 2,
      from: 'Angela Rodriguez',
      avatar: '5.jpg',
      status: 'danger',
      title: 'Social Media Campaign Launch',
      time: '1:52 PM',
      link: 'apps/email/inbox/message',
      message: 'Exciting news! Our new social media campaign goes live tomorrow. Brace yourselves for engagement...'
    },
    {
      id: 3,
      from: 'Jane Lewis',
      avatar: '4.jpg',
      status: 'info',
      title: 'Inventory Checkpoint',
      time: '4:03 AM',
      link: 'apps/email/inbox/message',
      message: 'Team, it\'s time for our monthly inventory check. Accurate counts ensure smooth operations. Let\'s nail it...'
    },
    {
      id: 3,
      from: 'Ryan Miller',
      avatar: '4.jpg',
      status: 'info',
      title: 'Customer Feedback Results',
      time: '3 days ago',
      link: 'apps/email/inbox/message',
      message: 'Our latest customer feedback is in. Let\'s analyze and discuss improvements for an even better service...'
    }
  ];

  public newNotifications = [
    { id: 0, title: 'New user registered', icon: 'cilUserFollow', color: 'success' },
    { id: 1, title: 'User deleted', icon: 'cilUserUnfollow', color: 'danger' },
    { id: 2, title: 'Sales report is ready', icon: 'cilChartPie', color: 'info' },
    { id: 3, title: 'New client', icon: 'cilBasket', color: 'primary' },
    { id: 4, title: 'Server overloaded', icon: 'cilSpeedometer', color: 'warning' }
  ];

  public newStatus = [
    { id: 0, title: 'CPU Usage', value: 25, color: 'info', details: '348 Processes. 1/4 Cores.' },
    { id: 1, title: 'Memory Usage', value: 70, color: 'warning', details: '11444GB/16384MB' },
    { id: 2, title: 'SSD 1 Usage', value: 90, color: 'danger', details: '243GB/256GB' }
  ];

  public newTasks = [
    { id: 0, title: 'Upgrade NPM', value: 0, color: 'info' },
    { id: 1, title: 'ReactJS Version', value: 25, color: 'danger' },
    { id: 2, title: 'VueJS Version', value: 50, color: 'warning' },
    { id: 3, title: 'Add new layouts', value: 75, color: 'info' },
    { id: 4, title: 'Angular Version', value: 100, color: 'success' }
  ];

}
