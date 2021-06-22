import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { TraitementService } from './../services/traitement/traitement.service';
import { Ij2ServiceService } from '../services/ij2-service.service';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-details-ij2',
  templateUrl: './details-ij2.component.html',
  styleUrls: ['./details-ij2.component.css']
})
export class DetailsIj2Component implements OnInit {
  @Input() idEmplChoisi
  @Output() emplTrouve = new EventEmitter();
  @Output() modifTermine = new EventEmitter();
  @ViewChild('dossierRefu') dossierRefu;
  listeChamps;
  enCours = false;
  listeAutreEtat = [];
  afficheCIE = false;
  that = this
  info_indiv: boolean = false
  tecPcsRecMod: any[]
  indiv = {
    nom: null,
    prenoms: null,
    date_naissance: null,
    nationalite: null,
    cin: null,
    profession: null,
    sexe: null,
    id_sexe: null,
    lieu_naissance: null,
    datecin: null,
    numcin: null
  }
  accesindiv: any;
  inputs: any;
  RefIJ1: any;
  dataMP;
  accessToken: any;
  public show = false;
  idDmdIJ: string;
  dmdIJ: any;
  employeur: any;
  individu: any;
  valueBenef: any;
  nouveauEtat: any;
  adresseIndividu: any;
  enPDF: boolean;
  pieceJointeMessage: string;
  ijForm: FormGroup;
  validForm: FormGroup;
  champIjValueList: any[];
  decompte: any;
  pieces: any[];
  est_choix_empl: boolean;
  dr: any;
  SEM = "3050";
  SEM2 = "6A08";
  PF = "3030";
  adresse: any;
  listeEtatDmd = [];
  id_employeur: any;
  listeEnfant = [];
  id_empl: any;
  histo_dmd = [];
  cant_validate: boolean;
  listEmployeur = [];
  id_benef: any;
  dateNow: any;
  dossierMessage: any;
  sexe: any;
  mode_paiement: any = [];
  test: boolean;
  estEmpl: boolean;
  oldNbJours: any;
  tecInfo: any;
  newNbJours: any;
  famille: any[] = [];
  conjoint: any;
  // BANQUE
  mode_p: any;
  banque: any;
  showModif = false;
  couleur = "#666";
  num_compte: any;
  CODE_SERVICE = null;
  id_compte: any;
  id_mode_p: any;
  dpa;
  dateArretTravail;
  listeModePaiement = [];
  etat = {
    id_type_etat: null,
    libelle: null
  }
  modePaiement = 1;
  mode_paiement2: null;
  decompteIj2 = {
    date_debut_prenatale: null,
    dac: null,
    nbjourpre: null,
    date_debut_postnatale: null,
    date_fin_postnatale: null,
    nbjourpost: null,
    drt: null,
    dat: null,
    totalNbJours: null,
    montantDroit: null,
    montantDroitIj1: null,
    salaire: null,
    nbjourIJ1: null,
    demiSalaire: null,
    postnatale: null,
    prenatale: null,
    redressement: {
      newDroit1tranche: null,
      newDroit2tranche: null,
      droitTotal: null,
      dejaPaye: null,
      restePaye: null
    },
    prolongation: {
      date_debut_prolongation: null,
      date_fin_prolongation: null,
      nbprolongation: null
    }
  }

  //REDRESSEMENT
  estRedressement: boolean;
  periodeSalaire: any;
  montantSalaire: any;
  montantIj1: any;
  montantArecalculer: any;
  idAccIj1: any;
  id_indiv: any;
  montantOP: any;
  EtatDmd = {
    idAcc: null,
    idTypeEtat: null,
    observationsSem: "",
    observations: "",
    userModif: null
  };
  notification = "";

  estMontantSalaireZero: boolean;
  // BANQUE
  typePaiement = "ESP";
  listeBanque = [];
  idCompte = null
  user: any;

  PRESTATION = "422";
  DR;

  afficheChangeMP = true;

  idToken;

