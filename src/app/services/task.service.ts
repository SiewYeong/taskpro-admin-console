import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { map } from 'rxjs/operators';
import { ActionSequence } from 'protractor';
import { Debit } from '../models/debit';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private afs: AngularFirestore) { }

  getAllTask(): Observable<Task[]> {
    const tasks = this.afs.collection<Task>('task', ref =>
      ref.where('status','!=','Draft')
    ).snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return tasks;
  }

  getTask(taskRef: any): Observable<Task> {
    const task = this.afs.doc<Task>(taskRef).snapshotChanges().pipe(map(action => {
      return action.payload.data();
    }));
    return task;
  }

  updateTask(task: Task, data) {
    return this.afs.doc('task/'+task.id).update(data);
  }

  refund(task: Task) {
    var debit = new Debit();
    debit.amount = task.fee;
    debit.category = "Refund";
    debit.payout = false;
    debit.status = "Success"
    debit.taskRef = "/task/"+task.id;
    debit.createdAt = new Date();
    return this.afs.collection('wallet').doc(task.created_by.id).collection('debit').add(Object.assign({}, debit));
  }
}
