import { Component } from '@angular/core';
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


function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
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

  public filteredNavItems: any[] = [];







    constructor(private authservice : AuthserviceService,
      private toastr: ToastrService,

    ) {

    }



    ngOnInit(): void {




      const userRole = this.authservice.getRole()?.trim().toLowerCase() || '';
      console.log('User role in sidebar:', userRole);

      this.filteredNavItems = this.filterNavItems(this.navItems, userRole);



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
