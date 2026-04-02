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
            @for (row of data; track row._id || row.id) {
              <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                @for (column of columns; track column) {
                  <td class="px-6 py-4 text-sm text-gray-700">
                    {{ row[column.toLowerCase()] }}
                  </td>
                }
                <td class="px-6 py-4 text-sm">
                  <div class="flex gap-2">
                    <button
                      class="text-blue-600 hover:text-blue-900 font-medium"
                      (click)="edit.emit(row)"
                    >
                      Edit
                    </button>
                    <button
                      class="text-red-600 hover:text-red-900 font-medium"
                      (click)="delete.emit(row._id || row.id)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span class="text-sm text-gray-600">Showing {{ data.length }} entries</span>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Previous
          </button>
          <button
            class="px-3 py-1 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
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

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
}
