import { Component } from '@angular/core';
import { UntypedFormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WireconsumptionService } from '../../../services/wireconsumption.service';
import { PlantService } from '../../../services/plant.service';
import { SupplierService } from '../../../services/supplier.service';

@Component({
    selector: 'app-list-groups',
    standalone: true,
    templateUrl: './list-groups.component.html',
    styleUrls: ['./list-groups.component.scss'],
    imports: [CommonModule,ReactiveFormsModule,FormsModule]
})
export class ListGroupsComponent {


  wireConsumptionData: any[] = [];
  pageSize: number = 9;
  currentPage: number = 1;
  totalElements: number = 0
  totalPages: number = 0;
  pagedData: any[] = [];
  pageNumbers: number[] = [];
  plants: any[] = [];
  listsuppliers: any[] = [];

  constructor(private wireconsumptionService: WireconsumptionService,private plantService : PlantService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {



    this.plantService.getPlants().subscribe({
      next: (plants) => this.plants = plants,
      error: (err) => console.error('Error  plants', err)
    });

    this.supplierService.getSuppliers().subscribe({
      next: (data) => this.listsuppliers = data,
      error: (err) => console.error('Error  supplier', err)
    });
    this.getWireConsumption();
  }

  getWireConsumption(): void {
    this.wireconsumptionService.getWireConsumption().subscribe({
      next: (data) => {
        this.wireConsumptionData = data;
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
    return this.wireConsumptionData.filter((item: { Plant: string; Supplier: string; Week_Number: any; yearB: any; }) =>
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
