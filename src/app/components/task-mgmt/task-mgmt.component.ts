import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from "@angular/common";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/firestore';
import { Task } from '../../models/task';

export class Author {
  name: string;
  profile_pic: string;
  constructor() {}
}
export class Provider {
  name: string;
  constructor() {}
}

@Component({
  selector: 'app-task-mgmt',
  templateUrl: './task-mgmt.component.html',
  styleUrls: ['./task-mgmt.component.scss']
})
export class TaskMgmtComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'consumer', 'provider', 'status'];
  dataSource: MatTableDataSource<Task>;
  tasks: Task[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private afs: AngularFirestore, private location: Location) { 
  }

  ngOnInit() {
    this.afs.collection<any>('task').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(this.tasks);
      for(let i of data) {
        let task: Task = new Task();
        task.id = i.id;
        task.title = i.title;
        task.content = i.description ?? '-';
        if(i.author != null) {
          let author: Author = i.author;
          task.consumer = author.name ?? '-';
        }
        if(i.service_provider != null) {
          let provider: Provider = i.service_provider;
          task.provider = provider.name ?? '-';
        }
        task.status = i.status;
        this.tasks.push(task);
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // back(){
  //   this.location.back();
  // }

}