import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs: AngularFirestore) { }

  getAllUsers(): Observable<User[]> {
    const users = this.afs.collection<User>('users',ref => 
      ref.where('status', '!=', 2))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return users;
  }

  updateUser(user: User, only: string) {
    if(only=="status") {
      return this.afs.doc('users/'+user.id).update({
      status: user.status
    });
    }
    return this.afs.doc('users/'+user.id).update({
      idnum: user.idnum,
      name: user.name,
      ph_num: user.ph_num,
      email: user.email,
      status: user.status
    });
  }

  addUser(user: User) {
    user.id = this.afs.createId();
    user.joined = new Date();
    return this.afs.collection('users').doc(user.id).set(Object.assign({}, user));
  }
}
