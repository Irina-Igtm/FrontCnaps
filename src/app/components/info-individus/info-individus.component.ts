import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
// import { Router, ActivatedRoute, Params } from '.../../node_modules/@angular/router';
import { Router, ActivatedRoute, Params } from '../../../../node_modules/@angular/router';
import { InfoService } from '../../services/info/info.service';
import { TravailleurService } from '../../services/travailleur/travailleur.service';
import { AdresseService } from '../../services/adresse/adresse.service';
import { UiService } from '../../services/ui/ui.service';
import { BanqueService } from '../../services/banque/banque.service';
import { EmployeurModel } from '../../models/employeur/employeurModel';
import { TravailleurModel } from '../../models/travailleur/travailleurModel';
import { Statu } from '../../models/individu/statu';
import { FileService } from '../../services/file/file.service';
import { IjService } from '../../services/ij/ij.service';
import { IjPfService } from '../../services/ij-pf/ij-pf.service';
import { Indivu } from '../../models/individu/indivu';


declare var $: any;

@Component({
  selector: 'app-info-individus',
  templateUrl: './info-individus.component.html',
  styleUrls: ['./info-individus.component.css']
})
export class InfoIndividusComponent implements OnInit, OnChanges {

  @Input() matricule: string;
  @Input() no_connection = false;
  @Input() detailAgent = false;
  @Input() couleur = null;
  @Output() modePaiementChange = new EventEmitter();
  @Output() statuIndividu = new EventEmitter();
  @Output() indiv = new EventEmitter();
  @Output() adresse = new EventEmitter();
  @Output() aUneAdresse = new EventEmitter();
  @Input() detailSeulement = false;
  @ViewChild("detailMp") detailMp;

  private user: any;
  public show: boolean;
  public show1: boolean;
  public showtype: boolean;
  idModPChoisi: any;
  entity: string;
  dataUser: any;
  dataCIT: any;
  dataBanque: any;
  dataAdresse: any;
  dataFamille: any;
  dataConjoint: any;
  dataEnfant: any[] = [];
  libelleStatu = '';
  statu: any;
  status: Statu[] = [];
  individu: EmployeurModel;
  travailleur: TravailleurModel;
  afficheMP = [];
  indicedetailmp = -1;
  compte: any;
  numtiers: any;
  codeagence: any;
  agence: any;
  institutionsortie: any;
  nombanque: any;
  mp: any;
  idMp: any;
  id_mp_get: any;
  select: null;
  mpsplit: any;
  pieceMP: any[] = [];
  infoConjoint: Indivu = new Indivu();
  idToken;
  affichelisteMP: any[];
  id_institution: any;
  listeInstitution = [];
  listereseau = [];
  listAutreAdress : any;
  listLieuAgence: any[];
  index: any;
  reference: any;
  max = "15";
  retour = {
    adresse_quartier: "",
    adresse_telephone: "",
    adresse_e_mail: "",
    adresse_fax: "",
    fokontany: {
      id_fokontany : ""
    },
    id_type: {
      id_type : ""
    },
    adresse_date: new Date().toISOString().split('T')[0],
    id_individu: "",
    id_empl: "",
    type: "",
    numero: "",
    libelle: "",
    complement: "",
    id_adresse: ""
  }
  dataToBack = {
    "compte": "",
    "cle": "22",
    "date_debut": "",
    "date_fin": null,
    "code_swift": "",
    "domiciliation": "",
    "idtiers": "",
    "defaut": null,
    "id_agence": {
      "id_agence": 145,
      "id_institution": {
        "id_institution": 5,
        "abreviation": null,
        "libelle": null,
        "code": null,
        "id_mode_paiement": null
      },
      "code_agence": null,
      "nom_agence": null,
      "id_reseau": {
        "idreseau": 2,
        "libelle": null,
        "idbanque": null
      }
    },
    "id_mode_paiement": {
      "id_mode_paiement": 2,
      "libelle": null,
      "abreviation": null
    },
    "caisse": null,
    "numero": null
  };
  itemsFokotany: any[] = [];
  dataagence = {
    agence: {
      id_institution: {
        id_institution: 22,
        abreviation: null
      },
      id_reseau: null,
      code_agence: "",
      nom_agence: ""
    },
    modep: {
      id_mode_paiement: {
        id_mode_paiement: 1,
        libelle: null,
        abreviation: null
      },
      tiersgroupe: null
    }
  };
  libelleAgence: any;
  dateDebut: any;
  showModif = true;
  showMaj = true;
  idModePaiementTiers: any;
  caisse: any;
  numero: any;
  abrevModePaiement: any;
  abbrevBanque: any;
  idAgence: any;
  idInstitution: any;
  idModePaiement: any;
  codeSwift: any;
  dateDebutUpd: any;
  compteUpd: any;
  showVir: boolean = false;
  showMobile: boolean = false;
  numeroUpd: any;
  pager = 1;
  dataType: any;
  showload = false;

