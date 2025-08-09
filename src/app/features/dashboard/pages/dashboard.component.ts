import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule,
    MatProgressBarModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule
  ],
  template: `
    <div class="space-y-6">
    </div>
  `
})
export class DashboardComponent implements OnInit {

  constructor() {
   
  }

  ngOnInit(): void {
    // Component initialization
  }


} 