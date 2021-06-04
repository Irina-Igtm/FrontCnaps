import { Component, OnInit, Input } from '@angular/core';
import { InputBase } from '../../services/input-service/input-base';
import { FormGroup, FormControl } from '@angular/forms';

declare var $ : any;

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.css']
})
export class DynamicInputComponent implements OnInit {

  @Input() input: InputBase<any>;
  @Input() form: FormGroup;
  @Input() estArgent = false;
  @Input() pourInfo = false;
  
  constructor() { }

  ngOnInit() {
  }

  clavier(){
  	if(this.input["type"] == "number" && this.estArgent){
  		let champ = $("#"+this.input["key"]);
  		let valeur = champ.val();
  		let nombre = Number(valeur.toString().replace(",","."));
  		let nonNombre = isNaN(nombre);
  		console.log("valeur "+valeur+" nonNombre",nonNombre);
  		if(nonNombre){
  			champ.val("");
  		}
  	}
  }

  isValid() { return this.form.controls[this.input.key].valid; }
}
