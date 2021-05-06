import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data) { }

  ngOnInit(): void {
  }

  dismiss(){
    console.log(this.data);
    this.data.preClose();
  }
}
