import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyShoppingListPage } from './weekly-shopping-list.page';

describe('WeeklyShoppingListPage', () => {
  let component: WeeklyShoppingListPage;
  let fixture: ComponentFixture<WeeklyShoppingListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyShoppingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
