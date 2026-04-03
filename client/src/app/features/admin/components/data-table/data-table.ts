import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-100 border-b border-gray-200">
            <tr>
              @for (column of columns; track column) {
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  {{ column }}
                </th>
              }
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            @if (isLoading) {
              <tr>
                <td [attr.colspan]="columns.length + 1" class="px-6 py-8 text-center text-gray-500">
                  <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="ml-2">Loading data...</span>
                  </div>
                </td>
              </tr>
            } @else if (data.length === 0) {
              <tr>
                <td [attr.colspan]="columns.length + 1" class="px-6 py-8 text-center text-gray-500">No data found.</td>
              </tr>
            } @else {
              @for (row of displayedData; track row._id || row.id) {
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                  @for (column of columns; track column) {
                    <td class="px-6 py-4 text-sm text-gray-700">
                      @if (column.toLowerCase() === 'name' && row.image) {
                        <div class="flex items-center gap-3">
                          <img [src]="row.image" alt="Product" class="w-10 h-10 rounded object-cover shadow-sm border border-gray-200">
                          <span class="font-medium text-gray-900">{{ row[column.toLowerCase()] }}</span>
                        </div>
                      } @else if (column.toLowerCase() === 'price') {
                        <span class="font-medium">{{ row[column.toLowerCase()] }}</span>
                      } @else {
                        {{ row[column.toLowerCase()] }}
                      }
                    </td>
                  }
                  <td class="px-6 py-4 text-sm">
                    <div class="flex gap-5">
                      @if (showEdit) {
                        <button
                          class="text-blue-600 hover:text-blue-900 font-medium"
                          (click)="edit.emit(row)"
                        >
                          Edit
                        </button>
                      }
                      @if (row.role !== 'admin') {
                        <button
                          class="text-red-600 hover:text-red-900 font-medium"
                          (click)="delete.emit(row._id || row.id)"
                        >
                          Delete
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span class="text-sm text-gray-600">Showing {{ displayedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }} to {{ Math.min(currentPage * pageSize, totalRecords) }} of {{ totalRecords }} entries</span>
        <div class="flex gap-2">
          <button
            (click)="prevPage()"
            [disabled]="currentPage === 1"
            class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            (click)="nextPage()"
            [disabled]="currentPage >= totalPages"
            class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Data table custom styles */
    `,
  ],
})
export class DataTable {
  @Input() title: string = 'Data Table';
  @Input() columns: string[] = ['Name', 'Email', 'Status'];
  @Input() data: any[] = [];
  @Input() showEdit: boolean = true;
  @Input() role: string = '';
  @Input() pageSize: number = 10;
  @Input() isLoading: boolean = false;
  
  @Input() isServerSide: boolean = false;
  @Input() totalItems: number = 0;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();

  Math = Math;
  @Input() currentPage: number = 1;

  get totalRecords(): number {
    return this.isServerSide ? this.totalItems : this.data.length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get displayedData(): any[] {
    if (this.isServerSide) {
      return this.data; // Server is returning exactly the current page's slice
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return this.data.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      if (!this.isServerSide) {
        this.currentPage++;
      }
      this.pageChange.emit(this.currentPage + (this.isServerSide ? 1 : 0));
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      if (!this.isServerSide) {
        this.currentPage--;
      }
      this.pageChange.emit(this.currentPage - (this.isServerSide ? 1 : 0));
    }
  }
}
