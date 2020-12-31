import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { browser } from 'protractor';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-acc-setting',
  templateUrl: './acc-setting.component.html',
  styleUrls: ['./acc-setting.component.scss']
})
export class AccSettingComponent implements OnInit {

  user: User;
  editName: boolean;
  editIdnum: boolean;
  editPhnum: boolean;
  nameFormControl: FormControl;
  idnumFormControl: FormControl;
  phnumFormControl: FormControl;

  constructor(private userService: UserService, public dialog: MatDialog, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.initializeEditValue();
  }

  initializeEditValue() {
    this.editName = false;
    this.editIdnum = false;
    this.editPhnum = false;
  }

  changeEditValue(field: String) {
    switch(field) {
      case "name":
        if(!this.editName) {
          this.initializeEditValue();
          this.nameFormControl = new FormControl(this.user.name, Validators.required);
        }
        this.editName = !this.editName;
        break;
      case "idnum":
        if(!this.editIdnum) {
          this.initializeEditValue();
          this.idnumFormControl = new FormControl(this.user.idnum, Validators.required);
        }
        this.editIdnum = !this.editIdnum;
        break;
      case "phnum":
        if(!this.editPhnum) {
          this.initializeEditValue();
          this.phnumFormControl = new FormControl(this.user.ph_num, Validators.required);
        }
        this.editPhnum = !this.editPhnum;
        break;
    }
  }

  save(field: String) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Update Confirmation",
        message: "Are you sure you want to update your "+field+"?",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    switch(field) {
      case "user name":
        dialogRef.afterClosed().subscribe(result => {
          if(result=="Confirm") {
            this.user.name = this.nameFormControl.value;
            this.userService.updateUser(this.user,{
              name: this.user.name
            }).then(() => {
              console.log("Done update user name.");
              this.ngOnInit();
            });
          }
        });
        break;
      case "IC/passport no.":
        dialogRef.afterClosed().subscribe(result => {
          if(result=="Confirm") {
            this.user.idnum = this.idnumFormControl.value;
            this.userService.updateUser(this.user,{
              idnum: this.user.idnum
            }).then(() => {
              console.log("Done update IC/passport no.");
              this.ngOnInit();
            });
          }
        });
        break;
      case "contact no.":
        dialogRef.afterClosed().subscribe(result => {
          if(result=="Confirm") {
            this.user.ph_num = this.phnumFormControl.value;
            this.userService.updateUser(this.user,{
              ph_num: this.user.ph_num
            }).then(() => {
              console.log("Done update contact no.");
              this.ngOnInit();
            });
          }
        });
        break;
    }
  }

  sendPwdResetEmail() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Password Reset Confirmation",
        message: "Are you sure you want to reset your password? A password reset email will be sent to "+this.user.email+".",
        enableCancel: true
      },
      height: "260px",
      width: "360px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result=="Confirm") {
        this.afAuth.sendPasswordResetEmail(this.user.email).then(() => {
          this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: "Account Setting Message",
              message: "A password reset email is sent to "+this.user.email+".",
              enableCancel: false
            },
            height: "260px",
            width: "360px"
          });
        }, err => {
          this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: "Account Setting Message",
              message: "Unable to send password reset email to "+this.user.email+".",
              enableCancel: false
            },
            height: "260px",
            width: "360px"
          });
        });
      }
    });
  }

}
