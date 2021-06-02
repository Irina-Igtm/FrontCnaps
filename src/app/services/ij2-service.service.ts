import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class Ij2ServiceService {
  url : any;
  demande: any;
  adresse: any;
  individu: any;
  employeur: any;
  accuse:any;
  rglOp:any
  constructor(
    private http: HttpClient
  ) { this.url = environment.apiUrl + "/api/";
  this.demande = environment.apiDemande;
  this.adresse = environment.adresse;
  this.individu = environment.individu;
  this.employeur = environment.employeur;
  this.accuse = environment.accuse;
  this.rglOp = environment.reglementOp
}

  ajoutAccuseWS(msg, token: string) {
    let headers = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post<any>(this.accuse + "saveAccuseReception2", msg, { headers: headers, observe: 'response' });
  }

  accuseReceptionByIdWS(reference) {
    let headers = new HttpHeaders();
    return this.http.post<any>(this.accuse + 'accuseReceptionByRef', { reference: reference }, { headers: headers, observe: 'response' });
  }

  infoIndivWebService(id_acces: string, token?:string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token}); 
     let param = new HttpParams().set('id', id_acces);
    return this.http.get(this.individu + 'findByMatricule', {headers:headers, params: param, observe: 'response'});
  }
  getmodepaiebyidaccWS(idacc: string, token: string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.get<any>(this.rglOp + 'getmodepaiebyidacc?idacc=' + idacc, {headers: headers, observe: 'response' });
  }
  infoEmployeurWS(identifiant: string, token: string) {
    let headers = new HttpHeaders({"Authorization" : "Bearer " + token});
    return this.http.get<any>(this.employeur + 'getinfoemplbymatricule?id=' + identifiant, { headers: headers, observe: 'response' });
  }
}
