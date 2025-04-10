import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonDirective, CollapseDirective } from '@coreui/angular';
import { WirebreackdetailsService } from '../../../services/wirebreackdetails.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-collapses',
    templateUrl: './collapses.component.html',
    styleUrls: ['./collapses.component.scss'],
    imports: [CommonModule , ReactiveFormsModule]
})
export class CollapsesComponent {


  wireBreakDetails: any[] = [];

  constructor(private wirebreakdetailsservice : WirebreackdetailsService,
               private toastr: ToastrService
  ) { }



  ngOnInit(): void {
    this.getWireBreakDetails();
  }

  getWireBreakDetails(): void {
    this.wirebreakdetailsservice.getWireBreakDetails().subscribe({
      next: (data) => {
        this.wireBreakDetails = data;
        console.log('WireBreak Details:', this.wireBreakDetails);
      },
      error: (err) => {
        console.error('Erreur:', err);
      }
    });
  }
}
