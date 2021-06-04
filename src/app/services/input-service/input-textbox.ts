import { InputBase } from './input-base';

export class InputTextBox extends InputBase<string> {
  controlType = 'textbox';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    switch(options['type']){
      case "D":
          this.type = "date";
          break;
      case "N":
          this.type = "number";
          break;
      default:
          this.type = "text";
    }
  }
}