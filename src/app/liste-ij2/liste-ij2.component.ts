import { TraitementService } from './../services/traitement/traitement.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-liste-ij2',
  templateUrl: './liste-ij2.component.html',
  styleUrls: ['./liste-ij2.component.css']
})
export class ListeIJ2Component implements OnInit {
  accessToken:any;
  idToken:any;
  show: boolean = false;
  listDmdIj: any[];
  listEtatDmdIj: any[];
  etat: any = 1;
  pagination: any;
  page_count: any[];
  searchByMatriculeTravailleur: any;
  code_prestation = 422;
  user: any;

  //search
  searchByMatricule: any;
  searchByRef: any;
  searchByDateReception: any;

  max = 10;
  page = 1;
  nbPage: number;
  EtatDmd = {
    idAcc: null,
    idTypeEtat: null,
    observationsSem: "",
    observations: "",
    userModif: null
  };

  filtre = {
    matricule: "",
    id_acc: "",
    prestation: "422",
    type_etat: 1,
    dateReception: "",
    nom: "",
    prenom: "",
    pagination: 1,
    taille: 20
  }
  constructor(
    private trtsrvc: TraitementService,
    private toastr: ToastrService,
    private routes: Router
  ) { }

  ngOnInit(): void {
    document.title = "LISTE - IJ2";
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;
    console.log("TOKEN" , this.idToken);
    
    this.pagination = 1;
    this.prendListe();
  }
  changeCritere() {
    this.filtre.taille = this.max,
      this.filtre.pagination = this.page,
      this.filtre.type_etat = this.etat,
      this.filtre.dateReception = this.filtre.dateReception,
      this.filtre.id_acc = this.filtre.id_acc,
      this.filtre.matricule = this.filtre.matricule,
      this.filtre.nom = this.filtre.nom,
      this.filtre.prenom = this.filtre.prenom
      
    this.prendListe();
  }

  prendListe() {
    this.show = true;
    this.trtsrvc.prendListeDemandePF(this.filtre, this.idToken).subscribe(data => {
      if (data.status == 200) {
        this.listDmdIj = data.body['list'];
        this.nbPage = data.body['totalPages'];
        this.show = false;
      }
      else {
        this.toastr.warning('Impossible de recupérer la liste de demande IJ2');
        this.show = false;
      }
      this.getEtatDemande();
    }
    );
  }

  onClickIJDetails(iddemande) {
    this.routes.navigate(['/details-ij2/' + iddemande]);
  }

  getEtatDemande() {
    if (this.listEtatDmdIj == undefined) {
      this.trtsrvc.listeRefEtatTypWS(this.idToken).subscribe(dataWS => {

        let liste: any = dataWS.body;
        liste.sort((a, b) => {
          if (a.libelle > b.libelle) return 1;
          else if (a.libelle < b.libelle) return -1;
          return 0;
        });
        this.listEtatDmdIj = liste;
      });
    }
  }

  filtreChange(sur) {
    if (sur == 'surRef') {
      if (this.filtre.id_acc.length >= 12 || this.filtre.id_acc.length == 0) {
        this.page = 1;
        this.changeCritere();

      }
    }
    else if (sur == 'surDateRec') {
      this.page = 1;
      this.changeCritere();
    }
    else if (sur == 'surMatr') {
      if (this.filtre.matricule.length >= 12 || this.filtre.matricule.length == 0) {
        this.page = 1;
        this.changeCritere();
      }
    }
    else if (sur == 'surNom') {
      if (this.filtre.nom.length >= 2 || this.filtre.nom.length == 0) {
        this.page = 1;
        this.changeCritere();
      }
    }
    else if (sur == 'surPrenom') {
      if (this.filtre.prenom.length >= 2 || this.filtre.prenom.length == 0) {
        this.page = 1;
        this.changeCritere();
      }
    }
  }

  onChange(event) {
    this.etat = event.target.value;
    this.changeCritere();
  }

}
