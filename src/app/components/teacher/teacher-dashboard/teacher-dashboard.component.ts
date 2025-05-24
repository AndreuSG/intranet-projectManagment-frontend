import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { CardModule } from 'primeng/card';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [CommonModule, RouterModule, CardModule, Button],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent {
  dashboardItems = [
    { title: "Control d'assistència", description: "Registra l'assistència de les teves classes.", image: "assets/attendance.jpg", buttonText: "PASSAR LLISTA", link: "/teacher/control-assistencia" },
    { title: "Projectes centre", description: "Administra els projectes dels teus grups.", image: "assets/projects.jpg", buttonText: "GESTIONAR PROJECTES" , link: "/teacher/projectes"},
    { title: "Rúbriques", description: "Gestiona les rúbriques pels teus grups.", image: "assets/rubrics.jpg", buttonText: "GESTIONAR RÚBRIQUES", link: "/teacher/rubriques" },
    { title: "Bústia de propostes", description: "Revisa les propostes dels teus alumnes.", image: "assets/proposal.jpg", buttonText: "VEURE PROPOSTES", link: "/teacher/propostes" },
    { title: "Calendari", description: "Estableix les dates d'assignatures i projectes.", image: "assets/calendar.jpg", buttonText: "GESTIONAR CALENDARI", link: "/teacher/calendari" },
    { title: "Informes", description: "Consulta els informes d'assistència i de progrés.", image: "assets/reports.jpg", buttonText: "VEURE INFORMES" , link: "/teacher/informes"},
  ];
}
