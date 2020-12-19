import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTestStructuralDirective]'
})
export class TestStructuralDirectiveDirective {
@Input() set appTestStructuralDirective(condition: boolean){
  if(!condition){
    this.vcRef.createEmbeddedView(this.templateRef);
  } else {
    this.vcRef.clear();
  }
}
  constructor(private templateRef: TemplateRef<any>, private vcRef: ViewContainerRef) { }

}
