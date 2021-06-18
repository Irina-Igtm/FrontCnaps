import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { InputBase } from './../services/input-service/input-base';
import { Router } from '@angular/router';
import { TraitementService } from './../services/traitement/traitement.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Ij2ServiceService } from '../services/ij2-service.service';
import { FileModel } from 'app/models/file-model';
import { ThrowStmt } from '@angular/compiler';
import { data } from 'jquery';


declare var $: any;
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  //pièces justificatives
  name: any;
  type: any;
  picByte: any;

  page:any;
  max:any;
  nbPage:any;
  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;
  @ViewChild('matricule') matricule;
  @ViewChild('ajputAdresse') ajputAdresse;
  @ViewChild('modalMP') modalMP;
  typeAdr = [{ id: 1, libelle: 'correspondance' }, { id: 2, libelle: 'physique' }];
  modepaietiers;
  items: any[] = []
  InfoIj1: any
  droitIj1;
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
  rechercheIndiv: any;
  matriculeIndividu: any
  param = {
    nom: "",
    prenoms: "",
    date_naissance: "",
    cin: ""
  }
  ListIndiv: any
  // Famille
  famille: any;
  listeEmpl: any;
  listeMP: any;
  modePaie: any;
  indiv: number;
  checkEmpl: any;
  // piece = [{ id: 1, nom: "Demande Inemnite Journalière 2" },
  // { id: 2, nom: "Certificat médical" },
  // { id: 1, nom: "Acte de naissance" }];

  piesy: any[]
  // MP
  mp = {
    id_individu: null,
    type_mdp: null,
    banque: null,
    agence: null,
    numero: null,
    numero_cmpt: null,
    id_mode_paiement: null,
    caisse: null
  }

  mpDmd = {
    id_individu: null,
    banque: null,
    agence: null,
    numero: null,
    numero_cmpt: null,
    id_mode_paiement: null,
    caisse: null
  }
  typeMp = [{ nom: "virement" }, { nom: "espece" }, { nom: "mobile" }];
  modeP: any[] = []
  refAcc: any;
  TypeMp: any[];
  tecIj1: any[];

  //Pièces
  show: boolean = false;
  prolongation: any;
  @Input() pieces: InputBase<any>[] = [];
  @Input() peaces: InputBase<any>;
  @Input() inputs: InputBase<any>[] = [];
  @Input() idfiles: string;
  @Input() form: FormGroup;
  ijForm: FormGroup
  private fb: FormBuilder
  isChecked: boolean;
  testNom = [];
  autrePieces = [];
  autrePieceValue = [];
  nomFichier = [];
  code_prestation = 422;
  @Input() accept: string = null;
  piecesAccuse = [];
  id_demande: any

  //info
  employeur: any;

  constructor(
    private traitSvc: TraitementService,
    private routes: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private ij2srvc: Ij2ServiceService,
    private http: HttpClient
  ) {
    // this.ijForm = this.fb.group({
    //   'matrIndiv': ['']
    //   //   'employeur': ['']
    // });
    this.isChecked = true;
  }

  ngOnInit() {
    document.title = "DEMANDE - IJ2";
    this.accessToken = localStorage.getItem('user');
    this.idToken = JSON.parse(this.accessToken).accessToken;
    this.prendReferenceDemande();
    this.getTypeAdr();
    for (let i = 0; i < this.typeMp.length; i++) {
      this.modeP.push({ id: this.typeMp[i].nom, text: this.typeMp[i].nom })
    } this.rechercheIndiv = {
      id_individu: null,
      nom: null,
      prenoms: null,
      date_naissance: null,
      cin: null
    };

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
        console.log(res);

        this.listeMP = res.body
      } else {
        this.toastr.error('error', "Erreur de connexion Mode de payement")
      }
    })
  }

  modePaiementChange(mp) {
    console.log("MODE PAIEMENT", mp);

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
        this.tecInfoIj1(this.ancien.id_acc)
        if (this.ij1.etat == 2) {
          this.ancien.etat = "Demande validée"
        } else if (this.ij1.etat == 1) {

          this.ancien.etat = "Demande en attente de validatien"

        }

        this.traitSvc.getnombredejourij1WS(this.ij1.id_acc.toString(), this.idToken).subscribe(data => {
          if (data.status == 200) {
            const nbjrij1 = data.body;
            this.traitSvc.decompteIjWS(this.ancien.id_acc, this.idToken).subscribe(result => {
              if (result.status == 200 && result.body != null) {
                console.log("RESULTAT DROIT IJ1", result.body);
                this.InfoIj1 = result.body
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


  tecInfoIj1(ref) {
    this.traitSvc.prendInfoRecuParIdAcc(ref, this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.tecIj1 = res.body
      }
    })
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
    this.getAllMp()
    $(this.modalMP.nativeElement).modal('show');
  }

  hideModalMP() {
    $(this.modalMP.nativeElement).modal('hide');
  }

  showModalAdresse() {
    ;
    $(this.ajputAdresse.nativeElement).modal('show');
  }

  hideModalAdresse() {
    $(this.ajputAdresse.nativeElement).modal('hide');
  }

  ajouterMP() {
    this.mpDmd = {
      id_individu: this.Dmd.champ.accueilMod.idIndividu,
      banque: this.mp.banque,
      agence: this.mp.agence,
      numero: this.mp.numero,
      numero_cmpt: this.mp.numero_cmpt,
      id_mode_paiement: this.mp.type_mdp,
      caisse: this.mp.caisse
    }
    this.traitSvc.saveModepaie(this.mpDmd, this.idToken).subscribe(res => {
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
    if (this.ij1.etat == 2) {
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
    } else {
      this.toastr.info("Votre ancien demande n'est pas encore validée , veuillez retsez en attente")
    }
  }
  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
  }

  insererDemande() {
    const formValue = this.ijForm.value;
    let dateDepot;
    const tecInfoNonRequis = this.ij2srvc.setValidFormDataForDynamicForms_toKeyArray(this.pieces);
    tecInfoNonRequis.push('matrIndiv');
    //  tecInfoNonRequis.push('empl');
    const tecInfRec = this.ij2srvc.setTecInfRec(formValue, this.referenceDemandeIj, tecInfoNonRequis);

    let tecPcsNonRequis = this.ij2srvc.setValidFormDataForDynamicForms_toKeyArray(this.inputs);
    tecPcsNonRequis.push('matrIndiv');
    let tecPcsRec = this.ij2srvc.setTecPcsRec(formValue, this.referenceDemandeIj, tecPcsNonRequis);

    for (let i = 0; i < tecInfRec.length; i++) {
      if (tecInfRec[i].idTypeInfo === '45') {
        dateDepot = tecInfRec[i].valeur;
        break;
      }
    }
    //eto zao ambony
    let msg = {}
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name)
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
      tecInfoRecuMod: this.tecIj1,
      infodmd: {
        montantij1: this.ancien.salaire,
        demisalaire: this.ancien.demisalaire,
        nbrjrpost: this.ancien.nbjourpost,
        nbjrpre: this.ancien.nbjourpre,
        nationaliote: this.individu.nationalite,
        sexe: this.individu.sexe,
        dateDossier: this.ancien.date_dossier,
        observations: this.ancien.observations,
        droipost: this.ancien.postnatale,
        droitpre: this.ancien.prenatale,
        reference: this.referenceDemandeIj
      },
      modepaietiers: {
        id_mode_paiement: this.mp.type_mdp,
        id_individu: this.indiv,
        banque: this.modePaie.banque,
        numero_cmpt: this.modePaie.numero_cmpt,
        numero: this.modePaie.numero,
        agence: this.modePaie.agence,
        IdACc: this.referenceDemandeIj,
        caisse: this.modePaie.caisse
      },
      tecPcsRecMod: tecPcsRec,

    };

    this.traitSvc.saveDemande(msg, this.idToken).subscribe(res => {
      let dataSave = this.traitSvc.transformeWSReponse(res);
      if (dataSave.success) {
        console.log("DONNEES DEMADE", msg);
        this.saveAccuse();
        localStorage.setItem("stock", JSON.stringify(msg));
        localStorage.getItem('user');
        localStorage.setItem("typeDemande", "Demande Indeminité Journalière deuxième tranche");
        const notifMessage = "Votre demande d'indemnité journalière deuxième tranche Réf-" + this.referenceDemandeIj + " a été enregistré mais en cours de traitement.";
        this.toastr.success(notifMessage);
        this.id_demande = this.referenceDemandeIj;
        const Pcs = this.ij2srvc.getTecPcsForMongo(formValue, tecPcsNonRequis);
        let fichiers = [];
        for (let i = 0; i < Pcs.length; i++) {
          if (Array.isArray(Pcs[i])) {
            for (let j = 0; j < Pcs[i].length; j++) {
              Pcs[i][j].serviceName = "Demande IJ2";
              this.piecesAccuse.push(Pcs[i][j].name);
              fichiers.push(Pcs[i][j]);
            }
          }
        }
        if (this.autrePieceValue.length > 0) {
          for (let i = 0; i < this.autrePieceValue.length; i++) {
            this.autrePieceValue[i].id_files = this.id_demande;
            this.piecesAccuse.push(this.autrePieceValue[i].name);
            fichiers.push(this.autrePieceValue[i]);
          }
        }
        this.ij2srvc.saveFilesWS(fichiers).subscribe(data => {
          if (data.status == 200) {
            this.toastr.success('Fichier enregistré avec succes');
          } else {
            this.toastr.warning('Erreur d\'enregistrement du fichier');
          }
        });
        localStorage.setItem("piecesAccuse", JSON.stringify(this.piecesAccuse));
        const dateToday = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd')
        this.showModalAR();
      } else {
        this.toastr.error('error', 'Veuillez choisir un mode de paiement')
      }
    });
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

  getAllMp() {
    this.typeMp = []
    this.traitSvc.getAllMp(this.idToken).subscribe(res => {
      if (res.status == 200) {
        this.typeMp = res.body
      }
    })
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

  versNoteRetour(reference) {
    this.routes.navigate(['/accusereception/' + reference])
  }

  selectMp(index) {
    console.log(index.target.value);
    this.mp.type_mdp = index.target.value
  }

  filtreChange(sur) {
    if (sur == 'surNom') {
      this.changeCritere();
    }
    else if (sur == 'surPrenom') {
      this.changeCritere();
    }
    else if (sur == 'surDatenais') {
      this.changeCritere();
    }
    else if (sur == 'surCin') {
      this.changeCritere();
    }
  }
  changeCritere() {
    this.param.nom = this.param.nom,
      this.param.prenoms = this.param.prenoms,
      this.param.date_naissance = this.param.date_naissance,
      this.param.cin = this.param.cin
    this.prendListe();
  }
  prendListe() {
    let msg={}
    this.show = true;
    msg={
      param : this.param
    }

    this.ij2srvc.prendListeIndiv(msg, this.idToken).subscribe(data => {
      if (data.status == 200) {
        this.ListIndiv = data.body['result'];
        this.page = data.body['page'];  
        this.max = data.body['max'];
        this.nbPage = data.body['nbPage'];
        this.show = false;
      }
      else {
        this.toastr.warning('Impossible de recupérer la liste des individus');
        this.show = false;
      }
    }
    );
  }
  //Manomboka eto
  addinputfile() {
    this.testNom.push(true);
    this.autrePieces.push(1)
  }

  getName(event, indice) {
    this.nomFichier[indice] = event.target.value;
    if (this.nomFichier.length === 0 || this.nomFichier[indice] === "" || this.nomFichier[indice] === undefined || this.nomFichier[indice] === null) {
      this.testNom[indice] = true;
    }
    else {
      this.testNom[indice] = false;
    }
    console.log(this.nomFichier[indice]);
  }

  checkValue(value) {
    var obj = {};
    this.show = true;
    if (!value.target.checked) {
      this.prolongation = 1;
      this.loadInputFile(this.prolongation);
    }

    else {
      this.prolongation = 0;
      this.loadInputFile(this.prolongation);
    }
    this.show = false;
  }

  loadInputFile(prol) {
    const obj = {
      "idtecdmd": "422",
      "prolongation": prol
    };
    this.ij2srvc.getPiecesRequiseIj2WS(obj, this.idToken).subscribe(data => {
      if (data.status == 200) {
        const listForm = data.body;
        this.pieces = this.ij2srvc.setValidFormDataForDynamicFormsPieces(listForm);
        this.ijForm = this.ij2srvc.addControlToFormGroupPcs(this.ijForm, this.pieces);
        //  this.show = true;
      } else {
        this.toastr.warning('Erreur: liste libellé requis Ij 2');
      }
    });

  }

  supprimerFichier(index) {
    this.autrePieceValue.splice(index, 1);
    this.autrePieces.splice(index, 1);
  }

  
}
