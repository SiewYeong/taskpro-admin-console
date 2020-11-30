import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogData } from 'src/app/models/dialogData';
import { Notification } from 'src/app/models/notification';
import { User } from 'src/app/models/user';
import { NotifService } from 'src/app/services/notif.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { UserDetailDialog } from '../user-mgmt/user-mgmt.component';

@Component({
  selector: 'app-notif-mgmt',
  templateUrl: './notif-mgmt.component.html',
  styleUrls: ['./notif-mgmt.component.scss']
})
export class NotifMgmtComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'sentTo', 'sentAt'];
  dataSource: MatTableDataSource<Notification>;
  notifs: Notification[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private notifService: NotifService) { }

  ngOnInit(): void {
    this.setupTable();
  }

  setupTable() {
    this.notifService.getAllNotif().subscribe(result => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Notification, filter: string) => data.id.toLowerCase().indexOf(filter) != -1 || data.title.toLowerCase().indexOf(filter) != -1;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openNotifDialog(notif, dialogFn) {
    const dialogRef = this.dialog.open(NotifDetailDialog, {
      data: {
        notif: notif,
        dialogFn: dialogFn
      },
      height: "560px",
      width: "600px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="refreshTable") {
        this.setupTable();
      }
    });
  }

  addNotif() {
    var newNotif = new Notification();
    this.openNotifDialog(newNotif, 2);
  }

}

@Component({
  selector: 'notif-detail-dialog',
  templateUrl: './notif-detail-dialog.html',
  styleUrls: ['./notif-detail-dialog.scss']
})
export class NotifDetailDialog implements OnInit{

  notif : Notification;
  fn: number; // 0-view, 1-edit, 2-add 
  notifForm: FormGroup;
  imageFile: File;
  url: any;
  users: User[];
  sentToOptions: Array<User>;

  constructor(public dialogRef: MatDialogRef<NotifDetailDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogData, private notifService: NotifService, private userService: UserService) { }

  ngOnInit() {
    this.notif = this.data.notif;
    this.fn = this.data.dialogFn;
    this.setupForm();
  }

  setupForm() {
    if(this.fn!=0) {
      this.notifForm = new FormGroup({
        sentTo: new FormControl(this.notif.sentTo, Validators.required),
        sentAt: new FormControl(this.notif.sentAt!=null ? this.notif.sentAt.toDate() : new Date(), Validators.required),
        title: new FormControl(this.notif.title, Validators.required),
        content: new FormControl(this.notif.content, Validators.required)
      });
      this.userService.getUsersWithRoleUser().subscribe(result => {
        this.users = result;
        this.sentToOptions = this.users;
      });
      this.url = this.notif.imageHeader;
    }
  }

  edit() {
    this.fn = 1;
    this.setupForm();
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete Confirmation",
        message: "Are you sure you want to delete this notification? This action cannot be undone.",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        this.notifService.deleteNotif(this.notif).then(
          () => {
            this.closeDialog("refreshTable");
          }
        );
      }
    });
  }

  onKey(value) { 
    this.sentToOptions = []; 
    let filter = value.toLowerCase();
    for(let i=0 ; i<this.users.length; i++) {
      let option = this.users[i];
      if(option.id.toLowerCase().indexOf(filter) >= 0) {
        this.sentToOptions.push(option);
      }
    }      
  }

  onFileSelected(event) {
    this.imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.imageFile);
    reader.onload = () => {
      this.url = reader.result;
    }
  }

  onSubmit() {
    this.notif.sentTo = this.notifForm.get('sentTo').value;
    this.notif.sentAt = this.notifForm.get('sentAt').value;
    this.notif.title = this.notifForm.get('title').value;
    this.notif.content = this.notifForm.get('content').value;
    if(this.fn==1) { //edit
      this.notifService.uploadTaskPromise(this.imageFile, this.notif).then(() => {
        this.notifService.updateNotif(this.notif,{
          sentTo: this.notif.sentTo,
          sentAt: this.notif.sentAt,
          title: this.notif.title,
          content: this.notif.content,
          imageHeader: this.notif.imageHeader
        }).then(
          () => {
            this.closeDialog("refreshTable");
          }
        );
      });
    } else { //add
      this.notifService.addNotif(this.notif, this.imageFile, false).then(
        () => {
          this.closeDialog("refreshTable");
        }
      );
    }
  }

  closeDialog(msg: string = ""){
    this.dialogRef.close(msg);
  }

  openUserDialog(userRef: any) {
    if(!new String(userRef).includes("Object")) {
      userRef = "/users/"+userRef;
    }
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