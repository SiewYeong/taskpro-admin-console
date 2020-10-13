import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { NgMaterialModule } from './ng-material/ng-material.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaskMgmtComponent } from './components/task-mgmt/task-mgmt.component';
import { UserMgmtComponent } from './components/user-mgmt/user-mgmt.component';
import { ReportMgmtComponent } from './components/report-mgmt/report-mgmt.component';
import { AccSettingComponent } from './components/acc-setting/acc-setting.component';
import { UserDetailDialog } from './components/user-mgmt/user-mgmt.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TaskMgmtComponent,
    UserMgmtComponent,
    ReportMgmtComponent,
    AccSettingComponent,
    UserDetailDialog,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    RouterModule.forRoot([
      { path: 'dashboard', component: DashboardComponent },
      { path: 'task-mgmt', component: TaskMgmtComponent },
      { path: 'user-mgmt', component: UserMgmtComponent },
      { path: 'report-mgmt', component: ReportMgmtComponent },
      { path: 'acc-setting', component: AccSettingComponent },
      { path: '',   redirectTo: '/dashboard', pathMatch: 'full' },
      { path: '**', component: DashboardComponent },
    ]),
    ReactiveFormsModule
  ],
  entryComponents: [UserDetailDialog, ConfirmationDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
