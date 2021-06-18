import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ij2ServiceService } from '../../services/ij2-service.service';


declare var $: any;

@Component({
  selector: 'app-modif-info-recu-pf',
  templateUrl: './modif-info-recu-pf.component.html',
  styleUrls: ['./modif-info-recu-pf.component.css']
})
export class ModifInfoRecuPfComponent implements OnInit {
  accessToken : any;
  idToken : any;
  @Input() referenceDmd;
  @Output() modifTermine = new EventEmitter();
  listeChamps;
  enCours = false;

  constructor(private ij2srvc : Ij2ServiceService) { }

  ngOnInit() {
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;
    this.ij2srvc.prendInfoRecuParIdAccPF("42202062118342", this.idToken).subscribe(liste=>{
      if(liste.status == 200){
        this.listeChamps = liste.body;
      }
    });
  }

  validerModification() {
    this.enCours = true;
    this.ij2srvc.modifierInfoRecuParIdAccPF(this.listeChamps,this.idToken).subscribe(res=>{
      if(res.status == 200){
        this.modifTermine.emit(true);

      } else {
        this.modifTermine.emit(false);
      }
      this.enCours = false;
      $('#btn-fermer-modif-pf').click();
    });
    //this.prestationFamilialeService
  }

}
