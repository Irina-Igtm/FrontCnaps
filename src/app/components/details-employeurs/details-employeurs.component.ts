import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TraitementService } from '../../services/traitement/traitement.service';

@Component({
  selector: 'app-details-employeurs',
  templateUrl: './details-employeurs.component.html',
  styleUrls: ['./details-employeurs.component.css']
})
export class DetailsEmployeursComponent implements OnInit {

	@Input() idIndividu;
  @Input() idEmplChoisi;
  @Output() emplTrouve = new EventEmitter();

	ListeEmployeur;
	indice;
  afficheCIE = false;

	flecheDroite = ">";
	flecheGauche = "<";
  idToken: any;
  accessToken:any

  constructor(
  	private traitsrvc: TraitementService,
    ) { }

  ngOnInit() {
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;
  	let that = this;
    //that.afService.findListSigemploisuccByIdIndividu(this.idIndividu).subscribe(obsE => {
    that.traitsrvc.getEmployeur(this.idIndividu,this.idToken).subscribe(obsE => {
      console.log("findListSigemploisuccByIdIndividuWS :", obsE);
      let obs = this.traitsrvc.transformeWSReponse(obsE);
      if (obs.success && obs.msg != null && obs.msg.length > 0) {
      	obs.msg.sort((a, b)=>{
      		if(a.sig.date_debut_contrat < b.date_debut_contrat){
      			return -1;
      		}
      		else if(a.sig.date_debut_contrat > b.date_debut_contrat){
      			return 1;
      		}
      		return 0;
      	});
        for(let i=0; i<obs.msg.length; i++){
        	if(obs.msg[i].sig.id_empl.id_empl == that.idEmplChoisi){
            that.indice = i;
            that.emplTrouve.emit(obs.msg[i]);
        		break;
        	}
        }
        if(that.indice == undefined && that.indice == null){
        	that.indice = 0;
        }
        that.ListeEmployeur = obs.msg;
      }
    });
  }

  change(sens){
  	this.indice += sens;
    this.afficheCIE = false;
  }

  voirCIE(){
    this.afficheCIE = true;
  }

}
