import { Component, ViewChild } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { WirebreakType } from '../../../models/wirebreaktype';
import { ToastrService } from 'ngx-toastr';
import { WirebreaktypeService } from '../../../services/wirebreaktype.service';

@Component({
    selector: 'app-checks-radios',
    standalone: true,
    templateUrl: './checks-radios.component.html',
    styleUrls: ['./checks-radios.component.scss'],
    imports: [CommonModule  , ReactiveFormsModule]
})
export class ChecksRadiosComponent {



    wireBreakTypeForm      : FormGroup;
    updateWireBreakTypeForm : FormGroup;
    listWireBreakType    : WirebreakType[] = [];
    wireBreakType          : WirebreakType = new WirebreakType();
    viewModeWireBreakType : WirebreakType = new WirebreakType();



    @ViewChild('closemodal') closeModalButton: any;

    constructor(
      private wirebreaktypeservice     : WirebreaktypeService,
      private toastr: ToastrService
    ) {

      this.wireBreakTypeForm = new FormGroup({
        wirebreaktype  : new FormControl('', Validators.required),
        typeB        : new FormControl('', Validators.required),


      })

      this.updateWireBreakTypeForm = new FormGroup({
        wirebreaktype  : new FormControl('', Validators.required),
        typeB        : new FormControl('', Validators.required),


      })
    }

    ngOnInit() {
         this.getAllWireBreak();

    }

    onSubmit() {

      this.wireBreakType = this.wireBreakType || {};
      this.wireBreakType.wirebreaktype = this.wireBreakTypeForm.value.wirebreaktype;
      this.wireBreakType.typeB = this.wireBreakTypeForm.value.typeB;

      console.log('  wirebreaktype data = ' ,this.wireBreakType)

        this.wirebreaktypeservice.createWireBreakType(this.wireBreakType).subscribe({
          next: (response) => {
            this.toastr.success('wiretype added successfully', 'Success');
            this.closeModalButton.nativeElement.click();

            this.getAllWireBreak();},
          error: (err) => {
            console.log('Error adding wiretype');

            this.getAllWireBreak();

            this.closeModalButton.nativeElement.click();
          }
        });

    }





    getAllWireBreak(){

      this.wirebreaktypeservice.getWireBreakTypes().subscribe({
        next: (data: any) => {
          this.listWireBreakType = data;
          console.log("wiretype list" ,this.listWireBreakType);
        },
        error: (error: any) => {
          console.log('no data founded');
        }
      });

    }



  deleteWireBreakType(wirebreaktype:any)
  {
    if(wirebreaktype!=undefined && wirebreaktype !=null)
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
          this.wirebreaktypeservice.deleteWireBreakType(wirebreaktype).subscribe(res=>{
            this.getAllWireBreak();
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




  getWireBreakType(id:any )
  {
      this.wirebreaktypeservice.getWireBreakTypeById(id).subscribe(
        (res : any)=>{
        this.viewModeWireBreakType = res
        console.log("  wirebreak info ." , res)
      },error=>{
        console.error(error)
      },()=>{
        this.updateWireBreakTypeForm.get("wirebreaktype")?.setValue(this.viewModeWireBreakType.wirebreaktype);
        this.updateWireBreakTypeForm.get("typeB")?.setValue(this.viewModeWireBreakType.typeB);
        this.updateWireBreakTypeForm.updateValueAndValidity()
      });
    }

    updateWireBreakType(): void {
      if (!this.viewModeWireBreakType || !this.viewModeWireBreakType.wirebreaktype) {
        console.error("Erreur : WireBreakType introuvable !");
        return;
      }

      const wirebreaktype = this.viewModeWireBreakType.wirebreaktype;
      const newWireBreakType = this.updateWireBreakTypeForm.get("wirebreaktype")?.value;
      const newTypeB = this.updateWireBreakTypeForm.get("typeB")?.value;

      console.log("Mise à jour du WireBreakType :", wirebreaktype, newWireBreakType, newTypeB);

      this.wirebreaktypeservice.updateWireBreakType(wirebreaktype, newWireBreakType, newTypeB).subscribe({
        next: () => {
          this.toastr.info("WireBreakType mis à jour avec succès", "Succès");
          this.getAllWireBreak();
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour du WireBreakType :", error);
          this.toastr.error("Échec de la mise à jour", "Erreur");
        }
      });
    }






}



