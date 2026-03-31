import { Component } from '@angular/core';
import { Footer } from "../../../../shared/components/footer/footer";
import { Navbar } from "../../../../shared/components/navbar/navbar";

@Component({
  selector: 'app-products',
  imports: [Footer, Navbar],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {}
