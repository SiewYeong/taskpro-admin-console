import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { map } from 'rxjs/operators';
import { ActionSequence } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private afs: AngularFirestore) { }

  getAllTask(): Observable<Task[]> {
    const tasks = this.afs.collection<Task>('task').snapshotChanges().pipe(map(actions => {
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
}
