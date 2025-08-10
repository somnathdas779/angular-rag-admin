import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { SignupComponent } from "./signup.component";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { AuthService } from "../../core/services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Mock AuthService
class MockAuthService {
  signup() {
    return of({ message: "Account created successfully" });
  }
}

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy("navigate");
}

// Mock SnackBar
class MockSnackBar {
  open = jasmine.createSpy("open");
}

describe("SignupComponent", () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;
  let snackBar: MatSnackBar;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent, // standalone component
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatSnackBar, useClass: MockSnackBar },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it("should create the signup component", () => {
    expect(component).toBeTruthy();
  });

  it("should mark form invalid when empty", () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it("should display error if passwords do not match", () => {
    component.signupForm.setValue({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "differentpass",
    });
    expect(component.signupForm.hasError("passwordMismatch")).toBeTruthy();
  });

  it("should call AuthService.signup and navigate on success", fakeAsync(() => {
    spyOn(authService, "signup").and.returnValue(
      of({ message: "Account created successfully" })
    );

    component.signupForm.setValue({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    component.onSubmit();
    tick();

    expect(authService.signup).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
    expect(snackBar.open).toHaveBeenCalledWith(
      "Account created successfully",
      "Close",
      { duration: 3000 }
    );
    expect(router.navigate).toHaveBeenCalledWith(["/auth/login"]);
    expect(component.loading()).toBeFalsy();
  }));

  it("should show error message when signup fails", fakeAsync(() => {
    spyOn(authService, "signup").and.returnValue(
      throwError(() => ({ message: "Signup failed" }))
    );

    component.signupForm.setValue({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    component.onSubmit();
    tick();
    expect(snackBar.open).toHaveBeenCalledWith(
      "Signup failed. Please try again.", // match component
      "Close",
      { duration: 3000 }
    );
    expect(component.loading()).toBeFalsy();
  }));
});
