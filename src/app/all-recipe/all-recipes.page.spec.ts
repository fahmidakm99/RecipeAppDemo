import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllRecipesPages } from './all-recipes.page';

describe('AllRecipesPage', () => {
  let component: AllRecipesPages;
  let fixture: ComponentFixture<AllRecipesPages>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRecipesPages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
