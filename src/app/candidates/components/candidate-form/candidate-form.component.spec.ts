import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateFormComponent } from './candidate-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateFormComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with name, surname, and file fields', () => {
    expect(component.form.contains('name')).toBeTrue();
    expect(component.form.contains('surname')).toBeTrue();
    expect(component.form.contains('file')).toBeTrue();
  });

  it('should mark the name field as invalid if empty', () => {
    const nameControl = component.form.get('name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalse();
  });

  it('should mark the surname field as invalid if empty', () => {
    const surnameControl = component.form.get('surname');
    surnameControl?.setValue('');
    expect(surnameControl?.valid).toBeFalse();
  });

  it('should mark the file field as invalid if no file is selected', () => {
    const fileControl = component.form.get('file');
    fileControl?.setValue(null);
    expect(fileControl?.valid).toBeFalse();
  });

  it('should not emit form data on invalid form submission', () => {
    const formDataSpy = spyOn(component.submitCandidate, 'emit');

    component.form.get('name')?.setValue('');
    component.form.get('surname')?.setValue('');
    component.form.get('file')?.setValue(null);

    component.onSubmit();

    expect(formDataSpy).not.toHaveBeenCalled();
  });

  it('should call onFileChange method when a file is selected', () => {
    const fileInput = new File(['mock content'], 'testfile.txt', { type: 'text/plain' });
    const event = { target: { files: [fileInput] } } as unknown as Event;
    const fileControl = component.form.get('file');

    component.onFileChange(event);

    expect(fileControl?.value).toBe(fileInput);
  });

  it('should disable submit button if form is invalid', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    component.form.get('name')?.setValue('');
    component.form.get('surname')?.setValue('');
    component.form.get('file')?.setValue(null);
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable submit button if form is valid', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    component.form.get('name')?.setValue('Juan');
    component.form.get('surname')?.setValue('Carrera');
    const mockFile = new Blob(['mock file content'], { type: 'application/pdf' });
    component.form.get('file')?.setValue(mockFile);
    fixture.detectChanges();
    expect(submitButton.disabled).toBeFalse();
  });
});
