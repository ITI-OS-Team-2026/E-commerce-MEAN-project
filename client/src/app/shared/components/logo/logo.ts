import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [CommonModule, RouterModule],
  templateUrl: './logo.html',
  styleUrl: './logo.css',
})
export class Logo {}
