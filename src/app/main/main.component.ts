import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';

// Please comment your code as needed. //
// We are not all Brance //
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
      transition('initial=>final', animate('150ms')),
      transition('final=>initial', animate('150ms'))
    ])

  ]
})
export class MainComponent implements OnInit {

  // Establish all Properties/Variables here //
  // Please group properties of same type together when possible //
  showSignUp: boolean;
  currentState = 'initial';
  panelOpenState = false;

  // When setting up formGroups, please place custom Validators beneath Angular's built-in validators //
  signUpForm = this.fb.group({
    discordUser: ['',
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(32),
      discordUsernameValidator(/discordtag|everyone|here|```|[#:@]/i)],
    age: ['',
      Validators.required,
      Validators.maxLength(3),
      Validators.minLength(2)],
    faveGames: [''],
    userLikes: [''],
    userDislikes: ['']
  });

  // Constructor and Lifecycle Methods ONLY //
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.showSignUp = false;
  }

  // All functions established here //
  changeState(): void {
    // Toggles panel expansion animation and Fader animation //
    this.currentState = (this.currentState === 'initial') ? 'final' : 'initial';
    this.panelOpenState = (this.currentState === 'initial') ? false : true;
  }

  showToggle(): void {
    if (this.showSignUp) {
      this.showSignUp = false;
    } else if (!this.showSignUp) {
      this.showSignUp = true;
    }
    this.changeState();
  }

}

function discordUsernameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}
