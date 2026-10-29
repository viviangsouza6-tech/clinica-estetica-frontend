import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaProdutosComponent } from './entrada-produtos.component';

describe('EntradaProdutosComponent', () => {
  let component: EntradaProdutosComponent;
  let fixture: ComponentFixture<EntradaProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntradaProdutosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EntradaProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