  constructor(
    private infoService: InfoService,
    private travailleurService: TravailleurService,
    private adresseService: AdresseService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private ui: UiService,
    private fileService: FileService,
    private banqueService: BanqueService,
    private route: ActivatedRoute,
    private ijpf: IjPfService,


  ) {
    this.show = false;
    this.show1 = false;
    this.showtype = false;
    this.banqueService.listeMPvalideWS(localStorage.getItem('id_token')).subscribe(dataWS => {
      console.log("listeMPvalideWS", dataWS);
      let data = this.ui.transformeWSReponse(dataWS);
      if(data.success){
        this.affichelisteMP = data.msg;
      }
    });
  }


  ngOnInit() {
    this.idToken = localStorage.getItem("id_token");
    //this.idModPChoisi = localStorage.removeItem('idModPChoisi');
    //console.log("idModPChoisi initial =>", this.idModPChoisi);
    console.log("Affiche Est ==> 1");
    this.initAllData();
    this.prendListeEnfant();
    this.route.params.subscribe((params:Params) => {
      this.reference = params['id'];
    })
    this.adresseService.getTypeAdresseWS(this.idToken).subscribe(dataWS => {
      let data = this.ui.transformeWSReponse(dataWS);
      if (data.success) {
        this.dataType = data.msg;
        console.log("LOG", this.dataType);
      }
      else {
        setTimeout(() => this.toastr.error(data.msg));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Affiche Est ==> 0");
    if (changes.matricule) {
      const sc: SimpleChange = changes.matricule;
      if (sc.currentValue) {
        this.matricule = sc.currentValue;
     // this.reinitData();
      this.initAllData();
    }
  }
  }

  onChangeInstitution(event) {
    this.show1 = true;
    const value = event.value;
    this.id_institution = value;
    console.log("id indtitu", this.id_institution);

    const obj = {
      modepaie: this.mpsplit[0],
      institution: this.id_institution
    };
    console.log("data get", obj);
    const id = this.id_institution;
    this.getAgence(obj);
    this.getReseau(id);
  }

  getAgence(obj) {
    console.log("dataAgence1", obj);
    this.listLieuAgence = [];
    this.banqueService.listAgenceByBanqueWS(obj, localStorage.getItem('id_token')).subscribe(dataWS => {
      let data = this.ui.transformeWSReponse(dataWS);
      if (data.success) {
        this.show1 = false;
        this.initDataRH(data.msg);
        console.log("liste agence", this.listLieuAgence);
      } else {
        this.show1 = false;
        this.toastr.error(data.msg);
      }
    });
  }


  initDataRH(data: any[]) {
    console.log("DATA AGENCE", data);
    this.listLieuAgence = [];
    for (let i = 0; i < data.length; i++) {
      this.listLieuAgence.push({id : data[i].id_agence.id_agence, text: data[i].id_agence.code_agence+'-'+data[i].id_agence.nom_agence});
      console.log("enjana222", this.listLieuAgence);
    }
  }

  getReseau(id) {
    console.log("data reseau", id);
    this.listereseau = [];
    this.banqueService.listeReseauWS(id, localStorage.getItem('id_token')).subscribe(reseauWS => {
      let reseau = this.ui.transformeWSReponse(reseauWS);
      if (reseau.success) {
        this.listereseau = reseau.msg;
        console.log("Liste reseau", this.listereseau);
        this.toastr.success("liste reseau chargé avec succes");
      } else {
        this.toastr.error("Pas de liste reseau")
      }
    });
  }

  initAllData() {
    if (this.no_connection) {
      this.user = { id_acces: this.matricule };
      this.entity = 'T';
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.entity = this.user.type_entite;
    }

    this.infoService.infoIndivWebService(this.user.id_acces).subscribe(data => {
      // tslint:disable-next-line:triple-equals
      console.log("  this.infoService.infoIndivWebService", data);

      if (data.status == 200) {
        if (data.body) {
          this.dataUser = <any>data.body;
          this.indiv.emit(this.dataUser);
          this.infoService.infoFiraisana(this.dataUser.id_firaisana_rel_fkt_naiss).subscribe(dataFir => {
            if (dataFir.success) {
              if (dataFir.msg !== null) {
                this.dataUser.firaisanaLibelle = dataFir.msg.libelle;
              }
            }
          });
        } else {
          this.toastr.error('L\'individu immatriculé ' + this.user.id_acces + ' est introuvable');
        }
        this.changeCouleur();
      } else {
        console.log(data);
        this.toastr.info('La requête a bien été aboutie mais n\'a pas retourné le resultat attendu');
      }
    }, error => {
      const status = error.status;
      // tslint:disable-next-line:triple-equals
      if (status != 404 && status != 403 && status != 0) {
        this.toastr.info(error.error.message);
      } else {
        this.toastr.info('Désolé le service information individu n\'est pas encore disponible, veuillez ressayer après quelques instants, merci');
      }
    });

    this.infoService.getStatusByIndivWS(this.user.id_acces, this.idToken).subscribe(dataWS => {
      console.log('dans app info indiv infoService.getStatusByIndiv', dataWS);
      this.status = [];
      let body: any = dataWS.body;
      for (const statu of body) {
        const statuTemp: Statu = Object.assign(new Statu(), statu);
        this.status.push(statuTemp);
        // this.libelleStatu += statuTemp.libelle_statut + ' - ';
        this.libelleStatu = statuTemp.libelle_statut;

      }
      this.statuIndividu.emit(this.status);
    });

    this.prendAdresse();
   this.setAdress();
    this.adresseService.getTypeAdresseWS(this.idToken).subscribe(typeWS => {
      console.log('dans app info indiv adresseService.getTypeAdresse', typeWS);
      const listType = typeWS.body;
      if (this.entity === 'E') {
        for (const list of listType) {
          if (list.libelle === 'CORRESPONDANCE' || list.libelle === 'PHYSIQUE') {
            this.adresseService.getAdressByTravailleurAndType(this.user.id_acces, list.id_type).subscribe(adresse => {
              console.log(adresse);
              if (adresse.success) {
                if (adresse.msg[0]) {
                  this.dataAdresse = adresse.msg[0];
                  console.log("ADRESSE 111", this.dataAdresse);
                }
              }
            });
            break;
          }
        }
      }
    });

    this.infoService.infoFamilleWS(this.user.id_acces, this.idToken).subscribe(data => {
      console.log("attestation infoService ==> ", data);
      this.dataFamille = data.body;
      for (let i = 0; i < this.dataFamille.length; i++) {
        if (this.dataFamille[i].statut === 'CONJOINT') {
          this.dataConjoint = this.dataFamille[i];
        }
      }
      this.initConjoint();
      console.log('dataConjoint1 ==> ', this.dataConjoint);
    });
  }

  prendListeEnfant(){
    this.infoService.infoFamilleWS(this.user.id_acces, this.idToken).subscribe(data => {
      console.log("attestation infoService ==> ", data);
      let res = data.body
      for (let i = 0; i < res.length; i++) {
        if (res[i].statut === 'ENFANT') {
          this.dataEnfant.push(res[i]);
        }
      }
      console.log('dataEnfant ==> ', this.dataEnfant);
    });
  }

  // prendAdresse() {
  //   this.adresseService.infoAresseWS(this.user.id_acces).subscribe(dataAdr => {
  //     if (dataAdr.status == 200 && dataAdr.body != null && dataAdr.body['length'] > 0) {
  //       this.aUneAdresse.emit(true);
  //       this.dataAdresse = dataAdr.body[0];
  //       console.log("ADRESS 222 if", this.dataAdresse);
  //       this.adresse.emit(this.dataAdresse);
  //     } else {
  //       this.adresseService.infoAresseWS(this.user.id_acces).subscribe(dataAdr2 => {
  //         if (dataAdr2.status == 200 && dataAdr2.body != null && dataAdr2.body['length'] > 0) {
  //           this.aUneAdresse.emit(true);
  //           this.dataAdresse = dataAdr2.body[0];
  //           console.log("ADRESS 333 elseif", this.dataAdresse);
  //           this.adresse.emit(this.dataAdresse);
  //         } else {
  //           this.aUneAdresse.emit(false);
  //         }
  //       });
  //     }
  //   });
  // }
  prendAdresse() {
    this.adresseService.infoAresseWS(this.user.id_acces).subscribe(dataAdr => {
      if (dataAdr.status == 200) {
        this.aUneAdresse.emit(true);
        this.dataAdresse = dataAdr.body[0];
        console.log("ADRESS 222 if", this.dataAdresse);
        this.adresse.emit(this.dataAdresse);
      } else {
        this.aUneAdresse.emit(false);
      }
    });
  }

  reinitData() {
    this.dataConjoint = null;
    this.dataEnfant = [];
  }

  initConjoint() {
    if (this.dataConjoint) {
      this.infoService.infoIndivWebService(this.dataConjoint.matricule).subscribe(res => {
        this.infoConjoint = Object.assign(new Indivu(), res.body);
      });
    }

  }

  // GET INFO ADRESS FOR UPDATE
  getinfoadress(){
    const data = {
      individu : this.user.id_acces,
      page : this.pager
    }
    console.log("DATA", data);
    this.adresseService.getlistAutreAdress(data, this.idToken).subscribe(listAdress => {
      let list = this.ui.transformeWSReponse(listAdress);
      if (list.success) {
        this.listAutreAdress = listAdress.body;
        console.log("LISTE ADRESS", this.listAutreAdress);
      }
    });
  }

  changeValue(page: number) {
    this.pager = page;
    this.getinfoadress();
  }

  public inputTyped(source: string, text: string) {
    if (text.length >= 3) {
      this.adresseService.listFokontanyWS(text, this.idToken).subscribe(dataWs => {
        let data = this.ui.transformeWSReponse(dataWs);
        if (data.success) {
          console.log("LIST FKT", data.msg);
          this.initData(data.msg.resultat);
        } else {
          // this.toastr.error( data.msg);
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

  updateAdress(info){
    console.log("INFO MODAL", info);
    this.retour.id_adresse = info.id_adresse,
    this.retour.adresse_date = info.adresse_date;
    this.retour.adresse_e_mail = info.adresse_e_mail;
    this.retour.adresse_telephone = info.adresse_telephone;
    this.retour.fokontany.id_fokontany = info.fokontany.id_fokontany;
    this.retour.id_type.id_type = info.id_type.id_type,
    this.retour.adresse_quartier = info.adresse_quartier,
    this.retour.adresse_fax = info.adresse_fax,
    this.retour.complement = info.complement,
    this.retour.type = info.type
    console.log("CHECK", this.retour);
  }

  modifierAdress(){
    this.showload = true;
    console.log("DATASENT", this.retour);
    this.adresseService.ajoutAdresseWS(this.retour).subscribe(dataResponseWS => {
      console.log("adresse.ajoutAdresse",dataResponseWS);
      let dataResponse = this.ui.transformeWSReponseSave(dataResponseWS);
        if (dataResponse.success) {
          this.toastr.success("Modification réussi");
          this.getinfoadress();
          this.showload = false;
        } else {
          this.toastr.info("Service non disponible, veuillez réessayer!!");
          this.showload = false;
        }
      }
    );
  }

  changeCouleur() {
    console.log('this.couleur', this.couleur);
    if (this.couleur != null) {
      setTimeout(() => {
        $('.titre-info').css('background-color', this.couleur);
        $('.texte_info').css('color', this.couleur);
        $('.titre-info1').css('background-color', this.couleur);
        $('.app-info-individu-conteneur').css('display', 'block');
      }, 500);
    } else {
      console.log('$(\'.app-info-individu-conteneur\')', $('.app-info-individu-conteneur'));
      $('.app-info-individu-conteneur').css('display', 'block');
    }
  }

  modepaiement() {
    this.show = true;
    this.infoService.infoIndivWebService(this.user.id_acces).subscribe(data => {
      this.dataUser = data.body;
      const idindividu = this.dataUser.id_individu;
      localStorage.setItem('idIndividuMP', this.dataUser.id_individu);
      console.log('matricule alefa randy', this.dataUser.id_individu);
      if (this.detailAgent) {
        this.banqueService.getModePaiementAgentWS(idindividu, this.idToken).subscribe(listemp => {
          console.log('getModePaiementAgentWS', listemp);
          if (listemp.body) {
            const tempMP = [];
            tempMP.push(listemp.body);
            this.afficheMP = tempMP;
            for (const mp of this.afficheMP) {
              for (const attribut in mp) {
                if (mp[attribut] === null) {
                  mp[attribut] = undefined;
                }
              }
              this.idModPChoisi = localStorage.getItem("idModPChoisi");
              if (mp.idModePaiementTiers == this.idModPChoisi) {
                mp.estChoisi = true;
              } else {
                mp.estChoisi = false;
              }
              this.ijpf.getmodepaiebyidaccWS(this.reference, this.idToken).subscribe(modeP => {
                if(modeP.body != null && modeP.body.idModePaiementTiers != null ) {
                  console.log("get mode de paiement", modeP);
                  const mop = <any>modeP.body
                  if (mop.idModePaiementTiers == mp.idModePaiementTiers) {
                    mp.estChoisi = true;
                  } else {
                    mp.estChoisi = false;
                  }
                }
              })
              mp.estChoisi = false;
            }
            console.log('Mode de paiement', this.afficheMP);
          } else {
            this.toastr.info('Pas de mode paiement');
          }
          this.show = false;
        });
      } else {
        this.banqueService.listeMPbymatriculeWS(idindividu, this.idToken).subscribe(listemp => {
          console.log('listeMPbymatriculeWS', listemp);
          if (listemp.body) {
            this.afficheMP = listemp.body;
            for (const mp of this.afficheMP) {
              console.log("mp", mp);
              for (const attribut in mp) {
                if (mp[attribut] === null) {
                  mp[attribut] = undefined;
                }
              }
              this.idModPChoisi = localStorage.getItem("idModPChoisi");
              if (mp.idModePaiementTiers == this.idModPChoisi) {
                mp.estChoisi = true;
              } else {
                mp.estChoisi = false;
              }
              this.ijpf.getmodepaiebyidaccWS(this.reference, this.idToken).subscribe(modeP => {
                if(modeP.body != null && modeP.body.idModePaiementTiers != null ) {
                  console.log("get mode de paiement", modeP);
                  const mop = <any>modeP.body
                  if (mop.idModePaiementTiers == mp.idModePaiementTiers) {
                    mp.estChoisi = true;
                  } else {
                    mp.estChoisi = false;
                  }
                }
              })

            }
          } else {
            this.toastr.info('Pas de mode paiement');
          }
          this.show = false;
        });
      }
    }, err => {
      this.toastr.info('Matricule introuvable');
    });
  }

  mpbyid(value) {
    const table = {
      '1': 'Espèces',
      '2': 'Virement',
      '3': 'Mise à disposition',
      '4': 'Chèque',
      '5': 'Mobile Banking'
    };
    return table[value];
  }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


  quandMPchange(index) {
    if (this.afficheMP[index].estChoisi) {
      this.afficheMP[index].defaut = new Boolean(this.afficheMP[index].defaut).toString();
      this.modePaiementChange.emit(this.afficheMP[index]);
      console.log("this.afficheMP[index]", this.afficheMP[index]);
      this.idModPChoisi = this.afficheMP[index].idModePaiementTiers;
      console.log("this.idModPChoisi =>",this.idModPChoisi);
      localStorage.setItem('idModPChoisi', this.idModPChoisi);
      for (let i = 0; i < this.afficheMP.length; i++) {
        if (i !== index) {
          this.afficheMP[i].estChoisi = false;
        }
      }
    } else {
      this.modePaiementChange.emit(null);
    }
  }

deleteMP(id:any){
  this.show = true;
    this.infoService.infoIndivWebService(this.user.id_acces).subscribe(data => {
    this.dataUser = data.body;
    const idindividu = this.dataUser.id_individu;
    this.banqueService.deletebanqueWS(id, this.idToken).subscribe(item => {
    if (item.status == 200) {
      this.toastr.success("Mode de paiement supprimé avec succé")
      if (this.detailAgent) {
        this.banqueService.getModePaiementAgentWS(idindividu, this.idToken).subscribe(listemp => {
          console.log('getModePaiementAgentWS', listemp);
          if (listemp.body) {
            const tempMP = [];
            tempMP.push(listemp.body);
            this.afficheMP = tempMP;
            for (const mp of this.afficheMP) {
              for (const attribut in mp) {
                if (mp[attribut] === null) {
                  mp[attribut] = undefined;
                }
              }
              this.idModPChoisi = localStorage.getItem("idModPChoisi");
              if (mp.idModePaiementTiers == this.idModPChoisi) {
                mp.estChoisi = true;
              } else {
                mp.estChoisi = false;
              }
              this.ijpf.getmodepaiebyidaccWS(this.reference, this.idToken).subscribe(modeP => {
                if(modeP.body != null && modeP.body.idModePaiementTiers != null ) {
                  console.log("get mode de paiement", modeP);
                  const mop = <any>modeP.body
                  if (mop.idModePaiementTiers == mp.idModePaiementTiers) {
                    mp.estChoisi = true;
                  } else {
                    mp.estChoisi = false;
                  }
                }
              })
              mp.estChoisi = false;
            }
            console.log('Mode de paiement', this.afficheMP);
          } else {
            this.toastr.info('Pas de mode paiement');
          }
          this.show = false;
        });
      } else {
        this.banqueService.listeMPbymatriculeWS(idindividu, this.idToken).subscribe(listemp => {
          console.log('listeMPbymatriculeWS', listemp);
          if (listemp.body) {
            this.afficheMP = listemp.body;
            for (const mp of this.afficheMP) {
              console.log("mp", mp);
              for (const attribut in mp) {
                if (mp[attribut] === null) {
                  mp[attribut] = undefined;
                }
              }
              this.idModPChoisi = localStorage.getItem("idModPChoisi");
              if (mp.idModePaiementTiers == this.idModPChoisi) {
                mp.estChoisi = true;
              } else {
                mp.estChoisi = false;
              }
              this.ijpf.getmodepaiebyidaccWS(this.reference, this.idToken).subscribe(modeP => {
                if(modeP.body != null && modeP.body.idModePaiementTiers != null ) {
                  console.log("get mode de paiement", modeP);
                  const mop = <any>modeP.body
                  if (mop.idModePaiementTiers == mp.idModePaiementTiers) {
                    mp.estChoisi = true;
                  } else {
                    mp.estChoisi = false;
                  }
                }
              })
              mp.estChoisi = false;
            }
          } else {
            this.toastr.info('Pas de mode paiement');
          }
          this.show = false;
        });
      }
    }
    });
  })
}

update(id) {
  this.idMp = id;
  console.log(id)
  this.idModPChoisi = localStorage.getItem("idModPChoisi");
}

  onChangeType(target) {
    console.log(this.id_mp_get);
    let val = target.value;
    var split = val.split(" ", 3);
    this.select = split[2];
    this.mpsplit = split[0];
    console.log("split1", this.select);
    console.log("split2", this.mpsplit);
    //this.listeInstitutions();
  }

  modeDePaiementAjoute(event) {
    this.modepaiement();
  }

  adresseMisAJour($event) {
    this.prendAdresse();
    this.aUneAdresse.emit($event);
    console.log("EMIT", this.aUneAdresse);
  }

  setAdress() {
    this.adresseService.infoAresseWS(this.user.id_acces).subscribe(data => {
      console.log("données à remplir indiv",data );
      this.dataAdresse = data.body[0];
      this.adresse.emit(this.dataAdresse);
      if (data.body['length'] > 0) {
        this.aUneAdresse.emit(true);
      } else {
        this.aUneAdresse.emit(false);
      }
    }, error => {
      this.toastr.info("Aucune adresse trouvé");
    });
  }

  upd(){
    this.showModif = false;
    this.showMaj = false;
  }

  miseAjour(){

    let   donnee = {
      "id_mode_paiement_tiers": this.idModePaiementTiers,
      "compte": this.compteUpd,
      "cle": "22",
      "date_debut": this.dateDebutUpd,
      "date_fin": null,
      "code_swift": "",
      "domiciliation": "",
      "idtiers": this.numtiers,
      "defaut": null,
      "id_agence": {
        "id_agence": this.idAgence,
        "id_institution": {
          "id_institution": 5,
          "abreviation": null,
          "libelle": null,
          "code": null,
          "id_mode_paiement": this.idModePaiement
        },
        "code_agence": this.codeagence,
        "nom_agence": this.libelleAgence,
        "id_reseau": {
          "idreseau": 2,
          "libelle": null,
          "idbanque": null
        }
      },
      "id_mode_paiement": {
        "id_mode_paiement": this.idModePaiement,
        "libelle": null,
        "abreviation": null
      },
      "caisse": this.caisse,
      "numero": this.numeroUpd
    };
    console.log("data UPD =>", donnee)
    this.banqueService.ajoutbanqueWS(donnee, this.idToken).subscribe(ajoutBWS => {
      let ajoutB = this.ui.transformeWSReponse(ajoutBWS);
      if (ajoutB.success) {
        this.toastr.success("Mise a à jour du mode de paiement avec success");
        $("#detailMp").modal("hide");
        this.modepaiement();
        this.showModif = true;
      } else {
        this.toastr.warning("Une erreur produite");
      }
    });
  }

  close(){
    this.showModif = true;
    $("#detailMp").modal("hide");
  }


  detailmodepaiement(mop) {
    if (!this.detailAgent) {
      $("#detailMp").modal("show");
      this.id_mp_get = mop.idModePaiementTiers;
      this.mp = mop.idModePaiement;
      this.nombanque = mop.libelleBanque;
      this.dateDebut = mop.dateDebut;
      this.compte = mop.compte;
      this.numtiers = mop.idTiers;
      this.codeagence = mop.codeAgence;
      this.agence = mop.libelleAgence;
      this.libelleAgence = mop.libelleAgence;
      this.idModePaiementTiers = mop.idModePaiementTiers;
      this.caisse = mop.caisse;
      this.numero = mop.numero;
      this.abrevModePaiement = mop.abrevModePaiement;
      this.abbrevBanque = mop.abbrevBanque;
      this.idAgence = mop.idAgence;
      this.idInstitution = mop.idInstitution;
      this.idModePaiement = mop.idModePaiement;
      this.codeSwift = mop.codeSwift;
      if(this.abrevModePaiement === "VIR"){
        this.showVir = true;
        this.showMobile = false;
      } else if (this.abrevModePaiement === "MB"){
        this.showVir = false;
        this.showMobile = true;
      }else{
        this.showVir = false;
        this.showMobile = false;
      }
      this.fileService.readWS(this.id_mp_get).subscribe(data => {
        if (data.status == 200) {
          this.pieceMP = <any>data.body;
        }
      });
    } else {
      $("#detailMp").modal("show");
      this.id_mp_get = mop.id_mode_paiement_tiers;
      this.mp = mop.id_mode_paiement.id_mode_paiement;
      this.nombanque = mop.id_agence.id_institution.libelle;
      this.dateDebut = mop.dateDebut;
      this.compte = mop.compte;
      this.numtiers = mop.idtiers;
      this.codeagence = mop.id_agence.code_agence;
      this.agence = mop.id_agence.nom_agence;
      this.idModePaiementTiers = mop.idModePaiementTiers;
      this.caisse = mop.caisse;
      this.numero = mop.numero;
      this.abrevModePaiement = mop.abrevModePaiement
      this.abbrevBanque = mop.abbrevBanque;
      this.idAgence = mop.idAgence;
      this.idInstitution = mop.idInstitution;
      this.idModePaiement = mop.idModePaiement;
      this.codeSwift = mop.codeSwift;
      if(this.abrevModePaiement === "VIR"){
        this.showVir = true;
        this.showMobile = false;
      } else if (this.abrevModePaiement === "MB"){
        this.showVir = false;
        this.showMobile = true;
      }else{
        this.showVir = false;
        this.showMobile = false;
      }
      this.fileService.readWS(this.id_mp_get).subscribe(data => {
        if (data.status == 200) {
          this.pieceMP = <any>data.body;
        }
      });
    }

  }

}
