import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'taskpro-admin-console';
  @ViewChild('sidenav') sidenav: MatSidenav;
  MENUS = [
    { id: 1, name: 'Dashboard', naviPath: '/dashboard' },
    { id: 2, name: 'Task Management', naviPath: '/task-mgmt' },
    { id: 3, name: 'User Management', naviPath: '/user-mgmt' },
    { id: 4, name: 'Report Management', naviPath: '/report-mgmt' },
    { id: 5, name: 'Account Setting', naviPath: '/acc-setting'},
    { id: 6, name: 'Logout', naviPath: null }
  ];

  toggle() {
    this.sidenav.toggle();
  }
}
