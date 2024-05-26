import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShareComponent } from './product-share.component';

describe('ProductShareComponent', () => {
  let component: ProductShareComponent;
  let fixture: ComponentFixture<ProductShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductShareComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
