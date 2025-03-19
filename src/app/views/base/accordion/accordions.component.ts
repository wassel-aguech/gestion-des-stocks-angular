import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { WirebreackdetailsService } from '../../../services/wirebreackdetails.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Wirebreackdetails } from '../../../models/wirebreackdetails';
import { HttpClientModule } from '@angular/common/http';
import { Plant } from '../../../models/plant';
import { Supplier } from '../../../models/supplier';
import { PlantService } from '../../../services/plant.service';
import { SupplierService } from '../../../services/supplier.service';
import { WirebreaktypeService } from '../../../services/wirebreaktype.service';
import { MachineService } from '../../../services/machine.service';
import { WirebreakType } from '../../../models/wirebreaktype';
import { MachineType } from '../../../models/machinetype';

@Component({
    selector: 'app-accordions',
    standalone : true,
    templateUrl: './accordions.component.html',
    styleUrls: ['./accordions.component.scss'],
    imports: [CommonModule ,ReactiveFormsModule ,HttpClientModule,FormsModule ]
})
export class AccordionsComponent implements OnInit {


  selectedFile: File | null = null;
  temporaryData: any[] = [];
  displayedColumns: string[] = [];
  isUploadLoading = false;
  isShowDataLoading = false;
  isSaveDataLoading = false;
  isUploadCompleted = false;
  isShowDataCompleted = false;
  isSaveDataCompleted = false;
  wireBreackDetailsForm : FormGroup
  wirebreackdetails : any = {}
  listwiredetails : Wirebreackdetails[] = []
  wireBreakData: any = {}
  plants : Plant[] = []
  suppliers : Supplier [] = []
  machineTypes : MachineType[] = []
  wirebreakTypes : WirebreakType [] = []


  private wirebreackdetailsservice = inject(WirebreackdetailsService);
  private plantService  = inject(PlantService);
  private supplierService = inject(SupplierService);
  private machineService  = inject(MachineService);
  private wireBreakTypeService = inject(WirebreaktypeService);



  constructor( ) {

        this.wireBreackDetailsForm = new FormGroup({
          Plant                  :new FormControl('', Validators.required),
          Supplier               :new FormControl('', Validators.required),
          Week_Number            :new FormControl('', Validators.required),
          Wire_Break_Type        :new FormControl('', Validators.required),
          Break_date             :new FormControl('', Validators.required),
          num_of_break           :new FormControl('', Validators.required),
          Machine_Number         :new FormControl('', Validators.required),
          Batch_Number           :new FormControl('', Validators.required),
          Break_Diameter         :new FormControl('', Validators.required),
          Range_                 :new FormControl('', Validators.required),
          Finished_Wire_Diameter :new FormControl('', Validators.required),
        })

  }


  ngOnInit(): void {
    this.plantService.getPlants().subscribe({
      next: (plants) => this.plants = plants,
      error: (err) => console.error('Error  plants', err)
    });

    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => this.suppliers = suppliers,
      error: (err) => console.error('Error  suppliers', err)
    });

    this.machineService.getMachines().subscribe({
      next: (res) => this.machineTypes = res,
      error: (err) => console.error('Error  machine', err)
    });

    this.wireBreakTypeService.getWireBreakTypes().subscribe({
      next: (res) => this.wirebreakTypes = res,
      error: (err) => console.error('Error  supwiretype', err)
    });
  }

  tableHeaders: string[] = [];

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    this.isUploadLoading = true;

    if (this.selectedFile) {
      this.wirebreackdetailsservice.uploadFile(this.selectedFile).subscribe(
        response => {
          console.log('Upload réussi', response);

          setTimeout(() => {
            // Opération terminée
            this.isUploadLoading = false;
            this.isUploadCompleted = true;

          }, 2000);
        },
        error => {
          console.error('Erreur upload', error);
          alert('Erreur durant l\'upload');
        }
      );
    }
  }

  getTemporaryData() {
    this.isShowDataLoading = true;


    this.wirebreackdetailsservice.getTemporaryData().subscribe(
      data => {
        this.temporaryData = data;
        this.displayedColumns = data.length > 0 ? Object.keys(data[0]) : [];

        setTimeout(() => {
          // Opération terminée
          this.isShowDataLoading = false;
          this.isShowDataCompleted = true;
        }, 1500);
      },
      error => {
        console.error('Erreur récupération données', error);
        alert('Impossible de récupérer les données');
      }
    );
  }

  validateData() {
    this.isSaveDataLoading = true;

    this.wirebreackdetailsservice.validateData().subscribe(
      response => {
        console.log('Validation réussie', response);

        this.temporaryData = [];

        setTimeout(() => {
          this.isSaveDataLoading = false;
          this.isSaveDataCompleted = true;

        }, 2500);
      },
      error => {
        console.error('Erreur validation', error);
        alert('Erreur de validation des données');
      }
    );
  }
  resetWorkflow() {
    this.isUploadLoading = false;
    this.isShowDataLoading = false;
    this.isSaveDataLoading = false;
    this.isUploadCompleted = false;
    this.isShowDataCompleted = false;
    this.isSaveDataCompleted = false;
  }


   datePipe = inject (DatePipe)

  formatDate(date: Date): string | null {
    return this.datePipe.transform(date, 'yyyy/mm/dd');
  }

  onSubmit(){

    this.wirebreackdetails.Plant                   = this.wireBreackDetailsForm.value.Plant
    this.wirebreackdetails.Supplier                = this.wireBreackDetailsForm.value.Supplier
    this.wirebreackdetails.Week_Number             = this.wireBreackDetailsForm.value.Week_Number
    this.wirebreackdetails.Wire_Break_Type         = this.wireBreackDetailsForm.value.Wire_Break_Type
    this.wirebreackdetails.Break_date              = this.formatDate(this.wireBreackDetailsForm.value.Break_date)
    this.wirebreackdetails.num_of_break            = this.wireBreackDetailsForm.value.num_of_break
    this.wirebreackdetails.Machine_Number          = this.wireBreackDetailsForm.value.Machine_Number
    this.wirebreackdetails.Batch_Number            = this.wireBreackDetailsForm.value.Batch_Number
    this.wirebreackdetails.Break_Diameter          = this.wireBreackDetailsForm.value.Break_Diameter
    this.wirebreackdetails.Range_                  = this.wireBreackDetailsForm.value.Range_
    this.wirebreackdetails.Finished_Wire_Diameter  = this.wireBreackDetailsForm.value.Finished_Wire_Diameter


    console.log(" info wirebreack " , this.wirebreackdetails)

    this.wirebreackdetailsservice.addWirebreackDetails(this.wirebreackdetails).subscribe(
      (data : any)=>{
        console.log("data medecin" , data)
      },(error)=>{
        console.log("error insertion wirebreak")
      }
    )
   }

















  //  getWireBreak() {
  //   const { Plant, Supplier, Week_Number, Wire_Break_Type, Break_date, num_of_break, Machine_Number } = this.wireBreakData;
  //   this.wirebreackdetailsservice.getWireBreak(Plant, Supplier, Week_Number, Wire_Break_Type, Break_date, num_of_break, Machine_Number)
  //     .subscribe(response => {
  //       console.log('WireBreak récupéré:', response);
  //       this.listwiredetails = response;
  //     });
  // }










  }



