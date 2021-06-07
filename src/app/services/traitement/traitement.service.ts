import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TraitementService {
  url : any;
  demande: any;
  adresse: any;
  individu: any;
  employeur: any;
  notif:any;
  constructor(
    private http: HttpClient
  ) { 
    this.url = environment.apiUrl + "/api/";
    this.demande = environment.apiDemande;
    this.adresse = environment.adresse;
    this.individu = environment.individu;
    this.employeur = environment.employeur;
  }

  getDemandeWS(matricule_indiv, prestation, token:string){
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    let data = {
      prestation: prestation,
      id_individu: matricule_indiv
    }
    return this.http.post<any>(this.demande + 'referenceDemandeByPrestationAndIndividu', data, {headers: headers, observe: 'response'} );
  }

  getAdresse(matricule_indiv, token:string){
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    
    return this.http.get(this.adresse + 'adresseByIndiv?id=' + matricule_indiv, {headers: headers, observe: 'response'} );
  }

  prendReferencePF(argument: any, token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.post(this.demande + 'prendReferencePF', argument, { headers: headers, observe: 'response' });
  }

  getnombredejourij1WS(id_acc, token:string){
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.post(this.demande + 'nombrejourij1', id_acc, {headers: headers, observe: 'response'} );
  }

  decompteIjWS(idDmdIj: string, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post<any>(this.demande + "decompteIJ", idDmdIj, { headers: headers, observe: 'response' });
  }

  updateDeclarationDatWs(data) {
    let httpheaders = new HttpHeaders();
    httpheaders = httpheaders.set('Content-Type', 'application/json');
    return this.http.post<any>(this.url + `auth/signin` + 'dat', data, { headers: httpheaders, observe: 'response' });
  }

  saveAdresse(data, token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.post(this.adresse + 'saveAdresse', data, { headers: headers, observe: 'response' });
  }

  infoIndividu(data, token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.get<any>(this.individu + 'findByMatricule?id='+ data, { headers: headers, observe: 'response' });
  }

  infoFamille(id, token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.get<any>(this.individu + 'getFamille?id='+ id, { headers: headers, observe: 'response' });
  }

  getEmployeur(id, token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.get<any>(this.employeur + 'getListSigemploisuccByIdIndividu?id='+ id, { headers: headers, observe: 'response' });
  }

  listeMP(id, token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.get<any>(this.individu + 'listMP?id='+ id, { headers: headers, observe: 'response' });
  }

  saveDemande(demande, token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.post<any>(this.demande + 'ajouterDemandePF', demande, { headers: headers, observe: 'response' });
  }

  getAllMp(token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.get<any>(this.individu + 'getallmodepaiement',  { headers: headers, observe: 'response' });
  }

  prendInfoRecuParIdAcc(reference: number ,token:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.get<any>(this.demande + 'prendInfoRecuParIdAcc?reference='+ reference , { headers: headers, observe: 'response' });
  }


  transformeWSReponse(wsReponse): { msg: any, success: boolean } {
    const kafkaStyle = {
      msg: null,
      success: false
    };
    // tslint:disable-next-line:triple-equals
    if (wsReponse.status == 200) {
      if (wsReponse.body != null) {
        kafkaStyle.success = true;
        kafkaStyle.msg = wsReponse.body;
      } else {
        kafkaStyle.msg = 'Pas de données';
      }
    } else {
      kafkaStyle.msg = 'Pas de réponse';
    }
    return kafkaStyle;
  }

  infoAresseWS(id_access: string, token:string, type?: number) {
    const headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    let params = new HttpParams();
    params = params.set('id', id_access);
    if (type) {
      params = params.set('type', type.toString());
    }
    return this.http.get<any>(this.adresse + 'adresseByIndiv', { headers: headers, params: params, observe: 'response' });
  }

  sendNotif(id: string, token:string ,content: any) {
    return new Promise(
      (resolve, reject) => {
        this.infoAresseWS(id, token).subscribe(
          (adr) => {

            const adress = adr.body;
            // adress[0].adresse_e_mail et adress[0].adresse_telephone;
            const sms = {
              numero: '0348733876',
              // numero: adress[0].adresse_telephone,
              message: content.message
            };
            this.sendSMS(sms).subscribe(
              (ms) => {
              }
            );
            const emailMsg = {
              // email: adress[0].adresse_e_mail,
              email: 'ranaivosonhajatiana@gmail.com',
              subject: content.titre,
              message: content.message
            };

            this.sendEmail(emailMsg).subscribe(
            (mss) => {
              }
            );
            this.addNotif(content).subscribe(
            (res) => {
            });
            resolve(true);
          }
        );
      }
    );
  }
  sendSMS(content:any){
    const sms = {
      numero: content.numero,
      message: content.message
    };
    let headers = new HttpHeaders();
    return this.http.post(this.notif + 'envoiSms', sms, { headers: headers, observe: 'response' });
  }

  sendEmail(content:any){
    const sms = {
      email: content.email,
      subject: content.subject,
      message: content.message
    };
    let headers = new HttpHeaders();
    return this.http.post(this.notif+ 'envoiEmail',sms , { headers: headers, observe: 'response' });

  }
  addNotif(content: any){
    const data = {
      expediteur: content.expediteur,
      destinataire: content.destinataire,
      referenceNotif: content.referenceNotif,
      titre: content.titre,
      message: content.message,
      typeNotif: content.typeNotif,
      dateEnvoi: content.dateEnvoi
    };
    let headers = new HttpHeaders();
    return this.http.post(this.notif + 'ajoutnotif',data, { headers: headers, observe: 'response' });
  }

  prendListeDemandePF(filtre ,  token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post<any>(this.demande + 'prendListeDemandePF', filtre, { headers: headers, observe: 'response' });
  }

  listeRefEtatTypWS(token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post(this.demande + 'listeRefEtatTypPF', null, { headers: headers, observe: 'response' });
  }

  listFokontanyWS(nom: string, token) {
    let data = {
      "search": {
        "libelle": nom
      }
    };
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post<any>(this.adresse + 'searchFkt', data, { headers: headers, observe: 'response' });
  }

  saveModepaie(data, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post(this.individu + 'saveModepaie', data, { headers: headers, observe: 'response' });
  }
}
