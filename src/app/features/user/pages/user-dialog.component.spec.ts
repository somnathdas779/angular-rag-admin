import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDialogComponent } from './user-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        UserDialogComponent, // standalone component import
        NoopAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null } // default: add mode
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when required fields are empty', () => {
    component.userForm.setValue({
      name: '',
      email: '',
      role: ''
    });
    expect(component.userForm.invalid).toBeTrue();
  });

  it('should call dialogRef.close() with form value when form is valid', () => {
    const formValue = {
      name: 'name',
      email: 'test@example.com',
      role: 'admin'
    };
    component.userForm.setValue(formValue);

    component.onSubmit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(formValue);
  });

  it('should not call dialogRef.close() when form is invalid', () => {
    component.userForm.setValue({
      name: '',
      email: '',
      role: ''
    });
    component.onSubmit();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should close the dialog on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should initialize form with data when editing a user', async () => {
    // Destroy the old fixture and create a new one with data
    fixture.destroy();
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [
          UserDialogComponent,
          NoopAnimationsModule,
          ReactiveFormsModule
        ],
        providers: [
          { provide: MatDialogRef, useValue: dialogRefSpy },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { name: 'Cname', email: 'edit@example.com', role: 'user' }
          }
        ]
      })
      .compileComponents();

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.userForm.value.email).toBe('edit@example.com');
    expect(component.userForm.value.role).toBe('user');
  });
});
