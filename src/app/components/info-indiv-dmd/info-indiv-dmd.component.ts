import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ij2ServiceService } from '../../services/ij2-service.service';
import { TraitementService } from '../../services/traitement/traitement.service';


@Component({
  selector: 'app-info-indiv-dmd',
  templateUrl: './info-indiv-dmd.component.html',
  styleUrls: ['./info-indiv-dmd.component.css']
})
export class InfoIndivDmdComponent implements OnInit {

  @Input() idIndividu;
  @Output() indivTrouve = new EventEmitter();

	Individu;
  accessToken : any ;
  idToken : any ;

  constructor(
    private ij2srvc : Ij2ServiceService,
    private traitSrvc: TraitementService,

    ) { }

  ngOnInit() {
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;
  	let that = this;
  	let observIndiv = that.traitSrvc.infoIndividu(this.idIndividu,this.idToken ).subscribe(obsIndivWS=>{
      let obsIndiv = that.traitSrvc.transformeWSReponse(obsIndivWS);
  		if(obsIndiv.success){
        that.Individu = obsIndiv.msg;
        that.indivTrouve.emit(obsIndiv.msg);
      }
      observIndiv.unsubscribe();
  	});
  }

  voirCIT() {
    const url = '/historique-salaire-annee/' + this.idIndividu;
    window.open(url, '_blank');
  }

}