  ListeEmployeur;
  indice;
  flecheDroite = ">";
  flecheGauche = "<";
  // MP
  mp = {
    id_individu: null,
    type_mdp: null,
    banque: null,
    agence: null,
    numero: null,
    numero_cmpt: null
  }

  listeMP: any[];
  mpActuel = {
    typeLibelle: "",
    typeAbrev: "",
    lieuAgence: "",
    mp: null
  };
  aucunTrouve = false;
  constructor(
    private traitSrvc: TraitementService,
    private ij2srvc: Ij2ServiceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private routes: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,


  ) {
    this.validForm = this.fb.group({
      observations: [''],
      avisSem: ['']
    });
    this.ijForm = this.fb.group({});
  }

  ngOnInit(): void {
    document.title = "DETAIL - IJ2";
    this.dateNow = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;
    // this.EtatDmd.userModif = this.user.id_acces;
    this.route.params.subscribe((params: Params) => {
      this.idDmdIJ = params['id'];
      console.log("ID ACC", this.idDmdIJ);
      this.EtatDmd.idAcc = this.idDmdIJ;
      this.ij2srvc.getEtatDmdWS(this.idDmdIJ, this.idToken).subscribe(dataEtat => {
        if (dataEtat.status == 200) {
          let idEtat = dataEtat.body;
          this.traitSrvc.listeRefEtatTypWS(this.idToken).subscribe(dataListeEtat => {
            if (dataListeEtat.status == 200) {
              this.listeEtatDmd = <any>dataListeEtat.body;
              for (let i = 0; i < this.listeEtatDmd['length']; i++) {
                if (idEtat['etat'] === this.listeEtatDmd[i].id_type_etat) {
                  this.etat.id_type_etat = this.listeEtatDmd[i].id_type_etat;
                  this.etat.libelle = this.listeEtatDmd[i].libelle;
                }
              }
            } else {
              this.toastr.warning("Impossible de récupérer la liste des états de demande");
            }
          });
          this.cant_validate = dataEtat.body['etat'] == 2 ? false : true;
          console.log("ETAT ANLE DEMANDE" , this.cant_validate)
        } else {
          this.toastr.warning("Impossible de récupérer l'état de la demande");
        }

        this.ij2srvc.prendDetailDemandePF(this.idDmdIJ, this.idToken).subscribe(dataDmd => {
          if (dataDmd.status == 200) {
            console.log("ITO MATRICULE", dataDmd.body.accueilMod.id_individu)
            this.getInfoIndiv(dataDmd.body.accueilMod.id_individu)
            this.getInfoEMployeur(dataDmd.body.accueilMod.id_individu)
            this.getMPIndiv()
            this.prendListeMP(dataDmd.body.accueilMod.id_individu)
            this.tecInfo = dataDmd.body;
            this.dmdIJ = dataDmd.body;
            this.id_employeur = this.dmdIJ.accueilMod.id_empl;
            this.id_indiv = this.dmdIJ.accueilMod.id_individu;
            this.valueBenef = this.id_indiv;
            this.champIjValueList = this.tecInfo.tecInfoRecuMod;
            this.tecPcsRecMod = this.tecInfo.tecPcsRecMod;
            this.montantIj1 = this.dmdIJ.infodmd.montantij1
            let exception: any[];
            exception = [
              {
                id_type_info: 61,
                isrequired: true,
                readonly: true
              }, {
                id_type_info: 62,
                isrequired: true,
                readonly: true
              }
            ];
            if (this.etat.id_type_etat !== 8) {
              exception.push(
                {
                  id_type_info: 52,
                  isrequired: true,
                  readonly: true
                }
              );
            }
            //get RefIJ1
            // this.ij2srvc.avoirRfIJ1(this.idDmdIJ, this.idToken).subscribe(data=>{
            //   if(data != null){
            //       this.RefIJ1 = data.body
            //   }else{
            //     this.toastr.info("Réference IJ1 n'existe pas");
            //   }
            // });

            //var makeDatePeriodeSalaire = new Date(this.ijForm.value["43"]); // DATE D'ARRET DE TRAVAIL
            this.inputs = this.ij2srvc.setValidFormDataForDynamicForms2(this.champIjValueList, exception);
            this.ijForm = this.ij2srvc.toFormGroupIJPf(this.inputs);
            // this.montantIj1 = parseFloat(this.ijForm.value["49"]).toFixed(2); // MONTANT DECLARE
            // console.log("Montant IJ1" , this.montantIj1);

            // this.montantIj1 = ;

            // this.oldNbJours = parseInt(this.ijForm.value["52"]); // PROLONGATION
            this.ij2srvc.prendInfoRecuParIdAccAndIdTypeInfoPF(42201062110242, 2, this.idToken).subscribe(dateArretInfo => { // DATE D'ARRET DE TRAVAIL
              if (dateArretInfo.status == 200) {
                this.dateArretTravail = dateArretInfo.body.valeur;
                var makeDatePeriodeSalaire = new Date(dateArretInfo.body.valeur);
                this.periodeSalaire = this.datePipe.transform(new Date(makeDatePeriodeSalaire.setMonth(makeDatePeriodeSalaire.getMonth() - 1)), "MM-yyyy");
                const dataDn = {
                  idEmpl: this.id_employeur,
                  idIndividu: this.dmdIJ.accueilMod.id_individu,
                  periode: this.periodeSalaire.toString()
                };
                let donne = this.getSalaireDn(dataDn);
              }
            });
            this.ij2srvc.prendInfoRecuParIdAccAndIdTypeInfoPF(42201062110242, 1, this.idToken).subscribe(dpaInfo => { // DPA
              if (dpaInfo.status == 200) {
                this.dpa = dpaInfo.body.valeur;
              }
            });
            this.infosFamille(this.id_indiv);
            this.historiqueDemande(this.dmdIJ.accueilMod.id_individu);
            this.ij2srvc.infoIndivWebService(this.dmdIJ.accueilMod.id_individu, this.idToken).subscribe(dataI => {
              if (dataI.status == 200) {
                this.info_indiv = true
                console.log("individu informations:", dataI);
                this.individu = dataI.body;
                this.ij2srvc.getListEmployeurWS(this.dmdIJ.accueilMod.id_individu, this.idToken).subscribe(dataE => {
                  if (dataE.status == 200) {
                    // console.log("EMPLOYEUR" , dataE);

                    this.listEmployeur = dataE.body;
                  }
                });
              }
            });
            //getmatriculeemployeur
            this.ij2srvc.infoEmployeurWS(this.dmdIJ.accueilMod.id_empl, this.idToken).subscribe(dataInfoEmpl => {
              if (dataInfoEmpl.status == 200 && dataInfoEmpl.body != null) {
                // console.log("INFO EMPLOYEUR" , dataInfoEmpl);

                this.employeur = dataInfoEmpl.body;
                this.estEmpl = true;
              } else {
                this.estEmpl = false;
              }
            });
            this.traitSrvc.infoAresseWS(this.dmdIJ.accueilMod.id_individu, this.idToken).subscribe(
              dataAdr => {
                console.log("ADRESSE", dataAdr);

                this.adresseIndividu = dataAdr.body[0];
              },
              errAdr => {
                this.adresseIndividu = null;
                this.toastr.warning("Service adresse indisponible");
              }
            );
            this.getEtatDemande();

          } else {
            this.toastr.warning("Impossible de trouver la demande");
          }
        });
      });

    });
    this.ij2srvc.prendInfoRecuParIdAccPF("42202062118342", this.idToken).subscribe(liste => {
      if (liste.status == 200) {
        this.listeChamps = liste.body;
        console.log("LISTECHAMPS", this.listeChamps);

      }
    });
  }


