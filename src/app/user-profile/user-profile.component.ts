import { Router } from '@angular/router';
import { TraitementService } from './../services/traitement/traitement.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Ij2ServiceService } from '../services/ij2-service.service';



declare var $: any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('matricule') matricule;
  @ViewChild('ajputAdresse') ajputAdresse;
  @ViewChild('modalMP') modalMP;
  typeAdr = [{ id: 1, libelle: 'correspondance' }, { id: 2, libelle: 'physique' }];
  items: any[] = []
  idToken;
  accessToken;
  dataMP;
  Dmd = {
    drDemandeur: "42",
    listeEmployeur: [],
    listeSuccursale: [],
    listeInfoReq: [],
    listePcsReq: [],
    champ: {
      accueilMod: {
        idAcc: null,
        idEmpl: null,
        idIndividu: null,
        idSuccursale: null,
        userInsert: null,
        dateDossier: null
      },
      tecInfoRecuMod: [],
      tecPcsRecMod: [],
      listeEnfant: []
    },
    pieces: {},
    modePaiement: null,
    feuillet: {
      matriculeDemandeur: null,
      nomDemandeur: null,
      nomConjoitFemme: null
    },
    aUneAdresse: false
  };
  ancien = {
    id_acc: null,
    date_dossier: null,
    etat: null,
    observations: null,
    nbjrij1: null,

    dat: null,
    date_debut_postnatale: null,
    date_debut_prenatale: null,
    date_fin_postnatale: null,
    demisalaire: null,
    dpa: null,
    ij1: null,
    nbjourpost: null,
    nbjourpre: null,
    postnatale: null,
    prenatale: null,
    salaire: null
  };
  adresse: any;
  ij1: any;
  referenceDemandeIj: any;
  showAdresse: boolean = false;
  showIj1: boolean = false;
  // ADRESSE
  numero: any;
  libelle: any;
  quartier: any;
  adresse_e_mail: any;
  adresse_fax: any;
  adresse_telephone: any;
  dataAdresse: any;
  entity: string;
  acces: any;
  dataType: any;
  itemsFokotany: any[] = [];
  fokontany: string;
  type_adresse: string;
  type_lieu: string;
  showSaveAddresse: boolean = false;
  refuseDmd: boolean = false;
  accesindiv: boolean = false
  id_adresse: any
  user: any

  //INDIVIDU
  individu = {
    nom: null,
    prenoms: null,
    date_naissance: null,
    nationalite: null,
    cin: null,
    profession: null,
    sexe: null,
    id_sexe: null
  }
  // Famille
  famille: any;
  listeEmpl: any;
  listeMP: any;
  modePaie: any;
  indiv: number;
  checkEmpl: any;
  piece = [{ id: 1, nom: "Demande Inemnite Journalière 2" },
  { id: 2, nom: "Certificat médical" },
  { id: 1, nom: "Acte de naissance" }];
  piesy: any[]
  // MP
  mp = {
    id_individu: null,
    type_mdp: null,
    banque: null,
    agence: null,
    numero: null,
    numero_cmpt: null
  }
  typeMp = [{ nom: "virement" }, { nom: "espece" }, { nom: "mobile" }];
  modeP: any[] = []
  refAcc: any;
  constructor(
    private traitSvc: TraitementService,
    private routes: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private ij2srvc: Ij2ServiceService
  ) { }

  ngOnInit() {
    document.title = "DEMANDE - IJ2";
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;
    this.prendReferenceDemande();
    this.getTypeAdr();
    for (let i = 0; i < this.typeMp.length; i++) {
      this.modeP.push({ id: this.typeMp[i].nom, text: this.typeMp[i].nom })
    }
  }

  valideMatricule(index) {
    if (index.target.value.length > 12) {
      this.getInfoIndiv(index.target.value);
      if (this.refuseDmd) {
        this.toastr.error('Sexe masculin')
      } else {
        this.getDemandeIJ1(index.target.value);
        this.getInfoFamille(index.target.value);
        this.getEmployeur(index.target.value);
        this.getModePayement(index.target.value);
        this.indiv = index.target.value
      }

    } else {
      this.toastr.warning('info', "le matricule entrer doivent etre 13 chiffres")
    }
  }

  getModePayement(matricule) {
    this.traitSvc.listeMP(matricule, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.listeMP = res.body
        console.log("MP", this.listeMP);

      } else {
        this.toastr.error('error', "Erreur de connexion Mode de payement")
      }
    })
  }

  modePaiementChange(mp) {
    this.modePaie = mp;
  }

  employeurChange(empl) {
    this.checkEmpl = empl.sig.id_empl.id_empl
  }

  getEmployeur(matricule) {
    this.traitSvc.getEmployeur(matricule, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.listeEmpl = res.body

      } else {
        this.toastr.error('error', "Erreur de connexion employeur")
      }
    })
  }

  getInfoIndiv(matricule) {
    this.traitSvc.infoIndividu(matricule, this.idToken).subscribe(res => {
      console.log("INFO INDIV =", res)
      if (res.status == 200) {
        this.user = res.body;
        this.accesindiv = true
        if (res.body.id_sexe.id_sexe === 'M') {
          this.refuseDmd = true
        } else {
          this.refuseDmd = false
          this.toastr.success("Affichage info individu avec success")
          this.individu.nom = res.body.nom
          this.individu.prenoms = res.body.prenoms
          this.individu.date_naissance = res.body.date_naissance
          this.individu.nationalite = res.body.id_nationalite.libelle
          this.individu.profession = res.body.profession
          this.individu.sexe = res.body.id_sexe.libelle
          this.individu.id_sexe = res.body.id_sexe.id_sexe
        }
      } else {
        this.toastr.error('error', "Erreur de connexion")
      }
    })
  }

  getInfoFamille(matricule) {
    this.traitSvc.infoFamille(matricule, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.toastr.success('success', "Affichage info famille avec success");
        this.famille = res.body;
      } else {
        this.toastr.error("Erreur de connexion info famille")
      }
    })
  }

  getDemandeIJ1(matricule) {
    this.showIj1 = true;
    this.traitSvc.getDemandeWS(matricule, 421, this.idToken).subscribe(res => {
      if (res.status == 200 && res.body.id_acc != null) {
        this.showIj1 = false;
        this.ij1 = res.body;
        this.ancien.id_acc = this.ij1.id_acc;
        this.ancien.date_dossier = this.ij1.date_dossier;
        this.ancien.observations = this.ij1.observations;
        this.Dmd.champ.accueilMod.idIndividu = this.ij1.id_individu;
        if (this.ij1.etat == 1) {
          this.ancien.etat = "Demande IJ1 validée"
        } else {
          this.ancien.etat = "Demande IJ1 en attente de validation"
        }
        this.traitSvc.getnombredejourij1WS(this.ij1.id_acc.toString(), this.idToken).subscribe(data => {
          if (data.status == 200) {
            const nbjrij1 = data.body;
            this.traitSvc.decompteIjWS(this.ancien.id_acc, this.idToken).subscribe(result => {
              if (result.status == 200 && result.body != null) {
                const decom = result.body;
                this.ancien.dat = decom.dat;
                this.ancien.dpa = decom.dpa;
                this.ancien.nbjourpost = decom.nbjourpost;
                this.ancien.nbjourpre = decom.nbjourpre;
                this.ancien.date_fin_postnatale = decom.date_fin_postnatale;
                this.ancien.date_debut_postnatale = decom.date_debut_postnatale;
                this.ancien.date_debut_prenatale = decom.date_debut_prenatale;
                this.ancien.demisalaire = decom.demisalaire;
                this.ancien.postnatale = decom.postnatale;
                this.ancien.prenatale = decom.prenatale;
                this.ancien.ij1 = decom.ij1;
                this.ancien.salaire = decom.salaire;
              }
            })
          }
        })
      } else {
        this.showIj1 = false;
        this.toastr.error("error", "l\'individu n'a pas de demande IJ1")
      }
    })
    this.getAdresse(matricule)
  }

  prendReferenceDemande() {
    const ref = {
      "prestation": "422",
      "dr": 42
    };
    this.traitSvc.prendReferencePF(ref, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.referenceDemandeIj = res.body['reference'];
      } else {
        this.toastr.error("error", "Erreur de prendre reference")
      }
    })
  }

  getAdresse(matricule) {
    this.showAdresse = true;
    this.traitSvc.getAdresse(matricule, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.showAdresse = false;
        this.adresse = res.body;
      }
    })
  }

  showModalAR() {
    $(this.matricule.nativeElement).modal('show');
  }

  hideModalAR() {
    $(this.matricule.nativeElement).modal('hide');
    this.routes.navigate(['/']);
  }

  /*
   * router pour accuse de reception
  */
  accuse() {
    this.routes.navigate(['/accusereception/recevable']);
  }

  showModalMP() {
    $(this.modalMP.nativeElement).modal('show');
  }

  hideModalMP() {
    $(this.modalMP.nativeElement).modal('hide');
  }

  showModalAdresse() {
    $(this.ajputAdresse.nativeElement).modal('show');
  }

  hideModalAdresse() {
    $(this.ajputAdresse.nativeElement).modal('hide');
  }

  ajouterMP() {
    this.dataMP = {
      id_individu: this.Dmd.champ.accueilMod.idIndividu,
      type_mdp: this.mp.type_mdp,
      banque: this.mp.banque,
      agence: this.mp.agence,
      numero: this.mp.numero,
      numero_cmpt: this.mp.numero_cmpt
    }
    this.traitSvc.saveModepaie(this.dataMP, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.getModePayement(this.Dmd.champ.accueilMod.idIndividu);
        this.hideModalMP();
        this.toastr.success('Ajout mode de payement avec success')
      }
    })
  }

  ajoutAdresse() {
    this.showSaveAddresse = true;
    const complement = this.numero + ' ' + this.libelle;
    const fkt = {
      id_fokontany: this.fokontany
    };
    const typeAdr = {
      id_type: this.type_adresse
    };
    const today = Date.now();
    const date = new Date(today);
    const month = (date.getMonth()) + 1;
    const date_adr = date.getFullYear() + '-' + month + '-' + date.getDate();
    this.acces = {
      adresse_quartier: this.quartier,
      adresse_telephone: this.adresse_telephone,
      adresse_e_mail: this.adresse_e_mail,
      adresse_fax: this.adresse_fax,
      fokontany: fkt,
      id_type: typeAdr,
      adresse_date: today,
      id_individu: this.Dmd.champ.accueilMod.idIndividu,
      type: "",
      numero: this.numero,
      libelle: this.libelle,
      complement: complement
      // id_adresse:'215629'
    };

    const data = {
      data: this.acces
    };

    this.traitSvc.saveAdresse(this.acces, this.idToken).subscribe(
      dataResponse => {
        if (dataResponse.status == 200) {
          this.showSaveAddresse = false;
          this.toastr.success('success', 'Ajout adresse reussie')
          this.getAdresse(this.Dmd.champ.accueilMod.idIndividu)
          this.hideModalAdresse();
        } else {
          this.showSaveAddresse = false;
          this.toastr.error('error', 'Erreur de connexion')
          // setTimeout( () => this.toastr.error(dataResponse.msg, 'Erreur'));
        }
      }
    );
  }


  ValideSaveDemande() {
    let MPDemande = {}
    if (this.modePaie != null || this.checkEmpl != null) {
      this.insererDemande()
      MPDemande = {
        modepaiement: this.modePaie.type_mdp,
        agence: this.modePaie.agence,
        banque: this.modePaie.banque,
        numero_cmpt: this.modePaie.numero_cmpt
      }
      localStorage.setItem("modepaie", JSON.stringify(MPDemande))
    }
    else {
      this.saveNoteRetour();
    }
  }

  insererDemande() {
    let msg = {}
    this.piesy = [];
    for (let i = 0; i < this.piece.length; i++) {
      const element = this.piece[i].nom;
      this.piesy.push(element)
    }
    msg = {
      accueilMod: {
        id_acc: this.referenceDemandeIj,
        id_tec_dmd: 422,
        date_dossier: new Date(),
        id_individu: this.indiv,
        id_succursale: this.Dmd.champ.accueilMod.idSuccursale,
        id_empl: 1,
        user_insert: JSON.parse(this.accessToken).username,
        num_doss: "",
        observations: " Demande indemnité journalière 2 ème tranche"
      },
      tecInfoRecuMod: [],
      tecPcsRecMod: [],
    };
    
    this.traitSvc.saveDemande(msg, this.idToken).subscribe(res => {
      let dataSave = this.traitSvc.transformeWSReponse(res);
      if (dataSave.success) {
        this.saveAccuse();
        localStorage.setItem("stock", JSON.stringify(msg));
        localStorage.getItem('user');
        localStorage.setItem("typeDemande", "Demande Indeminité Journalière deuxième tranche");
        const notifMessage = "Votre demande d'indemnité journalière deuxième tranche Réf-" + this.referenceDemandeIj + " a été enregistré mais en cours de traitement.";
        this.toastr.success(notifMessage);
        const dateToday = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
        const content = {
          expediteur: this.user.id_acces,
          destinataire: this.user.id_acces,
          titre: "Demande d'indemnité journalière deuxieme tranche",
          message: notifMessage,
          typeNotif: '',
          dateEnvoi: dateToday,
          referenceNotif: this.referenceDemandeIj
        };
        // this.traitSvc.sendNotif(this.user.id_acces, content).then(() => {
        //   this.toastr.success('Notification envoyé');
        // }, (err) => {
        //   this.toastr.warning('Notification non envoyé');
        // }
        // );
        this.showModalAR();
      } else {
        this.toastr.error('error', 'Veuillez choisir un mode de paiement')
      }
    })
  }

  public inputTyped(source: string, text: string) {
    if (text.length >= 3) {
      this.traitSvc.listFokontanyWS(text, this.idToken).subscribe(dataWs => {
        if (dataWs.status == 200) {
          console.log("LIST FKT", dataWs.body);
          this.initData(dataWs.body.resultat);
        }
      });
    }
  }


  private initData(data: any[]) {
    this.itemsFokotany = [];
    for (let i = 0; i < data.length; i++) {
      this.itemsFokotany.push({ id: data[i].id_fokontany, text: data[i].libelle + ' ' + data[i].firaisana.fivondronana.id_fiv });
    }
    console.log("list init fkt", this.itemsFokotany);
  }

  getTypeAdr() {
    for (let i = 0; i < this.typeAdr.length; i++) {
      this.items.push({ id: this.typeAdr[i].id, text: this.typeAdr[i].libelle })

    }
  }

  saveAccuse() {
    let accuseMsg = {}
    accuseMsg = {
      matricule: this.indiv,
      nom: this.individu.nom,
      prenom: this.individu.prenoms,
      typeDemande: null,
      agentAccueil: JSON.parse(this.accessToken).username,
      observation: "Demande indemnité journalière 2 ème tranche en attente de validation",
      page: 1,
      size: null,
      listePiece: ["Pièces justificatives"]
    };
    this.ij2srvc.ajoutAccuseWS(accuseMsg, this.idToken).subscribe(data => {
      if (data.status == 200) {
        this.toastr.success("Ajout des messages réussie")
      }
    });
  }

  saveNoteRetour() {
    let accuseMsg = {}
    accuseMsg = {
      matricule: this.indiv,
      nom: this.individu.nom,
      prenom: this.individu.prenoms,
      typeDemande: null,
      agentAccueil: JSON.parse(this.accessToken).username,
      observation: "Demande indemnité journalière 2 ème tranche vers le note de retour",
      page: 1,
      size: null,
      listePiece: ["Pièces justificatives"]
    };
    this.ij2srvc.ajoutAccuseWS(accuseMsg, this.idToken).subscribe(data => {
      if (data.status == 200) {
        this.toastr.success("Ajout des messages réussie")
        this.versNoteRetour(data.body.reference)
      }
    });
  }

  versNoteRetour(reference){
    this.routes.navigate(['/accusereception/'+reference])
  }

}
