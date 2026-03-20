import { Component } from '@angular/core';
import { HomeNavbar } from '../../components/home-navbar/home-navbar';
import { FeaturedCategories } from "../../components/featured-categories/featured-categories";
import { NewArrivals } from "../../components/new-arrivals/new-arrivals";
import { FeaturesGrid } from "../../components/features-grid/features-grid";
import { CtaSection } from "../../components/cta-section/cta-section";
import { HomeFooter } from "../../components/home-footer/home-footer";
import { Hero } from '../../components/hero/hero';

@Component({
  selector: 'app-home-page',
  imports: [HomeNavbar,Hero, FeaturedCategories, NewArrivals, FeaturesGrid, CtaSection, HomeFooter],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}
