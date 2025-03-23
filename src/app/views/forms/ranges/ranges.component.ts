import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supplier } from '../../../models/supplier';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../../services/supplier.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ranges',
    templateUrl: './ranges.component.html',
    styleUrls: ['./ranges.component.scss'],
    imports: [CommonModule , ReactiveFormsModule]
})
export class RangesComponent implements OnInit {



    supplierForm : FormGroup;
    updateSupplierForm : FormGroup;
    listSupplier : Supplier[] = [];
    supplier      : Supplier = new Supplier();
    viewModeSupplier : Supplier = new Supplier();

    @ViewChild('closemodal') closeModalButton: any;

    constructor(
      private supplierservice  : SupplierService,
      private toastr           : ToastrService
    ) {

      this.supplierForm = new FormGroup({
        supplierid  : new FormControl('', Validators.required),
      })

      this.updateSupplierForm = new FormGroup({
        supplierid  : new FormControl('', Validators.required),
      })


    }

    ngOnInit() {
         this.getAllsupplier();
    }


    onSubmit() {

      this.supplier = this.supplier || {};
      this.supplier.supplierid = this.supplierForm.value.supplierid;
      console.log('  machine data = ' ,this.supplier)

        this.supplierservice.createSupplier(this.supplier).subscribe({
          next: (response) => {
            this.toastr.success('Supplier added successfully', 'Success');
            this.closeModalButton.nativeElement.click();
            this.getAllsupplier();

          },
          error: (err) => {
            console.log('Error adding user');
            this.getAllsupplier();
            this.closeModalButton.nativeElement.click();
          }
        });

    }


    getAllsupplier(){

      this.supplierservice.getSuppliers().subscribe(
        (data : any) => {
          this.listSupplier = data;
        },(error : any) => {
          console.log(error);
        }
      )
    }



    deleteSupplier(supplierid:any)
  {
    if(supplierid!=undefined && supplierid !=null)
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
          this.supplierservice.deleteSupplier(supplierid).subscribe(res=>{
            this.getAllsupplier();
          })
        Swal.fire(
          'Supprimé!',
          'Votre Supplier entite a été supprimée.',
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








  getSupplier(supplierid:any )
  {

      this.supplierservice.getSupplierById(supplierid).subscribe(
        (res : any)=>{
          this.viewModeSupplier = res

          console.log("  supplier info ." , res)
      },error=>{
        console.error(error)
      },()=>{

        this.updateSupplierForm.get("supplierid")?.setValue(this.viewModeSupplier.supplierid);

        this.updateSupplierForm.updateValueAndValidity()
      });
    }

    updateSupplier(): void {
      if (!this.viewModeSupplier || !this.viewModeSupplier.supplierid) {
        console.error("ID du fournisseur introuvable !");
        return;
      }

      const updatedSupplier = {
        supplierid: this.updateSupplierForm.value.supplierid
      };

      console.log("Updating Supplier:", this.viewModeSupplier.supplierid, updatedSupplier); // Debugging

      this.supplierservice.updateSupplier(this.viewModeSupplier.supplierid, updatedSupplier).subscribe({
        next: (response) => {
          this.toastr.info('Fournisseur mis à jour avec succès', 'Succès');
          this.getAllsupplier(); // Rafraîchir la liste
        },
        error: (error) => {
          console.error("Erreur lors de la mise à jour du fournisseur:", error);
        }
      });
    }



}


