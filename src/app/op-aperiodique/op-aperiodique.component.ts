import { TraitementService } from './../services/traitement/traitement.service';
import { Ij2ServiceService } from './../services/ij2-service.service';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
    selector: 'app-op-aperiodique',
    templateUrl: './op-aperiodique.component.html',
    styleUrls: ['./op-aperiodique.component.css']
})
export class OpAperiodiqueComponent implements OnInit {

    @ViewChild('modalChoixProjet') modalChoixProjet;

    @Input() prestation: string;
    @Input() codeProjet: string = "421";
    @Input() codeService: string;
    @Input() idRubrique: string;
    @Input() compteBenef: string;
    @Input() lienRetour: string;
    @Input() code_dr = '42';

    @Output() resultSave = new EventEmitter();

    utilisateur = null;
    categorie = 'OP';
    estDirecteur = false;
    texteBenef = "DIVERS";

    OP = {
        listeProjet: [],
        listeBenef: [],
        doitAfficheBenef: false,
        fileAttente: null,
        charge: false,
        chargeListe: true,
        listeMP: [],
        mpChoisi: null,
        abrevMP: null,
        fileAttenteOP: [],
        totalOP: 0
    };

    OPD = {
        fileAttente: null,
        charge: false,
        chargeListe: false,
        mpChoisi: null,
        abrevMP: null,
        fileAttenteOP: []
    };

    Liste = {
        liste: [],
        filtre: {
            flagvalide: 'O',
            op: null,
            size: 100,
            page: 1,
            prestation: null
        },
        etat: {
            'O': 'Créé',
            'R': 'Réglé',
            'N': 'Annulé'
        },
        charge: false
    };

    Export = {
        idOp: '',
        libelleCompte: '',
        libelleDate: '',
        nombreBenef: 0,
        montant: 0,
        montantLettre: '',
        listeSouche: [],
        enPDF: false
    };

    listeSoucheExport = [];

    DetailPiece = {
        reference: null,
        liste: []
    };

    dr;

    idToken;
    ancienOp: any;
    id_acc: any
    mpActuel: any
    matricule: any
    constructor(
        private toast: ToastrService,
        private traitSrvc: TraitementService,
        private ij2srvc: Ij2ServiceService
    ) { }

    ngOnInit() {
        this.utilisateur = localStorage.getItem('user');
        this.idToken = JSON.parse(this.utilisateur).accessToken;
        this.matricule = JSON.parse(this.utilisateur).id;
        this.ancienOp = localStorage.getItem('ValideOp');
        this.id_acc = JSON.parse(this.ancienOp).idacc;
        const that = this;
        this.ij2srvc.infoDirectionWS(this.matricule, this.idToken).subscribe(
            obsDrWS => {
                if (obsDrWS.status == 200) {
                    console.log("INFO AGNET", obsDrWS.body);

                    if (obsDrWS.body.code_fonction == "02A") {
                        that.estDirecteur = true;
                    }
                    that.dr = obsDrWS.body.code_dr;
                    if (that.code_dr == null || that.code_dr == undefined) {
                        that.code_dr = that.dr;
                    }
                    that.suiteNgOnInit(obsDrWS.body.code_dr);
                }
                err => {
                    that.toast.info("Impossible de récuperer votre code DR");
                }
            }
        );

        this.ij2srvc.getMPDmd(this.id_acc, this.idToken).subscribe(obs => {
            if (obs.status == 200 && obs.body != null) {
                that.mpActuel = obs.body
                console.log("id", that.mpActuel);
            }
        });

    }

