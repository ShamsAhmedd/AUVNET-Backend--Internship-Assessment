import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishistComponent } from './wishist.component';

describe('WishistComponent', () => {
  let component: WishistComponent;
  let fixture: ComponentFixture<WishistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WishistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
