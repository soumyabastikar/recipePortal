import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {
@Input('appBetterHighlight') highlightColor : string;
@HostBinding('style.color') color: string;

  constructor(private elementRef: ElementRef, private renderer : Renderer2) { }

  ngOnInit(){
   
  }

  @HostListener('mouseenter') mouseenter(){
    // this.renderer.setStyle(this.elementRef.nativeElement,'color','red');
    this.color = this.highlightColor;
  }

  @HostListener('mouseleave') mouseleave(){
    // this.renderer.setStyle(this.elementRef.nativeElement,'color','black');
    this.color = 'black';
  }

}
