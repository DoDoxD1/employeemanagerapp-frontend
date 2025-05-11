import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Use CommonModule instead of just NgFor
import { FormsModule, NgForm } from '@angular/forms';

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
  public editEmployee: Employee | null = null;
  public deleteEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      },
    });
  }

  public searchEmployee(key: string): void {
    const result: Employee[] = [];
    this.employees.forEach((employee) => {
      if (
        employee.name.toLowerCase().indexOf(key.toLowerCase()) != -1 ||
        employee.email.toLowerCase().indexOf(key.toLowerCase()) != -1 ||
        employee.phone.toLowerCase().indexOf(key.toLowerCase()) != -1
      ) {
        result.push(employee);
      }
    });
    this.employees = result;
    if (result.length === 0 || !key) this.getEmployees();
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');
    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addEmployeeModal');
    } else if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-bs-target', '#updateEmployeeModal');
    } else if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-bs-target', '#deleteEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (res: Employee) => {
        console.log('Adding the employee to the db: ', res);
      },
      error: (error: HttpErrorResponse) => alert(error.message),
      complete: () => {
        alert('Employee added');
        addForm.reset();
        this.getEmployees();
      },
    });
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (res: Employee) => {
        console.log(
          `Updating the employee with id ${res.id} to the db: ', ${res}`
        );
      },
      error: (error: HttpErrorResponse) => alert(error.message),
      complete: () => {
        alert('Employee updated');
        this.getEmployees();
      },
    });
  }

  public onDeleteEmployee(employeeId: number): void {
    if (employeeId == -1) {
      alert('Something went wrong!');
      return;
    }
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        console.log(`Deleting the employee with id ${employeeId} from the db`);
      },
      error: (error: HttpErrorResponse) => alert(error.message),
      complete: () => {
        alert('Employee Deleted');
        this.getEmployees();
      },
    });
  }
}
