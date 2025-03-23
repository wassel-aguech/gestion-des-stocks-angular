import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Machine } from '../../../models/machine';
import { ToastrService } from 'ngx-toastr';
import { MachineService } from '../../../services/machine.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    imports: [CommonModule, ReactiveFormsModule],
})
export class SelectComponent {


    machineForm      : FormGroup;
    updateMachineForm : FormGroup;
    listMachines     : Machine[] = [];
    machine : Machine = new Machine();
    viewModeMachine : Machine = new Machine();



    @ViewChild('closemodal') closeModalButton: any;

    constructor(
      private machineService     : MachineService,
      private toastr: ToastrService
    ) {

      this.machineForm = new FormGroup({
        codeMachine       : new FormControl('', Validators.required),
        typeM      : new FormControl('', Validators.required),


      })

      this.updateMachineForm = new FormGroup({
        codeMachine       : new FormControl('', Validators.required),
        typeM      : new FormControl('', Validators.required),


      })
    }

    ngOnInit() {
         this.getAllMachines();

    }

    onSubmit() {

      this.machine = this.machine || {};
      this.machine.codeMachine = this.machineForm.value.codeMachine;
      this.machine.typeM = this.machineForm.value.typeM;
      console.log('  machine data = ' ,this.machine)

        this.machineService.createMachine(this.machine).subscribe({
          next: (response) => {
            this.toastr.success('machine added successfully', 'Success');
            this.closeModalButton.nativeElement.click();
            this.getAllMachines();
          },
          error: (err) => {
            console.log('Error adding user');

            this.getAllMachines();

            this.closeModalButton.nativeElement.click();
          }
        });

    }





    getAllMachines(){

      this.machineService.getMachines().subscribe({
        next: (data: any) => {
          this.listMachines = data;
          console.log("machines list" ,this.listMachines);
        },
        error: (error: any) => {
          console.log('no data founded');
        }
      });

    }



  deleteMachine(codeMachine:any)
  {
    if(codeMachine!=undefined && codeMachine !=null)
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
          this.machineService.deleteMachine(codeMachine).subscribe(res=>{
            this.getAllMachines();
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





  getMachine(codeMachine:any )
  {

      this.machineService.getMachineById(codeMachine).subscribe(
        (res : any)=>{
          this.viewModeMachine = res

          console.log("  machine info ." , res)
      },error=>{
        console.error(error)
      },()=>{

        this.updateMachineForm.get("codeMachine")?.setValue(this.viewModeMachine.codeMachine);
        this.updateMachineForm.get("typeM")?.setValue(this.viewModeMachine.typeM);

        this.updateMachineForm.updateValueAndValidity()
      });
    }


    updateMachine(): void {
      if (!this.viewModeMachine || !this.updateMachineForm.valid) {
        this.toastr.warning("Veuillez remplir correctement le formulaire", "Attention");
        return;
      }

      const codeMachine = this.viewModeMachine.codeMachine; // Ancien code machine
      const newCodeMachine = this.updateMachineForm.value.codeMachine; // Nouveau code machine
      const newTypeM = this.updateMachineForm.value.typeM; // Nouveau type de machine

      this.machineService.updateMachine(codeMachine, newCodeMachine, newTypeM).subscribe({
        next: () => {
          this.toastr.info("Machine mise à jour avec succès", "Succès");
          this.getMachine(newCodeMachine); // Rafraîchir les données avec le nouveau code
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour:", error);
          this.toastr.error("Échec de la mise à jour", "Erreur");
        }
      });
    }








}
