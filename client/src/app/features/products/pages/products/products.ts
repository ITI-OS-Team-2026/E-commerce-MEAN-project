import { Component } from '@angular/core';
import { Footer } from "../../../../shared/components/footer/footer";
import { Navbar } from "../../../../shared/components/navbar/navbar";
import { ProductsPageAside } from "../../components/products-page-aside/products-page-aside";

@Component({
  selector: 'app-products',
  imports: [Footer, Navbar, ProductsPageAside],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {}
