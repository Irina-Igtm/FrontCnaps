export class InputBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  controlType: string;

  readonly: string;

  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      required?: boolean,
      order?: number,
      readonly?: string
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.readonly = options.readonly || '';
  }
}
