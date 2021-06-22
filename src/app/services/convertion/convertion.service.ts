import {Injectable} from '@angular/core';

@Injectable()
export class ConvertionService {

  private Unite(nombre) {
    let unite;
    switch (nombre) {
      case 0:
        unite = 'zéro';
        break;
      case 1:
        unite = 'un';
        break;
      case 2:
        unite = 'deux';
        break;
      case 3:
        unite = 'trois';
        break;
      case 4:
        unite = 'quatre';
        break;
      case 5:
        unite = 'cinq';
        break;
      case 6:
        unite = 'six';
        break;
      case 7:
        unite = 'sept';
        break;
      case 8:
        unite = 'huit';
        break;
      case 9:
        unite = 'neuf';
        break;
    } // fin switch
    return unite;
  }

  private Dizaine(nombre) {
    let dizaine = '';
    switch (nombre) {
      case 10:
        dizaine = 'dix';
        break;
      case 11:
        dizaine = 'onze';
        break;
      case 12:
        dizaine = 'douze';
        break;
      case 13:
        dizaine = 'treize';
        break;
      case 14:
        dizaine = 'quatorze';
        break;
      case 15:
        dizaine = 'quinze';
        break;
      case 16:
        dizaine = 'seize';
        break;
      case 17:
        dizaine = 'dix-sept';
        break;
      case 18:
        dizaine = 'dix-huit';
        break;
      case 19:
        dizaine = 'dix-neuf';
        break;
      case 20:
        dizaine = 'vingt';
        break;
      case 30:
        dizaine = 'trente';
        break;
      case 40:
        dizaine = 'quarante';
        break;
      case 50:
        dizaine = 'cinquante';
        break;
      case 60:
        dizaine = 'soixante';
        break;
      case 70:
        dizaine = 'soixante-dix';
        break;
      case 80:
        dizaine = 'quatre-vingt';
        break;
      case 90:
        dizaine = 'quatre-vingt-dix';
        break;
    } // fin switch
    return dizaine;
  }

  
  chiffreApresVirgule(value:string){
    console.log('Chiffre avant ',value);
    const valueLettre = value.toString().split('');
    console.log('Chiffre Apres ', valueLettre);
    const tet = this.Dizaine(value);
    console.log('Chiffre Apres Result', parseInt(tet));
    let nb, quotient, reste, numberToLetter;
    nb = parseInt(value);
    if(parseInt(valueLettre[0]) != 0 && parseInt(valueLettre[1]) != 0){
      if(parseInt(valueLettre[0]) != 0){
        if(parseInt(valueLettre[1]) != 0){
          numberToLetter = 'virgule '+this.Unite(parseInt(valueLettre[0]));
        } else {
          if (nb > 19) {
            quotient = Math.floor(nb / 10);
            reste = nb % 10;
            if (nb < 71 || (nb > 79 && nb < 91)) {
              if (reste === 0) {
                numberToLetter = 'virgule '+this.Dizaine(quotient * 10);
              }
              if (reste === 1) {          
                numberToLetter = 'virgule '+this.Dizaine(quotient * 10) + '-et-' + this.Unite(reste);
              }
              if (reste > 1) {
                numberToLetter = 'virgule '+this.Dizaine(quotient * 10) + '-' + this.Unite(reste);
              }
            } else {
              numberToLetter = 'virgule '+this.Dizaine((quotient - 1) * 10) + '-' + this.Dizaine(10 + reste);
            }
          } else {
            numberToLetter = 'virgule '+this.Dizaine(nb);
          }
        }
      } else {
        numberToLetter = 'virgule '+'zéro ' + this.Unite(parseInt(valueLettre[1]));
      }
    } else {
      numberToLetter = '';
    }
    console.log('Restultat ==> ', numberToLetter);
    return numberToLetter;
  }

