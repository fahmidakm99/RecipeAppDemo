import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthlyShoppingListPage } from './monthly-shopping-list.page';

describe('MonthlyShoppingListPage', () => {
  let component: MonthlyShoppingListPage;
  let fixture: ComponentFixture<MonthlyShoppingListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyShoppingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