  getSalaireDn(dataDn) {
    this.ij2srvc.getSalaireDNWS(dataDn, this.idToken).subscribe(
      dataDN => {
        this.montantSalaire = parseFloat(dataDN.body['montant']).toFixed(2);
        if (dataDN.body['montant'] === 0) {
          this.estMontantSalaireZero = true;
        }
        else if (dataDN.body['montant'] > 0) {
          this.estMontantSalaireZero = false;
          if (this.montantIj1 != this.montantSalaire) {
            this.estRedressement = true;
            if (this.montantIj1 > this.montantSalaire) {
              this.montantArecalculer = parseFloat(this.montantSalaire).toFixed(2);
            }
            else {
              this.montantArecalculer = parseFloat(this.montantIj1).toFixed(2);
            }

            // MIANTSO TOPIC NIONY
            const dataRecalcul = {
              idAccIj1: 42201062110242,
              idAccIj2: this.idDmdIJ,
              salaire: this.montantArecalculer
            };
            this.ij2srvc.decompteIj2RedressementWS(dataRecalcul, this.idToken).subscribe(dataDec => {
              if (dataDec.status == 200) {
                this.decompte = dataDec.body;
                console.log("DECOMPTE", this.decompte);

                this.decompteIj2.date_debut_prenatale = this.decompte.decompte.date_debut_prenatale;
                this.decompteIj2.dac = this.decompte.decompte.dac;
                this.decompteIj2.dat = this.decompte.decompte.dat;
                this.decompteIj2.nbjourpre = this.decompte.decompte.nbjourpre;

                this.decompteIj2.date_debut_postnatale = this.decompte.decompte.date_debut_postnatale;
                this.decompteIj2.date_fin_postnatale = this.decompte.decompte.date_fin_postnatale;
                this.decompteIj2.nbjourpost = this.decompte.decompte.nbjourpost;
                this.decompteIj2.drt = this.decompte.decompte.drt;
                this.decompteIj2.totalNbJours = (this.decompteIj2.nbjourpost) + (this.decompteIj2.nbjourpre);
                this.decompteIj2.nbjourIJ1 = this.decompte.decompte.nbjourIJ1;

                this.decompteIj2.prolongation.date_debut_prolongation = this.decompte.decompte.date_debut_prolongation;
                this.decompteIj2.prolongation.date_fin_prolongation = this.decompte.decompte.date_fin_prolongation;
                this.decompteIj2.prolongation.nbprolongation = this.decompte.decompte.nbprolongation;

                this.decompteIj2.salaire = parseFloat(this.decompte.decompte.salaire).toFixed(2);
                this.decompteIj2.demiSalaire = parseFloat(this.decompte.decompte.demisalaire).toFixed(2);
                this.decompteIj2.postnatale = parseFloat(this.decompte.decompte.postnatale).toFixed(2);
                this.decompteIj2.prenatale = parseFloat(this.decompte.decompte.prenatale).toFixed(2);
                this.decompteIj2.redressement.newDroit1tranche = parseFloat(this.decompte.newdroitIJ1).toFixed(2);
                this.decompteIj2.redressement.newDroit2tranche = parseFloat(this.decompte.newdroitIJ2).toFixed(2);
                this.decompteIj2.redressement.droitTotal = parseFloat(this.decompte.droitTotal).toFixed(2);
                this.decompteIj2.redressement.dejaPaye = parseFloat(this.decompte.oldDroitIJ1).toFixed(2);
                this.decompteIj2.redressement.restePaye = parseFloat(this.decompte.decompte.ij1).toFixed(2);
                this.montantOP = this.decompteIj2.redressement.restePaye;
              } else {
                this.toastr.warning("Erreur lors de la récupération du decompte IJ2: redressement");
                if (this.montantArecalculer == 0) {
                  this.toastr.info("Le montant du salaire dans IJ 1 est de " + this.montantArecalculer);
                }
              }
            });
          }
          else {
            this.estRedressement = false;
            this.ij2srvc.decompteIj2WS("42202062118342", this.idToken).subscribe(data => {
              if (data.status == 200) {
                this.decompte = data.body;
                console.log("DECOMPTE", this.decompte);

                this.decompteIj2.date_debut_prenatale = this.decompte.date_debut_prenatale;
                this.decompteIj2.dac = this.decompte.dac;
                this.decompteIj2.nbjourpre = this.decompte.nbjourpre;
                this.decompteIj2.dat = this.decompte.dat;

                this.decompteIj2.date_debut_postnatale = this.decompte.date_debut_postnatale;
                this.decompteIj2.date_fin_postnatale = this.decompte.date_fin_postnatale;
                this.decompteIj2.nbjourpost = this.decompte.nbjourpost;
                this.decompteIj2.drt = this.decompte.drt;
                this.decompteIj2.totalNbJours = (this.decompteIj2.nbjourpost) + (this.decompteIj2.nbjourpre);
                this.decompteIj2.nbjourIJ1 = this.decompte.nbjourIJ1;

                this.decompteIj2.prolongation.date_debut_prolongation = this.decompte.date_debut_prolongation;
                this.decompteIj2.prolongation.date_fin_prolongation = this.decompte.date_fin_prolongation;
                this.decompteIj2.prolongation.nbprolongation = this.decompte.nbprolongation;

                this.decompteIj2.salaire = parseFloat(this.decompte.salaire).toFixed(2);
                this.decompteIj2.demiSalaire = parseFloat(this.decompte.demisalaire).toFixed(2);
                this.decompteIj2.montantDroit = parseFloat(this.decompte.ij1).toFixed(2);
                this.decompteIj2.postnatale = parseFloat(this.decompte.postnatale).toFixed(2);
                this.decompteIj2.prenatale = parseFloat(this.decompte.prenatale).toFixed(2);

                this.montantOP = this.decompteIj2.montantDroit;
              } else {
                this.toastr.warning("Erreur lors de la récupération du decompte IJ");
              }
            });
          }
        }
      }
      , err => {
        this.toastr.warning('Erreur service DN');
      }
    );
  }

