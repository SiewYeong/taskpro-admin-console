import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Task } from '../../models/task';
import { TaskService } from 'src/app/services/task.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { UserDetailDialog } from '../user-mgmt/user-mgmt.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NotifService } from 'src/app/services/notif.service';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-task-mgmt',
  templateUrl: './task-mgmt.component.html',
  styleUrls: ['./task-mgmt.component.scss']
})
export class TaskMgmtComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'author', 'status'];
  dataSource: MatTableDataSource<Task>;
  tasks: Task[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private taskService: TaskService, public dialog: MatDialog) { 
  }

  ngOnInit() {
    this.setupTable();
  }

  setupTable() {
    this.taskService.getAllTask().subscribe(result => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Task, filter: string) => data.id.toLowerCase().indexOf(filter) != -1 || data.title.toLowerCase().indexOf(filter) != -1;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openTaskDialog(task) {
    const dialogRef = this.dialog.open(TaskDetailDialog, {
      data: task,
      height: "560px",
      width: "600px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="refreshTable") {
        this.setupTable();
      }
    });
  }

}

@Component({
  selector: 'task-detail-dialog',
  templateUrl: './task-detail-dialog.html',
  styleUrls: ['./task-detail-dialog.scss']
})
export class TaskDetailDialog implements OnInit {

  task: Task;
  providerId: string;

  constructor(public dialogRef: MatDialogRef<TaskDetailDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: Task, private taskService: TaskService, private userService: UserService, private notifService: NotifService) {    
  }

  ngOnInit() {
    this.task = this.data;
    if(this.task.offered_by!=null&&this.task.offered_by!="") {
      this.providerId = this.task.offered_by.id;
    }
  }

  cancelTask() {
    var refund = this.task.status=="Ongoing";
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Cancel Confirmation",
        message: "Are you sure you want to cancel this task"+(refund?" and approve refund":"")+"? This action cannot be undone.",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        this.task.status = "Cancelled";
        this.taskService.updateTask(this.task,{
          status: this.task.status
        });
        if(refund) {
          this.taskService.refund(this.task);
        }
        var notif = new Notification();
        notif.sentTo = this.task.created_by.id;
        notif.sentAt = new Date();
        notif.title = "Task is Cancelled";
        notif.content = "Your task (ID: "+this.task.id+") has been cancelled by the admin."+(refund?" Your money has been refunded to your wallet.":"");
        this.notifService.addNotif(notif, null, true);
      }
    });
  }

  closeDialog(msg: string = ""){
    this.dialogRef.close(msg);
  }

  openUserDialog(userRef: any) {
    this.userService.getUser(userRef).subscribe(result => {
      if(result!=null) {
        const dialogRef = this.dialog.open(UserDetailDialog, {
          data: {
            user: result,
            dialogFn: 0
          },
          height: "560px",
          width: "600px"
        });
      } else {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: "View User Message",
            message: "User not found.",
            enableCancel: false
          },
          height: "260px",
          width: "360px"
        });
      }
    });
  }
}