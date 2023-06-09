import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sign-in-buttons',
  templateUrl: './sign-in-buttons.component.html',
  styleUrls: ['./sign-in-buttons.component.scss']
})
export class SignInButtonsComponent {
  @Input() src: string = "";
  @Input() text: string = "";
}