    suiteNgOnInit(dr) {
        let that = this;
        if (this.codeProjet == null || this.codeProjet == undefined || this.compteBenef == null || this.compteBenef == undefined) {
            this.afficheChoixProjet();
        }
        this.ij2srvc.getAllmodepaiementWS(this.idToken).subscribe(obsMP => {
            if (obsMP.status == 200) {
                that.OP.mpChoisi = obsMP.body[0];
                that.OP.abrevMP = obsMP.body[0].abreviation;
                that.OP.listeMP = obsMP.body;
                const data = {
                    prestation: this.prestation,
                    page: 1,
                    size: 1000,
                    dr: this.id_acc
                };
                that.ij2srvc.listTecOpTempWS(data, this.idToken).subscribe(obs => {
                    if (obs.status == 200 && obs.body != null) {
                        const _fileAttente = obs.body;
                        for (const opTemp of _fileAttente['tecop'].tecbenef) {
                            opTemp.nomBenef = '';
                            opTemp.prenomBenef = '';
                            opTemp.cinBenef = '';
                            that.traitSrvc.infoIndividu(opTemp.id_benef, this.idToken).subscribe(
                                obsIWS => {
                                    if (obsIWS.status == 200 && obsIWS.body != null) {
                                        opTemp.nomBenef = obsIWS.body['nom'];
                                        opTemp.prenomBenef = obsIWS.body['prenoms'];
                                        opTemp.cinBenef = obsIWS.body['cin'];
                                    }
                                    else {
                                        this.ij2srvc.infoEmployeurWS(opTemp.id_benef, this.idToken).subscribe(empl => {
                                            opTemp.nomBenef = empl.body.employeur_nom;
                                        });
                                    }
                                });
                        }
                        that.OP.fileAttente = _fileAttente['tecop'].tecbenef;
                        that.creeFileAttenteOP();
                    }
                    that.OP.chargeListe = false;
                });
            } else {
                that.toast.info('Impossible de récupérer la liste des modes de paiement');
            }
        });
        if (this.lienRetour == undefined || this.lienRetour == null) {
            this.lienRetour = 'accueil-connecte';
        }
    }

    afficheChoixProjet() {
        // $(this.modalChoixProjet.nativeElement).modal('show');
        const that = this;
        this.ij2srvc.budgetTopicWS('listeProjetPourElaborationBPSE', '', this.idToken).subscribe(obsP => {
            if (obsP.status == 200 && obsP.body != null && obsP.body['length'] > 0) {
                that.OP.listeProjet = <any>obsP.body;
            } else {
                that.toast.info('Impossible de récupérer la liste des projets');
            }
        });
        if (this.compteBenef == null || this.compteBenef == undefined) {
            this.OP.doitAfficheBenef = true;
            //   this.ijPfService.pretnotnullbysousprestWS(this.prestation, this.idToken).subscribe(obsCB => {
            //     console.log("code tiers projet =>", obsCB)
            //     if (obsCB.status == 200 && obsCB.body != null && obsCB.body['length'] > 0) {
            //       that.OP.listeBenef = <any>obsCB.body;
            //     }
            //   });
        }
    }

    creeFileAttenteOP() {
        this.OP.fileAttenteOP = [];
        this.OP.totalOP = 0;
        for (const file of this.OP.fileAttente) {
            if (this.mpActuel != null) {
                this.OP.fileAttenteOP.push(file);
                this.OP.totalOP += file.montant;
            }
        }
    }

    mpChange() {
        for (const mp of this.OP.listeMP) {
            if (mp.abreviation == this.OP.abrevMP) {
                this.OP.mpChoisi = mp;
                break;
            }
        }
        this.creeFileAttenteOP();
    }

    creeFileAttenteOPD() {
        this.OPD.fileAttenteOP = [];
        for (const file of this.OPD.fileAttente.tecBenef) {
            if (file.tecop.tecbenef[0].id_mode_paiement) {
                if (file.tecop.tecbenef[0].id_mode_paiement.abrevModePaiement == this.OPD.abrevMP) {
                    this.OPD.fileAttenteOP.push(file);
                }
            }
        }
    }

    mpChangeD() {
        for (const mp of this.OP.listeMP) {
            if (mp.abreviation == this.OPD.abrevMP) {
                this.OPD.mpChoisi = mp;
                break;
            }
        }
        this.creeFileAttenteOPD();
    }

