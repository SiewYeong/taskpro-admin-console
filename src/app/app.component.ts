import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from './services/auth.service';
import { SpinnerService } from './services/spinner.service';

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
    { id: 5, name: 'Notification Management', naviPath: '/notif-mgmt' },
    { id: 6, name: 'Account Setting', naviPath: '/acc-setting'},
    { id: 7, name: 'Logout', naviPath: null }
  ];
  selectedMenuId: number;
  logoutMenuId = 7;
  loading: boolean;

  constructor(public authService: AuthService, private spinnerService: SpinnerService) {
    this.spinnerService.spinnerActive.subscribe(showSpinner => {
      this.loading = showSpinner;
    });
  }

  toggle(menu) {
    this.sidenav.toggle();
    if(menu.id == this.logoutMenuId) {
      this.authService.logout();
    }
  }
}
