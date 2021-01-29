import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Profile } from '../models/profile';
import * as firebase from 'firebase';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private config = {
    apiKey: "AIzaSyAu01CyYNXvrPfsDGEyH76rEzdGTJiKO7o",
    authDomain: "taskpro-47370.firebaseapp.com",
    databaseURL: "https://taskpro-47370.firebaseio.com"
  };
  private secondaryApp = firebase.initializeApp(this.config, "Secondary");

  constructor(private afs: AngularFirestore,  public http: HttpClient) { }

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
    return new Promise<void>((resolve, reject) => {
      this.secondaryApp.auth().createUserWithEmailAndPassword(user.email, pwd).then(value => {
        console.log("User " + value.user.uid + " created successfully!");
        this.secondaryApp.auth().signOut();
        user.id = value.user.uid;
        user.joined = new Date();
        this.afs.collection('users').doc(user.id).set(Object.assign({}, user));
        resolve();
      }).catch(error => {
        console.log("Something went wrong: ", error);
      });
    });
  }

  deleteUser(uid: string) {
    let url = "https://us-central1-taskpro-47370.cloudfunctions.net/deleteUserById";
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return this.http.post(url, {"uid": uid}, {headers}).toPromise().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }
}
