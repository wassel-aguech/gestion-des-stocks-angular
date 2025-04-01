import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { Machine } from '../../../models/machine';
import { ToastrService } from 'ngx-toastr';

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
  machines : Machine[] = []
  wirebreakTypes : WirebreakType [] = []

  @ViewChild('closemodal') closeModalButton: any;


  private wirebreackdetailsservice = inject(WirebreackdetailsService);
  private plantService  = inject(PlantService);
  private supplierService = inject(SupplierService);
  private machineService  = inject(MachineService);
  private wireBreakTypeService = inject(WirebreaktypeService);
  private toastr = inject(ToastrService)

  wirenumbers : any

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

        this.wirenumbers = [
          {id: '1', code: 'W1'},  {id: '2', code: 'W2'}, {id: '3', code: 'W3'}, {id: '3', code: 'W4'}, {id: '4', code: 'W5'}, {id: '5', code: 'W6'},
          {id: '6', code: 'W7'},  {id: '7', code: 'W8'}, {id: '8', code: 'W9'}, {id: '9', code: 'W10'}, {id: '10', code: 'W11'},
          {id: '11', code: 'W12'}, {id: '12', code: 'W13'}, {id: '13', code: 'W14'}, {id: '14', code: 'W15'}, {id: '15', code: 'W16'},
          {id: '5', code: 'W17'}, {id: '5', code: 'W18'},{id: '5', code: 'W18'}, {id: '5', code: 'W19'}, {id: '5', code: 'W20'},
          {id: '5', code: 'W21'}, {id: '5', code: 'W22'}, {id: '5', code: 'W23'}, {id: '5', code: 'W24'}, {id: '5', code: 'W25'},
          {id: '5', code: 'W26'}, {id: '5', code: 'W27'}, {id: '5', code: 'W28'}, {id: '5', code: 'W29'}, {id: '5', code: 'W30'},
          {id: '5', code: 'W31'}, {id: '5', code: 'W32'}, {id: '5', code: 'W33'}, {id: '5', code: 'W34'}, {id: '5', code: 'W35'},
          {id: '5', code: 'W36'}, {id: '5', code: 'W37'}, {id: '5', code: 'W38'}, {id: '5', code: 'W39'}, {id: '5', code: 'W40'},
          {id: '5', code: 'W41'}, {id: '5', code: 'W42'}, {id: '5', code: 'W43'}, {id: '5', code: 'W44'}, {id: '5', code: 'W45'},
          {id: '5', code: 'W46'}, {id: '5', code: 'W47'}, {id: '5', code: 'W48'}, {id: '5', code: 'W49'}, {id: '5', code: 'W50'},
          {id: '5', code: 'W51'}, {id: '5', code: 'W52'}, {id: '5', code: 'W53'},

        ]

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
      next: (res) => this.machines = res,
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


  onSubmit(){

    this.wirebreackdetails.Plant                   = this.wireBreackDetailsForm.value.Plant
    this.wirebreackdetails.Supplier                = this.wireBreackDetailsForm.value.Supplier
    this.wirebreackdetails.Week_Number             = this.wireBreackDetailsForm.value.Week_Number
    this.wirebreackdetails.Wire_Break_Type         = this.wireBreackDetailsForm.value.Wire_Break_Type
    this.wirebreackdetails.Break_date              = this.wireBreackDetailsForm.value.Break_date
    this.wirebreackdetails.num_of_break            = this.wireBreackDetailsForm.value.num_of_break
    this.wirebreackdetails.Machine_Number          = this.wireBreackDetailsForm.value.Machine_Number
    this.wirebreackdetails.Batch_Number            = this.wireBreackDetailsForm.value.Batch_Number
    this.wirebreackdetails.Break_Diameter          = this.wireBreackDetailsForm.value.Break_Diameter
    this.wirebreackdetails.Range_                  = this.wireBreackDetailsForm.value.Range_
    this.wirebreackdetails.Finished_Wire_Diameter  = this.wireBreackDetailsForm.value.Finished_Wire_Diameter


    console.log(" info wirebreack " , this.wirebreackdetails)

    this.wirebreackdetailsservice.addWirebreackDetails(this.wirebreackdetails).subscribe(
      (data : any)=>{
        console.log("data wiredetails" , data)
        this.closeModalButton.nativeElement.click();
        this.toastr.success(" wirebreak details addded  , success")
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



