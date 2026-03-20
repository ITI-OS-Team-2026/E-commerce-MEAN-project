import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFooter } from './home-footer';

describe('HomeFooter', () => {
  let component: HomeFooter;
  let fixture: ComponentFixture<HomeFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
