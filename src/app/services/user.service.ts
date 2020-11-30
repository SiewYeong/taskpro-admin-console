import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Profile } from '../models/profile';
import { AngularFireAuth } from '@angular/fire/auth';
import { DateAdapter } from '@angular/material/core';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  getAllUsers(): Observable<User[]> {
    const users = this.afs.collection<User>('users',ref => 
      ref.where('deleted_at', '==', null))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return users;
  }

  getUsersWithRoleUser(): Observable<User[]> {
    const users = this.afs.collection<User>('users',ref => 
      ref.where('deleted_at', '==', null).where('role', '==', 'user'))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return users;
  }

  getSuperAdmins(): Observable<User[]> {
    const users = this.afs.collection<User>('users',ref => 
      ref.where('deleted_at', '==', null).where('role', '==', 'super admin'))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return users;
  }

  getSupportAdmins(): Observable<User[]> {
    const users = this.afs.collection<User>('users',ref => 
      ref.where('deleted_at', '==', null).where('role', '==', 'support admin'))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return users;
  }

  getUser(userRef: any): Observable<User> {
    const user = this.afs.doc<User>(userRef).snapshotChanges().pipe(map(action => {
      return action.payload.data();
    }));
    return user;
  }

  getUserProfile(id: string): Observable<Profile> {
    const profile = this.afs.collection('profile').doc<Profile>(id).snapshotChanges().pipe(map(action => {
      return action.payload.data();
    }));
    return profile;
  }

  updateUser(user: User, data) {
    return this.afs.doc('users/'+user.id).update(data);
    // if(purpose=="status") {
    //   return this.afs.doc('users/'+user.id).update({
    //     status: user.status
    //   });
    // }
    // if(purpose=="delete") {
    //   return this.afs.doc('users/'+user.id).update({
    //     status: user.status,
    //     deleted_at: new Date()
    //   });
    // }
    // return this.afs.doc('users/'+user.id).update({
    //   idnum: user.idnum,
    //   name: user.name,
    //   ph_num: user.ph_num,
    //   email: user.email,
    //   status: user.status
    // });
  }

  addAdmin(user: User, pwd: string) {
    return new Promise((resolve, reject) => {
      var config = {
        apiKey: "AIzaSyAu01CyYNXvrPfsDGEyH76rEzdGTJiKO7o",
        authDomain: "taskpro-47370.firebaseapp.com",
        databaseURL: "https://taskpro-47370.firebaseio.com"
      }
      var secondaryApp = firebase.initializeApp(config, "Secondary")
      secondaryApp.auth().createUserWithEmailAndPassword(user.email, pwd).then(value => {
        console.log("User " + value.user.uid + " created successfully!");
        secondaryApp.auth().signOut();
        user.id = value.user.uid;
        user.joined = new Date();
        this.afs.collection('users').doc(user.id).set(Object.assign({}, user));
        resolve();
      }).catch(error => {
        console.log("Something went wrong: ", error);
      });
    });
    
    // return new Promise((resolve, reject) => {
    //   this.afAuth.createUserWithEmailAndPassword(user.email,user.password).then(value => {
    //     console.log("Success", value);
    //     user.id = value.user.uid;
    //     user.joined = new Date();
    //     return this.afs.collection('users').doc(user.id).set(Object.assign({}, user));
    //   }).catch(error => {
    //     console.log("Something went wrong: ", error);
    //   });
    // });
    // this.afAuth.authState.subscribe(authUser => {
    //   if(authUser) {
    //     user.id = authUser.uid;
    //     user.joined = new Date();
    //     return this.afs.collection('users').doc(user.id).set(Object.assign({}, user));
    //   } else {
    //     return null;
    //   }
    // });
  }

  deleteAdminFromAuth() {
    return new Promise((resolve, reject) => {
      var config = {
        apiKey: "AIzaSyAu01CyYNXvrPfsDGEyH76rEzdGTJiKO7o",
        authDomain: "taskpro-47370.firebaseapp.com",
        databaseURL: "https://taskpro-47370.firebaseio.com"
      }
      var secondaryApp = firebase.initializeApp(config, "Secondary")
      secondaryApp.auth().currentUser.delete().then(() => {
        console.log("User deleted successfully!");
        secondaryApp.auth().signOut();
        resolve();
      }).catch(error => {
        console.log("Something went wrong: ", error);
      });
    });
  }
}
