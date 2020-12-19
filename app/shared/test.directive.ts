import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector:'[appTestDirective]'
})
export class TestDirective{
    constructor(private elementRef: ElementRef){
        this.elementRef.nativeElement.style.backgroundColor = 'green';
    }
}