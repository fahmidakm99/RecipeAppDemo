import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleRecipieInfoPublicPage } from './single-recipie-info-public.page';

describe('SingleRecipieInfoPage', () => {
  let component: SingleRecipieInfoPublicPage;
  let fixture: ComponentFixture<SingleRecipieInfoPublicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRecipieInfoPublicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
