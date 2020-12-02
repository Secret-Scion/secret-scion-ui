import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [

    trigger('fader', [
      state('initial', style({
        opacity: '0'
      })),
      state('final', style({
        opacity: '1'
      })),
      transition('initial=>final', animate('500ms')),
      transition('final=>initial', animate('500ms'))
    ])

  ]
})
export class MainComponent implements OnInit {

  showSignUp: boolean;

  constructor() { }

  ngOnInit(): void {
    this.showSignUp = false;
  }

  showToggle(): void {
    if (this.showSignUp) {
      this.showSignUp = false;
    } else if (!this.showSignUp) {
      this.showSignUp = true;
    }
  }

}
