import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlantService } from '../../../services/plant.service';
import { Plant } from '../../../models/plant';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { AuthserviceService } from '../../../services/auth.service';

@Component({
    selector: 'app-form-controls',
    standalone: true,
    templateUrl: './form-controls.component.html',
    styleUrls: ['./form-controls.component.scss'],
  imports: [CommonModule , ReactiveFormsModule]
})
export class FormControlsComponent {

  
  userForm : FormGroup;
  plants        : Plant[] = [];
  inventory : any
  listUser : User [] = []
  user: any
  isAdmin!: boolean ;

  role! : string


  @ViewChild('closemodal') closeModalButton: any;  
  
  userservice = inject (UserService)
  authService = inject (AuthserviceService)

  constructor(
    private plantservice     : PlantService,
  ) {

    this.userForm = new FormGroup({
      name       : new FormControl('', Validators.required),
      email      : new FormControl('', Validators.required),
      role       : new FormControl('', Validators.required),
      password   : new FormControl('', Validators.required),
      plant_name : new FormControl('', Validators.required),

    })
  }

  ngOnInit() {
    this.plantservice.getPlants().subscribe({
      next: (plants) => this.plants = plants,
      error: (err) => console.error('Error  plants', err)
    });


      this.getAllUsers();

      console.log("Votre rôle est :", localStorage.getItem('userRole') || 'Aucun rôle trouvé');
      this.role = this.authService.getRole()

  }

  onSubmit() {

    this.user = this.user || {};
    
    this.user.name = this.userForm.value.name;
    this.user.email = this.userForm.value.email;
    this.user.role = this.userForm.value.role;
    this.user.password = this.userForm.value.password;
    this.user.plant_name = this.userForm.value.plant_name;
   
    console.log('  user data = ' ,this.user)

      
      this.userservice.createUser(this.user).subscribe({
        next: (response) => {
          alert('User added successfully');
          this.userForm.reset({
          });

          this.getAllUsers();

          this.closeModalButton.nativeElement.click(); 


        },
        error: (err) => {
          console.log('Error adding user');

          this.getAllUsers();

          this.closeModalButton.nativeElement.click(); 


        }
      });
    
  }





  getAllUsers(){

    this.userservice.getUsers().subscribe({
      next: (data: any) => {
        this.listUser = data;
        console.log("users list" ,this.listUser);
      },
      error: (error: any) => {
        console.log('no data founded');
      }
    });

  }
  
 
deleteUser(userId: any): void {

  // if (this.role !== "Admin") {
  //   console.error("Accès refusé: vous n'êtes pas admin");
  //   return;
  // }
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    this.userservice.deleteUser(userId).subscribe({
      next: (response) => {
        console.log('Utilisateur supprimé avec succès');

        this.listUser = this.listUser.filter(user => user.id !== userId);
      },
      error: (error) => {
        console.error("Erreur lors de la suppression:", error);
      }
    });
  }
}


  
}




