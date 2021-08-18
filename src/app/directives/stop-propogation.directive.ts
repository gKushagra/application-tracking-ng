import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appStopPropogation]'
})
export class StopPropogationDirective {

  constructor(el: ElementRef) {
    el.nativeElement.addEventListener('click', (event: any) => {
      // console.log(event);
      event.stopPropagation();
    });
  }

}
