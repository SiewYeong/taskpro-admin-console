import { Component, OnInit, ViewChild, Inject } from '@angular/core';
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
import { AuthService } from 'src/app/services/auth.service';
import { Profile } from 'src/app/models/profile';

@Component({
  selector: 'app-user-mgmt',
  templateUrl: './user-mgmt.component.html',
  styleUrls: ['./user-mgmt.component.scss']
})
export class UserMgmtComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'role', 'joined', 'status'];
  dataSource: MatTableDataSource<User>;
  users: User[] = [];
  currentUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private afs: AngularFirestore, public dialog: MatDialog, private userService: UserService) { 
    this.currentUser = JSON.parse(localStorage.getItem('user'));
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
        this.userService.updateUser(user,{
          status: user.status
        });
      }
    });
  }
  //STATUS: 0-active, 1-inactive, 2-deleted

  addAdmin() {
    var newUser = new User();
    newUser.status = 0;
    newUser.deleted_at = null;
    this.openDialog(newUser, 2);
  }

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
  currentUser: User;
  canbeUpdated: boolean;
  loading: boolean;

  constructor(public dialogRef: MatDialogRef<UserDetailDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogData, private userService: UserService, private authService: AuthService) {    
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.loading = false;
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
    if(this.fn==2) { // add
      this.userForm.addControl('password', new FormControl(null, [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-zA-Z]).{6,30})')]));
      this.userForm.addControl('confirm_password', new FormControl(null, [Validators.required]));
      this.userForm.addControl('role', new FormControl(this.user.role));
      //this.userForm.setValidators(this.checkPasswords);
    }
    this.canbeUpdated = (this.user.role=='user'&&this.currentUser.role!='helpdesk admin')||(this.user.role!='super admin'&&this.currentUser.role=='super admin');
  }

  get confirmPwdError() {
    let pwd = this.userForm.get('password').value;
    let confirmPwd = this.userForm.get('confirm_password').value;
    if(confirmPwd == '' || confirmPwd == null) {
      this.userForm.controls.confirm_password.setErrors({ required: true });
      return false;
    } else {
      if(pwd===confirmPwd){
        this.userForm.controls.confirm_password.setErrors(null);
        return false;
      } else {
        this.userForm.controls.confirm_password.setErrors({ notSame: true });
        return true;
      }
    }
  }

  // checkPasswords(group: FormGroup) {
  //   let pwd = group.get('password').value;
  //   let confirmPwd = group.get('confirm_password').value;
  //   if(confirmPwd == '' || confirmPwd == null) {
  //     return { notSame: false };
  //   } else {
  //     //return pwd === confirmPwd ? { notSame: false } : { notSame: true };
  //     if(pwd===confirmPwd){
  //       console.log("same!");
  //       return { notSame: false };
  //     } else {
  //       console.log("NOT same!");
  //       return { notSame: true };
  //     }
  //   }   
  // }

  updateStatus() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Edit Confirmation",
        message: "Are you sure you want to "+(this.user.status==0 ? "deactivate" : "activate")+" this user?",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        this.user.status = this.user.status==0 ? 1 : 0;
        this.userService.updateUser(this.user,{
          status: this.user.status
        });
      }
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
        message: "Are you sure you want to delete this user? This action cannot be undone.",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        this.loading = true;
        this.userService.deleteUser(this.user.id).then(
          () => {
            this.loading = false;
            this.closeDialog("refreshTable");
          }
        );
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.user.name = this.userForm.get('name').value;
    this.user.idnum = this.userForm.get('idnum').value;
    this.user.ph_num = this.userForm.get('ph_num').value;
    this.user.email = this.userForm.get('email').value;
    this.user.status = this.userForm.get('status').value;
    if(this.fn==1) { //edit
      this.userService.updateUser(this.user,{
        idnum: this.user.idnum,
        name: this.user.name,
        ph_num: this.user.ph_num,
        email: this.user.email,
        status: this.user.status
      }).then(
        () => {
          this.loading = false;
          this.closeDialog("refreshTable");
        }
      );
    } else { //add
      this.user.role = this.userForm.get('role').value;
      this.userService.addAdmin(this.user, this.userForm.get('password').value).then(
        () => {
          this.loading = false;
          this.closeDialog("refreshTable");
        }
      );
    }
  }

  closeDialog(msg: string = ""){
    this.dialogRef.close(msg);
  }

  openProfileDialog() {
    this.userService.getUserProfile(this.user.id).subscribe(result => {
      if(result!=null) {
        const dialogRef = this.dialog.open(UserProfileDialog, {
          data: result,
          height: "560px",
          width: "600px"
        });
      } else {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: "View Profile Message",
            message: "User's profile not found.",
            enableCancel: false
          },
          height: "260px",
          width: "360px"
        });
      }
    });
  }
}


@Component({
  selector: 'user-profile-dialog',
  templateUrl: './user-profile-dialog.html',
  styleUrls: ['./user-detail-dialog.scss']
})
export class UserProfileDialog implements OnInit{

  profile : Profile;

  constructor(public dialogRef: MatDialogRef<UserDetailDialog>, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: Profile, private userService: UserService) {    
  }

  ngOnInit() {
    this.profile = this.data;
  }

  closeDialog(msg: string = ""){
    this.dialogRef.close(msg);
  }
}