    validerCodeProjet() {
        if (this.codeProjet != undefined && this.codeProjet != null) {
            if (this.compteBenef != undefined && this.compteBenef != null) {
                this.fermeChoixProjet();
            }
        }
    }

    creerArgumentOp() {
        this.OP.charge = true;
        const argOp = {
            prestation: this.prestation,
            dr: this.code_dr,
            tecop: {
                id_op: null,
                id_acc: null,
                montant: this.OP.totalOP,
                flag_valide: 'O',
                date_op: null,
                observations: 'OP pour Prestation ' + this.prestation + ' pour ' + this.OP.mpChoisi.abreviation,
                br_code: null,
                code_dr_service: this.code_dr,
                tecbenef: []
            },
            tef: {
                numTef: null,
                numOp: null,
                montant: this.OP.totalOP,
                codeProjet: this.codeProjet,
                codeService: this.codeService,
                idRubrique: this.idRubrique,
                compteBenef: this.compteBenef,
                objet: 'OP pour Prestation ' + this.prestation + ' pour ' + this.OP.mpChoisi.abreviation
            }
        };
        for (const benef of this.OP.fileAttenteOP) {
            argOp.tecop.tecbenef.push({
                id_benef: benef.id_benef,
                id_mode_paiement: benef.id_mode_paiement,
                id_adresse: benef.id_adresse,
                id_compte: benef.id_compte,
                id_individu: benef.id_individu,
                id_sucursale: benef.id_sucursale,
                id_empl: benef.id_empl,
                id_demande: benef.id_demande,
                montant: benef.montant
            });
        }
        const that = this;
        this.ij2srvc.infoDirectionWS(this.matricule, this.idToken).subscribe(obs => {
            if (obs.status == 200 && obs.body != null) {
                argOp.dr = obs.body.code_dr;
                argOp.tecop.code_dr_service = obs.body.code_dr;
                that.genererOP(argOp);
            } else {
                that.toast.info('Votre service est non reconnu, veuillez réessayer');
                that.OP.charge = false;
            }
        });
    }

    genererOP(argOp) {
        const argDmd = {
            listeIdAcc: [],
            numOP: null,
        };
        for (const opTemp of this.OP.fileAttenteOP) {
            argDmd.listeIdAcc.push(opTemp.id_demande);
        }
        const that = this;
        this.ij2srvc.addTecopWS(argOp, this.idToken).subscribe(obsOp => {
            if (obsOp.status == 200) {
                this.resultSave.emit(obsOp.body);
                that.toast.success('OP généré avec succès');
                that.OP.fileAttenteOP = [];
                const tempListe = [];
                for (const benef of that.OP.fileAttente.tecop.tecbenef) {
                    if (benef.id_mode_paiement.abrevModePaiement != that.OP.abrevMP) {
                        tempListe.push(benef);
                    }
                }
                that.OP.fileAttente.tecop.tecbenef = tempListe;
                argDmd.numOP = obsOp.body['tecop'].id_op;
                /*that.rfaService.insertionOpDmdGroupe(argDmd, that.prestation).subscribe(obs => {
                  console.log("insertionOpDmdGroupe", obs);
                });*/
                that.Export.idOp = obsOp.body['tecop'].id_op;
                that.clickCategorie('Export');
                that.opChange();
            } else {
                that.toast.info('OP non généré, veuillez réessayer');
            }
            that.OP.charge = false;
        });
    }

