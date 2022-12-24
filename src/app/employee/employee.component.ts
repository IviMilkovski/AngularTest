import { Component, OnInit} from '@angular/core';
import { Employee } from '../models/employee';
import { EmployeeService } from '../services/employee.service';
import { Chart } from "chart.js/auto";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit{

  public employees: Employee[] = [];

  chart : Chart | null = null;

  constructor(private service:EmployeeService){}

  ngOnInit(){
    this.service.getData().subscribe(res => {
      this.calculateH(res);
      this.employees = this.getUniqueEmployees(res);
      this.createChart(this.employees);
    })
   }

   getUniqueEmployees(employees : Employee[]){
    let uniqueEmp : Employee[] = [];
    for(let e of employees){
      if(uniqueEmp.find(u => u.EmployeeName == e.EmployeeName)== undefined && e.EmployeeName){
        uniqueEmp.push(e)
      }
    }
    uniqueEmp.sort((x,y)=> y.MonthlyHours - x.MonthlyHours);
    return uniqueEmp;
  }

  calculateH(employees: Employee[]){
    let uniqEmployees = []; 
    for(let e of employees){
      uniqEmployees = employees.filter(x => x.EmployeeName == e.EmployeeName);
      e.MonthlyHours = this.hoursFunction(uniqEmployees);
    }
  }

  hoursFunction(employees: Employee[]){
    let hours : number = 0;
    for(let e of employees){
      e.Hours = Math.abs(new Date(e.StarTimeUtc).getHours() - new Date(e.EndTimeUtc).getHours());
      hours += e.Hours;
    }
    return hours;
  }


  createChart(employees: Employee[]){
    this.chart = new Chart(
      "pie",{
        type: "pie",
        data:{
          labels: employees.map(e=>e.EmployeeName),
          datasets:[
            {
              label:"Total Monthly Hours",
              data: employees.map(e=>e.MonthlyHours),
            }
          ]
        },
        options:{
          plugins: {
            legend: {
                display: true,
                position:'bottom'
            }
        }
        }
      })
  }
    
}


  