  NumberToLetter(nombre: number) {
    let n, quotient, reste, nb;
    let numberToLetter = '';

    if (nombre.toString().replace(/ /gi, '').length > 15) {
      throw new Error('dépassement de capacité');
    }
    nb = parseFloat(nombre.toString().replace(/ /gi, ''));
    if (Math.ceil(nb) !== nb) {
      throw new Error('Nombre avec virgule non géré.');
    }

    n = nb.toString().length;
    switch (n) {
      case 1:
        numberToLetter = this.Unite(nb);
        break;
      case 2:
        if (nb > 19) {
          quotient = Math.floor(nb / 10);
          reste = nb % 10;
          if (nb < 71 || (nb > 79 && nb < 91)) {
            if (reste === 0) {
              numberToLetter = this.Dizaine(quotient * 10);
            }
            if (reste === 1) {
              numberToLetter = this.Dizaine(quotient * 10) + '-et-' + this.Unite(reste);
            }
            if (reste > 1) {
              numberToLetter = this.Dizaine(quotient * 10) + '-' + this.Unite(reste);
            }
          } else {
            numberToLetter = this.Dizaine((quotient - 1) * 10) + '-' + this.Dizaine(10 + reste);
          }
        } else {
          numberToLetter = this.Dizaine(nb);
        }
        break;
      case 3:
        quotient = Math.floor(nb / 100);
        reste = nb % 100;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'cent';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'cent' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.Unite(quotient) + ' cents';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.Unite(quotient) + ' cent ' + this.NumberToLetter(reste);
        }
        break;
      case 4 :
        quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'mille';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'mille' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' mille';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' mille ' + this.NumberToLetter(reste);
        }
        break;
      case 5 :
        quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'mille';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'mille' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' mille';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' mille ' + this.NumberToLetter(reste);
        }
        break;
      case 6 :
        quotient = Math.floor(nb / 1000);
        reste = nb - quotient * 1000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'mille';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'mille' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' mille';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' mille ' + this.NumberToLetter(reste);
        }
        break;
      case 7:
        quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un million';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un million' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' millions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' millions ' + this.NumberToLetter(reste);
        }
        break;
      case 8:
        quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un million';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un million' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' millions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' millions ' + this.NumberToLetter(reste);
        }
        break;
      case 9:
        quotient = Math.floor(nb / 1000000);
        reste = nb % 1000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un million';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un million' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' millions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' millions ' + this.NumberToLetter(reste);
        }
        break;
      case 10:
        quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un milliard';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un milliard' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' milliards';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' milliards ' + this.NumberToLetter(reste);
        }
        break;
      case 11:
        quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un milliard';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un milliard' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' milliards';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' milliards ' + this.NumberToLetter(reste);
        }
        break;
      case 12:
        quotient = Math.floor(nb / 1000000000);
        reste = nb - quotient * 1000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un milliard';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un milliard' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' milliards';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' milliards ' + this.NumberToLetter(reste);
        }
        break;
      case 13:
        quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un billion';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un billion' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' billions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' billions ' + this.NumberToLetter(reste);
        }
        break;
      case 14:
        quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un billion';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un billion' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' billions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' billions ' + this.NumberToLetter(reste);
        }
        break;
      case 15:
        quotient = Math.floor(nb / 1000000000000);
        reste = nb - quotient * 1000000000000;
        if (quotient === 1 && reste === 0) {
          numberToLetter = 'un billion';
        }
        if (quotient === 1 && reste !== 0) {
          numberToLetter = 'un billion' + ' ' + this.NumberToLetter(reste);
        }
        if (quotient > 1 && reste === 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' billions';
        }
        if (quotient > 1 && reste !== 0) {
          numberToLetter = this.NumberToLetter(quotient) + ' billions ' + this.NumberToLetter(reste);
        }
        break;
    }// fin switch
    /*respect de l'accord de quatre-vingt*/
    if (numberToLetter.substr(numberToLetter.length - 'quatre-vingt'.length, 'quatre-vingt'.length) === 'quatre-vingt') {
      numberToLetter = numberToLetter + 's';
    }

    return numberToLetter;
  }

  public clone(objectToClone: any): any {
    const cloneObj = new objectToClone.constructor;
    for (const attribut in objectToClone) {
      if (typeof objectToClone[attribut] === 'object') {
        cloneObj[attribut] = this.clone(objectToClone[attribut]);
      } else {
        cloneObj[attribut] = objectToClone[attribut];
      }
    }
    return cloneObj;
  }

  public cloneAny(objectToClone: any): any {
    const cloneObj = new Object();
    for (const attribut in objectToClone) {
      if (objectToClone[attribut] !== null && objectToClone[attribut] !== undefined) {

        if (typeof objectToClone[attribut] === 'object' && objectToClone[attribut].constructor !== Array) {
          cloneObj[attribut] = this.cloneAny(objectToClone[attribut]);
        } else {
          cloneObj[attribut] = objectToClone[attribut];
        }
      }
    }
    return cloneObj;
  }

  constructor() {
  }
}