    opChange() {
        const numOp = this.Export.idOp.trim();
        if (numOp.startsWith(this.prestation)) {
            this.Export.nombreBenef = 0;
            this.Export.montant = 0;
            this.Export.listeSouche = [];
            this.listeSoucheExport = [];
            const that = this;
            if (numOp.length >= 10) {
                this.traitSrvc.listTecopByIdWS(numOp, this.idToken).subscribe(obs => {
                    if (obs.status == 200 && obs.body != null) {
                        that.Export.montant = parseInt(obs.body.montant);
                        that.Export.nombreBenef = obs.body.tecbenef.length;
                        if (that.Export.nombreBenef == 1) {
                            that.traitSrvc.infoIndividu(obs.body.tecbenef[0].id_benef , this.idToken).subscribe(obsI => {
                                if (obsI.status == 200) {
                                    that.texteBenef = obsI.body['nom'] + " " + obsI.body['prenoms'];
                                }
                                else {
                                    this.ij2srvc.infoEmployeurWS(obs.body.tecbenef[0].id_benef, this.idToken).subscribe(empl => {
                                        that.texteBenef = empl.body.employeur_nom;
                                    });
                                }
                            });
                        }
                        else {
                            that.texteBenef = "DIVERS";
                        }
                        // that.Export.montantLettre = that.convertionService.NumberToLetter(that.Export.montant);
                        // that.prendSouche(numOp, 0);
                    }
                });
            }
        } else {
            this.toast.info('Veuillez saisir un numéro d\'OP qui correspond à la prestation');
        }
    }

    // prendSouche(op, recursion: number) {
    //     const that = this;
    //     that.ijPfService.soucheTechniqueWS(op, this.idToken).subscribe(obs => {
    //       console.log("pendre titre id =>", obs)
    //       if (obs.status == 200 && obs.body != null && obs.body.length > 0) {
    //         that.Export.listeSouche = obs.body;
    //         for (let souche of that.Export.listeSouche) {
    //           if (that.listeSoucheExport.length == 0) {
    //             that.listeSoucheExport.push({
    //               dateEdition: souche.dateEdition,
    //               abrevMP: souche.abrevMP,
    //               idTitre: souche.idTitre,
    //               montant: souche.montant,
    //               compte: souche.compte
    //             });
    //           }
    //           else {
    //             let existe = false;
    //             for (let exs of that.listeSoucheExport) {
    //               if (exs.idTitre == souche.idTitre) {
    //                 existe = true;
    //                 exs.montant += souche.montant;
    //               }
    //             }
    //             if (!existe) {
    //               that.listeSoucheExport.push({
    //                 dateEdition: souche.dateEdition,
    //                 abrevMP: souche.abrevMP,
    //                 idTitre: souche.idTitre,
    //                 montant: souche.montant,
    //                 compte: souche.compte
    //               });
    //             }
    //           }
    //         }
    //       } else {
    //         if (recursion < 3) {
    //           that.prendSouche(op, recursion + 1);
    //         }
    //       }
    //     });
    //   }

