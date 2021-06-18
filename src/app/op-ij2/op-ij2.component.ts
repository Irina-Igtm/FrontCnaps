import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-op-ij2',
  templateUrl: './op-ij2.component.html',
  styleUrls: ['./op-ij2.component.css']
})
export class OpIj2Component implements OnInit {
  lienRetour = "ij2-pf"; 
  enPDF = false;
  
  constructor() { }

  ngOnInit(): void {
    document.title = "OP - IJ2";
  }

}
