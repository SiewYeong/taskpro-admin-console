import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Location } from "@angular/common";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models/user';
import { DialogData } from '../../models/dialogData';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export class Author {
  name: string;
  profile_pic: string;
  constructor() {}
}
export class Provider {
  name: string;
  constructor() {}
}

@Component({
  selector: 'app-user-mgmt',
  templateUrl: './user-mgmt.component.html',
  styleUrls: ['./user-mgmt.component.scss']
})
export class UserMgmtComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'role', 'joined', 'status'];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private afs: AngularFirestore, private location: Location, public dialog: MatDialog, private userService: UserService) { 
  }

  ngOnInit() {
    this.setupTable();
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  setupTable() {
    this.userService.getAllUsers().subscribe(result => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: User, filter: string) => data.id.toLowerCase().indexOf(filter) != -1 || data.name.toLowerCase().indexOf(filter) != -1;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(user, dialogFn) {
    const dialogRef = this.dialog.open(UserDetailDialog, {
      data: {
        user: user,
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

  updateStatus(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Edit Confirmation",
        message: "Are you sure you want to "+(user.status==0 ? "deactivate" : "activate")+" this user?",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        user.status = user.status==0 ? 1 : 0;
        this.userService.updateUser(user,"status");
      }
    });
  }
  //STATUS: 0-active, 1-inactive, 2-deleted

  addUser() {
    // can only add ADMIN user
    var newUser = new User();
    newUser.role = "admin";
    newUser.status = 0;
    this.openDialog(newUser, 2);
  }

  // back(){
  //   this.location.back();
  // }

}

@Component({
  selector: 'user-detail-dialog',
  templateUrl: './user-detail-dialog.html',
  styleUrls: ['./user-detail-dialog.scss']
})
export class UserDetailDialog implements OnInit{

  user : User;
  fn: number; // 0-view, 1-edit, 2-add 
  userForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<UserDetailDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogData, private userService: UserService) {    
  }

  ngOnInit() {
    this.user = this.data.user;
    this.fn = this.data.dialogFn;
    this.userForm = new FormGroup({
      name: new FormControl(this.user.name, Validators.required),
      idnum: new FormControl(this.user.idnum, Validators.required),
      ph_num: new FormControl(this.user.ph_num, Validators.required),
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      status: new FormControl(this.user.status)
    });
  }

  changeStatus() {
    this.userForm.controls.status.setValue(this.userForm.get('status').value==0 ? 1:0);
  }

  edit() {
    this.fn = 1;
  }

  delete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete Confirmation",
        message: "Are you sure you want to delete this user?",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        this.user.status = 2;
        this.userService.updateUser(this.user,"status").then(
          () => {
            this.closeDialog("refreshTable");
          }
        );
      }
    });
  }

  onSubmit() {
    this.user.name = this.userForm.get('name').value;
    this.user.idnum = this.userForm.get('idnum').value;
    this.user.ph_num = this.userForm.get('ph_num').value;
    this.user.email = this.userForm.get('email').value;
    this.user.status = this.userForm.get('status').value;
    if(this.fn==1) { //edit
      this.userService.updateUser(this.user,"all").then(
        () => {
          this.closeDialog("refreshTable");
        }
      );
    } else { //add
      this.userService.addUser(this.user).then(
        () => {
          this.closeDialog("refreshTable");
        }
      );
    }
  }

  closeDialog(msg: string = ""){
    this.dialogRef.close(msg);
  }
}