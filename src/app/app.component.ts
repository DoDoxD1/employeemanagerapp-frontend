import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Use CommonModule instead of just NgFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true, // Add this for standalone components
  imports: [CommonModule, FormsModule], // Add FormsModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'employeemanagerapp';
  public employees: Employee[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add') {
      console.log('Addddddd');
      // $('#addEmployeeModal').modal('show');
      button.setAttribute('data-bs-target', '#addEmployeeModal');
    } else if (mode === 'edit') {
      console.log('update');
      button.setAttribute('data-bs-target', '#updateEmployeeModal');
    } else if (mode === 'delete') {
      console.log('delete');
      button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }
}