    creerArgumentOpD(indice: number) {
        this.OPD.charge = true;
        const argOp = {
            prestation: this.prestation,
            dr: this.code_dr,
            tecop: {
                id_op: null,
                id_acc: null,
                montant: this.OPD.fileAttenteOP[indice].tecop.montant,
                flag_valide: 'O',
                date_op: null,
                observations: 'OP pour Prestation ' + this.prestation + ' pour ' + this.OPD.mpChoisi.abreviation,
                br_code: null,
                code_dr_service: this.code_dr,
                tecbenef: []
            },
            tef: {
                numTef: null,
                numOp: null,
                montant: this.OPD.fileAttenteOP[indice].tecop.montant,
                codeProjet: this.codeProjet,
                codeService: this.codeService,
                idRubrique: this.idRubrique,
                compteBenef: this.compteBenef,
                objet: 'OP pour Prestation ' + this.prestation + ' pour ' + this.OPD.mpChoisi.abreviation
            }
        };
        argOp.tecop.tecbenef.push({
            id_benef: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].id_benef,
            id_mode_paiement: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].id_mode_paiement,
            id_adresse: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].id_adresse,
            id_compte: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].id_compte,
            id_individu: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].id_individu,
            id_sucursale: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].id_sucursale,
            id_empl: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].id_empl,
            id_demande: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].id_demande,
            montant: this.OPD.fileAttenteOP[indice].tecop.tecbenef[0].montant
        });

    }

    fermeChoixProjet() {
        $(this.modalChoixProjet.nativeElement).modal('hide');
    }

    clickCategorie(cat) {
        this.categorie = cat;
        if (cat == 'Liste') {
            this.Liste.filtre.prestation = this.prestation;
            const date = new Date(Date.now());
            this.Liste.filtre.op = date.getFullYear() + '-' + this.ajouteZero(date.getMonth() + 1) + '-' + this.ajouteZero(date.getDate());
            if (this.Liste.liste.length == 0) {
                this.prendListeOp();
            }
        } else if (cat == 'Export') {
            if (this.Export.libelleCompte == '') {
                this.ij2srvc.getCptbyGroupeWS(this.idRubrique, this.idToken).subscribe(obsWS => {
                    let obs = this.ij2srvc.transformeWSReponse(obsWS);
                    if (obs.success && obs.msg != null && obs.msg.length > 0) {
                        this.Export.libelleCompte = obs.msg[0].libelcpt;
                    }
                });
            }
            if (this.Export.libelleDate == '') {
                const date = new Date(Date.now());
                const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                const semaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                this.Export.libelleDate = semaine[date.getDay()] + ' ' + this.ajouteZero(date.getDate()) + ' ' + mois[date.getMonth()] + ' ' + date.getFullYear();
            }
        }
        else if (cat == "OPD") {
            if (this.OPD.fileAttente == null) {
                this.OPD.mpChoisi = this.OP.listeMP[1];
                this.OPD.abrevMP = this.OP.listeMP[0].abreviation;
                this.OPD.chargeListe = true;
                let data = {
                    prestation: this.prestation,
                    page: 1,
                    size: 1000,
                    dr: this.dr
                };
                let that = this;
                this.ij2srvc.listTecOpTempSupWS(data, this.idToken).subscribe(obs => {
                    if (obs.status == 200 && obs.body != null) {
                        let _fileAttente = obs.body;
                        for (let opTemp of _fileAttente['tecBenef']) {
                            opTemp.nomBenef = '';
                            opTemp.prenomBenef = '';
                            opTemp.cinBenef = '';
                            that.ij2srvc.infoIndivWebService(opTemp.tecop.tecbenef[0].id_benef, this.idToken).subscribe(obsIWS => {
                                if (obsIWS.body != null) {
                                    opTemp.nomBenef = obsIWS.body['nom'];
                                    opTemp.prenomBenef = obsIWS.body['prenoms'];
                                    opTemp.cinBenef = obsIWS.body['cin'];
                                }
                                else {
                                    this.ij2srvc.infoEmployeurWS(opTemp.id_benef, this.idToken).subscribe(empl => {
                                        opTemp.nomBenef = empl.body.employeur_nom;
                                    });
                                }
                            });
                        }
                        that.OPD.fileAttente = _fileAttente;
                        that.creeFileAttenteOPD();
                    }
                    that.OPD.chargeListe = false;
                });
            }
        }
    }

    ajouteZero(nombre: number) {
        if (nombre < 10) {
            return '0' + nombre;
        }
        return nombre;
    }

    prendListeOp() {
        this.Liste.charge = true;
        const that = this;
        this.Liste.liste = [];
        this.traitSrvc.listTecopbyprestationWS(this.Liste.filtre, this.idToken).subscribe(obs => {
            console.log("LIST OP =>", obs)
            if (obs.status == 200 && obs.body != null && obs.body['l'] != null) {
                console.log("Liste :", obs.body);

                that.Liste.liste = obs.body['l'];
            }
            that.Liste.charge = false;
        });
    }

    filtreChange() {
        this.Liste.filtre.page = 1;
        this.prendListeOp();
    }
}
