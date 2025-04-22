import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-custom-notification-toast',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './custom-notification-toast.component.html',
  styleUrl: './custom-notification-toast.component.scss'
})
export class CustomNotificationToastComponent extends Toast{
  


}
