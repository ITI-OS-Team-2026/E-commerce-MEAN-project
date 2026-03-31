import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsPageAside } from './products-page-aside';

describe('ProductsPageAside', () => {
  let component: ProductsPageAside;
  let fixture: ComponentFixture<ProductsPageAside>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsPageAside],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPageAside);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
