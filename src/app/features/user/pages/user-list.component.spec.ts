import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Sort } from '@angular/material/sort';
import { User } from '../../../core/models/user.model';

// Mock services
class MockUserService {
  getUsers = jasmine.createSpy().and.returnValue(of({ body: { data: [{ id: 1, email: 'test@test.com', role: 'admin' }] }, total: 1 }));
  addUser = jasmine.createSpy().and.returnValue(of({}));
  updateUser = jasmine.createSpy().and.returnValue(of({}));
  deleteUser = jasmine.createSpy().and.returnValue(of({}));
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(null)
    };
  }
}

class MockMatSnackBar {
  open = jasmine.createSpy();
}

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: MockUserService;
  let dialog: MockMatDialog;
  let snackBar: MockMatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as any;
    dialog = TestBed.inject(MatDialog) as any;
    snackBar = TestBed.inject(MatSnackBar) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    fixture.detectChanges();
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
  });

  it('should show error when loadUsers fails', () => {
    userService.getUsers.and.returnValue(throwError(() => new Error('Failed')));
    component.loadUsers();
    expect(snackBar.open).toHaveBeenCalledWith('Failed to load users', 'Close', { duration: 3000 });
  });

  it('should debounce search changes', fakeAsync(() => {
    fixture.detectChanges();
    const spy = spyOn(component, 'loadUsers');
    component.onSearchChange('abc');
    tick(400);
    expect(spy).toHaveBeenCalled();
  }));

  it('should apply filters', () => {
    const spy = spyOn(component, 'loadUsers');
    component.applyFilters();
    expect(spy).toHaveBeenCalled();
  });

  it('should clear filters', () => {
    const spy = spyOn(component, 'loadUsers');
    component.searchTerm = 'abc';
    component.selectedRole = 'admin';
    component.selectedStatus = 'active';
    component.clearFilters();
    expect(component.searchTerm).toBe('');
    expect(component.selectedRole).toBe('');
    expect(component.selectedStatus).toBe('');
    expect(spy).toHaveBeenCalled();
  });

  it('should handle pagination', () => {
    const spy = spyOn(component, 'loadUsers');
    component.onPageChange({ pageIndex: 1, pageSize: 20 });
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(20);
    expect(spy).toHaveBeenCalled();
  });

  it('should handle sorting', () => {
    const spy = spyOn(component, 'loadUsers');
    const sort: Sort = { active: 'email', direction: 'desc' };
    component.onSortChange(sort);
    expect(component.sortField).toBe('email');
    expect(component.sortDirection).toBe('desc');
    expect(spy).toHaveBeenCalled();
  });

  it('should add user when dialog returns result', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ email: 'new@test.com', role: 'admin' })
    } as any);
    component.onAddUser();
    expect(userService.addUser).toHaveBeenCalled();
  });

  it('should edit user when dialog returns result', () => {
    const mockUser: User = { id: 1, email: 'old@test.com', role: 'viewer' } as any;
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ email: 'updated@test.com', role: 'admin' })
    } as any);
    component.onEditUser(mockUser);
    expect(userService.updateUser).toHaveBeenCalledWith(1, jasmine.any(Object));
  });

  it('should handle image error', () => {
    const event = { target: { src: '' } } as any;
    component.onImageError(event);
    expect(event.target.src).toContain('assets/avatar-placeholder.png');
  });
});
