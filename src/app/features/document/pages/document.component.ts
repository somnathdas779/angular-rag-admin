import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
import { UploadService } from "../../../core/services/upload.service";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: "app-documents",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="space-y-6">
      <!-- File Upload Section -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold flex items-center">
          <mat-icon class="mr-2">upload_file</mat-icon>
          File Upload
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div class="space-y-3">
            @if (selectedFile) {
            <label class="block text-sm font-medium">{{
              selectedFile?.name
            }}</label>
            }
            <input
              type="file"
              hidden
              (change)="onFileSelected($event)"
              accept=".pdf, .doc"
              #fileInput
            />
            <div
              class="border-2 border-dashed rounded-lg p-6 text-center"
              (click)="fileInput.click()"
            >
              <mat-icon class="text-4xl mb-2">description</mat-icon>
              <div class="text-sm mb-2">Upload File(PDF, DOC)</div>
            </div>
          </div>
        </div>
        <!-- Progress Bar -->
        @if (uploadProgress) {

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <label class="block text-sm font-medium">Form Completion</label>
            <span class="text-sm">{{ uploadProgress }}%</span>
          </div>
          <mat-progress-bar
            mode="determinate"
            [value]="uploadProgress"
            color="primary"
          ></mat-progress-bar>
        </div>
        }
      </div>

      <!-- Recent Documents -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Recent Documents</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="recentReports" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Document Name</th>
              <td mat-cell *matCellDef="let report">
                <div class="flex items-center">
                  <mat-icon class="mr-3 text-blue-500">size</mat-icon>
                  <div>
                    <div class="font-medium">{{ report.name }}</div>
                    <div class="text-sm text-gray-500">
                      {{ report.size }}
                    </div>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let report">
                <mat-chip [color]="getChipColor(report.type)" selected>
                  {{ report.type }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Generated</th>
              <td mat-cell *matCellDef="let report">{{ report.date }}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>ingestion process</th>
              <td mat-cell *matCellDef="let report">
                <mat-chip
                  [ngClass]="
                    report.status === 'Completed'
                      ? 'green-chip'
                      : 'pending-chip'
                  "
                  selected
                >
                  {{ report.status }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let report">
                @if (report.status === 'Pending') {

                <mat-chip class="blue-chip" selected> Trigger </mat-chip>
                }
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <mat-paginator
            [pageSizeOptions]="[5, 10, 25]"
            showFirstLastButtons
          ></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class DocumentComponent {
  constructor(private tusUploadService: UploadService) {
    //
  }

  displayedColumns: string[] = ["name", "type", "date", "status", "actions"];

  recentReports = [
    {
      name: "Sample.pdf",
      size: "1MB",
      type: "PDF",
      date: "2015-08-09",
      status: "Completed",
    },
    {
      name: "Sample.pdf",
      size: "1MB",
      type: "PDF",
      date: "2015-08-09",
      status: "Pending",
    },
    {
      name: "Sample.pdf",
      size: "1MB",
      type: "PDF",
      date: "2015-08-09",
      status: "Pending",
    },
    {
      name: "Sample.pdf",
      size: "1MB",
      type: "PDF",
      date: "2015-08-09",
      status: "Completed",
    },
  ];

  getChipColor(type: string): string {
    switch (type) {
      case "PDF":
        return "primary";
      case "Users":
        return "accent";
      case "Analytics":
        return "warn";
      case "Performance":
        return "primary";
      default:
        return "primary";
    }
  }

  uploadProgress?: number;
  selectedFile?: File;
  uploadStatus?: string;

  onFileSelected(event: Event) {
    console.log("onFileSelected", event);
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.uploadStatus = "";
      this.uploadProgress = 0;
      this.upload();
    }
  }

  upload() {
    if (!this.selectedFile) {
      this.uploadStatus = "No file selected!";
      return;
    }
    this.tusUploadService
      .uploadFile(this.selectedFile, (uploaded, total) => {
        this.uploadProgress = Math.floor((uploaded / total) * 100);
      })
      .then((url) => {
        this.uploadStatus = "Upload successful! File URL: " + url;
      })
      .catch((error) => {
        this.uploadStatus = "Upload failed!";
        console.error(error);
      });
  }
}
