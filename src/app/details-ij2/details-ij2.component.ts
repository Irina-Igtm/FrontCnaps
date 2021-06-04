import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TraitementService } from './../services/traitement/traitement.service';
import { Ij2ServiceService } from '../services/ij2-service.service';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-details-ij2',
  templateUrl: './details-ij2.component.html',
  styleUrls: ['./details-ij2.component.css']
})
export class DetailsIj2Component implements OnInit {
  indiv = {
    nom: null,
    prenoms: null,
    date_naissance: null,
    nationalite: null,
    cin: null,
    profession: null,
    sexe: null,
    id_sexe: null
  }
  accesindiv: any;
  inputs: any;
  RefIJ1: any ;
  dataMP;
  accessToken: any;
  public show = false;
  idDmdIJ: string;
  dmdIJ: any;
  employeur: any;
  individu: any;
  listeAutreEtat = [];
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
  // MP
  mp = {
    id_individu: null,
    type_mdp: null,
    banque: null,
    agence: null,
    numero: null,
    numero_cmpt: null
  }

  listeMP: any;
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
    this.EtatDmd.userModif = this.user.id_acces;

    this.route.params.subscribe((params: Params) => {
      this.idDmdIJ = params['id'];
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
          this.cant_validate = dataEtat.body['etat'] == 3 ? false : true;
        } else {
          this.toastr.warning("Impossible de récupérer l'état de la demande");
        }
        // let query = new FileModel();
        // query.id_files = this.idDmdIJ;
        // this.fileService.readQueryWS(query).subscribe(data => {
        //   if (data.status == 200) {
        //     this.pieces = <any>data.body;
        //   } else {
        //     this.toastr.warning("Impossible de récupérer la liste des pièces jointes");
        //   }
        // });
        this.ij2srvc.prendDetailDemandePF(this.idDmdIJ).subscribe(dataDmd => {
          if (dataDmd.status == 200) {
            this.tecInfo = dataDmd.body;
            this.dmdIJ = dataDmd.body;
            this.id_employeur = this.dmdIJ.accueilMod.id_empl;
            this.id_indiv = this.dmdIJ.accueilMod.id_individu;
            this.valueBenef = this.id_indiv;
            this.champIjValueList = this.tecInfo.tecInfoRecuMod;
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
            this.ij2srvc.avoirRfIJ1(this.idDmdIJ, this.idToken).subscribe(data=>{
              if(data != null){
                  this.RefIJ1 = data.body
              }else{
                this.toastr.info("Réference IJ1 n'existe pas");
              }
            });
            
            //var makeDatePeriodeSalaire = new Date(this.ijForm.value["43"]); // DATE D'ARRET DE TRAVAIL
            this.inputs = this.ij2srvc.setValidFormDataForDynamicForms2(this.champIjValueList, exception);
            this.ijForm = this.ij2srvc.toFormGroupIJPf(this.inputs);
            this.montantIj1 = parseFloat(this.ijForm.value["49"]).toFixed(2); // MONTANT DECLARE
            // this.oldNbJours = parseInt(this.ijForm.value["52"]); // PROLONGATION
            this.ij2srvc.prendInfoRecuParIdAccAndIdTypeInfoPF(this.RefIJ1, 2).subscribe(dateArretInfo => { // DATE D'ARRET DE TRAVAIL
              if (dateArretInfo.status == 200) {
                this.dateArretTravail = dateArretInfo.body.valeur;
                var makeDatePeriodeSalaire = new Date(dateArretInfo.body.valeur);
                this.periodeSalaire = this.datePipe.transform(new Date(makeDatePeriodeSalaire.setMonth(makeDatePeriodeSalaire.getMonth() - 1)), "MM-yyyy");
                const dataDn = {
                  idEmpl: this.id_employeur,
                  idIndividu: this.dmdIJ.accueilMod.id_individu,
                  periode: this.periodeSalaire.toString()
                };
                this.getSalaireDn(dataDn);
              }
            });
            this.ij2srvc.prendInfoRecuParIdAccAndIdTypeInfoPF(this.RefIJ1, 1).subscribe(dpaInfo => { // DPA
              if (dpaInfo.status == 200) {
                this.dpa = dpaInfo.body.valeur;
              }
            });
            this.infosFamille(this.id_indiv);
            this.historiqueDemande(this.dmdIJ.accueilMod.id_individu);
            this.ij2srvc.infoIndivWebService(this.dmdIJ.accueilMod.id_individu, this.idToken).subscribe(dataI => {
              if (dataI.status == 200) {
                this.individu = dataI.body;
                this.ij2srvc.getListEmployeurWS(this.dmdIJ.accueilMod.id_individu, this.idToken).subscribe(dataE => {
                  if (dataE.status == 200) {
                    this.listEmployeur = dataE.body;
                  }
                });
              }
            });
            //getmatriculeemployeur
            this.ij2srvc.infoEmployeurWS(this.dmdIJ.accueilMod.id_empl, this.idToken).subscribe(dataInfoEmpl => {
              if (dataInfoEmpl.status == 200 && dataInfoEmpl.body != null) {
                this.employeur = dataInfoEmpl.body;
                this.estEmpl = true;
              } else {
                this.estEmpl = false;
              }
            });
            this.traitSrvc.infoAresseWS(this.dmdIJ.accueilMod.id_individu, this.idToken).subscribe(
              dataAdr => {
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
              idAccIj1: this.idAccIj1,
              idAccIj2: this.idDmdIJ,
              salaire: this.montantArecalculer
            };
            this.ij2srvc.decompteIj2RedressementWS(dataRecalcul, this.idToken).subscribe(dataDec => {
              if (dataDec.status == 200) {
                this.decompte = dataDec.body;
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
            this.ij2srvc.decompteIj2WS(this.idDmdIJ, this.idToken).subscribe(data => {
              if (data.status == 200) {
                this.decompte = data.body;

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
      }
    })
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
    if (this.montantOP > 0) {
      this.show = true;
      const formValue = this.validForm.value;
      let that = this;
      this.traitSrvc.listeMP(this.dmdIJ.accueilMod.id_acc, this.idToken).subscribe(
        obsMP => {
          if (obsMP.status == 200 && obsMP.body != null && obsMP.body.modepaiement != null) {
            let objetOP = {
              id_prestation: this.PRESTATION,
              id_benef: obsMP.body.idbenef != null ? obsMP.body.idbenef : obsMP.body.idTiers,
              id_mode_paiement: null,
              id_adresse: null,
              id_compte: null,
              id_individu: this.individu.id_individu,
              id_sucursale: this.dmdIJ.accueilMod.id_succursale,
              id_empl: this.dmdIJ.accueilMod.id_empl,
              montant: this.montantOP,
              flag_op: "N",
              id_demande: this.dmdIJ.accueilMod.id_acc
            };
            objetOP.id_mode_paiement = obsMP.body.idModePaiementTiers;
            let observ = that.traitSrvc.infoAresseWS(that.individu.id_individu, this.idToken).subscribe(
              obsA => {
                if (obsA.body != null && obsA.body['length'] > 0) {
                  objetOP.id_adresse = obsA.body[0].id_adresse;
                  // that.effectuerGroupementPourOP(objetOP);
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
            // that.toastr.warning("Le mode de paiement lié à cette demande est introuvable", "Service non valable");
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
      console.log("INFO INDIV =", res)
      if (res.status == 200) {
        this.user = res.body;
        this.accesindiv = true
          this.toastr.success("Affichage info individu avec success")
          this.indiv.nom = res.body.nom
          this.indiv.prenoms = res.body.prenoms
          this.indiv.date_naissance = res.body.date_naissance
          this.indiv.nationalite = res.body.id_nationalite.libelle
          this.indiv.profession = res.body.profession
          this.indiv.sexe = res.body.id_sexe.libelle
          this.indiv.id_sexe = res.body.id_sexe.id_sexe
      } else {
        this.toastr.error('error', "Erreur de connexion")
      }
    })
  }
}
