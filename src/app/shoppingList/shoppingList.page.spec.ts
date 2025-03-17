import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { ShoppingListPage } from './shoppingList.page';

describe('ShoppingListPage', () => {
  let component: ShoppingListPage;
  let fixture: ComponentFixture<ShoppingListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
