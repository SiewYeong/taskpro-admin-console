import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Report } from '../models/report';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private afs: AngularFirestore) { }

  getAllReport(): Observable<Report[]> {
    const reports = this.afs.collection<Report>('report',ref => 
      ref.orderBy('status',"desc"))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return reports;
  }

  getAssignToMeReports(): Observable<Report[]> {
    const currentUser = <User>JSON.parse(localStorage.getItem('user'));
    const reports = this.afs.collection<Report>('report',ref => 
      ref.where('status','==','Handling').where('assignTo','==',currentUser.id))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return reports;
  }

  getPendingReports(): Observable<Report[]> {
    const reports = this.afs.collection<Report>('report',ref => 
      ref.where('status','==','Pending'))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return reports;
  }

  getHandlingReports(): Observable<Report[]> {
    const reports = this.afs.collection<Report>('report',ref => 
      ref.where('status','==','Handling'))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return reports;
  }

  getCompletedReports(): Observable<Report[]> {
    const reports = this.afs.collection<Report>('report',ref => 
      ref.where('status','==','Completed'))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(c => c.payload.doc.data());
      }));
    return reports;
  }

  updateReport(report: Report, data) {
    return this.afs.doc('report/'+report.id).update(data);
  }
}
