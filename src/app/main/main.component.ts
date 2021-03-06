import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { take } from 'rxjs/operators';
import * as signUpData from '../signUp.json';
import * as UserData from '../users.json';
import { User } from './../models/users';

// Please comment your code as needed. //
// We are not all Brance //
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [

    trigger('fader', [
      state('initial', style({
        opacity: '0',
      })),
      state('final', style({
        opacity: '1',
      })),
      transition('initial=>final', animate('150ms')),
      transition('final=>initial', animate('150ms'))
    ])

  ]
})
export class MainComponent implements OnInit {

  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  // Establish all Properties/letiables here //
  // Please group properties of same type together when possible //
  allUsersArr: any = (UserData as any).default;
  userSignUp: any = (signUpData as any)?.default['Form Responses 1'];
  showSignUp: boolean;
  currentState = 'initial';
  panelOpenState = false;
  currId: number;

  // When setting up formGroups, please place custom Validators beneath Angular's built-in validators //
  signUpForm = this.fb.group({
    id: [''],
    discordUser: ['',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
        discordUsernameValidator(/discordtag|everyone|here|```|[#:@]/i)]],
    discriminator: ['',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)]],
    age: ['',
      [
        // This breaks things because there is no field for age.
        // Validators.required,
        Validators.maxLength(3),
        Validators.minLength(2)]],
    faveGames: [''],
    userLikes: ['', Validators.maxLength(2000)],
    userDislikes: ['', Validators.maxLength(2000)],
    isGuardian: ['', Validators.required]
  });

  series = [
    { nm: 'Blood Omen', checked: false },
    { nm: 'Soul Reaver', checked: false },
    { nm: 'Soul Reaver 2', checked: false },
    { nm: 'Defiance', checked: false },
    { nm: 'Blood Omen 2', checked: false },
    { nm: 'Nosgoth', checked: false },
  ];

  userFavesArr: string[] = [];

  // Constructor and Lifecycle Methods ONLY //
  constructor(
    private fb: FormBuilder,
    private _ngZone: NgZone,
  ) { }

  ngOnInit(): void {
    // console.log('You expected a normal console log but it is I, Dio!');
    console.log(this.userSignUp);
    this.showSignUp = false;
    this.showToggle(); // Remove this after form works
    // console.log(this.allUsersArr);
    this.findNextId();
    this.convertToUsers();
    this.modifyTestDataAges();
  }

  getAge(DOB): number {
    const today = new Date();
    const birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  modifyTestDataAges(): void {
    this.allUsersArr.forEach(user => {
      if (user.age >= 18) {
        user.over18 = true;
      } else {
        user.over18 = false;
      }
      delete user.age;
    });
  }

  determineGuardian(user): boolean {
    console.log(user.whatIsYourRoleInTheDiscordServer);
    return user.whatIsYourRoleInTheDiscordServer !== 'The Common Rabble';
  }

  convertToUsers(): void {
    this.userSignUp.forEach(user => {

      const newUser: User = {
        id: this.currId,
        over18: this.getAge(user.dateOfBirth) >= 18,
        discordUser: user.discordUsername,
        discriminator: user.discordDiscriminator,
        faveGames: user.favoriteGames.split(', '),
        isGuardian: this.determineGuardian(user),
        userDislikes: user.dislikes,
        userLikes: user.likes,
      };
      this.allUsersArr.push(newUser);
    });
    console.log(this.allUsersArr);
  }

  // All functions established here //
  changeState(): void {
    // Toggles panel expansion animation and Fader animation //
    this.currentState = (this.currentState === 'initial') ? 'final' : 'initial';
    this.panelOpenState = (this.currentState !== 'initial');
  }

  showToggle(submit?): void {
    if (this.showSignUp) {
      this.showSignUp = false;
    } else if (!this.showSignUp) {
      this.showSignUp = true;
    }
    this.changeState();

    if (submit && this.signUpForm.valid) {
      const newUser = this.signUpForm.value;
      newUser.id = this.currId;
      this.allUsersArr.push(newUser);
      this.resetChecks();
      this.signUpForm.reset();
      this.findNextId();
    }
  }

  saveToJson(): void {
    // Brance fixed the json export by parsing the JSON to a string...//
    const jsonse = JSON.stringify(this.allUsersArr);
    // ... I do not know why I did not think to do that. //
    const blob = new Blob([jsonse], { type: 'application/json' });
    FileSaver.saveAs(blob, 'users.json');
  }

  // Takes all non guardians, pairs them for gifts then spits out a json file
  pairAndMakeJson(): void {
    const gifters = [...this.allUsersArr];
    gifters.sort((a, b) => (a.isGuardian === b.isGuardian) ? 0 : a.isGuardian ? -1 : 1);
    let giftees = [...this.allUsersArr];
    const pairings = [];
    for (const gifter of gifters) {
      let giftee = null;
      do {
        giftee = giftees[Math.floor(Math.random() * giftees.length)];
      } while (giftee === gifter || (gifter.isGuardian && giftee.isGuardian));
      giftees = giftees.filter(user => user !== giftee);
      pairings.push(this.makePairing(gifter, giftee));
    }

    const pairingJson = JSON.stringify(pairings);
    const blob = new Blob([pairingJson], { type: 'application/json' });
    FileSaver.saveAs(blob, 'draw.json');
  }

  // Makes the objects we want when it's time to pair everyone
  makePairing(gifter, giftee): object {
    return {
      discordUser: gifter.discordUser,
      discriminator: gifter.discriminator,
      isGuardian: gifter.isGuardian,
      giftRecipient: giftee
    };
  }

  findNextId(): void {
    const idArr = [];
    this.allUsersArr.forEach(user => {
      idArr.push(user.id);
    });
    this.currId = (Math.max(...idArr) + 1);
  }

  markFavorite(game): void {
    if (!this.userFavesArr.includes(game)) {
      this.userFavesArr.push(game);
    } else {
      const target = this.userFavesArr.indexOf(game);
      this.userFavesArr.splice(target, 1);
    }
    this.signUpForm.controls.faveGames.setValue(this.userFavesArr);
  }

  resetChecks(): void {
    this.series.forEach(game => {
      game.checked = false;
    });
  }

  triggerResize(): void {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

}

function discordUsernameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}
