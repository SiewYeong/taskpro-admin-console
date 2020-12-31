import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, public dialog: MatDialog, private spinnerService: SpinnerService) {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        this.afs.doc<User>('users/'+user.uid).valueChanges().subscribe(doc => {
          this.user = doc;
          localStorage.setItem('user', JSON.stringify(this.user));
        });
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  login(email: string, password: string) {
    this.spinnerService.show();
    const users = this.afs.collection<User>('users',ref => ref.where('email', '==', email).limit(1)).valueChanges();
    users.subscribe(u => {
      if(u.length!=0) {
        if(u.pop().status==0) {
          this.afAuth.signInWithEmailAndPassword(email, password).then(value => {
            console.log("Login successfully."+value);
            this.router.navigateByUrl('/dashboard');
            this.spinnerService.hide();
          }).catch(err => {
            if(err.code == "auth/wrong-password") {
              this.openMessageDialog("Password is invalid.");
            } else {
              this.openMessageDialog(err.message);
            }
            this.spinnerService.hide();
          });
        } else {
          this.openMessageDialog("User has been deactivated or deleted.");
          this.spinnerService.hide();
        }
      } else {
        this.openMessageDialog("Email not found.")
        this.spinnerService.hide();
      }
    });
  }

  private openMessageDialog(msg: string) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Login Message",
        message: msg,
        enableCancel: false
      },
      height: "260px",
      width: "360px"
    });
  }

  logout() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
      console.log("Done logout!");
    });
  }

  get isLoggedIn(): boolean {
    var currentUser = JSON.parse(localStorage.getItem('user'));
    return currentUser !== null;
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider);
  }
}
