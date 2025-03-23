import { Component, inject, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule, NgStyle } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlantService } from '../../../services/plant.service';
import { Plant } from '../../../models/plant';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { AuthserviceService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-form-controls',
    standalone: true,
    templateUrl: './form-controls.component.html',
    styleUrls: ['./form-controls.component.scss'],
  imports: [CommonModule , ReactiveFormsModule]
})
export class FormControlsComponent {


  userForm : FormGroup;
  updateUserForm : FormGroup;
  plants        : Plant[] = [];
  inventory : any
  listUser : User [] = []
  user: any
  viewmodeluser :any
  isAdmin!: boolean ;
  role! : string
  selectedRole: string = '';



  @ViewChild('closemodal') closeModalButton: any;
  @ViewChild('closemodalupdate') closeModalButtonupdate: any;

  userservice = inject (UserService)
  authService = inject (AuthserviceService)

  constructor(
    private plantservice     : PlantService,
    private toastr: ToastrService
  ) {

    this.userForm = new FormGroup({
      name       : new FormControl('', Validators.required),
      email      : new FormControl('', Validators.required),
      role       : new FormControl('', Validators.required),
      password   : new FormControl('', Validators.required),
      plant_name : new FormControl('', Validators.required),

    })

    this.updateUserForm = new FormGroup({
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
          this.toastr.success('User added successfully', 'Success');
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



onRoleChange(event: Event) {
  this.selectedRole = (event.target as HTMLSelectElement).value;
}




deleteUser(id:any)
{
  if(id!=undefined && id !=null)
  {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Vous ne pourrez pas récupérer entite USer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-la!',
      cancelButtonText: 'Non, gardez-la'
    }).then((result : any) => {
      if (result.value) {
        this.userservice.deleteUser(id).subscribe(res=>{
        this.listUser = this.listUser.filter(user => user.id !== id);

        })
      Swal.fire(
        'Supprimé!',
        'Votre USER entite a été supprimée.',
        'success'
      )

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Annulé',
        'Votre niveau est en sécurité 🙂',
        'error'
      )
      }
    })
  }
}

getUser(id: any): void {
  this.userservice.getUsers().subscribe(
    (data) => {
      this.viewmodeluser = data.find(user => user.id === id);
      console.log(data);
    },
    (error) => {
      console.error('Erreur lors de la récupération des données', error);
    },
    () => {
      if (this.viewmodeluser) {
        this.updateUserForm.patchValue({
          name: this.viewmodeluser.name,
          email: this.viewmodeluser.email,
          role: this.viewmodeluser.role,
          password: this.viewmodeluser.password,
          plant_name: this.viewmodeluser.plant_name
        });
        this.updateUserForm.updateValueAndValidity();
        console.log("Form value:", this.updateUserForm.value);
      } else {
        console.error("Utilisateur non trouvé !");
      }
    }
  );
}

  updateUser(): void {
    if (!this.updateUserForm.valid) {
      console.warn("Le formulaire n'est pas valide !");
      return;
    }

    const userId = this.viewmodeluser.id;
    const updatedUser = this.updateUserForm.value;
    this.userservice.updateUser(userId, updatedUser).subscribe({
      next: (response) => {
        console.log('Mise à jour réussie !');
        this.closeModalButtonupdate.nativeElement.click();
        this.toastr.info('User mis à jour avec succès', 'Succès');
        this.getAllUsers();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour', error);
      }
    });
  }



}




