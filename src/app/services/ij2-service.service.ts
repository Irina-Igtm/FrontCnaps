import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { InputTextBox } from './input-service/input-textbox';
import { InputBase } from './input-service/input-base';



@Injectable({
  providedIn: 'root'
})
export class Ij2ServiceService {
  url: any;
  demande: any;
  adresse: any;
  individu: any;
  employeur: any;
  accuse: any;
  rglOp: any;
  banque:any
  dn: any;
  constructor(
    private http: HttpClient
  ) {
    this.url = environment.apiUrl + "/api/";
    this.demande = environment.apiDemande;
    this.adresse = environment.adresse;
    this.individu = environment.individu;
    this.employeur = environment.employeur;
    this.accuse = environment.accuse;
    this.rglOp = environment.reglementOp
    this.banque = environment.banque
    this.dn = environment.dn

  }

  ajoutAccuseWS(msg, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post<any>(this.accuse + "saveAccuseReception2", msg, { headers: headers, observe: 'response' });
  }

  accuseReceptionByIdWS(reference) {
    let headers = new HttpHeaders();
    return this.http.post<any>(this.accuse + 'accuseReceptionByRef', { reference: reference }, { headers: headers, observe: 'response' });
  }

  infoIndivWebService(id_acces: string, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    let param = new HttpParams().set('id', id_acces);
    return this.http.get(this.individu + 'individu', { headers: headers, params: param, observe: 'response' });
  }
  getmodepaiebyidaccWS(idacc: string, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.get<any>(this.rglOp + 'getmodepaiebyidacc?idacc=' + idacc, { headers: headers, observe: 'response' });
  }
  infoEmployeurWS(identifiant: string, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.get<any>(this.employeur + 'getinfoemplbymatricule?id=' + identifiant, { headers: headers, observe: 'response' });
  }
  getEtatDmdWS(idDmd, token: string) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.post(this.demande + 'etatDossierPF', idDmd, { headers: headers, observe: 'response' });
  }
  prendDetailDemandePF(reference: string, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.get<any>(this.demande + 'prendDetailDemandePF?reference=' + reference, { headers: headers, observe: 'response' });
  }

  prendInfoRecuParIdAccAndIdTypeInfoPF(idAcc, IdInfo, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.get<any>(this.demande + 'prendInfoRecuParIdAccAndIdTypeInfoPF?reference=' + idAcc + "&idTypeInfo=" + IdInfo, { headers: headers, observe: 'response' });
  }

  decompteIj2WS(idDmdIj: string, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post(this.demande + "decompteIJ2", idDmdIj, { headers: headers, observe: 'response' });
  }

  decompteIj2RedressementWS(data, token) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post(this.demande + "redressementIJ ", data, { headers: headers, observe: 'response' });
  }

  // getSalaireDNWS(data, token:string){
  //   let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
  //   return this.http.post(this. + 'getIndivSalaireByPeriodeAndEmpl', data, {headers: headers, observe: 'response'} );
  // }

  getListEmployeurWS(idindividu, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.get<any>(this.employeur + "listtravempl?matricule=" + idindividu, { headers: headers, observe: 'response' });
  }

  getSalaireDNWS(data, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post(this.dn + 'getIndivSalaireByPeriodeAndEmpl', data, { headers: headers, observe: 'response' });
  }

  historiqueDemandeWS(id, token: string) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.post(this.demande + 'listeDemandeByIndivIJ', id, { headers: headers, observe: 'response' });
  }

  avoirRfIJ1(id, token: string) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.get(this.demande + 'avoirReFIj1' + id, { headers: headers, observe: 'response' });
  }

  setValidFormDataForDynamicForms2(listForm, exception: any[]) {
    const inputs: InputBase<any>[] = [];
    for (let i = 0; i < listForm.length; i++) {
      let there_is_exception = -1;
      for (let j = 0; j < exception.length; j++) {
        if (listForm[i].idTypeInfo == exception[j].id_type_info) {
          there_is_exception = j;
          break;
        }
      }
      if (there_is_exception < 0) {
        const inputTextBox = new InputTextBox({
          key: listForm[i].idTypeInfo,
          label: listForm[i].refAccInfoTypMod.libelle_info,
          type: listForm[i].refAccInfoTypMod.type_champ,
          value: listForm[i].valeur,
          required: true
        });
        inputs.push(inputTextBox);
      } else {
        const inputTextBox = new InputTextBox({
          key: listForm[i].idTypeInfo,
          label: listForm[i].refAccInfoTypMod.libelle_info,
          type: listForm[i].refAccInfoTypMod.type_champ,
          value: listForm[i].valeur,
          required: exception[there_is_exception].isrequired != null ? exception[there_is_exception].isrequired : false,
          readonly: exception[there_is_exception].readonly != null ? exception[there_is_exception].readonly : false
        });
        inputs.push(inputTextBox);
      }
    }
    return inputs;
  }

  toFormGroupIJPf(questions: InputBase<any>[]) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    group['observations'] = new FormControl('');
    return new FormGroup(group);
  }
  prendInfoRecuParIdAccPF(idAcc: string, token : string) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(this.demande + 'prendInfoRecuParIdAccPF?reference=' + idAcc, {headers: headers, 
       observe: 'response' });
  }

  modifierInfoRecuParIdAccPF(tecInfoRecu: string, token :string) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.post(this.demande + 'modifierInfoRecuParIdAccPF', tecInfoRecu, { headers: headers, observe: 'response' });
  }

  getAllmodepaiementWS(token: string) {
    const headers = new HttpHeaders();
    headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<any>(this.individu + 'getallmodepaiement', {headers: headers, observe: 'response'});
  }

  listeMPbymatriculeWS(id: string, token?: string) {
    let headers = new HttpHeaders();
    if(token != null && token != undefined){
      headers = new HttpHeaders({'Authorization': 'Bearer ' + token});
    }
    return this.http.get<any>(this.banque + 'getmodepaiementbytierstechnique?idtiers=' + id, {headers: headers, observe: 'response'});
  }

  creerModePaiementOP(idAcc, modePaiement) {
    const mpObjet = {
      abbrevBanque: modePaiement.abbrevBanque,
      abrevModePaiement: modePaiement.abrevModePaiement,
      caisse: modePaiement.caisse,
      cle: modePaiement.cle,
      codeAgence: modePaiement.codeAgence,
      codeBanque: modePaiement.codeBanque,
      codeDr: modePaiement.codeDr,
      codeSwift: modePaiement.codeSwift,
      compte: modePaiement.compte,
      dateDebut: modePaiement.dateDebut,
      dateFin: modePaiement.dateFin,
      defaut: modePaiement.defaut,
      domiciliation: modePaiement.domiciliation,
      idAcc: idAcc,
      idAgence: modePaiement.idAgence,
      idInstitution: modePaiement.idInstitution,
      idModePaiement: modePaiement.idModePaiement,
      idModePaiementTiers: modePaiement.idModePaiementTiers,
      idTiers: modePaiement.idTiers,
      imputation: modePaiement.imputation,
      libelleAgence: modePaiement.libelleAgence,
      libelleBanque: modePaiement.libelleBanque,
      nomInstitutionSortie: modePaiement.nomInstitutionSortie,
      numCompteInstitution: modePaiement.numCompteInstitution,
      numero: modePaiement.numero,
      agenceotiv: modePaiement.agenceotiv,
      codeagenceotiv: modePaiement.codeagenceotiv,
      idbenef: modePaiement.idbenef
    };
    if (modePaiement.idbenef == null || modePaiement.idbenef == undefined) {
      mpObjet.idbenef = modePaiement.idTiers;
    }
    return mpObjet;
  }

  updatemodepaiementop(mp) {
    const headers = new HttpHeaders();
    return this.http.post(this.individu + 'updatemodepaiementop', mp, { headers: headers, observe: 'response' });
  }
}
