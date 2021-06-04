import { Injectable } from '@angular/core';
import { InputBase } from './input-base';
import { FormControl, FormGroup, Validators, FormArray } from '@angular/forms';

@Injectable()
export class InputService {

  constructor() { }

  toFormGroup(questions: InputBase<any>[]) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });

    group['employeur'] = new FormControl('', Validators.required);
    group['fichePaye'] = new FormControl('', Validators.required);
    return new FormGroup(group);
  }

  toFormGroupPen(questions: InputBase<any>[]) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });

    group['matriculTeravailleur'] = new FormControl('', Validators.required);
    group['matriculBenef'] = new FormControl('', Validators.required);
    return new FormGroup(group);
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

  addControlToFormGroup(fg: FormGroup, questions: InputBase<any>[]) {
    const group: any = {};
    questions.forEach(question => {
      fg.addControl(question.key, question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || ''));
    });
    return fg;
  }

  addControlToFormGroupIJ1(fg: FormGroup, questions: InputBase<any>[]) {
    questions.forEach(question => {
      if (question.key != "46") {
        fg.addControl(question.key, question.required ? new FormControl(question.value || '', Validators.required)
          : new FormControl(question.value || ''));
      }
      else {
        fg.addControl(question.key, question.required ? new FormControl(question.value || '', Validators.nullValidator)
          : new FormControl(question.value || ''));
      }
    });
    return fg;
  }

  removeControlToFormGroup(fg: FormGroup, questions: InputBase<any>[]) {
    const group: any = {};
    questions.forEach(question => {
      fg.removeControl(question.value);
    });
    return fg;
  }

  addControlToFormGroupPcs(fg: FormGroup, questions: InputBase<any>[]) {
    const group: any = {};
    questions.forEach(question => {
      fg.addControl(question.key, question.required ? new FormArray(question.value || [], Validators.required) : new FormArray(question.value || []));
    });
    return fg;
  }

  addControlToFormGroupPcsASVT(fg: FormGroup, questions: InputBase<any>[]) {
    const group: any = {};
    questions.forEach(question => {
      if (question.key != "326" && question.key != "327" && question.key != "LVM") {
        fg.addControl(
          question.key, question.required ? new FormArray(question.value || [], Validators.required) : new FormArray(question.value || [])
        );
      }
    });
    return fg;
  }

  _addControlToFormGroupPcsASVT(fg: FormGroup, questions: InputBase<any>[]) {
    const group: any = {};
    questions.forEach(question => {
      if (question.key != "326" && question.key != "327" && question.key != "LVM" && question.key != "632" && question.key != "700") {
        fg.addControl(
          question.key, question.required ? new FormArray(question.value || [], Validators.required) : new FormArray(question.value || [])
        );
      }
    });
    return fg;
  }

}
