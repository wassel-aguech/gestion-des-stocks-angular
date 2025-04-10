import { Component } from '@angular/core';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WireconsumptionService } from '../../../services/wireconsumption.service';

@Component({
    selector: 'app-list-groups',
    standalone: true,
    templateUrl: './list-groups.component.html',
    styleUrls: ['./list-groups.component.scss'],
    imports: [CommonModule,ReactiveFormsModule]
})
export class ListGroupsComponent {


  wireConsumptionData: any[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  totalElements: number = 0
  totalPages: number = 0;
  pagedData: any[] = [];
  pageNumbers: number[] = [];

  constructor(private wireconsumptionService: WireconsumptionService) {}

  ngOnInit(): void {
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
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = this.wireConsumptionData.slice(startIndex, endIndex);
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





}
