import { Component } from '@angular/core';
import { Logo } from '../../../../shared/components/logo/logo';
import { Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-home-navbar',
  imports: [Logo, Button],
  templateUrl: './home-navbar.html',
  styleUrl: './home-navbar.css',
})
export class HomeNavbar {
  //import the list of categories from the backend and display them in the navbar

  //link the sign in and sign up buttons to the respective pages
}