  getEtatDemande() {
    this.traitSrvc.listeRefEtatTypWS(this.idToken).subscribe(data => {
      if (data.status == 200) {
        var temp = [];
        temp = <any>data.body;
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].id_type_etat != 1 && temp[i].id_type_etat != 3) {
            this.listeAutreEtat.push(temp[i]);
          }
        }
        console.log("ETAT BE", this.listeAutreEtat);

      }
    });
  }



  infosFamille(id) {
    this.traitSrvc.infoFamille(id, this.idToken).subscribe(
      data => {
        if (data.status == 200) {
          this.famille = data.body;

          for (let i = 0; i < this.famille.length; i++) {
            if (this.famille[i].statut === "CONJOINT") {
              this.conjoint = this.famille[i];
            }
            if (this.famille[i].statut === "ENFANT") {
              this.listeEnfant.push(this.famille[i]);
            }
          }
        }
      }
    )
  }

  historiqueDemande(id) {
    this.ij2srvc.historiqueDemandeWS(id, this.idToken).subscribe(
      data => {
        if (data.status == 200) {
          this.histo_dmd = <any>data.body;
        }
      }
    )
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }



  onClickPiece(piece_file, name) {

    window.open(piece_file, name);
  }

  onDecompteClick() {
    this.routes.navigate(['/decompte/' + this.idDmdIJ]);
  }

  // onModifTecInfReq() {
  //   this.showModif = true;
  //   const formValue = this.ijForm.value;
  //   const tecInfRec = this.ijpfService.setTecInfRec(formValue, this.idDmdIJ, this.champIjValueList);
  //   this.ijService.updateIj2(tecInfRec).subscribe(data => {
  //     this.toastr.success('Données mise à jour');
  //     this.ngOnInit();
  //     this.showModif = false;
  //   });
  // }

  // modePaiementChange() {
  //   for (let mp of this.listeModePaiement) {
  //     if (this.modePaiement == mp.idModeP) {
  //       this.typePaiement = mp.idTypeP;
  //       break;
  //     }
  //   }
  // }

  modePaiementChange(objet) {
    this.mode_paiement2 = objet;
  }

  //ajout mode de paiement
  ajouterMP() {
    this.dataMP = {
      id_individu: this.dmdIJ.accueilMod.id_individu,
      type_mdp: this.mp.type_mdp,
      banque: this.mp.banque,
      agence: this.mp.agence,
      numero: this.mp.numero,
      numero_cmpt: this.mp.numero_cmpt
    }
    this.traitSrvc.saveModepaie(this.dataMP, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.getModePayement(this.dmdIJ.accueilMod.idIndividu);
        // this.hideModalMP();
        this.toastr.success('Ajout mode de payement avec success')
      }
    })
  }

  onAcceptCLick() {
    console.log("MONTANT DROIT :" , this.montantOP);
    if (this.montantOP > 0) {
      this.show = true;
      const formValue = this.validForm.value;
      let that = this;
      this.ij2srvc.getMPDmd(this.dmdIJ.accueilMod.id_acc, this.idToken).subscribe(
        obsMP => {
          if (obsMP.status == 200 && obsMP.body != null && obsMP.body != null) {
            let objetOP = {
              id_prestation: this.PRESTATION,
              // id_benef: obsMP.body.idbenef != null ? obsMP.body.idbenef : obsMP.body.idTiers,
              id_mode_paiement: this.mpActuel.mp.id_modepaieDmd,
              id_adresse: null,
              id_compte: null,
              id_individu: this.individu.id_individu,
              id_sucursale: this.dmdIJ.accueilMod.id_succursale,
              id_empl: this.dmdIJ.accueilMod.id_empl,
              montant: this.montantOP,
              flag_op: "N",
              id_benef:this.individu.id_individu,
              id_demande: this.dmdIJ.accueilMod.id_acc
            };
            objetOP.id_mode_paiement = this.mpActuel.mp.id_modepaieDmd;
            let observ = that.traitSrvc.infoAresseWS(that.individu.id_individu, this.idToken).subscribe(
              obsA => {
                if (obsA.body != null && obsA.body['length'] > 0) {
                  objetOP.id_adresse = obsA.body[0].id_adresse;
                  that.effectuerGroupementPourOP(objetOP);
                }
                else {
                  that.toastr.info("L'individu n'a pas d'adresse", 'Info');
                  this.show = false;
                }
                observ.unsubscribe();
              }, erreurAdr => {
                that.toastr.warning("L'individu n'a pas d'adresse", 'Service non valable');
                this.show = false;
              }
            );
          } else {
            that.show = true;
            this.ajouterMP();
            that.toastr.warning("Le mode de paiement lié à cette demande est introuvable", "Service non valable");
          }
        },
        erreur => {
          that.show = true;
          that.toastr.warning("Le mode de paiement lié à cette demande est introuvable", "Service non valable");
        });
    } else {
      this.toastr.warning("Montant droit invalide");
    }
  }

  effectuerGroupementPourOP(objetOP) {
    let that = this;
    this.ij2srvc.saveTecoptempWS(objetOP, this.idToken).subscribe(
      obsO => {
        that.toastr.success("Opération terminée, la demande est ajoutée en file d'attente d'OP");
        const cc = this.validForm.value;
        this.EtatDmd.idTypeEtat = 2;
        this.EtatDmd.observations = cc.observations;
        this.EtatDmd.observationsSem = "";
        let argument = {
          etat: this.EtatDmd.idTypeEtat,
          idacc: this.EtatDmd.idAcc,
          observation: this.EtatDmd.observations,
          observationSem: this.EtatDmd.observationsSem,
          userModif: this.EtatDmd.userModif
        };
        this.ij2srvc.changerEtatDemandePF(argument, this.idToken).subscribe(dataWS => {
          if(dataWS.status == 200){
            localStorage.setItem("ValideOp", JSON.stringify(argument));
            that.toastr.success("Etat de la demande modifié");
                 }
        });
        // let notifMessage = 'Votre demande d\'indemnité journalière 1ère tranche: ref - ' + this.dmdIJ.accueilMod.id_acc + ' a été validée.';
        // let dateToday = that.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
        // let content = {
        //   expediteur: JSON.parse(localStorage.getItem('user')).id_acces,
        //   destinataire: that.individu.id_individu,
        //   titre: 'Demande IJ1',
        //   message: notifMessage,
        //   typeNotif: '',
        //   dateEnvoi: dateToday,
        //   referenceNotif: 'Préstation familiale'
        // // };
        // if (that.ui.EST_PROD) {
        //   that.notificationService.sendNotif(that.individu.id_individu, content).then(() => {
        //     that.toastr.success('Notification envoyé');
        //   }, (err) => {
        //     that.toastr.warning('Notification non envoyé');
        //   });
        // }
        setTimeout(() => {
          that.routes.navigate(['/listeij2']);
        }, 500);
        that.show = false;
      },
      err => {
        that.show = false;
        that.toastr.warning("Impossible de procéder à la validation de la demande");
      }
    );
  }

  onChangeEtat(val) {
    this.nouveauEtat = val.value;
    this.EtatDmd.idTypeEtat = this.nouveauEtat;
  }

  getModePayement(matricule) {
    this.traitSrvc.listeMP(matricule, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.listeMP = res.body
        console.log("MP", this.listeMP);

      } else {
        this.toastr.error('error', "Erreur de connexion Mode de payement")
      }
    })
  }

  getInfoIndiv(matricule) {
    this.traitSrvc.infoIndividu(matricule, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.user = res.body;
        this.accesindiv = true
        this.info_indiv = true
        this.toastr.success("Affichage info individu avec success")
        this.indiv.nom = res.body.nom
        this.indiv.prenoms = res.body.prenoms
        this.indiv.date_naissance = res.body.date_naissance
        this.indiv.nationalite = res.body.id_nationalite.libelle
        this.indiv.profession = res.body.profession
        this.indiv.sexe = res.body.id_sexe.libelle
        this.indiv.id_sexe = res.body.id_sexe.id_sexe
        this.indiv.cin = res.body.cin,
          this.indiv.lieu_naissance = res.body.lieu_naissance,
          this.indiv.datecin = res.body.date_cin
      } else {
        this.toastr.error('error', "Erreur de connexion")
      }
    })
  }

  getInfoEMployeur(matricule) {
    let that = this;
    that.traitSrvc.getEmployeur(matricule, this.idToken).subscribe(obsE => {
      console.log("findListSigemploisuccByIdIndividuWS :", obsE);
      let obs = this.traitSrvc.transformeWSReponse(obsE);
      if (obs.success && obs.msg != null && obs.msg.length > 0) {
        obs.msg.sort((a, b) => {
          if (a.sig.date_debut_contrat < b.date_debut_contrat) {
            return -1;
          }
          else if (a.sig.date_debut_contrat > b.date_debut_contrat) {
            return 1;
          }
          return 0;
        });
        for (let i = 0; i < obs.msg.length; i++) {
          if (obs.msg[i].sig.id_empl.id_empl == that.idEmplChoisi) {
            that.indice = i;
            that.emplTrouve.emit(obs.msg[i]);
            break;
          }
        }
        if (that.indice == undefined && that.indice == null) {
          that.indice = 0;
        }
        that.ListeEmployeur = obs.msg;
        console.log("EMPLOYEUR use :", this.ListeEmployeur);

      }
    });

  }

  change(sens) {
    console.log("SENS", sens);

    this.indice += sens;
    this.afficheCIE = false;
  }
  getMPIndiv() {
    let that = this;
    // prend la liste des modes de paiement
    this.ij2srvc.getAllmodepaiementWS(this.idToken).subscribe(obsLMP => {
      if (obsLMP.status == 200) {
        that.listeModePaiement = obsLMP.body;
        this.ij2srvc.getMPDmd(this.idDmdIJ, this.idToken).subscribe(obs => {
          if (obs.status == 200 && obs.body != null) {
            that.mpActuel.mp = obs.body
            console.log("id", that.mpActuel.mp);

            that.mpActuel.typeLibelle = that.mpActuel.mp.banque;
            that.mpActuel.typeAbrev = that.mpActuel.mp.agence;
          }
          else {
            that.aucunTrouve = true;
          }
        });
      }
    });
  }

  prendListeMP(matricule) {
    let that = this;
    this.traitSrvc.listeMP(matricule, this.idToken).subscribe(obs => {
      console.log("listeMPbymatricule => " + matricule, obs);
      if (obs.status == 200) {
        this.listeMP = [];
        for (let l of obs.body) {
          let mp = {
            mp: l,
            estCoche: false
          };
          if (that.mpActuel.mp != null && that.mpActuel.mp.idModePaiementTiers == l.idModePaiementTiers) {
            mp.estCoche = true;
          }
          this.listeMP.push(mp);
        }
        console.log("KIVY", this.listeMP);

      }
    });
  }

  checkChange(index) {
    console.log("checkChange ", index);
    // for (let i = 0; i < this.listeMP.length; i++) {
    //   if (index != i) {
    //     this.listeMP[i].estCoche = false;
    //   }
    // }
  }

  validerChoixMp() {
    let modePaiement = null;
    //gettMpdmd
    console.log("validerChoixMp modePaiement", modePaiement);
    if (modePaiement != null) {
      if (this.aucunTrouve) {
        this.traitSrvc.saveModepaie(modePaiement, this.idToken).subscribe(obs => {
          console.log("ajouttrsmodepaieWS", obs);
          if (obs.status == 200) {
            this.traitement(modePaiement);
            this.toastr.success("Le mode de paiement pour cette demande a été modifié");
          }
          else {
            this.toastr.info("Impossible de modifier le mode de paiement");
          }
        });
      }
      else {
        this.ij2srvc.updatemodepaiementop(modePaiement).subscribe(obs => {
          console.log("updatemodepaiementop", obs);
          if (obs.status == 200) {
            this.traitement(modePaiement);
            this.toastr.success("Le mode de paiement pour cette demande a été modifié");
          }
          else {
            this.toastr.info("Impossible de modifier le mode de paiement");
          }
        });
      }
    }
    else {
      this.toastr.info("Vous n'avez choisi aucun mode de paiement");
    }
  }

  traitement(modePaiement) {
    if (this.mpActuel.mp == null) {
      this.mpActuel.mp = {};
    }
    for (let attr in modePaiement) {
      this.mpActuel.mp[attr] = modePaiement[attr];
    }
    for (let mp of this.listeModePaiement) {
      if (mp.id_mode_paiement == this.mpActuel.mp.id_mode_paiement) {
        this.mpActuel.typeLibelle = mp.banque;
        this.mpActuel.lieuAgence = this.mpActuel.mp.agence;
        break;
      }
    }
  }

  imprimerPDF() {
    this.enPDF = true;
    let that = this;
    // $('#decompte').modal('hide');
    $(".footer_cnaps").hide();
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        that.enPDF = false;
        $(".footer_cnaps").show();
      }, 1000);
    }, 2000);
  }

  dossierRefuse() {
    if (this.nouveauEtat === null || this.nouveauEtat === undefined || this.nouveauEtat === "") {
      this.toastr.warning('Il est impératif de choisir l\'état de la demande');
    }
    else if (this.dossierMessage === null || this.dossierMessage === undefined || this.dossierMessage === "") {
      this.toastr.warning('Veuillez écrire un méssage ou un motif');
    }
    else {
      this.EtatDmd.observations = this.dossierMessage;
      let argument = {
        etat: this.EtatDmd.idTypeEtat,
        idacc: this.EtatDmd.idAcc,
        observation: this.EtatDmd.observations,
        observationSem: this.EtatDmd.observationsSem,
        userModif: this.EtatDmd.userModif
      };
      this.ij2srvc.changerEtatDemandePF(argument, this.idToken).subscribe(data => {
        if (data.status == 200) {
          this.toastr.success('Change état success');
          $('#dossierRefu').modal('hide');
          this.notification = this.notification.trim();
          const notifMessage = this.notification == "" ? "Demande d'indemnité journalière 2ème tranche ref - " + this.idDmdIJ + " réfusée." : this.notification;
          const dateToday = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
          const content = {
            expediteur: JSON.parse(localStorage.getItem('user')).id,
            destinataire: this.individu.id_individu,
            titre: "Demande d'indemnité journalière 2ème tranche",
            message: notifMessage,
            typeNotif: '',
            dateEnvoi: dateToday,
            referenceNotif: 'Préstation familiale'
          };
          this.routes.navigate(['/listeij2']);
        } else {
          this.toastr.warning("Erreur changement d'état");
        }
      });
    }
  }

}
