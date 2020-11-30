import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Notification } from 'src/app/models/notification';
import { Report } from 'src/app/models/report';
import { User } from 'src/app/models/user';
import { NotifService } from 'src/app/services/notif.service';
import { ReportService } from 'src/app/services/report.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TaskDetailDialog } from '../task-mgmt/task-mgmt.component';
import { UserDetailDialog } from '../user-mgmt/user-mgmt.component';

@Component({
  selector: 'app-report-mgmt',
  templateUrl: './report-mgmt.component.html',
  styleUrls: ['./report-mgmt.component.scss']
})
export class ReportMgmtComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'category', 'subcategory', 'status'];
  assignToMeDataSource: MatTableDataSource<Report>;
  pendingDataSource: MatTableDataSource<Report>;
  handlingDataSource: MatTableDataSource<Report>;
  completedDataSource: MatTableDataSource<Report>;
  reports: Report[] = [];
  tabIndex: number;
  currentUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private reportService: ReportService, public dialog: MatDialog) { 
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit(): void {
    this.setupTable();
  }

  setupTable() {
    if(this.currentUser.role=='super admin'||this.currentUser.role=='support admin') {
      this.reportService.getAssignToMeReports().subscribe(result => {
        this.assignToMeDataSource = new MatTableDataSource(result);
        this.assignToMeDataSource.paginator = this.paginator;
        this.assignToMeDataSource.sort = this.sort;
      })
    }
    this.reportService.getPendingReports().subscribe(result => {
      this.pendingDataSource = new MatTableDataSource(result);
      this.pendingDataSource.paginator = this.paginator;
      this.pendingDataSource.sort = this.sort;
    })
    this.reportService.getHandlingReports().subscribe(result => {
      this.handlingDataSource = new MatTableDataSource(result);
      this.handlingDataSource.paginator = this.paginator;
      this.handlingDataSource.sort = this.sort;
    })
    this.reportService.getCompletedReports().subscribe(result => {
      this.completedDataSource = new MatTableDataSource(result);
      this.completedDataSource.paginator = this.paginator;
      this.completedDataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    switch(this.tabIndex) {
      case 0:
        this.assignToMeDataSource.filter = filterValue.trim().toLowerCase();
        this.assignToMeDataSource.filterPredicate = (data: Report, filter: string) => data.id.toLowerCase().indexOf(filter) != -1 || data.title.toLowerCase().indexOf(filter) != -1;
        if (this.assignToMeDataSource.paginator) {
          this.assignToMeDataSource.paginator.firstPage();
        }
        break;
      case 1:
        this.pendingDataSource.filter = filterValue.trim().toLowerCase();
        this.pendingDataSource.filterPredicate = (data: Report, filter: string) => data.id.toLowerCase().indexOf(filter) != -1 || data.title.toLowerCase().indexOf(filter) != -1;
        if (this.pendingDataSource.paginator) {
          this.pendingDataSource.paginator.firstPage();
        }
        break;
      case 2:
        this.completedDataSource.filter = filterValue.trim().toLowerCase();
        this.completedDataSource.filterPredicate = (data: Report, filter: string) => data.id.toLowerCase().indexOf(filter) != -1 || data.title.toLowerCase().indexOf(filter) != -1;
        if (this.completedDataSource.paginator) {
          this.completedDataSource.paginator.firstPage();
        }
        break;
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    this.tabIndex = tabChangeEvent.index
  }

  openReportDialog(report: Report) {
    const dialogRef = this.dialog.open(ReportDetailDialog, {
      data: report,
      height: "560px",
      width: "600px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="refreshTable") {
        this.setupTable();
      }
    });
  }

  updateStatus(report: Report) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: report.status!="Completed"?"Mark Complete Confirmation":"Unmark Complete Confirmation",
        message: report.status!="Completed"?"Are you sure you want to mark this report as completed?":"Are you sure you want to unmark this report as completed?",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        if(report.status!="Completed") {
          report.status = "Completed";
        } else {
          if(report.assignTo!=null) {
            report.status = "Handling";
          } else {
            report.status = "Pending";
          }
        }
        this.reportService.updateReport(report, {
          status: report.status
        });
      }
    });
  }

}

@Component({
  selector: 'report-detail-dialog',
  templateUrl: './report-detail-dialog.html',
  styleUrls: ['./report-detail-dialog.scss']
})
export class ReportDetailDialog implements OnInit {

  report: Report;
  assignToText: String;
  superadmins: User[];
  supportadmins: User[];

  constructor(public dialogRef: MatDialogRef<ReportDetailDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: Report, private reportService: ReportService, private taskService: TaskService, private userService: UserService, private notifService: NotifService) {  
  }

  ngOnInit() {
    this.report = this.data;
    this.assignToText = this.report.assignTo!=null ? this.report.assignTo : "Select an admin";
    this.userService.getSuperAdmins().subscribe(result => {
      this.superadmins = result;
    });
    this.userService.getSupportAdmins().subscribe(result => {
      this.supportadmins = result;
    });
  }

  assignTo(id: string, name: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Assign Report Confirmation",
        message: "Are you sure you want to assign this report to the selected admin?",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        this.report.assignTo = id;
        this.report.status = "Handling";
        this.reportService.updateReport(this.report, {
          assignTo: this.report.assignTo,
          status: this.report.status
        });
        var notif = new Notification();
        notif.sentTo = this.report.createdBy.id;
        notif.sentAt = new Date();
        notif.title = "Report In Progress";
        notif.content = "Your report (ID: "+this.report.id+") has been assigned to admin "+name+".";
        this.notifService.addNotif(notif, null, true);
      }
    });
  }

  updateStatus() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Mark Complete Confirmation",
        message: "Are you sure you want to mark this report as completed? This action cannot be undone.",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        this.report.status = "Completed";
        this.reportService.updateReport(this.report, {
          status: this.report.status
        });
        var notif = new Notification();
        notif.sentTo = this.report.createdBy.id;
        notif.sentAt = new Date();
        notif.title = "Report Marked As Completed";
        notif.content = "Your report (ID: "+this.report.id+") has been marked as completed by the admin.";
        this.notifService.addNotif(notif, null, true);
      }
    });
  }

  closeDialog(msg: string = ""){
    this.dialogRef.close(msg);
  }

  openTaskDialog(taskRef: any) {
    this.taskService.getTask(taskRef).subscribe(result => {
      const dialogRef = this.dialog.open(TaskDetailDialog, {
        data: result,
        height: "560px",
        width: "600px"
      });
    });
  }

  openUserDialog(userRef: any) {
    this.userService.getUser(userRef).subscribe(result => {
      const dialogRef = this.dialog.open(UserDetailDialog, {
        data: {
          user: result,
          dialogFn: 0
        },
        height: "560px",
        width: "600px"
      });
    });
  }

}