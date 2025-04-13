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
    suppliers: any[] = [];

    supplier      : Supplier = new Supplier();
    viewModeSupplier : Supplier = new Supplier();

    @ViewChild('closemodal') closeModalButton: any;

    constructor(
      private supplierservice  : SupplierService,
      private toastr           : ToastrService
    ) {

      this.supplierForm = new FormGroup({
        supplierid  : new FormControl('', Validators.required),
        target     : new FormControl('', Validators.required),

      })

      this.updateSupplierForm = new FormGroup({
        supplierid  : new FormControl('', Validators.required),
        target     : new FormControl('', Validators.required),

      })


    }

    ngOnInit() {
         this.getAllsupplier();
    }


    onSubmit() {
      this.supplier = this.supplier || {};
      this.supplier.supplierid = this.supplierForm.value.supplierid;
      this.supplier.target = this.supplierForm.value.target;
      console.log('  supplier data = ' ,this.supplier)

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

          console.log( " list supplier est ",data)
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








  // getSupplier(supplierid:any )
  // {

  //     this.supplierservice.getSupplierById(supplierid).subscribe(
  //       (res : any)=>{
  //         this.viewModeSupplier = res

  //         console.log("  supplier info ." , res)
  //     },error=>{
  //       console.error(error)
  //     },()=>{

  //       this.updateSupplierForm.get("supplierid")?.setValue(this.viewModeSupplier.supplierid);
  //       this.updateSupplierForm.get("target")?.setValue(this.viewModeSupplier.target);

  //       this.updateSupplierForm.updateValueAndValidity()
  //     });
  //   }
  getSupplier(supplierid: any): void {
    this.supplierservice.getSupplierById(supplierid).subscribe(
      (res: any) => {
        this.viewModeSupplier = res;
      },
      (error) => {
        console.error(error);
      },
      () => {
        this.updateSupplierForm.get("supplierid")?.setValue(this.viewModeSupplier.supplierid);
        this.updateSupplierForm.get("target")?.setValue(this.viewModeSupplier.target);
        this.updateSupplierForm.updateValueAndValidity();
      }
    );
  }



  updateSupplierTarget(): void {
    const supplierid = this.updateSupplierForm.value.supplierid;
    const target = this.updateSupplierForm.value.target;

    if (!supplierid || target === null) {
      console.error("Fournisseur ou target manquant !");
      return;
    }

    this.supplierservice.updateSupplierTarget2(supplierid, target).subscribe({
      next: (response) => {
        this.toastr.success('Target mis à jour avec succès', 'Succès');
        this.getAllsupplier();
      },
      error: (error) => {
        console.error("Erreur lors de la mise à jour du target :", error);
        this.toastr.error('Échec de la mise à jour du target', 'Erreur');
      }
    });
  }




    // updateSupplier(): void {

    //   const newSupplierId = this.updateSupplierForm.value.supplierid;

    //   if (!newSupplierId) {
    //     console.error("Nouvel ID du fournisseur introuvable !");
    //     return;
    //   }

    //   console.log("Updating Supplier:", this.viewModeSupplier.supplierid, "New ID:", newSupplierId);

    //   this.supplierservice.updateSupplier(this.viewModeSupplier.supplierid, newSupplierId).subscribe({
    //     next: (response) => {
    //       this.toastr.info('Fournisseur mis à jour avec succès', 'Succès');
    //       this.getAllsupplier();
    //     },
    //     error: (error) => {
    //       console.error("Erreur lors de la mise à jour du fournisseur:", error);
    //     }
    //   });
    // }



    deactivateSupplier(supplierId: any) {
      this.supplierservice.deactivateSupplier(supplierId).subscribe({
        next: (response) => {
          console.log('Fournisseur désactivé :', response);
          const supplier = this.suppliers.find(s => s.supplierid === supplierId);
          if (supplier) {
            supplier.is_active = false;
          }
          this.toastr.warning('Supplier Desactivee', 'Success');

        },
        error: (err) => {
          console.error('Erreur lors de la désactivation', err);
        }
      });
    }



    activateSupplier(supplierid: string) {
      this.supplierservice.activateSupplier(supplierid).subscribe({
        next: (response) => {
          console.log('Fournisseur activé avec succès :', response);
          const supplier = this.suppliers.find(s => s.supplierid === supplierid);
          if (supplier) {
            supplier.is_active = true;
          }
          this.toastr.info('Supplier Active', 'Success');

        },
        error: (err) => {
          console.error('Erreur lors de l\'activation du fournisseur', err);
        }
      });
    }



}


