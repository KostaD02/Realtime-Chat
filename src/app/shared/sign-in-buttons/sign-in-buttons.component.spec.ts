import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInButtonsComponent } from './sign-in-buttons.component';

describe('SignInButtonsComponent', () => {
  let component: SignInButtonsComponent;
  let fixture: ComponentFixture<SignInButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignInButtonsComponent]
    });
    fixture = TestBed.createComponent(SignInButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
