import { Routes } from "@angular/router";
import { RoleGuard } from "../core/role.guard";

export const TEACHER_ROUTES: Routes = [
   {
      path: '',
      loadComponent: () => import('../pages/teacher/teacher.component').then(mod => mod.TeacherComponent),
      canActivate: [RoleGuard],
      data: { roles: ['profe'] }
   },
   {
      path: 'control-assistencia',
      loadComponent: () => import('../pages/teacher/attendance/attendance.component').then(mod => mod.AttendanceComponent),
      canActivate: [RoleGuard],
      data: { roles: ['profe'] }
   },
   {
      path: 'projectes',
      loadComponent: () => import('../pages/teacher/project/project.component').then(mod => mod.ProjectComponent),
      canActivate: [RoleGuard],
      data: { roles: ['profe'] }
   },
   { 
      path: 'projectes/:tab/:id', 
      loadComponent: () => import('../pages/teacher/project/project-detail/project-detail.component').then(mod => mod.ProjectDetailComponent),
      canActivate: [RoleGuard],
      data: { roles: ['profe'] }
   },
   { 
      path: 'rubriques',
      loadComponent: () => import('../pages/teacher/rubrics/rubrics.component').then(mod => mod.RubricsComponent),
      canActivate: [RoleGuard],
      data: { roles: ['profe'] }
   },
   {
      path: 'rubriques/:id',
      loadComponent: () => import('../pages/teacher/rubrics/rubrics-group-detail/rubrics-detail.component').then(mod => mod.RubricsDetailComponent),
      canActivate: [RoleGuard],
      data: { roles: ['profe'] }
   },
   {
      path: 'calendari',
      loadComponent: () => import('../pages/teacher/calendar/calendar.component').then(mod => mod.CalendarComponent),
      canActivate: [RoleGuard],
      data: { roles: ['profe'] }
   }
]