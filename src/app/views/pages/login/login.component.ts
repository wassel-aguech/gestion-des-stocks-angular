import { Component, inject } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthserviceService } from '../../../services/auth.service';
import { AuthenticationRequest } from '../../../models/authentication-request';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ContainerComponent, RowComponent, ColComponent,
       CardGroupComponent, TextColorDirective, CardComponent,
       CardBodyComponent, FormDirective, InputGroupComponent,
       InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective,
      CommonModule,ReactiveFormsModule,FormsModule]
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  authrequest:AuthenticationRequest = new AuthenticationRequest()
  role:any
  http = inject  (HttpClient);


  constructor(
    private authService: AuthserviceService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email : new FormControl ('',[Validators.required,Validators.minLength(3)]),
      password : new FormControl ('',[Validators.required,Validators.minLength(3)])
     })}

  get password(){
    return this.loginForm.get('password')
  }
  get email(){
    return this.loginForm.get('email')
  }

    authservice = inject(AuthserviceService);

    ngOnInit(): void {
       this.role =  this.authservice.getRole()
       console.log('User role in login:', this.role);
    }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    console.log("email:", email, "password:", password);

    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        console.log('Login successful, response:');

                 this.router.navigate(['/dashboard']);



      },
      error: (error) => {
        console.log('Login error');
      },

    });
  }
}
