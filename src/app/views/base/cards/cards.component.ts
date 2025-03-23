import { Component, inject, OnInit } from '@angular/core';
import { WireconsumptionService } from '../../../services/wireconsumption.service';
import { Wireconsumption } from '../../../models/wireconsumption';
import { CommonModule } from '@angular/common';
import { AuthserviceService } from '../../../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';



@Component({
    selector: 'app-cards',
    standalone: true,
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss'],
  imports: [CommonModule , ReactiveFormsModule , FormsModule]
})
export class CardsComponent implements OnInit {
   wireconsumption : Wireconsumption = new Wireconsumption
  wireConsumptionsuser: any[] = [];
  userId! : number
  id! : number
  userRole: string | null = null;
  userPlant: string | null = null;

  wireconsumptionservice = inject(WireconsumptionService)
  authService = inject(AuthserviceService)
  transactionService = inject(TransactionService)

  addForm : FormGroup

  data = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Élément ${i + 1}` }));

  currentPage = 1;
  pageSize = 5;
  totalPages!: number;
  pages!: number[];
  paginatedData!: any
  listWireConsumption : any

  isUploadLoading = false;
  isUploadCompleted = false;
  isGettingWire = false;
  isGettingWireCompleted = false;

  isLoading = false;
  message = '';

  wireConsumption : any
  viewmodelwireconsumption : any

  plant!:any
  supplier!:any
  weekNumber!:any
  yearB!:any


  constructor(){

       this.addForm = new FormGroup({

          Plant              : new FormControl('', Validators.required),
          Supplier           : new FormControl('', Validators.required),
          Week_Number        : new FormControl('', Validators.required),
          yearB              : new FormControl('', Validators.required),
          initial_stock      : new FormControl('', Validators.required),
          Quantity_received  : new FormControl('', Validators.required),
          Real_Consumption   : new FormControl('', Validators.required),
          Final_Stock        : new FormControl('', Validators.required),
          MaterialBreaks     : new FormControl('', Validators.required),
          ProcessBreaks      : new FormControl('', Validators.required),
          Rate               : new FormControl('', Validators.required),


        })
  }








  ngOnInit(): void {

    this.totalPages = Math.ceil(this.data.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginate();


    this.userRole = this.authService.getRole();
    console.log("role est ", this.userRole )

  }


   paginate() {
    if (this.listWireConsumption && this.listWireConsumption.length > 0) {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.paginatedData = this.listWireConsumption.slice(start, end);
    }
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginate();
    }
  }

  loadWireConsumption(): void {
    this.isGettingWire = true;

    this.wireconsumptionservice.getWireConsumption().subscribe({
      next: (data) => {
        console.log('Wire Consumption Data:', data);
        this.listWireConsumption = data;

        this.totalPages = Math.ceil(this.listWireConsumption.length / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.paginate();


        setTimeout(() => {
          this.isGettingWire = false;
          this.isGettingWireCompleted = true;

        }, 2000);


      },
      error: (error) => {
        console.error('Error loading data:', error);
      }
    });
  }


  // remplir wire transuction

  remplirTransaction() {
    this.isUploadLoading = true;

    this.transactionService.remplirWireTransaction().subscribe({
      next: (response : any) => {
        console.log(' transaction success:');

        setTimeout(() => {
          this.isUploadLoading = false;
          this.isUploadCompleted = true;

        }, 2000);

      },
      error: (error) => {
        console.log(' transaction failed:');

      }
    });
  }



  resetWorkflow() {
    this.isUploadLoading = false;
    this.isUploadCompleted = false;
    this.isGettingWire = false;
    this.isGettingWireCompleted = false;
  }








  getwireconsumption(Plant:any , Supplier:any , Week_Number:any , yearB:any)
  {

    this.wireconsumptionservice.getWireConsumptionbyId(Plant, Supplier, Week_Number, yearB).subscribe(

      (data) => {
        this.viewmodelwireconsumption = data;
        console.log(data);  // Affiche les données dans la console
      },
      (error) => {
        console.error('Erreur lors de la récupération des données', error);
      }
      ,()=>{

        this.addForm.get("Plant")?.setValue(this.viewmodelwireconsumption.Plant);
        this.addForm.get("Supplier")?.setValue(this.viewmodelwireconsumption.Supplier);
        this.addForm.get("Week_Number")?.setValue(this.viewmodelwireconsumption.Week_Number);
        this.addForm.get("yearB")?.setValue(this.viewmodelwireconsumption.yearB);
        this.addForm.get("initial_stock")?.setValue(this.viewmodelwireconsumption.Initial_stock);
        this.addForm.get("Quantity_received")?.setValue(this.viewmodelwireconsumption.Quantity_received);
        this.addForm.get("Real_Consumption")?.setValue(this.viewmodelwireconsumption.Real_Consumption);
        this.addForm.get("Final_Stock")?.setValue(this.viewmodelwireconsumption.Final_Stock);
        this.addForm.get("MaterialBreaks")?.setValue(this.viewmodelwireconsumption.MaterialBreaks);
        this.addForm.get("ProcessBreaks")?.setValue(this.viewmodelwireconsumption.ProcessBreaks);
        this.addForm.get("Rate")?.setValue(this.viewmodelwireconsumption.Rate);


        this.addForm.updateValueAndValidity()
        console.log("form value", this.addForm.value)

      });

    }





  updateWireConsumption() {
    this.isLoading = true;
    this.message = '';

    this.wireconsumptionservice.updateWireConsumption(this.addForm.value).subscribe({
      next: (response) => {
        this.message = 'Mise à jour réussie !';
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour', error);
        this.message = 'Erreur lors de la mise à jour.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }







}
