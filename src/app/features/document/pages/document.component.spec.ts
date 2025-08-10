import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentComponent } from './document.component';
import { UploadService } from '../../../core/services/upload.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('DocumentComponent', () => {
  let component: DocumentComponent;
  let fixture: ComponentFixture<DocumentComponent>;
  let uploadServiceSpy: jasmine.SpyObj<UploadService>;

  beforeEach(async () => {
    uploadServiceSpy = jasmine.createSpyObj('UploadService', ['uploadFile']);
    

    await TestBed.configureTestingModule({
      imports: [
        DocumentComponent, // standalone component import
        NoopAnimationsModule
      ],
      providers: [
        { provide: UploadService, useValue: uploadServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the document component', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct chip color for known types', () => {
    expect(component.getChipColor('PDF')).toBe('primary');
    expect(component.getChipColor('Users')).toBe('accent');
    expect(component.getChipColor('Analytics')).toBe('warn');
    expect(component.getChipColor('Performance')).toBe('primary');
  });

  it('should default chip color to primary for unknown types', () => {
    expect(component.getChipColor('Unknown')).toBe('primary');
  });

  it('should set uploadStatus when no file is selected', () => {
    component.selectedFile = undefined;
    component.upload();
    expect(component.uploadStatus).toBe('No file selected!');
  });

  it('should call uploadFile when a file is selected', async () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    component.selectedFile = mockFile;

    // Mock uploadFile to simulate progress and return a resolved promise
    uploadServiceSpy.uploadFile.and.callFake((file: File, onProgress: (uploaded: number, total: number) => void) => {
      onProgress(50, 100); // simulate 50% upload
      return Promise.resolve('http://example.com/file.pdf');
    });

    await component.upload();

    expect(uploadServiceSpy.uploadFile).toHaveBeenCalledWith(mockFile, jasmine.any(Function));
    expect(component.uploadProgress).toBe(50);
    expect(component.uploadStatus).toContain('Upload successful!');
  });

  it('should handle upload errors', async () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    component.selectedFile = mockFile;

    uploadServiceSpy.uploadFile.and.returnValue(Promise.reject('Upload failed'));

    await component.upload();

    expect(component.uploadStatus).toBe('Upload failed!');
  });

  it('should handle file selection', () => {
    spyOn(component, 'upload');
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

    const event = {
      target: { files: [mockFile] }
    } as unknown as Event;

    component.onFileSelected(event);

    expect(component.selectedFile).toBe(mockFile);
    expect(component.uploadProgress).toBe(0);
    expect(component.upload).toHaveBeenCalled();
  });
});
