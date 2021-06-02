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
    reference: "",
    prestation: "422",
    type_etat: 1,
    dateReception: "",
    nom: "",
    prenom: "",
    pagination: 1,
    taille: 20
  }

  id_token: any;
  constructor(
    private trtsrvc: TraitementService,
    private toastr: ToastrService,
    private routes: Router
  ) { }

  ngOnInit(): void {
    document.title = "LISTE - IJ2";
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log("USER", this.user);

    this.id_token = localStorage.getItem('id_token');
    this.pagination = 1;
    this.prendListe();
  }
  changeCritere() {
    this.filtre.taille = this.max,
      this.filtre.pagination = this.page,
      this.filtre.type_etat = this.etat,
      this.filtre.dateReception = this.filtre.dateReception,
      this.filtre.reference = this.filtre.reference,
      this.filtre.matricule = this.filtre.matricule,
      this.filtre.nom = this.filtre.nom,
      this.filtre.prenom = this.filtre.prenom

    this.prendListe();
  }

  prendListe() {
    this.show = true;
    const obj = {
      type_etat: this.etat,
      prestation: this.code_prestation,
      pagination: this.page,
      matricule: this.searchByMatricule,
      reference: this.searchByRef,
      dateReception: this.searchByDateReception,
      taille: this.max
    };

    this.trtsrvc.prendListeDemandePF(this.filtre).subscribe(data => {
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
      this.trtsrvc.listeRefEtatTypWS(this.id_token).subscribe(dataWS => {

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
      if (this.filtre.reference.length >= 12 || this.filtre.reference.length == 0) {
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

}
