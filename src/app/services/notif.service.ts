import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotifService {

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) { }

  getAllNotif(): Observable<Notification[]> {
    const notifs = this.afs.collection<Notification>('notification', ref => 
    ref.where('createdBy','!=',null)
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(c => c.payload.doc.data());
    }));
    return notifs;
  }

  addNotif(notif: Notification, imgFile: File, auto: boolean) {
    const promise = this.generateId(notif).then(() => {
      this.uploadTaskPromise(imgFile, notif).then(() => {
        if(!auto) {
          notif.createdBy = this.afs.doc('users/' + JSON.parse(localStorage.getItem('user')).id).ref;
          notif.createdAt = new Date();
        }
        return this.afs.collection('notification').doc(notif.id).set(Object.assign({}, notif));
      })
    });
    return promise;
  }

  updateNotif(notif: Notification, data) {
    return this.afs.doc('notification/'+notif.id).update(data);
  }

  deleteNotif(notif: Notification) {
    return this.afs.collection("notification").doc(notif.id).delete().then(function() {
      console.log("Notification successfully deleted!");
    }).catch(function(error) {
      console.error("Error deleting notification: ", error);
    });
  }

  async generateId(notif: Notification) {
    return new Promise((resolve, reject) => {
      notif.id = this.afs.createId();
      resolve();
    });
  }

  async uploadTaskPromise(imgFile: File, notif: Notification) {
    return new Promise((resolve, reject) => {
      if(imgFile!=null) {
        const filePath = 'NotifImages/'+notif.id;
        const uploadTask = this.storage.upload(filePath, imgFile);
        uploadTask.snapshotChanges().pipe(finalize(()=> {
          this.storage.ref(filePath).getDownloadURL().subscribe(
            res => {
              notif.imageHeader = res as string;
              console.log(res);
              resolve();
            }, err => reject());
        })).subscribe();
      } else {
        resolve();
      }
    });
  }
}
