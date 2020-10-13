import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialogData } from "../../models/confirmationDialogData";
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  dialogData: ConfirmationDialogData;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }

  ngOnInit(): void {
    this.dialogData = this.data;
  }

  confirmAct() {
    this.dialogRef.close("Confirm");
  }

  cancelAct() {
    this.dialogRef.close("Cancel");
  }

}
