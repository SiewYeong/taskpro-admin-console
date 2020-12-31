import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, public dialog: MatDialog, private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  onSubmit(formData: NgForm) {
    if(formData.valid) {
      this.authService.login(formData.value.email, formData.value.password);
    }
  }

  forgotPassword() {
    this.dialog.open(ForgotPwdDialog, {
      height: "310px",
      width: "360px"
    });
  }

}

@Component({
  selector: 'forgot-pwd-dialog',
  templateUrl: './forgot-pwd-dialog.html',
  styleUrls: ['./forgot-pwd-dialog.scss']
})
export class ForgotPwdDialog implements OnInit{

  constructor(public dialogRef: MatDialogRef<ForgotPwdDialog>, public dialog: MatDialog, private afAuth: AngularFireAuth) { }

  ngOnInit() {

  }

  onSubmit(formData: NgForm) {
    if(formData.valid) {
      let email = formData.value.email;
      this.afAuth.sendPasswordResetEmail(email).then(() => {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: "Forgot Password Message",
            message: "A password reset email is sent to "+email+".",
            enableCancel: false
          },
          height: "260px",
          width: "360px"
        });
      }, err => {
        this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: "Forgot Password Message",
            message: "Unable to send password reset email to "+email+".",
            enableCancel: false
          },
          height: "260px",
          width: "360px"
        });
      });
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

}