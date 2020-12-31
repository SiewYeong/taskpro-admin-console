import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { NgMaterialModule } from './ng-material/ng-material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskDetailDialog, TaskMgmtComponent } from './components/task-mgmt/task-mgmt.component';
import { UserDetailDialog, UserMgmtComponent, UserProfileDialog } from './components/user-mgmt/user-mgmt.component';
import { ReportDetailDialog, ReportMgmtComponent } from './components/report-mgmt/report-mgmt.component';
import { AccSettingComponent } from './components/acc-setting/acc-setting.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { LoginComponent, ForgotPwdDialog } from './components/login/login.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { NotifMgmtComponent, NotifDetailDialog } from './components/notif-mgmt/notif-mgmt.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TaskMgmtComponent,
    UserMgmtComponent,
    ReportMgmtComponent,
    AccSettingComponent,
    UserDetailDialog,
    UserProfileDialog,
    TaskDetailDialog,
    ReportDetailDialog,
    ConfirmationDialogComponent,
    LoginComponent,
    NotifMgmtComponent,
    NotifDetailDialog,
    ForgotPwdDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate:[AngularFireAuthGuard] },
      { path: 'task-mgmt', component: TaskMgmtComponent, canActivate:[AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
      { path: 'user-mgmt', component: UserMgmtComponent, canActivate:[AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
      { path: 'report-mgmt', component: ReportMgmtComponent, canActivate:[AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
      { path: 'notif-mgmt', component: NotifMgmtComponent, canActivate:[AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
      { path: 'acc-setting', component: AccSettingComponent, canActivate:[AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
      { path: '',   redirectTo: '/login', pathMatch: 'full' },
      { path: '**', component: LoginComponent },
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule
  ],
  entryComponents: [UserDetailDialog, UserProfileDialog, TaskDetailDialog, ReportDetailDialog, NotifDetailDialog, ConfirmationDialogComponent, ForgotPwdDialog],
  providers: [AngularFireAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
