import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { WireconsumptionUploadService } from '../../../services/wireconsumption-upload.service';

@Component({
  selector: 'app-carousels',
  standalone: true,
  templateUrl: './carousels.component.html',
  styleUrls: ['./carousels.component.scss'],
  imports: [CommonModule ,ReactiveFormsModule]
})
export class CarouselsComponent {

  selectedFile: File | null = null;
  temporaryData: any[] = [];
  displayedColumns: string[] = [];
  isUploadLoading = false;
  isShowDataLoading = false;
  isSaveDataLoading = false;
  isUploadCompleted = false;
  isShowDataCompleted = false;
  isSaveDataCompleted = false;

  constructor(private wireconsumptionupload : WireconsumptionUploadService) {}


  tableHeaders: string[] = [];

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    this.isUploadLoading = true;

    if (this.selectedFile) {
      this.wireconsumptionupload.uploadFile(this.selectedFile).subscribe(
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


    this.wireconsumptionupload.getTemporaryData().subscribe(
      data => {
        this.temporaryData = data;
        this.displayedColumns = data.length > 0 ? Object.keys(data[0]) : [];

        setTimeout(() => {
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

    this.wireconsumptionupload.validateData().subscribe(
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



}
