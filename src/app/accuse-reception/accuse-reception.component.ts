import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TraitementService } from './../services/traitement/traitement.service';
import { Ij2ServiceService } from '../services/ij2-service.service';

@Component({
  selector: 'app-accuse-reception',
  templateUrl: './accuse-reception.component.html',
  styleUrls: ['./accuse-reception.component.css']
})
export class AccuseReceptionComponent implements OnInit {
  MPDemande: any
  idindiv;
  idToken: any;
  accessToken: any;
  matricule: string;
  nom: string;
  prenoms: string;
  typeDemande: string;
  modePaiement: string;
  agence: string;
  numCompte: string;
  banque: string;
  dateFacture: string;
  agentAccueil: string;
  pieceValue: any[] = [];
  dateToday: any;
  observations: string;
  showPrint: boolean = false;
  idAccuse: string;
  dateReception: any;
  public listePieces: any[] = [];
  reference: string;
  accueilMod: any;
  size: number = 0;
  sizeP: number = 0;
  // fileQuery = new FileModel();
  pieceJointe: any[] = [];
  numero: any;
  titre: any;
  prestation: any;
  pcsrecu: any;
  pcsretourn: any;
  pageB: any;
  titreMotif: any;
  bafRet = [];
  loaderPiece = false;
  constructor(
    private route: ActivatedRoute,
    private routes: Router,
    private datePipe: DatePipe,
    private traitsrvc: TraitementService,
    private ij2srvc: Ij2ServiceService
  ) { }

  ngOnInit(): void {
    document.title = "Accuse de reception - IJ2";
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;
    this.route.params.subscribe((params: Params) => {
      this.reference = params['reference'];
    });
    console.log("Reference volohany", this.reference);
    if (this.reference != "recevable") {
      this.ij2srvc.accuseReceptionByIdWS(this.reference).subscribe(data => {
        if (data.status == 200) {
          this.observations = data.body['observation'];
          this.matricule = data.body['matricule'];
          this.pageB = this.observations + '\r Raiso tompoko, ny haja atolotray anao.';
          this.nom = data.body['nom'];
          this.titre = 'NOTE DE RETOUR';
          this.titreMotif = 'Motif de retour';
          this.pcsretourn = 'Pièce(s) retouné(s)';
          this.prenoms = data.body['prenom'];
          this.typeDemande = data.body['typeDemande'];
          let user = JSON.parse(localStorage.getItem('user')).id_acces;
          this.ij2srvc.infoIndivWebService(user).subscribe(dataI => {
            if (dataI.status == 200) {
              this.agentAccueil = dataI.body['nom'] + ' ' + dataI.body['prenoms'];
            }
          });
          this.listePieces = data.body['listePiece'];
          this.size = this.listePieces.length;
          this.dateReception = data.body['dateReception'];

        }
      });
    } else {
      this.loaderPiece = true;
      this.pcsrecu = 'Pièce(s) reçue(s)';
      this.reference = JSON.parse(localStorage.getItem('stock')).accueilMod.id_acc;
      //paiement
      this.MPDemande = localStorage.getItem('modepaie');
      this.modePaiement = JSON.parse(localStorage.getItem('modepaie')).modepaiement;
      this.banque = JSON.parse(localStorage.getItem('modepaie')).banque
      this.agence = JSON.parse(localStorage.getItem('modepaie')).agence
      this.numCompte = JSON.parse(localStorage.getItem('modepaie')).numero_cmpt

      let user = JSON.parse(localStorage.getItem('user')).id_acces;

      this.accueilMod = localStorage.getItem('stock');
      //individu
      this.matricule = JSON.parse(localStorage.getItem('stock')).accueilMod.id_individu;
      this.prestation = JSON.parse(localStorage.getItem('stock')).accueilMod.id_tec_dmd;
      this.bafRet = JSON.parse(localStorage.getItem('stock')).accueilMod.baf;

      if (this.prestation == '361') {
        this.pageB = '';
      }
      this.traitsrvc.infoAresseWS(this.matricule, this.idToken).subscribe(infoAdresse => {
        if (infoAdresse.status == 200) {
          this.numero = (infoAdresse.body['length'] == 0 || infoAdresse.body[0].adresse_telephone == null || infoAdresse.body[0].adresse_telephone == undefined) ? '[inconnu]' : infoAdresse.body[0].adresse_telephone;
          if (!JSON.parse(localStorage.getItem('stock')).accueilMod.dat && this.prestation != '361') {
            this.pageB = ' << Ho lazaina anao amin\'ny SMS amin\'ny nomerao '
              + this.numero +
              ' ny tohin\'ny fangatahanao. Raha toa anefa ka tsy mahazo valiny ianao ao anatin\'ny fito andro fiasana dia antsoy ny laharan-tariby 020 22 205 20 na 032 07 205 20 na manatona mivantana ny biraon\'ny CNaPS akaiky anao. Misaotra tompoko. >>';
          } else {
            this.pageB = '';
          }
        } else {
          if (!JSON.parse(localStorage.getItem('stock')).accueilMod.dat && this.prestation != '361') {
            this.pageB = ' << Ny valin\'ny fangatahanao dia azonao anontaniana eny amin\'ny biraon\'ny CNaPS akaiky anao afaka fito andro fiasana >>';
          }
        }
      });
      const dateToday = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
      // this.dateReception = JSON.parse(localStorage.getItem('stock')).accueilMod.date_dossier;
      this.dateReception = dateToday;
      this.typeDemande = localStorage.getItem('typeDemande');
      this.agentAccueil = JSON.parse(localStorage.getItem('user')).username;

      this.ij2srvc.infoIndivWebService(this.matricule, this.idToken).subscribe(data => {
        if (data.status == 200 && data.body != null && data.body['nom'] != null) {
          this.nom = data.body['nom'];
          this.prenoms = data.body['prenoms'];
        } else {
          this.ij2srvc.infoEmployeurWS(this.matricule, localStorage.getItem('id_token')).subscribe(employeurRes => {
            if (employeurRes.status == 200) {
              this.nom = employeurRes.body.employeur_nom;
            }
          });
        }
      });
    }
  }

  imprimer() {
    this.showPrint = true;
    let that = this;
    $('.footer_cnaps').hide();
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        that.showPrint = false;
        $('.footer_cnaps').show();
        this.routes.navigate(['/accueil-connecte']);
      }, 1000);
    }, 2000);
  }

  fermer() {
    this.routes.navigate(['/']);
  }
}
