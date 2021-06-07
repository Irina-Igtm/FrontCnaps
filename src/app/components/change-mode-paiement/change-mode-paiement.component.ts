import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Ij2ServiceService } from '../../services/ij2-service.service';
import { TraitementService } from '../../services/traitement/traitement.service';



@Component({
	selector: 'app-change-mode-paiement',
	templateUrl: './change-mode-paiement.component.html',
	styleUrls: ['./change-mode-paiement.component.css']
})
export class ChangeModePaiementComponent implements OnInit {

	@Input() idAcc;
	@Input() idIndividu;

	aucunTrouve = false;

	mpActuel = {
		typeLibelle: "",
		typeAbrev: "",
		lieuAgence: "",
		mp: null
	};
	listeModePaiement = []; // VIR, ESP, ...

	listeMP = [];

	idToken;
	accessToken:any

	constructor(
		private toast: ToastrService,
		private ij2srvc : Ij2ServiceService,
		private traitSrvc: TraitementService
		) { }

	ngOnInit() {
		this.accessToken = localStorage.getItem('user');
		this.idToken = JSON.parse(this.accessToken).accessToken;
		if (this.idAcc == null || this.idIndividu == null || this.idAcc == undefined || this.idIndividu == undefined) {
			this.toast.info("Certaines valeurs pour les détails du mode de paiement sont invalides");
		}
		else {
			let that = this;
			// prend la liste des modes de paiement
			this.ij2srvc.getAllmodepaiementWS(this.idToken).subscribe(obsLMP => {
				console.log("getAllmodepaiement", obsLMP);
				if (obsLMP.status == 200) {
					that.listeModePaiement = obsLMP.body;
					this.traitSrvc.listeMP(this.idIndividu, this.idToken).subscribe(obs => {
						console.log("getmodepaiebyidacc", obs);
						if (obs.status == 200 && obs.body != null) {
							that.mpActuel.mp = obs.body;
							for (let mp of that.listeModePaiement) {
								if (mp.id_mode_paiement == that.mpActuel.mp.idModePaiement) {
									that.mpActuel.typeLibelle = mp.libelle;
									that.mpActuel.typeAbrev = mp.abreviation;
									// that.mpActuel.lieuAgence = that.mpActuel.mp.libelleAgence;
									break;
								}
							}
						} else {
							that.aucunTrouve = true;
						}
					});
				}
			});
		}
	}

	prendListeMP() {
		let that = this;
		this.ij2srvc.listeMPbymatriculeWS(this.idIndividu, this.idToken).subscribe(obs => {
			console.log("listeMPbymatricule => " + that.idIndividu, obs);
			if (obs.status == 200) {
				let liste = [];
				for (let l of obs.body) {
					let mp = {
						mp: l,
						estCoche: false
					};
					if (that.mpActuel.mp != null && that.mpActuel.mp.idModePaiementTiers == l.idModePaiementTiers) {
						mp.estCoche = true;
					}
					liste.push(mp);
				}
				that.listeMP = liste;
			}
		});
	}

	checkChange(index) {
		console.log("checkChange " + index + " => ", this.listeMP[index]);
		for (let i = 0; i < this.listeMP.length; i++) {
			if (index != i) {
				this.listeMP[i].estCoche = false;
			}
		}
	}

	validerChoixMp() {
		let modePaiement = null;
		for (let mp of this.listeMP) {
			if (mp.estCoche) {
				modePaiement = this.ij2srvc.creerModePaiementOP(this.idAcc, mp.mp);
				break;
			}
		}
		console.log("validerChoixMp modePaiement", modePaiement);
		if (modePaiement != null) {
			if (this.aucunTrouve) {
				this.traitSrvc.saveModepaie(modePaiement, this.idToken).subscribe(obs => {
					console.log("ajouttrsmodepaieWS", obs);
					if (obs.status == 200) {
						this.traitement(modePaiement);
						this.toast.success("Le mode de paiement pour cette demande a été modifié");
					}
					else {
						this.toast.info("Impossible de modifier le mode de paiement");
					}
				});
			}
			else {
				this.ij2srvc.updatemodepaiementop(modePaiement).subscribe(obs => {
					console.log("updatemodepaiementop", obs);
					if (obs.status == 200) {
						this.traitement(modePaiement);
						this.toast.success("Le mode de paiement pour cette demande a été modifié");
					}
					else {
						this.toast.info("Impossible de modifier le mode de paiement");
					}
				});
			}
		}
		else {
			this.toast.info("Vous n'avez choisi aucun mode de paiement");
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
			if (mp.id_mode_paiement == this.mpActuel.mp.idModePaiement) {
				this.mpActuel.typeLibelle = mp.libelle;
				this.mpActuel.typeAbrev = mp.abreviation;
				this.mpActuel.lieuAgence = this.mpActuel.mp.libelleAgence;
				break;
			}
		}
	}

}
