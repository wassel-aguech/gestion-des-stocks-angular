import { CommonModule, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { AuthserviceService } from '../../services/auth.service';


@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    imports: [CommonModule]
})
export class DashboardComponent implements OnInit {


  // notifications: any[] = [];
  // unreadCount = 0;
  role: any
  name : any

  constructor(
    private toastr: ToastrService,private authservice : AuthserviceService,

  ) {}

  ngOnInit() {



  

    this.role = this.authservice.getRole().trim().toLowerCase();
    console.log(" le role est " , this.role)

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.name = currentUser.name;



  }

}




























