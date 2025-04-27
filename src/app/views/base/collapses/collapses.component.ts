import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, CollapseDirective } from '@coreui/angular';
import { WirebreackdetailsService } from '../../../services/wirebreackdetails.service';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from '../../../services/supplier.service';
import { PlantService } from '../../../services/plant.service';

@Component({
    selector: 'app-collapses',
    templateUrl: './collapses.component.html',
    styleUrls: ['./collapses.component.scss'],
    imports: [CommonModule , ReactiveFormsModule,FormsModule]
})
export class CollapsesComponent {






  wireBreakDetails: any[] = [];
  pageSize: number = 6;
  currentPage: number = 1;
  totalElements: number = 0
  totalPages: number = 0;
  pagedData: any[] = [];
  pageNumbers: number[] = [];
  plants: any[] = [];
  listsuppliers: any[] = [];



// plants: any[] = [];         // Remplir depuis le backend si besoin
// listsuppliers: any[] = [];

  constructor(private wirebreakdetailsservice : WirebreackdetailsService,
   private toastr: ToastrService,private plantService : PlantService,
   private supplierService: SupplierService
  ) { }

 // Remplir depuis le backend si besoin

ngOnInit(): void {

  this.plantService.getPlants().subscribe({
    next: (plants) => this.plants = plants,
    error: (err) => console.error('Error  plants', err)
  });

  this.supplierService.getSuppliers().subscribe({
    next: (data) => this.listsuppliers = data,
    error: (err) => console.error('Error  supplier', err)
  });


  this.getWireBreakDetails();
}

// getWireBreakDetails(): void {
//   this.wirebreakdetailsservice.getWireBreakDetails().subscribe({
//     next: (data) => {
//       this.wireBreakDetails = data;
//       this.setPageData();
//       this.updatePageNumbers();
//       console.log('WireBreak Details:', this.wireBreakDetails);
//     },
//     error: (err) => {
//       console.error('Erreur:', err);
//     }
//   });
// }


getWireBreakDetails(): void {
  this.wirebreakdetailsservice.getWireBreakDetails().subscribe({
    next: (data) => {
      this.wireBreakDetails = data;
      this.totalElements = data.length;
      this.totalPages = Math.ceil(this.totalElements / this.pageSize);
      this.setPageData();
      this.updatePageNumbers();
    },
    error: (err) => {
      console.error('Erreur:', err);
    },
  });
}




onPageChange(page: number): void {
  this.currentPage = page;
  this.setPageData();
  this.updatePageNumbers();
}

setPageData(): void {
  const filtered = this.filteredData();
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.pagedData = filtered.slice(startIndex, endIndex);

  // Met à jour le total après filtrage
  this.totalElements = filtered.length;
  this.totalPages = Math.ceil(this.totalElements / this.pageSize);
}

updatePageNumbers(): void {
  const range = 2;
  let start = Math.max(this.currentPage - range, 1);
  let end = Math.min(this.currentPage + range, this.totalPages);

  this.pageNumbers = [];
  for (let i = start; i <= end; i++) {
    this.pageNumbers.push(i);
  }
}










search = {
  Plant: '',
  Supplier: '',
  Week_Number: null,
  yearB: null
};

filteredData(): any[] {
  return this.wireBreakDetails.filter((item: { Plant: string; Supplier: string; Week_Number: any; yearB: any; }) =>
    (!this.search.Plant || item.Plant.toLowerCase().includes(this.search.Plant.toLowerCase())) &&
    (!this.search.Supplier || item.Supplier.toLowerCase().includes(this.search.Supplier.toLowerCase())) &&
    (!this.search.Week_Number || item.Week_Number === this.search.Week_Number) &&
    (!this.search.yearB || item.yearB === this.search.yearB)
  );
}

clearFilter() {
  this.search = {
    Plant: '',
    Supplier: '',
    Week_Number: null,
    yearB: null
  };
  this.currentPage = 1;
  this.setPageData();
}


























}
