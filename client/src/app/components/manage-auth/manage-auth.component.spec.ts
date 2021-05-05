import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAuthComponent } from './manage-auth.component';

describe('ManageAuthComponent', () => {
  let component: ManageAuthComponent;
  let fixture: ComponentFixture<ManageAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
