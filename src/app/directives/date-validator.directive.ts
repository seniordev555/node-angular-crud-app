import { Directive, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateDate]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: DateValidatorDirective, multi: true }
  ]
})
export class DateValidatorDirective implements Validator {

  constructor( @Attribute('validateDate') public validateDate: string) {}

  validate(c: AbstractControl): { [key: string]: any } {
    var v = c.value;
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(v) {
      if(!v.match(regEx))
        return { validateDate: "invalid date format" };

      var d:any = new Date(v);
      if(!((d)|0))
        return { validateDate: "invalid date format" };

      if(d.toISOString().slice(0,10) != v) {
        return { validateDate: "invalid date format" };
      }
    }

    return null;
  }

}
