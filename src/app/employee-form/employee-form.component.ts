import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../models/employee';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
  };

  isEditing: boolean = false;

  errorMessage: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((result) => {
      const id = result.get('id');

      if (id) {
        this.isEditing = true;
        this.employeeService.getEmployeeById(Number(id)).subscribe({
          next: (result) => {
            this.employee = result;
          },
          error: (error) => {
            this.errorMessage = `La modification d'un employé a échoué. Veuillez réessayer plus tard.
                    Erreur: ${error.status}`;
          },
        });
      }
    });
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.employeeService.updateEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error updating employee:', error);
          this.errorMessage = `La modification d'un employé a échoué. Veuillez réessayer plus tard.
                    Erreur: ${error.status}`;
        },
      });
    } else {
      this.employeeService.createEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding employee:', error);
          this.errorMessage = `L'ajout d'un employé a échoué. Veuillez réessayer plus tard.
                      Erreur: ${error.status}`;
        },
      });
    }
  }
}
