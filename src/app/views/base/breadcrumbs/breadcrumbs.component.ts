import { Component, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plant } from '../../../models/plant';
import { Supplier } from '../../../models/supplier';
import { InventoryService } from '../../../services/inventory.service';
import { PlantService } from '../../../services/plant.service';
import { SupplierService } from '../../../services/supplier.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Inventory } from '../../../models/inventory';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-breadcrumbs',
    standalone : true,
    templateUrl: './breadcrumbs.component.html',
    styleUrl: './breadcrumbs.component.scss',
    imports: [  CommonModule,  ReactiveFormsModule,  HttpClientModule,FormsModule ]
})
export class BreadcrumbsComponent implements OnInit  {

  inventoryForm     : FormGroup;
  plants            : Plant[] = [];
  suppliers         : Supplier[] = [];
  errorMessage      : string = '';
  listInventory     : Inventory[] = []
  inventory         : any
  selectedInventory : any = null;
  inventoryItems    : any[] = [];
  editingItem       : any = null;
  originalValue     : number = 0;

  @ViewChild('closemodal') closeModalButton: any;



  constructor(
    private inventoryservice : InventoryService,
    private plantservice     : PlantService,
    private supplierservice  : SupplierService,
    private toastr           : ToastrService
  ) {

    this.inventoryForm = new FormGroup({
      plant            : new FormControl('', Validators.required),
      supplier         : new FormControl('', Validators.required),
      initial_stock    : new FormControl('', Validators.required),
      Year             : new FormControl('', Validators.required),

    })
  }

  ngOnInit() {
    this.plantservice.getPlants().subscribe({
      next: (plants) => this.plants = plants,
      error: (err) => console.error('Error  plants', err)
    });

    this.supplierservice.getSuppliers().subscribe({
      next: (suppliers) => this.suppliers = suppliers,
      error: (err) => console.error('Error  suppliers', err)
    });


    this.getAllInventory();



  }

  onSubmit() {
    this.inventory = this.inventory || {};
    this.inventory.plant = this.inventoryForm.value.plant;
    this.inventory.supplier = this.inventoryForm.value.supplier;
    this.inventory.initial_stock = this.inventoryForm.value.initial_stock;
    this.inventory.Year = this.inventoryForm.value.Year;

      this.inventoryservice.addInventory(this.inventory).subscribe({
        next: (response) => {
          console.log('Inventory added successfully', response);
          this.getAllInventory();
          this.closeModalButton.nativeElement.click();
          this.toastr.success('Inventory added successfully', 'Success');
        },
        error: (err) => {
          console.error('Error adding inventory', err);
          this.getAllInventory();
          this.closeModalButton.nativeElement.click();
          this.toastr.error('Error adding inventory', 'Error');
        }
      });

  }


  getAllInventory(){
    this.inventoryservice.getAllInventory().subscribe(
      (data : any)=>{
        this.listInventory = data
        console.log('inventory list ' , data)
      },(error)=>{
        console.log("error")
      }
    )
  }


  startEditing(item: any): void {
    this.originalValue = item.initial_stock;
    this.editingItem = item;

    setTimeout(() => {
      const inputElement = document.getElementById('editStock') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
    }, 0);
  }

  cancelEditing(): void {
    if (this.editingItem) {
      this.editingItem.initial_stock = this.originalValue;
    }
    this.editingItem = null;
  }

  handleKeyEvent(event: KeyboardEvent, item: any): void {
    if (event.key === 'Enter') {
      this.saveItem(item);
    } else if (event.key === 'Escape') {
      this.cancelEditing();
    }
  }

  saveItem(data: any): void {
    if (!this.editingItem) return;


    this.inventoryservice.updateInventory(data).subscribe(
      (response) => {
        // Mise à jour réussie
        const index = this.inventoryItems.findIndex(i =>
          i.plant === data.plant &&
          i.supplier === data.supplier &&
          i.Year === data.Year
        );

        if (index !== -1) {
          this.inventoryItems[index] = response;
        }

        this.editingItem = null;

        this.getAllInventory();
      },
      (error) => {
        console.error('Error updating inventory:', error);
        // Restaurer la valeur originale en cas d'erreur
        data.initial_stock = this.originalValue;
        this.editingItem = null;

        this.getAllInventory();

      }
    );
  }

  isEditing(data: any): boolean {
    return this.editingItem &&
           this.editingItem.plant === data.plant &&
           this.editingItem.supplier === data.supplier &&
           this.editingItem.Year === data.Year;
  }


}
